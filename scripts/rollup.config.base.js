// 安装以下 npm 包
// import { nodeResolve } from '@rollup/plugin-node-resolve' // 解析 node_modules 中的模块
// import commonjs from '@rollup/plugin-commonjs' // cjs => esm
// import alias from '@rollup/plugin-alias' // alias 和 reslove 功能
// import replace from '@rollup/plugin-replace'
import eslint from '@rollup/plugin-eslint'
// import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
// import clear from 'rollup-plugin-clear'
import json from '@rollup/plugin-json' // 支持在源码中直接引入json文件，不影响下面的
import { globSync } from 'glob';
// import path from 'path';
// import { fileURLToPath } from 'node:url';
const files = globSync('src/**/*.js', { absolute: true });

export default {
  input: files,
  output:{
    format: 'es',
    dir: 'bin',
    entryFileNames: '[name].js',
    plugins: [terser()]
  },
  // 注意 plugin 的使用顺序
  plugins: [
    json({
      exclude: [ 'node_modules/*' ],
    }),
    // clear({
    //   targets: ['lib']
    // }),
    // alias(),
    // replace({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    //   preventAssignment: true
    // }),
    // nodeResolve(),
    // commonjs({
    //   include: 'node_modules/**'
    // }),
    eslint({
      throwOnError: true, // 抛出异常并阻止打包
      include: ['src/**'],
      exclude: ['node_modules/**']
    }),
    // babel({ babelHelpers: 'bundled' })
  ]
}

