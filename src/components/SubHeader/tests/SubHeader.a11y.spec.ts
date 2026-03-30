// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SubHeader from '../SubHeader.vue'

describe('SubHeader – accessibility (axe)', () => {
	it('has no obvious axe violations', async () => {
		const wrapper = mount(SubHeader, {
			slots: {
				default: '<h1>Mon titre principal</h1>',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SubHeader – default state')
	})
})
