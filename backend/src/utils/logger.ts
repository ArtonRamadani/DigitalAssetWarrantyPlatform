import colors from 'colors';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const LEVEL_COLORS = {
  INFO: colors.cyan,
  WARN: colors.yellow,
  ERROR: colors.red,
  DEBUG: colors.green,
  SUCCESS: colors.blue
};

const LEVEL_ICONS = {
  INFO: 'ℹ️',
  WARN: '⚠️',
  ERROR: '❌',
  DEBUG: '🔍',
  SUCCESS: '✅'
};

export class Logger {
  private static instance: Logger;
  private constructor() { }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(
    level: keyof typeof LEVEL_COLORS,
    context: string,
    message: string,
    metadata?: Record<string, unknown>
  ): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const levelColor = LEVEL_COLORS[level];
    const levelIcon = LEVEL_ICONS[level];

    let formattedMessage = `${levelColor(`[${timestamp}] ${levelIcon} ${level}:`)} ${message}`;
    if (metadata) {
      formattedMessage += `${colors.gray(JSON.stringify(metadata, null, 2))}`;
    }

    return formattedMessage;
  }

  public info(context: string, message: string, metadata?: Record<string, any>): void {
    console.log(this.formatMessage('INFO', context, message, metadata));
  }

  public warn(context: string, message: string, metadata?: Record<string, any>): void {
    console.warn(this.formatMessage('WARN', context, message, metadata));
  }

  public error(context: string, message: string, metadata?: Record<string, any>): void {
    console.error(this.formatMessage('ERROR', context, message, metadata));
  }

  public debug(context: string, message: string, metadata?: Record<string, any>): void {
    console.log(this.formatMessage('DEBUG', context, message, metadata));
  }

  public success(context: string, message: string, metadata?: Record<string, any>): void {
    console.log(this.formatMessage('SUCCESS', context, message, metadata));
  }

  public logRequest(req: Request, res: Response): void {
    const requestId = uuidv4();
    const { method, url, headers } = req;
    const { statusCode } = res;

    this.info('REQUEST', `HTTP ${method} ${url}`, {
      requestId,
      status: statusCode,
      headers: headers,
      timestamp: new Date().toISOString()
    });
  }
}

export const logger = Logger.getInstance();