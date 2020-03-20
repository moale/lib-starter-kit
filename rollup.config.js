const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');
const strip = require('@rollup/plugin-strip');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const compiler = require('@ampproject/rollup-plugin-closure-compiler');

// const path = require('path');
const FORMATS = ['esm', 'cjs'];

const env = process.env.NODE_ENV || 'development';
const __DEV__ = process.env.NODE_ENV === 'development';

/* function isBareModuleId(id) {
  return (
    !id.startsWith('.') &&
    (!id.includes(path.join(process.cwd(), 'modules')) ||
      !id.includes(path.join(process.cwd(), 'packages')))
  );
} */

function createConfig({
  input,
  output,
  min,
  env = 'development',
  isEsm = output.format !== 'cjs',
  sourceMaps = false,
  compilerSettings = {},
}) {
  return {
    input,
    output,
    //external: isBareModuleId,
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps,
        plugins: [['@babel/transform-runtime', { useESModules: isEsm }]],
      }),
      env === 'production' && strip({ sourceMap: sourceMaps }),
      replace({ 'process.env.NODE_ENV': JSON.stringify(env), __DEV__ }),
      nodeResolve(),
      commonjs(),
      compiler(compilerSettings),
      min && terser(),
    ].filter(Boolean),
  };
}

module.exports = FORMATS.map((format) => {
  return {
    ...createConfig({
      env,
      min: env === 'production',
      input: 'src/index.js',
      output: {
        file: `dist/${format}.js`,
        format,
      },
    }),
    watch: {
      exclude: 'node_modules/**',
      chokidar: true,
      include: 'src/**',
    },
  };
});
