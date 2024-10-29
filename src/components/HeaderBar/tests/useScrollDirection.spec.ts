import { it, describe, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import useScrollDirection from '../useScrollDirection'

describe('useScrollDirection', () => {
	it('should return the correct scroll direction', async () => {
		const mockScrollTop = vi.spyOn(document.documentElement, 'scrollTop', 'get')

		const wrapper = mount({
			template: `<div :class="scrollDirection"></div>`,
			setup() {
				const { scrollDirection } = useScrollDirection()
				return { scrollDirection }
			},
		})
		mockScrollTop.mockReturnValue(0)
		window.dispatchEvent(new CustomEvent('scroll'))

		expect(wrapper.find('div').classes()).toEqual([])

		mockScrollTop.mockReturnValue(100)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()
		expect(wrapper.find('div').classes()).toEqual(['bottom'])

		mockScrollTop.mockReturnValue(50)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()
		expect(wrapper.find('div').classes()).toEqual(['top'])

		vi.clearAllMocks()
		wrapper.unmount()
	})
})
