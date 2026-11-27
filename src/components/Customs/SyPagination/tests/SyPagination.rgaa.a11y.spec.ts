// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyPagination from '../SyPagination.vue'

export const syPaginationRgaaCriteria = ['7.1', '8.9', '10.7', '12.6'] as const

describe('SyPagination – executable RGAA contracts', () => {
	it('7.1, 8.9 and 12.6 – exposes a labelled navigation landmark and current page', () => {
		const wrapper = mount(SyPagination, { props: { modelValue: 2, pages: 5, label: 'Résultats' } })
		const nav = wrapper.get('nav')
		expect(nav.attributes('aria-labelledby')).toBeTruthy()
		expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
		expect(wrapper.get('.previous-page').exists()).toBe(true)
		expect(wrapper.get('.next-page').exists()).toBe(true)
	})
})
