module.exports = {
  extends: [
    'plugin:vue/base',
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },

  root: false,

  env: {
    node: true
  },

  parserOptions: {
    ecmaVersion: 2020
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
