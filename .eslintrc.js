const RULES = {
	OFF: 'off',
	WARN: 'warn',
	ERROR: 'error',
};
module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['plugin:react/recommended', 'standard', 'prettier'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['react'],
	rules: {
		'react/react-in-jsx-scope': RULES.OFF,
		'react/prop-types': RULES.OFF,
		'no-console': RULES.ERROR,
		'no-multi-spaces': RULES.ERROR,
		'no-inline-comments': RULES.ERROR,
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
