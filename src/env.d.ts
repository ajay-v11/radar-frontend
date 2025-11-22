/// <reference types="next" />

/**
 * Type definitions for environment variables
 * These variables are defined in .env.local (development) and .env.production (production)
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * API Mode: Controls which API implementation to use
     * - 'mock': Use simulated API responses (no backend required)
     * - 'real': Connect to actual backend API
     * @default 'mock'
     */
    NEXT_PUBLIC_API_MODE?: 'mock' | 'real';

    /**
     * API Base URL: The base URL of the backend API server
     * Only used when NEXT_PUBLIC_API_MODE is set to 'real'
     * @example 'http://localhost:8000' (development)
     * @example 'https://api.production.com' (production)
     */
    NEXT_PUBLIC_API_URL?: string;

    /**
     * Node environment
     */
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
