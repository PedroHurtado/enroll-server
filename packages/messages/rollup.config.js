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
import copy from 'rollup-plugin-copy';

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
      typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false }),
      nodeResolve(),
      commonjs(),
      json(),
      copy({
        targets: [
          {
            src: 'package.json',
            dest: 'dist',
            transform: (contents) => {
              const packageJson = JSON.parse(contents.toString());
              // Excluir @enroll-server/common de dependencies
              packageJson.dependencies = Object.fromEntries(
                Object.entries(packageJson.dependencies || {}).filter(([key]) => key !== '@enroll-server/common')
              );
              // Eliminar devDependencies y scripts
              delete packageJson.devDependencies;
              delete packageJson.scripts;
              packageJson.main = 'index.js';
              return JSON.stringify(packageJson, null, 2);
            }
          }
        ]
      })
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
      typescript({ tsconfig: './tsconfig.json', outputToFilesystem: false }),
      nodeResolve(),
      commonjs(),
      json()
    ]
  }))
];
