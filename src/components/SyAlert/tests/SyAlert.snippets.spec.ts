import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import * as vue from 'vue'
import * as vuetifyComponents from 'vuetify/components'
import * as mdi from '@mdi/js'
import { analyzeSnippet, getMissingSnippetImports } from '@tests/helpers/storySnippets'
import * as synapse from '@/main'
import * as stories from '../SyAlert.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

const modules = {
	'@cnamts/synapse': synapse,
	'vuetify/components': vuetifyComponents,
	'vue': vue,
	'@mdi/js': mdi,
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
		expect(getMissingSnippetImports(story, modules)).toEqual([])
	})
})
