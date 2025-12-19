// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import BackBtn from '@/components/BackBtn/BackBtn.vue'

describe('BackBtn accessibility (axe)', () => {
	it('has no obvious axe violations in its default state', async () => {
		const wrapper = mount(BackBtn, {
			props: {
				label: 'Retour',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'BackBtn – default state')
	})
})
