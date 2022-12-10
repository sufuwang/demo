const path = require('path')
const ts = require('rollup-plugin-typescript2')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

module.exports = {
  input: './src/index.ts',
  output: {
    file: path.resolve(__dirname, './dist/bundle.js'),
    format: 'cjs',
    sourcemap: false,
  },
  plugins:[
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
  ]
}
