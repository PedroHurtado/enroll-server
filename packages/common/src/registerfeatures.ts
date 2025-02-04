import { Express } from 'express';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

export async function registerFeatures(app: Express) {
    try {
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDir = dirname(currentFilePath);
        
        const featuresPath = currentDir.includes('dist') 
            ? path.join(currentDir, 'features')
            : path.join(currentDir, '../src/features');

        const files = await glob(`${featuresPath}/**/*.{js,ts}`, {
            ignore: ['**/*.test.*', '**/*.spec.*', '**/*.d.ts']
        });

        for (const file of files) {
            try {
                // Convertir a URL compatible con importación en ESM
                const fileUrl = pathToFileURL(file).href;
                
                // Importar el módulo
                const feature = await import(fileUrl);
                
                if (typeof feature.default === 'function') {
                    await feature.default(app);
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
