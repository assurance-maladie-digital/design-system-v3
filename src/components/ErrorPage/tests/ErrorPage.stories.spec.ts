import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, type StoryWithSourceCode } from '@tests/helpers/storySnippets'
import * as stories from '../ErrorPage.stories'

const composedStories = composeStories(stories)
const { CustomIllustration, SlotAction, SlotAdditionalContent } = composedStories

const allStories = Object.entries(composedStories).map(([name, story]) => ({ name, story }))

function snippetCode(story: StoryWithSourceCode): string {
	const { sourceCode } = story.parameters
	return JSON.stringify(sourceCode)
}

enableAutoUnmount(afterEach)

describe('ErrorPage stories', () => {
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

	it.each(allStories)('l\'extrait de $name ne reprend pas l\'habillage Storybook ni de couleur codée en dur', ({ story }) => {
		const code = snippetCode(story)

		expect(code).not.toContain('rgb(231, 236, 245)')
		expect(code).not.toMatch(/#[0-9a-f]{3,6}\b/i)
	})

	it.each([
		{ name: 'CustomIllustration', story: CustomIllustration },
		{ name: 'SlotAction', story: SlotAction },
		{ name: 'SlotAdditionalContent', story: SlotAdditionalContent },
	])('le rendu de $name transmet les args au composant', ({ story }) => {
		const wrapper = mount(story({ pageTitle: 'Titre piloté par le Control' }))

		expect(wrapper.text()).toContain('Titre piloté par le Control')
	})

	it('SlotAction remplace le bouton par défaut sans passer hide-btn', () => {
		const wrapper = mount(SlotAction({ btnText: 'Bouton par défaut', btnHref: '/' }))

		expect(wrapper.text()).not.toContain('Bouton par défaut')
		expect(wrapper.text()).toContain('Déconnexion')
		expect(snippetCode(SlotAction)).not.toContain('hide-btn')
	})
})
