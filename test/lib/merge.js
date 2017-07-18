const assert = require('assert')
const fs = require('fs-extra')
const path = require('path')
const mergeFile = require('../../lib/merge')

describe('Merge by git merge-file', () => {
    const srcPath = path.resolve(__dirname, './test-src.js')
    const targetPath = path.resolve(__dirname, './test-target.js')
    const basePath = path.resolve(__dirname, './test-empty.js')

    const rstArr = []

    before(() => {
    })

    it('Merge text and has conflict', () => {
        fs.writeFileSync(srcPath, 'var a = 1')
        fs.writeFileSync(targetPath, 'var b = 2')
        fs.writeFileSync(basePath, '')

        const result = mergeFile(targetPath, basePath, srcPath)
        rstArr.push(!result)

        assert(!result, 'Merge should has conflict')
    })

    it('Merge text and has not conflict', () => {
        fs.writeFileSync(srcPath, 'var a = 1\nvar b = 2')
        fs.writeFileSync(targetPath, 'var a = 1')
        fs.writeFileSync(basePath, 'var a = 1')
        const result = mergeFile(targetPath, basePath, srcPath)
        rstArr.push(result)

        assert(result, 'Merge should has not conflict')
    })

    it('Merge dir use cover', () => {
        const srcPath = path.resolve(__dirname, './test/test.js')
        const targetPath = path.resolve(__dirname, '../test/test.js')
        fs.ensureFileSync(srcPath)
        fs.ensureFileSync(targetPath)
        fs.writeFileSync(srcPath, 'var a = 1')
        fs.writeFileSync(targetPath, 'var a = 2')

        mergeFile(
            path.resolve(__dirname, './test'),
            basePath,
            path.resolve(__dirname, '../test')
        )

        const fileContent = fs.readFileSync(targetPath, { encoding: 'utf-8' })

        assert.strictEqual(fileContent, 'var a = 2')

        fs.removeSync(path.resolve(__dirname, './test'))
        fs.removeSync(path.resolve(__dirname, '../test'))
    })

    after(() => {
        if (rstArr.every(rst => rst)) {
            fs.removeSync(srcPath)
            fs.removeSync(targetPath)
            fs.removeSync(basePath)
        }
    })
})