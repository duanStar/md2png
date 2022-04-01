const fs = require('fs')
const path = require('path')
const marked = require('marked')
const puppeteer = require('puppeteer')
const { cosmiconfigSync } = require('cosmiconfig')
const ora = require('ora')

const defaultHtml =
  '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="stylesheet" href="https://unpkg.com/github-markdown-css@5.1.0/github-markdown.css"/><style>.markdown-body {width: 90%;max-width: 700px;margin: 0 auto;}</style></head><body class="markdown-body">${fragment}</body></html>'

/**
 * 将指定路径的 md 文件转为png
 * @param {string} name 输入文件路径（相对or绝对）
 * @param {object} param1
 * @returns
 */
module.exports = async (input, options) => {
  const spinner = ora('加载中').start()
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`)
  }

  options = Object.assign({}, options)
  const { output, width = 800 } = options

  const filePath = path.resolve(input)

  const isFileExits = fs.existsSync(filePath)
  if (!isFileExits) {
    throw new Error(`不存在 ${input} 所对应文件`)
  }

  const isFile = fs.statSync(filePath).isFile
  if (!isFile) {
    throw new Error(`${input} 路径不是一个文件`)
  }

  const isMD = path.extname(filePath) === '.md'
  if (!isMD) {
    throw new Error(`${input} 对应文件不是md文件`)
  }

  let outputPath = path.resolve(output)
  let filename = 'result.png'

  if (path.extname(outputPath) === '.png') {
    const index = outputPath.lastIndexOf('\\')
    filename = outputPath.substring(index + 1) || filename
    outputPath = outputPath.substring(0, index)
  }

  const isDirExits = fs.existsSync(outputPath)

  if (!isDirExits) {
    fs.mkdirSync(outputPath)
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const fragment = marked.parse(content)

  const explorer = cosmiconfigSync('md2png')
  const { config = {} } = explorer.search(process.cwd()) || {}

  const html = (config.template || defaultHtml).replace(
    '${fragment}',
    fragment
  )

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width, height: 100 })
  await page.setContent(html)
  await page.screenshot({
    path: `${outputPath}\\${filename}`,
    fullPage: true
  })

  await browser.close()
  spinner.color = 'green'
  spinner.succeed('加载完成')
  setTimeout(() => {
    spinner.stop()
  }, 1000)
  return true
}
