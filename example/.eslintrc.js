module.exports = {
  root: true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "plugins": [
    "get"
  ],
  "extends": "eslint:recommended",
  "overrides": [],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "get/getter-function-must-return": ["error"]
  }
}
