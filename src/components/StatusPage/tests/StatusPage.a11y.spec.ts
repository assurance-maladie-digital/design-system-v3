// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import StatusPage from '../StatusPage.vue'

// Scénario d’accessibilité : page d’erreur avec titre, message, code
// et bouton de retour vers la page d’accueil.

describe('StatusPage – accessibility (axe)', () => {
	it('has no obvious axe violations with title, message and action button', async () => {
		const wrapper = mount(StatusPage, {
			props: {
				pageTitle: 'Une erreur est survenue',
				message: 'Un problème technique est survenu. Merci de réessayer plus tard.',
				code: '500',
				btnText: 'Retour à l\'accueil',
				btnHref: 'https://www.ameli.fr',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'StatusPage – default page', {
			ignoreRules: ['region'],
		})
	})
})
