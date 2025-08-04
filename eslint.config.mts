import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.eslintRecommended,
    tseslint.configs.stylistic,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.react,
    importPlugin.flatConfigs.electron,
    importPlugin.flatConfigs.typescript,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        ignores: [".vite/**"]
    },

    // {
    //     files: ['**/*.{ts,tsx}'],
    //     rules: {
    //         'import/no-unresolved': [
    //             'error',
    //             {
    //                 'ignore': [
    //                     '.*?no-inline',
    //                     '.*?asset',
    //                 ],
    //             },
    //         ],
    //         'indent': [
    //             'error',
    //             4,
    //             {
    //                 'SwitchCase': 1,
    //             },
    //         ],
    //         'semi': [
    //             'error',
    //             'always',
    //         ],
    //         'quotes': [
    //             'error',
    //             'single',
    //         ],
    //         'linebreak-style': [
    //             'error',
    //             'unix',
    //         ],
    //         'comma-dangle': [
    //             'error',
    //             {
    //                 'arrays': 'always-multiline',
    //                 'objects': 'always-multiline',
    //                 'imports': 'always-multiline',
    //                 'exports': 'always-multiline',
    //                 'functions': 'always-multiline',
    //             },
    //         ],
    //         'padded-blocks': [
    //             'error',
    //             {
    //                 'blocks': 'never',
    //                 'classes': 'always',
    //                 'switches': 'never',
    //             },
    //         ],
    //         'rest-spread-spacing': [
    //             'error',
    //             'never',
    //         ],
    //         'template-curly-spacing': [
    //             'error',
    //             'never',
    //         ],
    //         'switch-colon-spacing': [
    //             'error',
    //             {
    //                 'after': true,
    //                 'before': false,
    //             },
    //         ],
    //         'space-unary-ops': [
    //             2,
    //             {
    //                 'words': true,
    //                 'nonwords': false,
    //             },
    //         ],
    //         'space-in-parens': [
    //             'error',
    //             'never',
    //         ],
    //         'object-curly-spacing': [
    //             'error',
    //             'always',
    //         ],
    //         'array-bracket-spacing': [
    //             'error',
    //             'never',
    //             {
    //                 'singleValue': false,
    //                 'objectsInArrays': false,
    //                 'arraysInArrays': false,
    //             },
    //         ],
    //         'no-whitespace-before-property': 'error',
    //         'eol-last': 'error',
    //     },
    // },
);
