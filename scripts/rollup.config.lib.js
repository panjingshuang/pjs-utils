import baseConfig from './rollup.config.base.js'
import terser from '@rollup/plugin-terser'
import pkg from '../package.json' assert { type: 'json' }


const pkgName = 'pjs-utils'
const banner =
'/*!\n' +
` * ${pkg.name} v${pkg.version}\n` +
` * (c) 2014-${new Date().getFullYear()} ${pkg.name}\n` +
' * Released under the MIT License.\n' +
' */'


export default {
  ...baseConfig,
  input: 'src/index.js',
  // 同时打包多种规范的产物
  output: [ 
    {
      file: `lib/${pkgName}.umd.js`,
      format: 'umd',
      name: pkgName,
      banner
    },
    {
      file: `lib/${pkgName}.umd.min.js`,
      format: 'umd',
      name: pkgName,
      banner,
      plugins: [terser()]
    },
    {
      file: `lib/${pkgName}.cjs.js`,
      format: 'cjs',
      name: pkgName,
      banner
    },
    {
      file: `lib/${pkgName}.esm.js`,
      format: 'es',
      banner
    }
  ],
  plugins: [
    ...baseConfig.plugins
  ]
}
