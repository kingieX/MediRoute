import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  transport: isDev ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
  level: isDev ? 'debug' : 'info',
});
