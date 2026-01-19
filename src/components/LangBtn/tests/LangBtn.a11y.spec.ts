// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import LangBtn from '../LangBtn.vue'

// Scénario d’accessibilité : sélecteur de langue fermé, avec label ARIA
// et liste de langues FR / EN.

describe('LangBtn – accessibility (axe)', () => {
	it('has no obvious axe violations in closed state', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'en'],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LangBtn – closed state', {
			ignoreRules: ['region'],
		})
	})
})
