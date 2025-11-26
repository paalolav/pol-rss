import { InvocationContext } from '@azure/functions';

export interface LogEntry {
  timestamp: string;
  correlationId: string;
  event: string;
  url?: string;
  status?: number;
  duration?: number;
  error?: string;
  clientIp?: string;
  blocked?: boolean;
  reason?: string;
}

export class Logger {
  private context: InvocationContext;
  private correlationId: string;
  private startTime: number;

  constructor(context: InvocationContext) {
    this.context = context;
    this.correlationId = context.invocationId;
    this.startTime = Date.now();
  }

  private createEntry(event: string, data: Partial<LogEntry> = {}): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      correlationId: this.correlationId,
      event,
      ...data
    };
  }

  public requestReceived(url: string, clientIp?: string): void {
    const entry = this.createEntry('REQUEST_RECEIVED', { url, clientIp });
    this.context.log(JSON.stringify(entry));
  }

  public requestBlocked(url: string, reason: string): void {
    const entry = this.createEntry('REQUEST_BLOCKED', { url, blocked: true, reason });
    this.context.warn(JSON.stringify(entry));
  }

  public upstreamError(url: string, status: number, error: string): void {
    const entry = this.createEntry('UPSTREAM_ERROR', { url, status, error });
    this.context.error(JSON.stringify(entry));
  }

  public requestCompleted(url: string, status: number): void {
    const duration = Date.now() - this.startTime;
    const entry = this.createEntry('REQUEST_COMPLETED', { url, status, duration });
    this.context.log(JSON.stringify(entry));
  }

  public rateLimitExceeded(clientIp: string): void {
    const entry = this.createEntry('RATE_LIMIT_EXCEEDED', { clientIp, blocked: true, reason: 'Rate limit exceeded' });
    this.context.warn(JSON.stringify(entry));
  }

  public info(message: string, data?: Record<string, unknown>): void {
    this.context.log(JSON.stringify({ ...this.createEntry('INFO'), message, ...data }));
  }

  public error(message: string, error?: Error): void {
    this.context.error(JSON.stringify({
      ...this.createEntry('ERROR'),
      message,
      error: error?.message,
      stack: error?.stack
    }));
  }
}
