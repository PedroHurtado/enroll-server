import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';

const mainConfig = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  external: ['express', 'express-validator', 'glob', 'mongoose'],
  plugins: [
    del({ targets: ['dist/*.js', 'dist/*.map'] }), // Evita borrar .d.ts
    resolve({
      extensions: ['.ts', '.js'],
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'      
    })
  ]
};


export default [mainConfig];
