// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyAlert from '../SyAlert.vue'

describe('SyAlert – accessibility (axe)', () => {
	it('has no obvious axe violations', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				type: 'info',
			},
			slots: {
				default: 'Ceci est un message d\'information.',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyAlert – default state')
	})
})
