const path = require('path')
/**  @type {import('eslint').Linter.Config} */
module.exports = {
    env: {
        node: true,
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier',
    ],
    ignorePatterns: ['*.d.ts', '.eslintrc.js'],
    plugins: ['@typescript-eslint', 'import', 'unused-imports'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: path.join(__dirname, 'tsconfig.eslint.json'),
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: path.join(__dirname, 'tsconfig.eslint.json'),
            },
        },
    },
    rules: {
        'no-empty': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-namespace': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'all',
                argsIgnorePattern: '^_',
            },
        ],
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                },
                groups: [
                    ['builtin', 'external', 'internal'],
                    ['parent', 'sibling', 'index'],
                    ['object'],
                ],
                'newlines-between': 'always',
            },
        ],
    },
    overrides: [
        {
            files: ['*.tsx'],
            extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
            plugins: ['react'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaFeatures: { jsx: true },
                ecmaVersion: 2022,
            },
            rules: {
                'react/react-in-jsx-scope': 'off',
                'react-hooks/exhaustive-deps': 'off',
                'react/prop-types': 'off',
            },
        },
    ],
}
