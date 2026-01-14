// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import RangeField from '../RangeField.vue'

// Scénario d’accessibilité : champ de plage numérique avec fieldset et légende.

describe('RangeField – accessibility (axe)', () => {
	it('has no obvious axe violations with labeled fieldset and values', async () => {
		const wrapper = mount(RangeField, {
			props: {
				modelValue: [20, 80],
				min: 0,
				max: 100,
				fieldsetLabel: 'Plage de valeurs',
				textFieldMinLabel: 'Min',
				textFieldMaxLabel: 'Max',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'RangeField – labeled fieldset', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
