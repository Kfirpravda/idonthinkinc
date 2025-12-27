import { Agent, AgentCapabilities } from '@idonthinkinc/shared-types';

export abstract class BaseAgent<Input, Output> implements Agent<Input, Output> {
  abstract name: string;
  abstract version: string;

  abstract execute(input: Input): Promise<Output>;
  abstract validate(input: Input): Promise<boolean>;

  abstract getCapabilities(): AgentCapabilities;

  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.name}] [${level.toUpperCase()}] ${message}`);
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.log(`Attempt ${attempt} failed: ${lastError.message}`, 'warn');

        if (attempt < maxRetries) {
          await this.sleep(delayMs * attempt);
        }
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
