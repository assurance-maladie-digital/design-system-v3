import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintpluginStorybook from 'eslint-plugin-storybook'
import ts from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
import storyTemplateComponentCasing from './eslint-rules/story-template-component-casing.js'

export default ts.config(
	// Parser
	{
		files: ['*.vue', '**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: '@typescript-eslint/parser',
				sourceType: 'module',
			},
		},
	},

	// Base config
	js.configs.recommended,
	...ts.configs.recommended,
	...eslintPluginVue.configs['flat/recommended'],
	...pluginVueA11y.configs['flat/recommended'],
	eslintpluginStorybook.configs['flat/recommended'],
	stylistic.configs.customize({
		indent: 'tab',
		quotes: 'single',
		semi: false,
		jsx: false,
	}),
	// Global rules
	{
		rules: {
			'no-console': 'error',
		},
	},
	// Overrides
	{
		// Vue Overrides
		files: ['*.vue', '**/*.vue'],
		rules: {
			'vue/block-order': [
				'error',
				{
					order: [
						'script:not([setup])',
						'script[setup]',
						'template',
						'style[scoped]',
						'style:not([scoped])',
					],
				},
			],
			'vue/multi-word-component-names': 0,
			'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }],
			'vue/script-indent': ['error', 'tab', { baseIndent: 1 }],
			'vue/html-indent': ['error', 'tab'],
			'vue/html-comment-indent': ['error', 'tab'],
			'vue/no-v-html': 0,
			'@stylistic/indent': 0,
			'no-explicit-any': 0,
			'vuejs-accessibility/interactive-supports-focus': 0,
		},
	},

	// Storybook overrides
	{
		// Inline render `template` strings aren't parsed as Vue SFCs, so
		// vue/component-name-in-template-casing doesn't apply to them.
		files: ['**/*.stories.ts'],
		plugins: {
			local: {
				rules: {
					'story-template-component-casing': storyTemplateComponentCasing,
				},
			},
		},
		rules: {
			'local/story-template-component-casing': 'error',
		},
	},
)
