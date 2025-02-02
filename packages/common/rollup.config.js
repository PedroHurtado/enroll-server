import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';

// Configuración principal para el código
const mainConfig = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',   
    sourcemap: true,
  },
  external: ['express', 'express-validator', 'glob', 'mongoose'],
  plugins: [
    del({ targets: ['dist/*'] }),
    resolve({
      extensions: ['.ts', '.js'],
      preferBuiltins: true,
      dedupe: ['express', 'express-validator', 'glob', 'mongoose']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',      
    })
  ]
};

// Configuración específica para generar los tipos
const dtsConfig = {
  input: 'src/index.ts',
  output: {
    dir: 'dist/types',
    format: 'es',
      },
  plugins: [
    resolve({
      extensions: ['.ts', '.d.ts']
    }),
    dts({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@enroll-server/common": ["src"]
        }
      }
    })
  ]
};

export default [mainConfig, dtsConfig];