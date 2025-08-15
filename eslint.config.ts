import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.eslintRecommended,
    tseslint.configs.stylistic,
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
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'varsIgnorePattern': '^_',
                },
            ],
            'indent': [
                'error',
                4,
                {
                    SwitchCase: 1,
                },
            ],
            'semi': [
                'error',
                'always',
            ],
            'quotes': [
                'error',
                'single',
            ],
            'linebreak-style': [
                'error',
                'unix',
            ],
            'comma-dangle': [
                'error',
                'always-multiline',
            ],
            'padded-blocks': [
                'error',
                {
                    blocks: 'never',
                    classes: 'always',
                    switches: 'never',
                },
            ],
            'rest-spread-spacing': [
                'error',
                'never',
            ],
            'template-curly-spacing': [
                'error',
                'never',
            ],
            'switch-colon-spacing': [
                'error',
                {
                    after: true,
                    before: false,
                },
            ],
            'space-unary-ops': [
                2,
                {
                    words: true,
                    nonwords: false,
                },
            ],
            'space-in-parens': [
                'error',
                'never',
            ],
            'object-curly-spacing': [
                'error',
                'always',
            ],
            'array-bracket-spacing': [
                'error',
                'never',
                {
                    singleValue: false,
                    objectsInArrays: false,
                    arraysInArrays: false,
                },
            ],
            'no-whitespace-before-property': 'error',
            'eol-last': 'error',
        },
    },
);
