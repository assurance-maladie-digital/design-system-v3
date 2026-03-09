// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'

// Scénario d’accessibilité : groupe de cases à cocher requis avec label.

describe('SyCheckBoxGroup – accessibility (axe)', () => {
	it('has no obvious axe violations for required checkbox group', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				label: 'Choisissez une option',
				modelValue: null,
				required: true,
				options: [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
					{ label: 'Option B', value: 'B', id: 'opt-b' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckBoxGroup – required group', {
			ignoreRules: ['region'],
		})
	})
})
