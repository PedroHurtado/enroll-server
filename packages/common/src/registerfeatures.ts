import { Express } from 'express';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { Logger } from 'pino';

export async function registerFeatures(app: Express, logger: Logger) {
    try {
        // Usamos SERVICE_PATH si está definido, si no, usamos la ruta calculada
        const basePath = process.env.SERVICE_PATH || dirname(fileURLToPath(import.meta.url));
        const featuresPath = process.env.NODE_ENV === 'development' 
            ? path.join(basePath, 'src', 'features')
            : path.join(basePath, 'features');
        
        console.log(`🔍 Entorno: ${process.env.NODE_ENV}`);
        console.log(`🔍 Buscando archivos en: ${featuresPath}`);
        
        const files = await glob(`${featuresPath}/**/*.{js,ts}`, {
            ignore: ['**/*.test.*', '**/*.spec.*', '**/*.d.ts']
        });
        
        
        console.log(`📂 Archivos encontrados:`, files);
        
        for (const file of files) {
            try {
                const fileUrl = pathToFileURL(file).href;
                console.log(`🔗 Intentando importar: ${fileUrl}`);
                const feature = await import(fileUrl);
                if (typeof feature.default === 'function') {
                    await feature.default(app, logger);
                    console.log(`✅ Ruta registrada: ${file}`);
                } else {
                    console.warn(`⚠️ El archivo ${file} no exporta una función por defecto.`);
                }
            } catch (importError) {
                console.error(`❌ Error al importar ${file}:`, importError);
            }
        }
    } catch (error) {
        throw error;
    }
 }