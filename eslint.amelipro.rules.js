export default [{
	// -----------------------
	// AMELIPRO : Règles communes
	// -----------------------
	files: ['**/Amelipro/**/*.{js,ts,vue}', '**/_gni/**/*.{js,ts,vue}'],
	rules: {
		'array-bracket-newline': 'off',
		'array-element-newline': 'off',
		'arrow-body-style': ['warn', 'as-needed'],
		// 'arrow-parens': 'warn', => en conflit avec @stylistic/arrow-parens
		// 'brace-style': ['error', '1tbs', { allowSingleLine: true }], => en conflit avec @stylistic/brace-style
		'capitalized-comments': 'off',
		'class-methods-use-this': 'off',
		'comma-dangle': ['warn', 'always-multiline'],
		'comma-spacing': 'warn',
		'complexity': 'off',
		'curly': 'warn',
		'dot-location': ['warn', 'property'],
		'dot-notation': 'warn',
		'eol-last': 'warn',
		'eqeqeq': 'warn',
		'func-call-spacing': ['warn', 'never'],
		'func-style': 'off',
		'function-call-argument-newline': ['error', 'never'],
		'function-paren-newline': 'warn',
		'id-length': 'off',
		'import/order': 'off',
		'indent': ['warn', 'tab', {
			ImportDeclaration: 2,
			MemberExpression: 'off',
			ObjectExpression: 1,
			SwitchCase: 1,
			VariableDeclarator: 1,
		}],
		'init-declarations': 'off',
		'key-spacing': 'warn',
		'keyword-spacing': 'warn',
		'line-comment-position': 'off',
		'linebreak-style': 'off',
		'lines-around-comment': 'warn',
		'lines-between-class-members': 'off',
		'max-depth': 'off',
		'max-len': 'off',
		'max-lines': ['warn', {
			max: 350,
			skipBlankLines: true,
			skipComments: true,
		}],
		'max-lines-per-function': ['warn', {
			max: 30,
			skipBlankLines: true,
			skipComments: true,
		}],
		// 'max-statements-per-line': ['warn', 10],
		'max-statements-per-line': 'off',
		// 'member-delimiter-style': ['error', {
		//	multiline: {
		//		delimiter: 'semi',
		//		requireLast: true,
		//	},
		//	multilineDetection: 'brackets',
		//	singleline: {
		//		delimiter: 'semi',
		//		requireLast: true,
		//	},
		// }],
		'multiline-comment-style': ['warn', 'separate-lines'],
		'multiline-ternary': 'off',
		'new-cap': 'off',
		'no-alert': 'warn',
		// 'no-extra-parens': 'warn',
		// 'class-methods-use-this': 'warn',
		// Les console.log sont automatiquement supprimés lors du build, mais APRÈS le passage d'ESLint.
		// Pour éviter des erreurs inutiles lors du build, on désactive la règle pour le mode PRODUCTION
		// 'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'warn',
		// 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-duplicate-imports': 'warn',
		'no-else-return': 'warn',
		'no-eq-null': 'warn',
		'no-extra-parens': 'off',
		'no-implicit-coercion': 'warn',
		'no-inline-comments': 'off',
		'no-invalid-this': 'off',
		'no-irregular-whitespace': ['error', { skipComments: true }],
		'no-magic-numbers': 'off',
		'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
		'no-multi-spaces': 'warn',
		'no-multiple-empty-lines': ['error', { max: 1 }],
		'no-negated-condition': 'warn',
		'no-plusplus': 'off',
		'no-prototype-builtins': 'error',
		'no-shadow': 'warn',
		'no-tabs': 'off',
		'no-ternary': 'off',
		'no-throw-literal': 'warn',
		'no-trailing-spaces': 'warn',
		'no-undef-init': 'warn',
		'no-undefined': 'off',
		'no-underscore-dangle': 'warn',
		'no-unneeded-ternary': 'warn',
		// 'no-unused-vars': 'warn',
		// Entre en conflit avec la règle ts
		'no-unused-vars': 'off',
		'no-use-before-define': 'off',
		'no-useless-concat': 'warn',
		'no-warning-comments': 'off',
		'object-curly-newline': ['warn', { multiline: true }],
		'object-curly-spacing': ['error', 'always', {
			arraysInObjects: true,
			objectsInObjects: true,
		}],
		'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
		'object-shorthand': 'warn',
		'one-var-declaration-per-line': 'off',
		'operator-assignment': 'warn',
		'padded-blocks': 'off',

		'prefer-arrow-callback': 'error',
		'prefer-const': ['warn', { ignoreReadBeforeAssign: false }],
		// 'prefer-destructuring': ['warn', { AssignmentExpression: { array: true, object: true }, VariableDeclarator: { array: true, object: true } }, { enforceForRenamedProperties: true }],
		'prefer-destructuring': 'off',
		'prefer-named-capture-group': 'off',
		'prefer-template': 'warn',
		// 'quote-props': ['warn', 'as-needed'], => Conflit avec @stylistic/quote-props
		'quotes': ['error', 'single', { avoidEscape: true }],
		'radix': ['error', 'as-needed'],
		'require-await': 'warn',
		'require-unicode-regexp': 'off',
		// 'semi': ['error', 'always'],
		'semi-spacing': 'warn',
		'sort-imports': 'warn',
		'sort-keys': ['warn', 'asc', { minKeys: 3 }],
		'sort-vars': 'warn',
		'space-before-blocks': 'warn',
		// 'space-before-function-paren': ['error', 'never'],
		'space-in-parens': 'warn',
		'space-infix-ops': 'warn',
		'space-unary-ops': 'warn',
		'spaced-comment': 'off',
		'switch-colon-spacing': ['error', {
			after: true,
			before: false,
		}],
		'template-curly-spacing': ['warn', 'never'],
	},
}, {
	// -----------------------
	// Règles Typescript
	// -----------------------
	files: ['**/Amelipro/**/*.{js,ts,vue}', '**/_gni/**/*.{js,ts,vue}'],
	rules: {
		// -----------------------
		// @typescript Rules
		// -----------------------
		'@typescript-eslint/ban-ts-comment': ['warn'],
		'@typescript-eslint/consistent-indexed-object-style': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': ['error', { allowedNames: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'] }],
		// '@typescript-eslint/no-explicit-any': ['warn'],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-require-imports': 'warn',
		'@typescript-eslint/no-unused-vars': ['warn'],
		// Note: you must disable the base rule as it can report incorrect errors
		// '@typescript-eslint/no-use-before-define': ['error', { functions: true, classes: true, variables: true, allowNamedExports: false }],
		'@typescript-eslint/no-use-before-define': 'off',
	},
}, {
	// -----------------------
	// Règles Vue.js
	// -----------------------
	files: ['**/Amelipro/**/*.vue', '**/_gni/**/*.vue'],
	rules: {
		'indent': 'off',
		'vue/attributes-order': ['warn', {
			alphabetical: true,
			order: ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', ['UNIQUE', 'SLOT'], 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT'],
		}],
		'vue/component-name-in-template-casing': ['error', 'PascalCase', { ignores: ['keep-alive', 'component', 'transition', 'transition-group'] }],
		// Allow event names like click:row
		'vue/custom-event-name-casing': ['error', 'kebab-case', { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }],
		'vue/html-indent': ['error', 'tab'],
		'vue/multi-word-component-names': ['warn'],
		'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
		'vue/no-v-html': ['off'],
		'vue/script-indent': ['warn', 'tab', {
			baseIndent: 1,
			ignores: [],
			switchCase: 1,
		}],
		// Allow modifiers in slot names. 		 * eg. <template v-slot.foo>
		'vue/valid-v-slot': ['error', { allowModifiers: true }],
	},
}, {
	files: ['**/Amelipro/**/*.spec.ts'],
	rules: {
		'max-lines': 'off',
		'max-lines-per-function': 'off',
		// 'object-curly-newline': ['warn', {
		//	ExportDeclaration: 'always',
		//	ImportDeclaration: 'never',
		//	ObjectExpression: 'always',
		//	ObjectPattern: 'always',
		// }],
	},
}, {
	// -----------------------
	// Règles Types
	// -----------------------
	files: ['**/Amelipro/**/*.d.ts'],
	rules: {
		'object-curly-newline': ['warn', {
			ExportDeclaration: 'always',
			ImportDeclaration: 'never',
			ObjectExpression: 'always',
			ObjectPattern: 'always',
		}],
		'object-curly-spacing': ['warn', 'always'],
		/// / conlitcs with '@typescript-eslint/semi'
		'object-property-newline': ['warn', { allowAllPropertiesOnSameLine: false }],
	},
}]
