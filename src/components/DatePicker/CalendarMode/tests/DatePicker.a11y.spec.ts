// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DatePicker from '../DatePicker.vue'

// Scénario d’accessibilité : champ de date en mode calendrier,
// avec label et champ requis, calendrier fermé (état par défaut).

describe('DatePicker (CalendarMode) – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de naissance',
				format: 'DD/MM/YYYY',
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker (CalendarMode) – default state', {
			ignoreRules: ['region'],
		})
	})
})
