const program = require('commander')
const { CLIEngine } = require('eslint')

const { logSuccess } = require('../lib/log')
const tofurc = require('../lib/get-config')()

program
    .option('-f, --fix', '自动修复')
    .parse(process.argv)

let rules = {
    'semi': ['error', 'always'],
    'indent': ['error', 4],
    'brace-style': ['error', '1tbs'],
    'keyword-spacing': ['error', {
        'after': true
    }],
    'eqeqeq': 2,
    'no-console': process.env.NODE_ENV === 'production'
        ? 1 : 0,
    'no-debugger': process.env.NODE_ENV ===
        'production' ? 2 : 0
}
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
} else {
    logSuccess('Perfect code!')
}
