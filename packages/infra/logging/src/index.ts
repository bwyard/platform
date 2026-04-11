// ============================================================
// @breeyard/logging — structured logging via Pino
// Ported and adapted from @artist-platform/logging
// BOUNDARY: all log I/O goes through this package. Never import pino directly.
// ============================================================

import pino from 'pino';

// ---- Types ----

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggerConfig {
  readonly level?: LogLevel;
  readonly redact?: readonly string[];
  readonly pretty?: boolean;
  readonly base?: Record<string, unknown>;
}

export interface Logger {
  readonly trace: (msg: string, context?: Record<string, unknown>) => void;
  readonly debug: (msg: string, context?: Record<string, unknown>) => void;
  readonly info: (msg: string, context?: Record<string, unknown>) => void;
  readonly warn: (msg: string, context?: Record<string, unknown>) => void;
  readonly error: (msg: string, context?: Record<string, unknown>) => void;
  readonly fatal: (msg: string, context?: Record<string, unknown>) => void;
  readonly child: (bindings: Record<string, unknown>) => Logger;
}

// ---- Defaults ----

const DEFAULT_REDACT_PATHS: readonly string[] = [
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'authorization',
  'cookie',
  '*.password',
  '*.token',
  '*.secret',
  'req.headers.authorization',
  'req.headers.cookie',
];

// ---- Factory ----

const wrapPino = (instance: pino.Logger): Logger => ({
  trace: (msg, ctx) => {
    instance.trace(ctx ?? {}, msg);
  },
  debug: (msg, ctx) => {
    instance.debug(ctx ?? {}, msg);
  },
  info: (msg, ctx) => {
    instance.info(ctx ?? {}, msg);
  },
  warn: (msg, ctx) => {
    instance.warn(ctx ?? {}, msg);
  },
  error: (msg, ctx) => {
    instance.error(ctx ?? {}, msg);
  },
  fatal: (msg, ctx) => {
    instance.fatal(ctx ?? {}, msg);
  },
  child: (bindings) => wrapPino(instance.child(bindings)),
});

export const createLogger = (config: LoggerConfig = {}): Logger => {
  const redact = [...DEFAULT_REDACT_PATHS, ...(config.redact ?? [])];

  const transport = config.pretty
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined;

  const instance = pino({
    level: config.level ?? process.env.LOG_LEVEL ?? 'info',
    redact: { paths: redact, censor: '[REDACTED]' },
    base: config.base ?? { pid: process.pid },
    ...(transport ? { transport } : {}),
  });

  return wrapPino(instance);
};

// ---- Singleton ----

let _defaultLogger: Logger | null = null;

export const getLogger = (config?: LoggerConfig): Logger => {
  _defaultLogger ??= createLogger(config);
  return _defaultLogger;
};

export const _resetLogger = (): void => {
  _defaultLogger = null;
};
