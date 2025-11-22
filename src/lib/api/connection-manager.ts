/**
 * SSE Connection Manager
 * Manages lifecycle of SSE connections to prevent memory leaks
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 */

import {SSEConnection} from './sse';

export class SSEConnectionManager {
  private connections: Map<string, SSEConnection>;
  private static instance: SSEConnectionManager | null = null;

  private constructor() {
    this.connections = new Map();
  }

  /**
   * Get singleton instance of connection manager
   */
  static getInstance(): SSEConnectionManager {
    if (!SSEConnectionManager.instance) {
      SSEConnectionManager.instance = new SSEConnectionManager();
    }
    return SSEConnectionManager.instance;
  }

  /**
   * Register a new SSE connection
   * Automatically cleans up any existing connection with the same ID
   */
  register(id: string, connection: SSEConnection): void {
    // Clean up existing connection if present
    this.cleanup(id);

    // Store new connection
    this.connections.set(id, connection);
  }

  /**
   * Clean up a specific connection by ID
   * Closes the connection and removes it from the registry
   */
  cleanup(id: string): void {
    const connection = this.connections.get(id);
    if (connection) {
      connection.close();
      this.connections.delete(id);
    }
  }

  /**
   * Clean up all active connections
   * Useful for component unmount or application cleanup
   */
  cleanupAll(): void {
    this.connections.forEach((connection) => {
      connection.close();
    });
    this.connections.clear();
  }

  /**
   * Check if a connection exists and is active
   */
  hasConnection(id: string): boolean {
    const connection = this.connections.get(id);
    return connection ? connection.isConnected() : false;
  }

  /**
   * Get the number of active connections
   */
  getActiveConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Get all connection IDs
   */
  getConnectionIds(): string[] {
    return Array.from(this.connections.keys());
  }
}

/**
 * Get the singleton connection manager instance
 */
export function getConnectionManager(): SSEConnectionManager {
  return SSEConnectionManager.getInstance();
}
