import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../SyTabs.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

function getSnippet(parameters: Record<string, unknown>): string {
	const tabs: { name?: string, code: string }[] = Array.isArray(parameters.sourceCode)
		? parameters.sourceCode
		: []

	return tabs.map(tab => tab.code).join('\n')
}

// Noms locaux introduits par les imports (par défaut, namespace, nommés, aliasés)
// et les déclarations const.
function getBindings(code: string): string[] {
	const fromLists = [
		...code.matchAll(/import\s+(?:type\s+)?(?:\w+\s*,\s*)?\{([^}]+)\}/g),
		...code.matchAll(/const\s+\{([^}]+)\}\s*=/g),
	].flatMap(([, list]) =>
		list!
			.split(',')
			.map(name => name.trim().split(/\s+as\s+|\s*:\s*/).at(-1)!.replace(/^type\s+/, '')),
	)

	const defaults = [...code.matchAll(/import\s+(?:type\s+)?(\w+)\s*(?:,|from)/g)].map(([, name]) => name!)
	const namespaces = [...code.matchAll(/import\s+\*\s+as\s+(\w+)/g)].map(([, name]) => name!)
	const declared = [...code.matchAll(/const\s+(\w+)\s*=/g)].map(([, name]) => name!)

	return [...fromLists, ...defaults, ...namespaces, ...declared].filter(Boolean)
}

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

	it.each(allStories)('le snippet de $name ne contient aucun import ou const inutilisé', ({ story }) => {
		const code = getSnippet(story.parameters)
		const unused = getBindings(code)
			.filter(name => (code.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length < 2)

		expect(unused).toEqual([])
	})

	it.each(allStories)('le snippet de $name contient les onglets et le composant SyTabs', ({ story }) => {
		const code = getSnippet(story.parameters)

		expect(code).toContain('SyTabs')
		expect(code).toContain('const items')
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

		const code = getSnippet(story!.parameters)

		expect(code).toContain('v-model="activeTab"')
		expect(code).toContain('const activeTab = ref(\'tab2\')')
	})

	it('le snippet WithTabConfirmation expose la confirmation de changement', () => {
		const story = allStories.find(({ name }) => name === 'WithTabConfirmation')?.story

		expect(story).toBeDefined()

		const code = getSnippet(story!.parameters)

		expect(code).toContain('confirm-tab-change')
		expect(code).toContain('showConfirmDialog')
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
			expect(getSnippet(story!.parameters)).toContain(slotName)
		}
	})
})
