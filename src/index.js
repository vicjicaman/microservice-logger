import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import * as Service from "./service";

export const create = ({ path: logPath, env }) => {
  const transports = [];
  const level = env !== "production" ? "debug" : "info";

  if (logPath !== null) {
    if (!fs.existsSync(logPath)) {
      execSync("mkdir -p " + logPath);
    }

    transports.push(
      new DailyRotateFile({
        filename: path.join(logPath, "error.log"),
        datePattern: "yyyy-MM-dd.",
        prepend: true,
        level: "error"
      })
    );

    transports.push(
      new DailyRotateFile({
        filename: path.join(logPath, "info.log"),
        datePattern: "yyyy-MM-dd.",
        prepend: true,
        level: "info"
      })
    );
  }

  const logger = winston.createLogger({
    level,
    format: winston.format.json(),
    transports
  });

  if (env !== "production" || logPath === null) {
    logger.add(
      new winston.transports.Console({
        level: "debug",
        format: winston.format.simple()
      })
    );
  } else {
    logger.add(
      new winston.transports.Console({
        level: "info",
        format: winston.format.simple()
      })
    );
  }

  return logger;
};

export { Service };
