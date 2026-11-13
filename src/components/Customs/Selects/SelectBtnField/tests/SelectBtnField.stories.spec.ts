import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as validationStories from '../Validation/Validation.stories'

const composed = composeStories(validationStories)

const allStories = Object.entries(composed).map(([name, story]) => ({ name, story }))

enableAutoUnmount(afterEach)

describe('SelectBtnField validation stories', () => {
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
})
