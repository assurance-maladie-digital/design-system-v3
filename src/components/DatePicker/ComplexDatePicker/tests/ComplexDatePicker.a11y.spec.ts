// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import ComplexDatePicker from '../ComplexDatePicker.vue'

// Scénario d’accessibilité : sélecteur de date combiné (champ + calendrier),
// en mode simple, avec label et format jour/mois/année.

describe('ComplexDatePicker – accessibility (axe)', () => {
	it('has no obvious axe violations in default calendar mode', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'ComplexDatePicker – default calendar mode', {
			ignoreRules: ['region'],
		})
	})
})
