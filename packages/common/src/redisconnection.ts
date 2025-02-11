import { Redis } from 'ioredis';
import { config } from '@enroll-server/common';
export const redis = new Redis(config.redis);

const gracefulShutdown = async () => {
    console.log("Cerrando conexión con Redis...");
    await redis.quit();
    console.log("Conexión con Redis cerrada.");
    process.exit(0);
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);