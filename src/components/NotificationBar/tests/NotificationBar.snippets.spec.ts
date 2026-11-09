import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../NotificationBar.stories'

const sourceCodeStories = Object.entries(composeStories(stories))
	.map(([name, story]) => ({ name, story }))
	.filter(({ story }) => Array.isArray(story.parameters.sourceCode))

function getSnippet(parameters: Record<string, unknown>): string {
	const tabs: { code: string }[] = Array.isArray(parameters.sourceCode) ? parameters.sourceCode : []
	return tabs.map(tab => tab.code).join('\n')
}

describe('NotificationBar snippets', () => {
	it.each(sourceCodeStories)('l\'extrait de $name est un SFC autonome et copiable', ({ story }) => {
		expect(analyzeSnippet(story)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it.each(sourceCodeStories)('l\'extrait de $name n\'importe ni ne déclare rien d\'inutilisé', ({ story }) => {
		const code = getSnippet(story.parameters)
		const imported = [...code.matchAll(/import\s+(?:type\s+)?\{([^}]+)\}/g)]
		const destructured = [...code.matchAll(/const\s+\{([^}]+)\}\s*=/g)]
		const names = [...imported, ...destructured]
			.flatMap(([, list]) => list!.split(',').map(name => name.replace(/^type\s+/, '').trim()))
		const declared = [...code.matchAll(/const\s+(\w+)\s*=/g)].map(([, name]) => name!)
		const unused = [...names, ...declared]
			.filter(name => (code.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length < 2)

		expect(unused).toEqual([])
	})

	it.each(sourceCodeStories)('l\'extrait de $name affiche le close-btn-text de la story', ({ story }) => {
		const code = getSnippet(story.parameters)
		const closeBtnTexts = [...code.matchAll(/close-btn-text="([^"]*)"/g)].map(([, text]) => text)

		expect(closeBtnTexts.every(text => text === story.args.closeBtnText)).toBe(true)
	})
})
