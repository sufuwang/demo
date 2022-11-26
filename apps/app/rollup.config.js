const path = require('path')
const serve = require('rollup-plugin-serve')
const ts = require('rollup-plugin-typescript2')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')


module.exports = [
  {
    input: './src/index.ts',
    output: {
      file: path.resolve(__dirname, './dist/bundle.js'),
      // global: 弄个全局变量来接收
      // cjs: module.exports
      // esm: export default
      // iife: ()()
      // umd: 兼容 amd + commonjs 不支持es6导入
      format: 'cjs',
      sourcemap: false, // ts中的sourcemap也得变为true
    },
    plugins:[ // 这个插件是有执行顺序的
      nodeResolve({
        extensions: ['.js', '.ts']
      }),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      commonjs(),
      json(),
    ]
  }
]