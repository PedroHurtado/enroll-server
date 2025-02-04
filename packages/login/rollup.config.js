import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import { globSync } from 'glob';

// Leer package.json para obtener dependencias externas
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const external = Object.keys(packageJson.dependencies || {}).filter(dep => !packageJson.dependencies[dep].startsWith('workspace:')).filter(dep => dep !== '@enroll-server/common');

// Directorios de entrada y salida
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const featuresDir = path.resolve(__dirname, 'src/features');
const outputDir = path.resolve('dist/features');

// Obtener todos los archivos dentro de features de forma recursiva
const featureFiles = globSync(`${featuresDir}/**/*.ts`);

export default [
  // Configuración para el index principal
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true
    },
    external,
    
    plugins: [
      alias({
        entries: [
          { find: '@enroll-server/common', replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../common/dist') }
        ]
      }),
      del({ targets: 'dist/*' }),
      typescript({ tsconfig: './tsconfig.json' }),
      nodeResolve(),
      commonjs(),
      json()
    ]
  },
  // Configuración para los bundles de cada feature
  ...featureFiles.map(file => ({
    input: file,
    output: {
      file: path.join(outputDir, path.relative(featuresDir, file).replace('.ts', '.js')),
      format: 'esm',
      sourcemap: true
    },
    external,
    plugins: [
      alias({
        entries: [
          { find: '@enroll-server/common', replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../common/dist') }
        ]
      }),
      typescript({ tsconfig: './tsconfig.json' }),
      nodeResolve(),
      commonjs(),
      json()
    ]
  }))
];
