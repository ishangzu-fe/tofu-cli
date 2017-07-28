const program = require('commander')
const { CLIEngine } = require('eslint')

const { logSuccess } = require('../lib/log')
const tofurc = require('../lib/get-config')()

program
    .option('-f, --fix', '自动修复')
    .option('-q, --quiet', '安静地校验')
    .parse(process.argv)

let rules = require('../webpack/rules')
if (tofurc && tofurc.rules) {
    rules = Object.assign({}, rules, tofurc.rules)
}

const linter = new CLIEngine({
    fix: program.fix,
    ignorePattern: [],
    useEslintrc: false,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    cwd: process.cwd(),
    env: ['browser'],
    plugins: [
        'html'
    ],
    rules
})

const report = linter.executeOnFiles(['src/**/*.js', 'src/**/*.vue'])
CLIEngine.outputFixes(report)
const formatter = require("eslint-friendly-formatter")

console.log(formatter(report.results))

if (report.errorCount) {
    process.exit(1)
} else if (!program.quiet) {
    logSuccess('Perfect code!')
}
