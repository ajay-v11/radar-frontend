import {
  CompanyAnalysisRequest,
  CompanyAnalysisData,
  VisibilityAnalysisRequest,
  VisibilityAnalysisData,
  SSEEvent,
} from './types';
import {RealAPIClient} from './real';
import {MockAPIClient} from './mock';

export type APIMode = 'real' | 'mock';

export interface APIClientConfig {
  mode: APIMode;
  baseURL?: string;
  timeout?: number;
}

/**
 * Unified API client that routes requests to either real or mock implementations
 * based on the configured mode.
 */
export class APIClient {
  private mode: APIMode;
  private realClient: RealAPIClient;
  private mockClient: MockAPIClient;

  constructor(config: APIClientConfig) {
    this.mode = config.mode;
    this.realClient = new RealAPIClient(
      config.baseURL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:8000',
      config.timeout
    );
    this.mockClient = new MockAPIClient();
  }

  /**
   * Set the API mode (real or mock)
   */
  setMode(mode: APIMode): void {
    this.mode = mode;
  }

  /**
   * Get the current API mode
   */
  getMode(): APIMode {
    return this.mode;
  }

  /**
   * Analyze a company - routes to appropriate client based on mode
   */
  async analyzeCompany(
    request: CompanyAnalysisRequest,
    onProgress?: (event: SSEEvent) => void
  ): Promise<CompanyAnalysisData> {
    if (this.mode === 'real') {
      return this.realClient.analyzeCompany(request, onProgress);
    }
    return this.mockClient.analyzeCompany(request, onProgress);
  }

  /**
   * Analyze visibility - routes to appropriate client based on mode
   */
  async analyzeVisibility(
    request: VisibilityAnalysisRequest,
    onProgress?: (event: SSEEvent) => void
  ): Promise<VisibilityAnalysisData> {
    if (this.mode === 'real') {
      return this.realClient.analyzeVisibility(request, onProgress);
    }
    return this.mockClient.analyzeVisibility(request, onProgress);
  }

  /**
   * Health check - routes to appropriate client based on mode
   */
  async healthCheck(): Promise<{status: string; version: string}> {
    if (this.mode === 'real') {
      return this.realClient.healthCheck();
    }
    return this.mockClient.healthCheck();
  }
}

// Singleton instance
let apiClientInstance: APIClient | null = null;

/**
 * Get the singleton API client instance
 * Initializes with configuration from environment variables on first call
 */
export function getAPIClient(): APIClient {
  if (!apiClientInstance) {
    const mode = getAPIMode();
    apiClientInstance = new APIClient({mode});
  }
  return apiClientInstance;
}

/**
 * Set the API mode and persist to localStorage
 */
export function setAPIMode(mode: APIMode): void {
  const client = getAPIClient();
  client.setMode(mode);

  // Persist to localStorage for development
  if (typeof window !== 'undefined') {
    localStorage.setItem('api_mode', mode);
  }
}

/**
 * Get the API mode from localStorage or environment variables
 * Priority: localStorage > environment variable > default ('mock')
 */
export function getAPIMode(): APIMode {
  // Check localStorage first (for runtime mode switching)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('api_mode') as APIMode;
    if (stored === 'real' || stored === 'mock') {
      return stored;
    }
  }

  // Fall back to environment variable
  const envMode = process.env.NEXT_PUBLIC_API_MODE as APIMode;
  if (envMode === 'real' || envMode === 'mock') {
    return envMode;
  }

  // Default to mock mode for safety
  return 'mock';
}
