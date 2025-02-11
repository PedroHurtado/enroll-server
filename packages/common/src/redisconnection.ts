import { Redis } from 'ioredis';
import { config } from '../src/config'
export const redis = new Redis(config.redis);

const gracefulShutdown = async () => {
    console.log("Cerrando conexión con Redis...");
    await redis.quit();
    console.log("Conexión con Redis cerrada.");
    process.exit(0);
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);