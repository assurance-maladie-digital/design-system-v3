import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as mainStories from '../SyTextField.stories'
import * as validationStories from '../Validation/Validation.stories'

const allStories = [
	...Object.entries(composeStories(mainStories)),
	...Object.entries(composeStories(validationStories)),
].map(([name, story]) => ({ name, story }))

describe('SyTextField stories : extraits de code', () => {
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
