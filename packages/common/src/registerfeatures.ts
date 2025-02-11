import { Express } from 'express';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Logger } from 'pino';
import { dirname } from 'path';

export async function registerFeatures(app: Express, logger: Logger, moduleUrl: string) {
    try {
        // Determinar la ubicación de `features` a partir de import.meta.url
        const basePath = dirname(fileURLToPath(moduleUrl));
        const featuresPath = path.join(basePath, 'features');

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
