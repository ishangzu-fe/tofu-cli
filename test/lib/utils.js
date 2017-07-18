const assert = require('assert')
const { resolveCwd } = require('../../lib/utils')

// 缺少对报错的测试
describe('Utils', () => {
    it('Resolve path from cwd', () => {
        assert.strictEqual(resolveCwd(), process.cwd(), 'Empty param should return cwd.')
        assert.strictEqual(
            resolveCwd('test', 'lib'),
            process.cwd() + '/test' + '/lib',
            'Empty param should return cwd.'
        )
    })
})