// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import LunarCalendar from '../LunarCalendar.vue'

// Scénario d’accessibilité : champ de date lunaire avec label requis et valeur renseignée.

describe('LunarCalendar – accessibility (axe)', () => {
	it('has no obvious axe violations with labeled required field', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance',
				modelValue: '10/19/1995',
				required: true,
				minYear: 1900,
				maxYear: 2030,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar – labeled required field', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
