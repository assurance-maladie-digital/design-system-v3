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

		const ignoredRules = ['region'] // Ignoring 'region' rule as per test configuration

		const results = await axe(wrapper.element as HTMLElement)
		// Debug aid: log violations details when present
		if (results.violations.filter(
			v => !ignoredRules.includes(v.id), // Ignoring specified rules as per test configuration
		).length > 0) {
			console.log(JSON.stringify(results.violations, null, 2))
		}
		assertNoA11yViolations(results, 'ComplexDatePicker – default calendar mode', {
			ignoreRules: ignoredRules,
		})
	})
})
