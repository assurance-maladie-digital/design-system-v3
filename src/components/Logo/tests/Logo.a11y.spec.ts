// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import Logo from '../Logo.vue'

// Scénario d’accessibilité : logo CNAM avec props par défaut (non avatar).

describe('Logo – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(Logo)

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'Logo – default state', {
			ignoreRules: ['region'],
		})
	})
})
