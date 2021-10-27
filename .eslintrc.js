module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    extraFileExtensions:true
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],

  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "camelcase": "off",
    "@typescript-eslint/camelcase": ["off"],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}