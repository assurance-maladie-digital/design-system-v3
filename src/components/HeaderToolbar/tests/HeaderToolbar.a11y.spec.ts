// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import HeaderToolbar from '../HeaderToolbar.vue'

// Scénario d’accessibilité : barre d’outils d’en-tête avec menus gauche/droite
// rendus en mode bureau.

describe('HeaderToolbar – accessibility (axe)', () => {
	it('has no obvious axe violations with default desktop menus', async () => {
		const wrapper = mount(HeaderToolbar, {
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'HeaderToolbar – default desktop menus', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
