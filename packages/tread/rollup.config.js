import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const config = {
  input: 'src/tread.ts',
  external: ['react', 'zustand', 'zustand/context'],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
};

export default config;
