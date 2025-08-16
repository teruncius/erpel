import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.eslintRecommended,
    tseslint.configs.stylistic,
    stylistic.configs.recommended,
    perfectionist.configs['recommended-alphabetical'],
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
            '@stylistic/array-bracket-spacing': ['error', 'never', {
                arraysInArrays: false,
                objectsInArrays: false,
                singleValue: false,
            }],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/eol-last': 'error',
            '@stylistic/indent': ['error', 4, {
                SwitchCase: 1,
            }],
            '@stylistic/jsx-indent-props': ['error', 4],
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/multiline-ternary': ['error', 'never'],
            '@stylistic/no-whitespace-before-property': 'error',
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/padded-blocks': ['error', {
                blocks: 'never',
                classes: 'always',
                switches: 'never',
            }],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/rest-spread-spacing': ['error', 'never'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/space-in-parens': ['error', 'never'],
            '@stylistic/space-unary-ops': [2, {
                nonwords: false,
                words: true,
            }],
            '@stylistic/switch-colon-spacing': ['error', {
                after: true,
                before: false,
            }],
            '@stylistic/template-curly-spacing': ['error', 'never'],
            '@typescript-eslint/no-unused-vars': ['error', {
                varsIgnorePattern: '^_',
            }],
            'perfectionist/sort-imports': 'error',
        },
    },
);
