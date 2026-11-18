import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, findUnknownSnippetImports, getSnippetTab } from '@tests/helpers/storySnippets'
import * as stories from '../SyTabs.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

describe('SyTabs snippets', () => {
	it.each(allStories)('le snippet de $name est valide et autonome', ({ story }) => {
		expect(analyzeSnippet(story)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it.each(allStories)('le snippet de $name n\'importe que des exports disponibles', ({ story }) => {
		expect(findUnknownSnippetImports(story)).toEqual([])
	})

	it.each(allStories)('le snippet de $name expose les onglets Template et Script', ({ story }) => {
		const tabs: { name?: string, code: string }[] = Array.isArray(story.parameters.sourceCode)
			? story.parameters.sourceCode
			: []
		const tabNames = tabs.map(tab => tab.name)

		expect(tabNames).toContain('Template')
		expect(tabNames).toContain('Script')
		expect(tabs.every(tab => tab.code.trim().length > 0)).toBe(true)
	})

	it('le snippet WithVModel relie le composant à activeTab avec v-model', () => {
		const story = allStories.find(({ name }) => name === 'WithVModel')?.story

		expect(story).toBeDefined()

		const code = getSnippetTab(story!, 'Template')
		const script = getSnippetTab(story!, 'Script')

		expect(code).toContain('v-model="activeTab"')
		expect(script).toContain('const activeTab = ref(\'tab2\')')
	})

	it('le snippet WithTabConfirmation expose la confirmation de changement', () => {
		const story = allStories.find(({ name }) => name === 'WithTabConfirmation')?.story

		expect(story).toBeDefined()

		const code = getSnippetTab(story!, 'Template')
		const script = getSnippetTab(story!, 'Script')

		expect(code).toContain('confirm-tab-change')
		expect(script).toContain('showConfirmDialog')
	})

	it('les snippets des stories avec slots exposent les slots attendus', () => {
		const expectedSlots: Record<string, string> = {
			WithTabsPrependSlot: '#tabs-prepend',
			WithTabsAppendSlot: '#tabs-append',
			WithTabPrependSlot: '#tab-prepend',
			WithTabAppendSlot: '#tab-append',
			WithCustomContent: '#panel-0',
		}

		for (const [storyName, slotName] of Object.entries(expectedSlots)) {
			const story = allStories.find(({ name }) => name === storyName)?.story

			expect(story, `Story ${storyName} introuvable`).toBeDefined()
			expect(getSnippetTab(story!, 'Template')).toContain(slotName)
		}
	})
})
