const tseslint = require('typescript-eslint')
const prettier = require('eslint-config-prettier')
const prettierPlugin = require('eslint-plugin-prettier')

module.exports = tseslint.config(
  {
    // Add ignore patterns from .eslintignore
    ignores: ['*.config.js', '*.config.ts', '*.test.js', '*.test.ts', 'dist'],
  },
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Extend recommended TypeScript rules
      ...tseslint.configs.recommended.rules,
      // Extend Prettier rules
      ...prettier.rules,
      // Explicitly enable the prettier rule
      'prettier/prettier': 'error',
    },
  }
)
