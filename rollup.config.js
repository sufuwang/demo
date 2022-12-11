const path = require('path')
const ts = require('rollup-plugin-typescript2')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

const getOption = (input, output) => ({
  input,
  output: {
    file: path.resolve(__dirname, output),
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
})

module.exports = [
  getOption('./src/index.1.ts', './dist/bundle.1.js'),
  getOption('./src/index.2.ts', './dist/bundle.2.js'),
]
