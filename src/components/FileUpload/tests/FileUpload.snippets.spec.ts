import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import * as vue from 'vue'
import * as vuetifyComponents from 'vuetify/components'
import * as mdi from '@mdi/js'
import { analyzeSnippet, findUnknownSnippetImports, getSnippetTab } from '@tests/helpers/storySnippets'
import * as synapse from '@/main'
import { createVuetifyOptions } from '@/vuetifyOptions'
import * as stories from '../FileUpload.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

const modules = {
	'@cnamts/synapse': synapse,
	'vuetify/components': vuetifyComponents,
	'vue': vue,
	'@mdi/js': mdi,
}

// Vuetify ne génère une classe `bg-<couleur>` que pour les couleurs déclarées dans le thème actif
const themeColors = Object.values(createVuetifyOptions().theme?.themes ?? {}).map(theme => Object.keys(theme.colors ?? {}))
const colorsDefinedInEveryTheme = themeColors[0]?.filter(color => themeColors.every(colors => colors.includes(color))) ?? []

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

	it.each(allStories)('l\'extrait de $name n\'importe que des exports réellement disponibles', ({ story }) => {
		expect(findUnknownSnippetImports(story, modules)).toEqual([])
	})

	it.each(allStories)('l\'extrait de $name type les ref initialisées avec un tableau vide', ({ story }) => {
		expect(getSnippetTab(story, 'Script')).not.toMatch(/\bref\(\[\]\)/)
	})

	it.each(allStories)('l\'extrait de $name n\'utilise pas de classes de couleur Vuetify 2', ({ story }) => {
		expect(getSnippetTab(story, 'Template')).not.toMatch(/\b[\w-]+--text\b/)
	})

	it('l\'extrait de MultipleFiles branche sendError sur l\'événement error', () => {
		expect(getSnippetTab(stories.MultipleFiles, 'Template')).toContain('@error="sendError"')
	})

	it('l\'extrait de Customization affiche le texte personnalisé en blanc', () => {
		const spanClasses = getSnippetTab(stories.Customization, 'Template').match(/<span class="([^"]*)">/)?.[1].split(/\s+/) ?? []

		expect(spanClasses).toEqual(expect.arrayContaining(['d-flex', 'align-center', 'text-white']))
	})

	it.each(allStories)('l\'extrait de $name n\'utilise que des couleurs de fond définies dans tous les thèmes', ({ story }) => {
		const backgroundColors = [...getSnippetTab(story, 'Template').matchAll(/\bbg-([a-z][\w-]*)/g)].map(([, color]) => color!)

		expect(backgroundColors.filter(color => !colorsDefinedInEveryTheme.includes(color))).toEqual([])
	})
})
