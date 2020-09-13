const { createLogger, transports, format } = require('winston')
const { combine, timestamp, simple } = format

logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    simple()
  ),
  transports: [
    new transports.Console()
  ]
});

module.exports = {
  debug: message => logger.log({level: 'debug', message}),
  info: message => logger.log({level: 'info', message}),
  warn: message => logger.log({level: 'warn', message}),
  error: message => logger.log({level: 'error', message})
}