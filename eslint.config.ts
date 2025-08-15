import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.eslintRecommended,
    tseslint.configs.stylistic,
    stylistic.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        ignores: ['.vite'],
    },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', {
                varsIgnorePattern: '^_',
            }],
            '@stylistic/indent': ['error', 4, {
                SwitchCase: 1,
            }],
            '@stylistic/jsx-indent-props': ['error', 4],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/padded-blocks': ['error', {
                blocks: 'never',
                classes: 'always',
                switches: 'never',
            }],
            '@stylistic/rest-spread-spacing': ['error', 'never'],
            '@stylistic/template-curly-spacing': ['error', 'never'],
            '@stylistic/switch-colon-spacing': ['error', {
                after: true,
                before: false,
            }],
            '@stylistic/space-unary-ops': [2, {
                words: true,
                nonwords: false,
            }],
            '@stylistic/space-in-parens': ['error', 'never'],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/array-bracket-spacing': ['error', 'never', {
                singleValue: false,
                objectsInArrays: false,
                arraysInArrays: false,
            }],
            '@stylistic/no-whitespace-before-property': 'error',
            '@stylistic/eol-last': 'error',
            '@stylistic/multiline-ternary': ['error', 'never'],
        },
    },
);
