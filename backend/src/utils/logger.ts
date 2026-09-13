import { env } from "../config/env.config";

type LogLevel = "info" | "warn" | "error" | "debug";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

const formatMessage = (level: LogLevel, message: string, meta?: any): string => {
  const timestamp = new Date().toISOString();
  let color = colors.green;

  if (level === "warn") color = colors.yellow;
  if (level === "error") color = colors.red;
  if (level === "debug") color = colors.cyan;

  const prefix = `${colors.dim}[${timestamp}]${colors.reset} ${color}${colors.bright}[${level.toUpperCase()}]${colors.reset}`;
  const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : "";

  return `${prefix} ${message}${metaStr}`;
};

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(formatMessage("info", message, meta));
  },
  warn: (message: string, meta?: any) => {
    console.warn(formatMessage("warn", message, meta));
  },
  error: (message: string, meta?: any) => {
    console.error(formatMessage("error", message, meta));
  },
  debug: (message: string, meta?: any) => {
    if (env.NODE_ENV !== "production") {
      console.log(formatMessage("debug", message, meta));
    }
  },
};

export default logger;
