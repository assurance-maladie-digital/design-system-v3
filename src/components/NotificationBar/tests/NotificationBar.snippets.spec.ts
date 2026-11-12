import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../NotificationBar.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

function getSnippet(parameters: Record<string, unknown>): string {
	const tabs: { code: string }[] = Array.isArray(parameters.sourceCode) ? parameters.sourceCode : []
	return tabs.map(tab => tab.code).join('\n')
}

// Noms locaux introduits par les imports (par défaut, namespace, nommés, aliasés, types) et les déstructurations
function getBindings(code: string): string[] {
	const fromLists = [
		...code.matchAll(/import\s+(?:type\s+)?(?:\w+\s*,\s*)?\{([^}]+)\}/g),
		...code.matchAll(/const\s+\{([^}]+)\}\s*=/g),
	].flatMap(([, list]) => list!.split(',').map(name => name.trim().split(/\s+as\s+|\s*:\s*/).at(-1)!.replace(/^type\s+/, '')))
	const defaults = [...code.matchAll(/import\s+(?:type\s+)?(\w+)\s*(?:,|from)/g)].map(([, name]) => name!)
	const namespaces = [...code.matchAll(/import\s+\*\s+as\s+(\w+)/g)].map(([, name]) => name!)
	const declared = [...code.matchAll(/const\s+(\w+)\s*=/g)].map(([, name]) => name!)
	return [...fromLists, ...defaults, ...namespaces, ...declared].filter(Boolean)
}

describe('NotificationBar snippets', () => {
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

	it.each(allStories)('l\'extrait de $name n\'importe ni ne déclare rien d\'inutilisé', ({ story }) => {
		const code = getSnippet(story.parameters)
		const unused = getBindings(code)
			.filter(name => (code.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length < 2)

		expect(unused).toEqual([])
	})

	it.each(allStories)('l\'extrait de $name affiche le close-btn-text de la story', ({ story }) => {
		const code = getSnippet(story.parameters)
		const closeBtnTexts = [...code.matchAll(/close-btn-text="([^"]*)"/g)].map(([, text]) => text)

		expect(closeBtnTexts.every(text => text === story.args.closeBtnText)).toBe(true)
	})

	it.each(allStories)('l\'extrait de $name est indenté uniquement avec des tabulations', ({ story }) => {
		const lines = getSnippet(story.parameters).split('\n')
		const spaceIndented = lines.filter(line => /^\t* +\S/.test(line))

		expect(spaceIndented).toEqual([])
	})
})
