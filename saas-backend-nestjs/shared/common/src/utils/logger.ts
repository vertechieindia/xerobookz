import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  logContext(context: string, message: string, ...args: any[]) {
    super.log(`[${context}] ${message}`, ...args);
  }

  errorContext(context: string, message: string, trace?: string, ...args: any[]) {
    super.error(`[${context}] ${message}`, trace, ...args);
  }

  warnContext(context: string, message: string, ...args: any[]) {
    super.warn(`[${context}] ${message}`, ...args);
  }

  debugContext(context: string, message: string, ...args: any[]) {
    super.debug(`[${context}] ${message}`, ...args);
  }
}
