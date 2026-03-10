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

		const ignoreRules = ['region']

		const results = await axe(wrapper.element as HTMLElement)
		if (results.violations.filter(violation => !ignoreRules.includes(violation.id)).length > 0) {
			console.log(JSON.stringify(results.violations, null, 2))
		}
		assertNoA11yViolations(results, 'PeriodField – valid period', {
			ignoreRules: ignoreRules,
		})

		wrapper.unmount()
	})
})
