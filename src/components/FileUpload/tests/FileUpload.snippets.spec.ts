import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../FileUpload.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

interface SourceCodeTab {
	name: string
	code: string
}

function isSourceCodeTab(tab: unknown): tab is SourceCodeTab {
	return typeof tab === 'object' && tab !== null
		&& 'name' in tab && typeof tab.name === 'string'
		&& 'code' in tab && typeof tab.code === 'string'
}

function getSnippetTab(story: { parameters?: Record<string, unknown> }, name: string): string {
	const sourceCode: unknown = story.parameters?.sourceCode
	const tabs = Array.isArray(sourceCode) ? sourceCode.filter(isSourceCodeTab) : []
	return tabs.find(tab => tab.name === name)?.code ?? ''
}

describe('FileUpload snippets', () => {
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

	it.each(allStories)('l\'extrait de $name type les ref initialisées avec un tableau vide', ({ story }) => {
		expect(getSnippetTab(story, 'Script')).not.toMatch(/\bref\(\[\]\)/)
	})

	it.each(allStories)('l\'extrait de $name importe les composants Vuetify depuis vuetify', ({ story }) => {
		expect(getSnippetTab(story, 'Script')).not.toMatch(/import\s*\{[^}]*\bV[A-Z]\w*[^}]*\}\s*from\s*'@cnamts\/synapse'/)
	})

	it('l\'extrait de MultipleFiles branche sendError sur l\'événement error', () => {
		expect(getSnippetTab(stories.MultipleFiles, 'Template')).toContain('@error="sendError"')
	})

	it.each(allStories)('l\'extrait de $name n\'utilise pas de classes de couleur Vuetify 2', ({ story }) => {
		expect(getSnippetTab(story, 'Template')).not.toMatch(/\b[\w-]+--text\b/)
	})

	it('l\'extrait de Customization affiche le texte personnalisé en blanc', () => {
		const spanClasses = getSnippetTab(stories.Customization, 'Template').match(/<span class="([^"]*)">/)?.[1].split(/\s+/) ?? []

		expect(spanClasses).toEqual(expect.arrayContaining(['d-flex', 'align-center', 'text-white']))
	})
})
