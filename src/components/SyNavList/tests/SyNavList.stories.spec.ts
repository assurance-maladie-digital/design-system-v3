import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../SyNavList.stories'

const composedStories = composeStories(stories)
const { Default, WithIcons, WithActions, WithSubLevel, Complete, SlotActions } = composedStories

const allStories = Object.entries(composedStories).map(([name, story]) => ({ name, story }))

enableAutoUnmount(afterEach)

describe('SyNavList stories', () => {
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

	it('Default ne montre que des liens', () => {
		const wrapper = mount(Default())

		expect(wrapper.get('nav').attributes('aria-label')).toBe('Dossiers client')
		expect(wrapper.findAll('a')).toHaveLength(3)
		expect(wrapper.findAll('button')).toHaveLength(0)
		expect(wrapper.findAll('.v-icon')).toHaveLength(0)
	})

	it.each([
		{ name: 'WithIcons', story: WithIcons, icons: 3, actions: 0, toggles: 0 },
		{ name: 'WithActions', story: WithActions, icons: 4, actions: 4, toggles: 0 },
		{ name: 'WithSubLevel', story: WithSubLevel, icons: 1, actions: 0, toggles: 1 },
	])('$name n\'ajoute qu\'une option à Default', ({ story, icons, actions, toggles }) => {
		const wrapper = mount(story())

		expect(wrapper.findAll('.sy-nav-list > .v-list > .v-list-item .v-icon')).toHaveLength(icons)
		expect(wrapper.findAll('.sy-nav-list > .v-list > .v-list-item .sy-nav-list-panel__actions button')).toHaveLength(actions)
		expect(wrapper.findAll('.sy-nav-list > .v-list > .v-list-item button[aria-controls]')).toHaveLength(toggles)
	})

	it('Complete reprend la maquette PA, actions et sous-niveaux combinés', () => {
		const wrapper = mount(Complete())

		expect(wrapper.find('button[aria-label="Modifier (Droit de base)"]').exists()).toBe(true)
		expect(wrapper.find('button[aria-label="Demande d’affiliation : afficher le sous-menu"]').exists()).toBe(true)
	})

	it('le rendu de SlotActions transmet les args au composant', () => {
		const wrapper = mount(SlotActions({ label: 'Libellé piloté par le Control' }))

		expect(wrapper.get('nav').attributes('aria-label')).toBe('Libellé piloté par le Control')
		expect(wrapper.find('button[aria-label="Créer un dossier (CMU-B)"]').exists()).toBe(true)
		expect(wrapper.find('button[aria-label="Modifier (CMU-B)"]').exists()).toBe(false)
	})
})
