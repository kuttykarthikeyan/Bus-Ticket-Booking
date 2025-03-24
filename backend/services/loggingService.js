import winston from "winston";


const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);


const logger = winston.createLogger({
  level: "info", 
  format: logFormat,
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), 
    new winston.transports.File({ filename: "logs/combined.log" }) 
  ]
});

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
};

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ success: false, message: "Internal Server Error" });
};

export { logger, requestLogger, errorHandler };
