module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jquery: true
  },
  extends: ['standard','plugin:vue/essential'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'standard/no-callback-literal':0,
    'quotes':[1,'single'],
    'prefer-const':0,
    'eqeqeq':0,
    "no-template-curly-in-string":0,
    "no-eval":0
  }
}
