import { glob } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';
export async function registerFeatures(app, featuresPath = './src/features') {
    try {
        const files = await glob(`${featuresPath}/**/*.ts`);
        for (const file of files) {
            const modulePath = pathToFileURL(path.resolve(file)).href;
            const feature = await import(modulePath);
            if (typeof feature.default === 'function') {
                feature.default(app);
            }
            else {
                console.warn(`El archivo ${modulePath} no exporta una función por defecto.`);
            }
        }
    }
    catch (error) {
        console.error('Error al registrar características:', error);
    }
}
