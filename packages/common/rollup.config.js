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
      outputToFilesystem: true
    })
  ]
};

const dtsConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es'
  },  
  plugins: [      
    dts({
      tsconfig: './tsconfig.json',      
      compilerOptions: {
        composite: false,
        preserveSymlinks: true
      },
      respectExternal: true
    })
  ]
};



export default [mainConfig];