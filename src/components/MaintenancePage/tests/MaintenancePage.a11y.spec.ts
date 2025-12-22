// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import MaintenancePage from '../MaintenancePage.vue'

// Scénario d’accessibilité : page de maintenance basée sur ErrorPage,
// sans bouton d’action, avec illustration décorative masquée.

describe('MaintenancePage – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(MaintenancePage)

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'MaintenancePage – default state', {
			ignoreRules: ['region'],
		})
	})
})
