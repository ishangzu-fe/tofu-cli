module.exports = {
    'no-console': process.env.NODE_ENV === 'production'
        ? 1 : 0,
    'no-debugger': process.env.NODE_ENV ===
        'production' ? 2 : 0,

    'no-func-assign': 2,
    'no-sparse-arrays': 2,
    'no-unreachable': 2,

    'curly': ['error', 'all'],
    'default-case': 2,
    'no-multi-spaces': 2,
    'no-new-wrappers': 2,
    'no-redeclare': 2,

    // 'no-undefined': 2,
    'no-undef-init': 2,
    // 'no-undef': 2,
    'no-unused-vars': 1,

    'block-spacing': 2,
    'brace-style': ['error', '1tbs'],
    'comma-spacing': 2,
    'comma-style': 2,
    'computed-property-spacing': 2,
    'func-call-spacing': 2,
    'indent': ['error', 4],
    'keyword-spacing': 2,
    'max-statements-per-line': ['error', { max: 1 }],
    'no-mixed-spaces-and-tabs': 2,
    'no-multiple-empty-lines': 2,
    'no-tabs': 2,
    'no-whitespace-before-property': 2,
    'object-curly-newline': ['error', {
        multiline: true
    }],
    'one-var': ['error', {
        initialized: 'never',
        uninitialized: 'always',
    }],
    'quotes': ['error', 'single'],
    'semi': 2,
    'space-before-blocks': ['error', {
        'functions': 'never',
        'keywords': 'always',
        'classes': 'always'
    }],
    'space-before-function-paren': ['error', 'never'],
    'space-unary-ops': ['error', {
        words: true,
        nonwords: false
    }],
    'space-infix-ops': 2,

    'arrow-spacing': 2,
    'generator-star-spacing': ['error', 'after'],
    'no-const-assign': 2,
    'no-duplicate-imports': 2,

    'no-compare-neg-zero': 2,
    'no-eval': 2,
    'no-invalid-regexp': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': 2,
    'no-empty-character-class': 2,
    'no-extra-semi': 2,
    'no-regex-spaces': 2,
    'no-unexpected-multiline': 2,
    'valid-typeof': 2,
    'no-lone-blocks': 2,
    'no-loop-func': 2,
    'no-self-assign': 2,
    'no-self-compare': 2,
    'no-unused-expressions': 2,
    'no-useless-concat': 2,
    'no-with': 2,
    // 'no-use-before-define': 2,
    'no-dupe-class-members': 2,
    'no-unneeded-ternary': 2
}
