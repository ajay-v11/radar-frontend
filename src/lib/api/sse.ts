import {SSEEvent} from './types';

export interface SSEConnectionOptions {
  onEvent: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  method?: 'GET' | 'POST';
  body?: string;
}

export class SSEConnection {
  private eventSource: EventSource | null = null;
  private abortController: AbortController | null = null;
  private url: string;
  private options: SSEConnectionOptions;

  constructor(url: string, options: SSEConnectionOptions) {
    this.url = url;
    this.options = options;
  }

  async connect(): Promise<void> {
    if (this.eventSource || this.abortController) {
      this.close();
    }

    const method = this.options.method || 'GET';

    // Use EventSource for GET requests (standard SSE)
    if (method === 'GET') {
      this.connectWithEventSource();
    } else {
      // Use fetch for POST requests (streaming)
      await this.connectWithFetch();
    }
  }

  private connectWithEventSource(): void {
    try {
      this.eventSource = new EventSource(this.url);

      this.eventSource.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.eventSource.onerror = () => {
        const error = new Error('SSE connection error');
        if (this.options.onError) {
          this.options.onError(error);
        }
        this.close();
      };
    } catch (error) {
      const connectionError = new Error(
        `Failed to establish SSE connection: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      if (this.options.onError) {
        this.options.onError(connectionError);
      }
    }
  }

  private async connectWithFetch(): Promise<void> {
    try {
      this.abortController = new AbortController();

      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: this.options.body,
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        // Try to parse error details from response body
        let errorDetail = response.statusText;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            // Handle FastAPI validation errors
            if (Array.isArray(errorData.detail)) {
              errorDetail = errorData.detail
                .map((err: any) => `${err.loc?.join('.')}: ${err.msg}`)
                .join(', ');
            } else {
              errorDetail = errorData.detail;
            }
          }
        } catch {
          // If parsing fails, use statusText
        }
        throw new Error(`HTTP ${response.status}: ${errorDetail}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const {done, value} = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {stream: true});
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            this.handleMessage(data);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        const connectionError = new Error(
          `Failed to establish SSE connection: ${error.message}`
        );
        if (this.options.onError) {
          this.options.onError(connectionError);
        }
      }
    }
  }

  private handleMessage(data: string): void {
    try {
      const event = JSON.parse(data) as SSEEvent;
      this.options.onEvent(event);

      // Check if this is a completion or error event
      if (event.step === 'complete' || event.step === 'error') {
        if (event.step === 'complete' && this.options.onComplete) {
          this.options.onComplete();
        }
        this.close();
      }
    } catch (error) {
      const parseError = new Error(
        `Failed to parse SSE event: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      if (this.options.onError) {
        this.options.onError(parseError);
      }
      this.close();
    }
  }

  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  isConnected(): boolean {
    if (this.eventSource) {
      return this.eventSource.readyState === EventSource.OPEN;
    }
    return this.abortController !== null;
  }
}

export function createSSEConnection(
  url: string,
  options: SSEConnectionOptions
): SSEConnection {
  return new SSEConnection(url, options);
}
