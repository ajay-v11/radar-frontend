import {
  CompanyAnalysisRequest,
  CompanyAnalysisData,
  VisibilityAnalysisRequest,
  VisibilityAnalysisData,
  SSEEvent,
  APIError,
  CompanyAnalysisResponse,
} from './types';
import {createSSEConnection} from './sse';
import {getConnectionManager} from './connection-manager';

export class RealAPIClient {
  private baseURL: string;
  private timeout: number;
  private connectionManager = getConnectionManager();

  constructor(baseURL: string, timeout: number = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  async healthCheck(): Promise<{status: string; version: string}> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Health check request timed out');
        }
        throw error;
      }
      throw new Error('Unknown error during health check');
    }
  }

  async analyzeCompany(
    request: CompanyAnalysisRequest,
    onProgress?: (event: SSEEvent) => void
  ): Promise<CompanyAnalysisData> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/analyze/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.detail);
      }

      // Check content type to determine if cached or streaming
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        // This shouldn't happen with the new API - it always streams
        const data: CompanyAnalysisResponse = await response.json();
        return data.data;
      } else if (contentType?.includes('text/event-stream')) {
        // Streaming response - establish SSE connection
        return await this.handleCompanyAnalysisStream(request, onProgress);
      } else {
        throw new Error('Unexpected response content type');
      }
    } catch (error) {
      this.connectionManager.cleanup('company-analysis');
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Company analysis request timed out');
        }
        throw error;
      }
      throw new Error('Unknown error during company analysis');
    }
  }

  private async handleCompanyAnalysisStream(
    request: CompanyAnalysisRequest,
    onProgress?: (event: SSEEvent) => void
  ): Promise<CompanyAnalysisData> {
    return new Promise((resolve, reject) => {
      const requestBody: Record<string, string> = {
        company_url: request.company_url,
      };
      if (request.company_name) {
        requestBody.company_name = request.company_name;
      }
      if (request.target_region) {
        requestBody.target_region = request.target_region;
      }

      const url = `${this.baseURL}/analyze/company`;
      let finalData: CompanyAnalysisData | null = null;

      const connection = createSSEConnection(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        onEvent: (event: SSEEvent) => {
          if (onProgress) {
            onProgress(event);
          }

          if (event.step === 'complete' && event.status === 'success') {
            finalData = event.data as CompanyAnalysisData;

            // Extract slug_id from event root level (backend sends it at root, not in data)
            const slugId = event.slug_id;

            // Store slug_id in the finalData object so it's available to the caller
            if (slugId && finalData) {
              finalData.slug_id = slugId;
              console.log('[API] Extracted slug_id from event:', slugId);
            }

            // Store company slug_id in session storage if present
            if (slugId) {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('companySlugId', slugId);
                console.log('[API] Stored company slug ID:', slugId);
              }
            }
          } else if (event.step === 'error') {
            const errorMessage =
              'data' in event && event.data && 'error' in event.data
                ? event.data.error
                : 'Unknown error';
            reject(new Error(errorMessage));
          }
        },
        onError: (error: Error) => {
          this.connectionManager.cleanup('company-analysis');
          reject(error);
        },
        onComplete: () => {
          this.connectionManager.cleanup('company-analysis');
          if (finalData) {
            resolve(finalData);
          } else {
            reject(new Error('Stream completed without final data'));
          }
        },
      });

      this.connectionManager.register('company-analysis', connection);
      connection.connect();
    });
  }

  async analyzeVisibility(
    request: VisibilityAnalysisRequest,
    onProgress?: (event: SSEEvent) => void
  ): Promise<VisibilityAnalysisData> {
    try {
      // Build request body with only fields the backend accepts
      const requestBody: Record<
        string,
        string | number | string[] | Record<string, number> | null
      > = {};

      // Use company_slug_id if available, otherwise use company_url
      // Backend doesn't accept both at the same time
      if (request.company_slug_id) {
        requestBody.company_slug_id = request.company_slug_id;
      } else {
        requestBody.company_url = request.company_url;
      }
      if (request.num_queries !== undefined) {
        requestBody.num_queries = request.num_queries;
      }
      if (request.models && request.models.length > 0) {
        requestBody.models = request.models;
      }
      if (request.llm_provider) {
        requestBody.llm_provider = request.llm_provider;
      }
      if (request.batch_size !== undefined) {
        requestBody.batch_size = request.batch_size;
      }
      if (request.query_weights) {
        requestBody.query_weights = request.query_weights;
      }

      console.log('[API] Sending visibility analysis request:', requestBody);
      console.log(
        '[API] Request body JSON:',
        JSON.stringify(requestBody, null, 2)
      );

      // Both cached and streaming responses return text/event-stream
      // Cached responses only send the final 'complete' event with cached: true
      // Streaming responses send multiple events (initialization, category_*, complete)
      console.log('[API] Starting SSE stream for visibility analysis');
      return await this.handleVisibilityAnalysisStream(requestBody, onProgress);
    } catch (error) {
      this.connectionManager.cleanup('visibility-analysis');
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Visibility analysis request timed out');
        }
        throw error;
      }
      throw new Error('Unknown error during visibility analysis');
    }
  }

  private async handleVisibilityAnalysisStream(
    requestBody: Record<
      string,
      string | number | string[] | Record<string, number> | null
    >,
    onProgress?: (event: SSEEvent) => void
  ): Promise<VisibilityAnalysisData> {
    return new Promise((resolve, reject) => {
      // Build URL with request body as JSON in the body parameter for POST
      const url = `${this.baseURL}/analyze/visibility`;
      let finalData: VisibilityAnalysisData | null = null;

      const connection = createSSEConnection(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        onEvent: (event: SSEEvent) => {
          if (onProgress) {
            onProgress(event);
          }

          if (event.step === 'complete' && event.status === 'success') {
            finalData = event.data as VisibilityAnalysisData;

            // Extract slug_id from event root level (backend sends it at root, not in data)
            const slugId = event.slug_id;

            // Store slug_id in the finalData object so it's available to the caller
            if (slugId && finalData) {
              finalData.slug_id = slugId;
              console.log(
                '[API] Extracted visibility slug_id from event:',
                slugId
              );
            }

            // Check if this is a cached response
            if ('cached' in event && event.cached === true) {
              console.log('[API] Cached visibility data received');
            } else {
              console.log('[API] Streaming visibility analysis completed');
            }

            // Store slug_id in session storage if present
            if (slugId) {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('visibilitySlugId', slugId);
                console.log('[API] Stored visibility slug ID:', slugId);
              }
            }
          } else if (event.step === 'error') {
            const errorMessage =
              'data' in event && event.data && 'error' in event.data
                ? event.data.error
                : 'Unknown error';
            console.error('[API] SSE error event received:', errorMessage);
            this.connectionManager.cleanup('visibility-analysis');
            reject(new Error(errorMessage));
          }
        },
        onError: (error: Error) => {
          console.error('[API] SSE connection error:', error.message);
          this.connectionManager.cleanup('visibility-analysis');
          reject(new Error(`SSE connection failed: ${error.message}`));
        },
        onComplete: () => {
          this.connectionManager.cleanup('visibility-analysis');
          if (finalData) {
            resolve(finalData);
          } else {
            reject(new Error('Stream completed without final data'));
          }
        },
      });

      this.connectionManager.register('visibility-analysis', connection);
      connection.connect();
    });
  }

  private async parseErrorResponse(response: Response): Promise<APIError> {
    try {
      const errorData = await response.json();
      // Handle FastAPI validation errors
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const validationErrors = errorData.detail
          .map(
            (err: {loc?: string[]; msg: string}) =>
              `${err.loc?.join('.')}: ${err.msg}`
          )
          .join(', ');
        return {
          detail: `Validation error: ${validationErrors}`,
          status: response.status,
        };
      }
      return {
        detail: errorData.detail || errorData.message || 'Unknown error',
        status: response.status,
      };
    } catch {
      return {
        detail: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }
  }

  async getFullReport(slugId: string): Promise<unknown> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/report/${slugId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Full report request timed out');
        }
        throw error;
      }
      throw new Error('Unknown error fetching full report');
    }
  }

  async getQueryLog(
    slugId: string,
    params: {
      page?: number;
      limit?: number;
      category?: string;
      model?: string;
      mentioned?: boolean;
    } = {}
  ): Promise<unknown> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(
        `${this.baseURL}/report/${slugId}/query-log`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: params.page || 1,
            limit: params.limit || 50,
            category: params.category,
            model: params.model,
            mentioned: params.mentioned,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Query log request timed out');
        }
        throw error;
      }
      throw new Error('Unknown error fetching query log');
    }
  }

  async exportCSV(slugId: string): Promise<Blob> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(
        `${this.baseURL}/report/${slugId}/export/csv`,
        {
          method: 'GET',
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.detail);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('CSV export request timed out');
        }
        throw error;
      }
      throw new Error('Unknown error exporting CSV');
    }
  }

  public cleanupAllConnections(): void {
    this.connectionManager.cleanupAll();
  }
}
