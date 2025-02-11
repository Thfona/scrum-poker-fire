import globals from 'globals';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

const jsFiles = [
    '**/*.js',
    '**/*.jsx',
    '**/*.mjs',
    '**/*.cjs',
];

const tsFiles = [
    '**/*.ts',
    '**/*.tsx',
    '**/*.mts',
    '**/*.cts',
];

const codeFiles = [
    ...jsFiles,
    ...tsFiles,
];

export default [
    {
        name: 'Ignores',
        ignores: ['dist', 'node_modules', '/.angular', '**/package-lock.json'],
    },
    {
        ...js.configs.recommended,
        name: 'Code',
        files: codeFiles,
        rules: {
            ...js.configs.recommended.rules,
            'arrow-parens': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            indent: ['error', 4],
        },
    },
    {
        name: 'JavaScript',
        files: jsFiles,
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
            },
            ecmaVersion: 2022,
            sourceType: 'module',
        },
    },
    {
        name: 'TypeScript',
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        files: tsFiles,
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
            },
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                project: 'tsconfig.json',
            },
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    {
        name: 'JSON',
        plugins: {
            json,
        },
        files: [
            '**/*.json',
        ],
        language: 'json/json',
        rules: {
            'json/no-duplicate-keys': 'error',
        },
    },
    {
        name: 'Markdown',
        plugins: {
            markdown,
        },
        files: [
            '**/*.md',
        ],
        language: 'markdown/commonmark',
        rules: {
            'markdown/no-html': 'error',
        },
    },
];
