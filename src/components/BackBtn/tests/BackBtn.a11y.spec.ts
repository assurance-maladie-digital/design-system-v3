// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import BackBtn from '@/components/BackBtn/BackBtn.vue'

describe('BackBtn accessibility (axe)', () => {
	it('has no obvious axe violations in its default state', async () => {
		const wrapper = mount(BackBtn, {
			props: {
				label: 'Retour',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		expect(results.violations).toEqual([])
	})
})
