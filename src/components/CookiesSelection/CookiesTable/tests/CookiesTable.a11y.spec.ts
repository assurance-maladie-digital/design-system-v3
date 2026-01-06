// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import CookiesTable from '../CookiesTable.vue'

const cookies = [
	{
		name: 'session',
		description: 'Sauvegarde la session pour rester connecté.',
		conservation: '20 heures',
	},
	{
		name: 'cookie_policy',
		description: 'Sauvegarde les préférences de cookies.',
		conservation: '1 an',
	},
]

// Scénario d’accessibilité : tableau des cookies avec en-têtes et deux lignes.

describe('CookiesTable – accessibility (axe)', () => {
	it('has no obvious axe violations with default cookies list', async () => {
		const wrapper = mount(CookiesTable, {
			props: {
				items: cookies,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'CookiesTable – default items', {
			ignoreRules: ['region'],
		})
	})
})
