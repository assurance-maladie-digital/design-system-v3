// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import CookiesSelection from '../CookiesSelection.vue'

const cookiesList = {
	essentials: [
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
	],
	functional: [
		{
			name: 'contrast',
			description: 'Sauvegarde la personnalisation de l’affichage.',
			conservation: '1 an',
		},
	],
	analytics: [
		{
			name: 'user_id',
			description: 'Sauvegarde l’identifiant unique de visiteur.',
			conservation: '6 mois',
		},
	],
}

// Scénario d’accessibilité : formulaire complet de choix des cookies,
// avec sections fonctionnelles et analytics, et bouton de sauvegarde.

describe('CookiesSelection – accessibility (axe)', () => {
	it('has no obvious axe violations for full cookie preferences form', async () => {
		const wrapper = mount(CookiesSelection, {
			props: {
				items: cookiesList,
			},
		})

		// Laisser le temps aux focus/validations de s’appliquer
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'CookiesSelection – full form', {
			ignoreRules: ['region'],
		})
	})
})
