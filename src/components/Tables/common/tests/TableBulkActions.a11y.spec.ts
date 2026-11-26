// @vitest-environment jsdom

import { beforeEach, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'

import TableBulkActions from '../TableBulkActions.vue'

// Scénario d’accessibilité : barre d'actions groupées visible quand des lignes
// sont sélectionnées (compteur aria-live + actions projet + bouton d'effacement).

describe('TableBulkActions – accessibility (axe)', () => {
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('has no obvious axe violations with a selection count and actions', async () => {
		const wrapper = mount(TableBulkActions, {
			props: {
				count: 3,
			},
			slots: {
				default: '<button type="button">Supprimer la sélection</button>',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'TableBulkActions – selection with actions', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations without project actions', async () => {
		const wrapper = mount(TableBulkActions, {
			props: {
				count: 1,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'TableBulkActions – count only', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
