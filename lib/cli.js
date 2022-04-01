const cac = require('cac')
const md2Png = require('.')
const { name, version } = require('../package.json')

// Unified error handling
/* istanbul ignore next */
const onError = (err) => {
  console.error(err.message)
  process.exit(1)
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

const cli = cac(name)

cli
  .command('<input>', 'md文件路径')
  .option('-o, --output <output>', '输出图片路径')
  .option('-w, --width <width>', '输出图片宽度')
  .example(`  $ ${name} ./README.md -o ./dist/README.png -w 500`)
  .action((input, { output, width }) => {
    if (typeof host !== 'string' && typeof host !== 'undefined') {
      throw new TypeError('Expected host is a string, got undefined')
    }
    md2Png(input, { output, width })
  })

cli.help().version(version).parse()
