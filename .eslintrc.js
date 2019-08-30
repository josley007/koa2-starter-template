module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        'linebreak-style': 0,
        'no-unused-vars': 0,
        'no-underscore-dangle': 0,
        'no-console': 0,
        'prefer-promise-reject-errors': 0,
        'no-restricted-syntax': 0,
        'import/no-dynamic-require': 0,
        'no-param-reassign': 0,
        'consistent-return': 0
    }
};