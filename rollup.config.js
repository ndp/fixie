import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';
import pkg from './package.json';

export default [{
  input: 'dist/fixie.js',
  output: {
    name: "fixie",
    file: pkg.browser,
    format: 'iife',
    sourcemap: false,
    exports: 'named'
  },
  plugins: [
    resolve(),
    commonjs(),
    minify({ comments: false }),
  ],
}];
