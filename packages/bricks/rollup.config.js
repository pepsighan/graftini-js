import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const config = {
  input: 'src/bricks.ts',
  external: ['react', '@emotion/react', '@emotion/react/jsx-runtime', 'next/router', 'draft-js'],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
};

export default config;
