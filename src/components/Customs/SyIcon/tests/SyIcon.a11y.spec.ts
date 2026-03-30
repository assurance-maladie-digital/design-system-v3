// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyIcon from '../SyIcon.vue'

describe('SyIcon – accessibility (axe)', () => {
	it('has no obvious axe violations', async () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'home',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyIcon – default state')
	})
})
