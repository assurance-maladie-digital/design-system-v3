// @vitest-environment jsdom

import { beforeEach, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'

import TableToolbar from '../TableToolbar.vue'

// Scénarios d’accessibilité : barre d'outils de tableau avec compteur,
// champ de recherche et bouton d'ajout.

describe('TableToolbar – accessibility (axe)', () => {
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('has no obvious axe violations with row count only', async () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 2,
				nbTotal: 5,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'TableToolbar – row count only', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with search field and add button', async () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbTotal: 5,
				search: 'dupont',
				searchLabel: 'Rechercher un agent',
				showAddButton: true,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'TableToolbar – search + add button', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations while loading', async () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbTotal: 1,
				loading: true,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'TableToolbar – loading', {
			ignoreRules: ['region'],
		})
	})
})
