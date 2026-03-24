// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import ErrorPage from '../ErrorPage.vue'

// Scénario d’accessibilité : page d'erreur basée sur StatusPage,
// sans bouton d’action, avec illustration décorative masquée.

describe('ErrorPage – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(ErrorPage)

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'ErrorPage – default state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with #action slot', async () => {
		const wrapper = mount(ErrorPage, {
			attachTo: document.body,
			props: { hideBtn: true },
			slots: {
				action: '<button>Retour à l\'accueil</button>',
			},
		})

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'ErrorPage – action slot', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
