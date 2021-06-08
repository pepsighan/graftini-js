import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const config = {
  input: 'src/graft.ts',
  external: [
    'react',
    'zustand',
    'zustand/context',
    'nanoid',
    'immer',
    'lodash-es',
    'react-merge-refs',
  ],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
};

export default config;
