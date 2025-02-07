import { Redis } from 'ioredis';


export const redis = new Redis("redis://localhost:6379");

const gracefulShutdown = async () => {
    console.log("Cerrando conexión con Redis...");
    await redis.quit();
    console.log("Conexión con Redis cerrada.");
    process.exit(0);
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);