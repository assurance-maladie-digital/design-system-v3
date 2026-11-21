import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, getSnippetTab } from '@tests/helpers/storySnippets'
import * as stories from '../validation/validation.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

describe('Captcha validation snippets', () => {
	it.each(allStories)('l\'extrait de $name est un SFC autonome et copiable', ({ story }) => {
		expect(analyzeSnippet(story)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it.each(allStories)('l\'extrait de $name reflète showSuccessMessages et required du rendu', ({ story }) => {
		const template = getSnippetTab(story, 'Template')
		const showsSuccess = /successMessage|:success-messages/.test(template + getSnippetTab(story, 'Script'))

		if (showsSuccess) {
			expect(story.args.showSuccessMessages).toBe(true)
			expect(template).toContain('show-success-messages')
		}
		if (story.args.required === false && !/\srequired[\s/>]/.test(template)) {
			expect(template).toContain(':required="false"')
		}
	})
})
