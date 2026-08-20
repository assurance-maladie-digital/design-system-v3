// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import PeriodField from '../PeriodField.vue'

// Scénario d’accessibilité : champ de période avec deux dates valides.

describe('PeriodField – accessibility (axe)', () => {
	it('has no obvious axe violations with valid period', async () => {
		const wrapper = mount(PeriodField, {
			props: {
				modelValue: {
					from: '14/11/2005',
					to: '23/12/2005',
				},
				required: true,
			},
			attachTo: document.body,
		})

		// 'aria-valid-attr-value' is ignored because Vuetify sets aria-owns on the
		// DatePicker input referencing the VMenu id, but in JSDOM the menu is
		// rendered via <Teleport> and not present in the scanned subtree.
		// See: https://github.com/assurance-maladie-digital/design-system-v3/issues/1960
		const ignoreRules = ['region', 'aria-valid-attr-value']

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PeriodField – valid period', {
			ignoreRules: ignoreRules,
		})

		wrapper.unmount()
	})
})
