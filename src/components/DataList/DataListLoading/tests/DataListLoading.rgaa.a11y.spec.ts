// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DataListLoading from '../DataListLoading.vue'

export const dataListLoadingRgaaCriteria = ['1.2', '7.5'] as const
describe('DataListLoading – executable RGAA contracts', () => {
	it('1.2 – hides the loading skeleton from assistive technologies', () => {
		const wrapper = mount(DataListLoading, { props: { itemsNumber: 3, heading: true } })
		expect(wrapper.get('[aria-hidden="true"]').attributes('aria-hidden')).toBe('true')
		expect(wrapper.findAll('li')).toHaveLength(3)
	})
})
