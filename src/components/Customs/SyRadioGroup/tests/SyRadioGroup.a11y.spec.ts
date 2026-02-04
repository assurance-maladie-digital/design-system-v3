// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyRadioGroup from '../SyRadioGroup.vue'

// Scénario d’accessibilité : groupe de boutons radio requis avec label.

describe('SyRadioGroup – accessibility (axe)', () => {
	it('has no obvious axe violations for required radio group', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				label: 'Choisissez une option',
				modelValue: null,
				required: true,
				options: [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyRadioGroup – required group', {
			ignoreRules: ['region'],
		})
	})
})
