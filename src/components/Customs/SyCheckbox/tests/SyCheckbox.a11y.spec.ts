// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyCheckbox from '../SyCheckbox.vue'

// Scénario d’accessibilité : case à cocher requise avec libellé.

describe('SyCheckbox – accessibility (axe)', () => {
	it('has no obvious axe violations for required checkbox with label', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'J’accepte les conditions générales',
				modelValue: false,
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckbox – required labelled checkbox', {
			ignoreRules: ['region'],
		})
	})
})
