import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // Layering (blueprint/03): domain imports nothing above it.
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['react', 'react-dom', 'react/*'], message: 'domain/ is framework-free.' },
            {
              group: ['@/app/*', '@/features/*', '@/data/*', '@/design/*'],
              message: 'domain/ imports nothing above it.',
            },
          ],
        },
      ],
    },
  },
  // Layering: the design system knows no features and no data.
  {
    files: ['src/design/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/*', '@/features/*', '@/data/*'],
              message: 'design/ is feature-agnostic.',
            },
          ],
        },
      ],
    },
  },
  // Layering: features never import other features (own folder allowed via relative paths).
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/features/*'], message: 'features never import other features.' },
          ],
        },
      ],
    },
  },
)
