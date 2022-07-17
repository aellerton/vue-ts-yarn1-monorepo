/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path')

module.exports = {
  /*
  paths: {
    index: {
      entry: 'src/pages/root/main.ts'
    },
    foo: {
      entry: 'src/pages/foo/main.ts',
      template: 'public/sim.html'
    }
  }
  */
  outputDir: path.join(__dirname, '..', 'dist', 'app'),

  lintOnSave: false
}
