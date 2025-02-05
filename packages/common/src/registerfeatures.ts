import { Express } from 'express';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { Logger } from 'pino';

export async function registerFeatures(app:Express, logger: Logger) {
    try {
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDir = dirname(currentFilePath);
        const featuresPath = path.join(currentDir, 'features');

        console.log(`🔍 Buscando archivos en: ${featuresPath}`);

        const files = await glob(`${featuresPath}/**/*.js`, {
            ignore: ['**/*.test.*', '**/*.spec.*', '**/*.d.ts']
        });        
        console.log(`📂 Archivos encontrados:`, files);

        for (const file of files) {
            try {
                const fileUrl = pathToFileURL(file).href;
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
