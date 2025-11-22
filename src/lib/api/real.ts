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
        // Cached response - immediate JSON return
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
      const params = new URLSearchParams({
        company_url: request.company_url,
      });
      if (request.company_name) {
        params.append('company_name', request.company_name);
      }

      const url = `${this.baseURL}/analyze/company?${params.toString()}`;
      let finalData: CompanyAnalysisData | null = null;

      const connection = createSSEConnection(url, {
        onEvent: (event: SSEEvent) => {
          if (onProgress) {
            onProgress(event);
          }

          if (event.step === 'complete' && event.status === 'success') {
            finalData = event.data as CompanyAnalysisData;
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
      > = {
        company_url: request.company_url,
      };

      // Only include optional fields if they're defined
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/analyze/visibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        console.error('[API] Error response:', errorData);
        throw new Error(errorData.detail);
      }

      // Check content type to determine if cached or streaming
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        // Cached response - immediate JSON return
        const data = await response.json();
        console.log('[API] Cached visibility data received:', data);
        return data.data || data;
      } else if (contentType?.includes('text/event-stream')) {
        // Streaming response - establish SSE connection
        console.log('[API] Starting SSE stream for visibility analysis');
        return await this.handleVisibilityAnalysisStream(
          requestBody,
          onProgress
        );
      } else {
        throw new Error('Unexpected response content type');
      }
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
          } else if (event.step === 'error') {
            const errorMessage =
              'data' in event && event.data && 'error' in event.data
                ? event.data.error
                : 'Unknown error';
            reject(new Error(errorMessage));
          }
        },
        onError: (error: Error) => {
          this.connectionManager.cleanup('visibility-analysis');
          reject(error);
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

  public cleanupAllConnections(): void {
    this.connectionManager.cleanupAll();
  }
}
