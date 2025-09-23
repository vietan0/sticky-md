import antfu from '@antfu/eslint-config';
import pluginQuery from '@tanstack/eslint-plugin-query';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default antfu(
  {
    stylistic: {
      semi: true,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-console': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'style/padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'export'],
        },
        {
          blankLine: 'never',
          prev: 'export',
          next: 'export',
        },
        {
          blankLine: 'always',
          prev: [
            'multiline-expression',
            'multiline-block-like',
            'multiline-const',
            'interface',
          ],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'multiline-expression',
            'multiline-block-like',
            'multiline-const',
            'interface',
          ],
        },
        {
          blankLine: 'never',
          prev: ['singleline-const', 'singleline-let', 'singleline-var'],
          next: ['singleline-const', 'singleline-let', 'singleline-var'],
        },
      ],
      'perfectionist/sort-jsx-props': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-refresh/only-export-components': 'warn',
    },
    formatters: {
      css: true,
      html: true,
    },
  },
  {
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      'better-tailwindcss/no-unregistered-classes': ['warn', {
        ignore: ['task-list-item'],
      }],
      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', {
        printWidth: 100,
      }],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/index.css',
      },
    },
  },
  ...pluginQuery.configs['flat/recommended'],
);
