/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'@stylistic',
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2021: true,
		node: true,
		webextensions: true,
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		//Wish I could disable semicolon for class member fields
		"@stylistic/semi": ["error", "always"],
		"@stylistic/member-delimiter-style": [
			"warn",
			{
				"multiline": {
					"delimiter": "none",
					"requireLast": true
				},
				"singleline": {
					"delimiter": "comma",
					"requireLast": false
				}
			}
		],
		"@stylistic/quotes": [
			"warn",
			"single",
			{
				"avoidEscape": true
			}
		],
		"@stylistic/quote-props": ["warn", "as-needed"],
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_"
			}
		],
		"svelte/require-store-reactive-access": "error",
		"svelte/html-quotes": ["warn", {
			"prefer": "single",
			"dynamic": {
				"quoted": false,
				"avoidInvalidUnquotedInHTML": true
			}
		}]
	}
};
