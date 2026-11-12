import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { parse } from 'vue/compiler-sfc'
import * as vue from 'vue'
import * as vuetifyComponents from 'vuetify/components'
import * as mdi from '@mdi/js'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as synapse from '@/main'
import * as stories from '../SyAlert.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

const modules: Record<string, Record<string, unknown>> = {
	'@cnamts/synapse': synapse,
	'vuetify/components': vuetifyComponents,
	'vue': vue,
	'@mdi/js': mdi,
}

// Imports nommés du `<script setup>` de l'extrait affiché, avec leur module d'origine.
function getSnippetImports(parameters: Record<string, unknown>): { source: string, name: string }[] {
	const tabs: { code: string }[] = Array.isArray(parameters.sourceCode) ? parameters.sourceCode : []
	const script = parse(tabs.map(tab => tab.code).join('\n')).descriptor.scriptSetup?.content ?? ''
	return [...script.matchAll(/import\s+\{([^}]+)\}\s+from\s+'([^']+)'/g)].flatMap(([, list, source]) =>
		list!.split(',').map(name => ({ source: source!, name: name.trim().split(/\s+as\s+/)[0]! })).filter(({ name }) => name !== ''),
	)
}

describe('SyAlert snippets', () => {
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
		const missing = getSnippetImports(story.parameters)
			.filter(({ source, name }) => !(source in modules) || !(name in modules[source]!))
			.map(({ source, name }) => `${source}:${name}`)

		expect(missing).toEqual([])
	})
})
