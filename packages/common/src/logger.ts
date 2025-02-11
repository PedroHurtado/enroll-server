import pino from 'pino';
import pinoHttp from 'pino-http';
import pinoElastic from 'pino-elasticsearch';

export function loggerApp(node: string, index:string) {
  const streamToElastic = pinoElastic({
    index,
    node
  });
  const logger = pino({}, streamToElastic);
  const httpLogger = pinoHttp({ logger });  
  return {
    logger, httpLogger
  }
}
