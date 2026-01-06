// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import CookiesInformation from '../CookiesInformation.vue'
import { locales } from '../locales'

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

// Scénario d’accessibilité : section d’information sur une catégorie de cookies
// (par ex. "functional"), avec tableau détaillé et groupe de boutons radio.

describe('CookiesInformation – accessibility (axe)', () => {
	it('has no obvious axe violations for functional cookies section', async () => {
		const wrapper = mount(CookiesInformation, {
			props: {
				tableItems: cookies,
				type: 'functional',
			},
		})

		// Vérification rapide que le contenu attendu est bien rendu
		const text = wrapper.text()
		// Utilisation des locales pour garantir un scénario cohérent
		if (!text.includes(locales.functional.title))
			throw new Error('CookiesInformation not rendered as expected')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'CookiesInformation – functional', {
			ignoreRules: ['region'],
		})
	})
})
