import { Express } from 'express';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export async function registerFeatures(app: Express) {
    try {
        // Obtener la ruta base del proyecto
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDir = dirname(currentFilePath);
        
        // En producción, buscar en dist/features, en desarrollo en src/features
        const featuresPath = currentDir.includes('dist') 
            ? path.join(currentDir, 'features')
            : path.join(currentDir, '../src/features');

        const files = await glob(`${featuresPath}/**/*.{js,ts}`, {
            ignore: ['**/*.test.*', '**/*.spec.*', '**/*.d.ts']
        });

        for (const file of files) {
            try {
                // Normalizar la ruta para que sea compatible con el sistema operativo
                const normalizedPath = path.resolve(file);
                
                // Importar el módulo
                const feature = await import(normalizedPath);
                
                if (typeof feature.default === 'function') {
                    await feature.default(app);
                    console.log(`✅ Ruta registrada: ${normalizedPath}`);
                } else {
                    console.warn(`⚠️ El archivo ${normalizedPath} no exporta una función por defecto.`);
                }
            } catch (importError) {
                console.error(`❌ Error al importar ${file}:`, importError);
            }
        }
    } catch (error) {
        console.error('❌ Error al registrar características:', error);
        throw error; // Re-lanzar el error para manejo superior
    }
}