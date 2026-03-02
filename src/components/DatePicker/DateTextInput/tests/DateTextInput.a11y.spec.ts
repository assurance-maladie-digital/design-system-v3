// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DateTextInput from '../DateTextInput.vue'

// Scénario d’accessibilité : champ texte de date seul, requis,
// avec format jour/mois/année.

describe('DateTextInput – accessibility (axe)', () => {
	it('has no obvious axe violations for a required single date field', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DateTextInput – required single date', {
			ignoreRules: ['region'],
		})
	})
})
