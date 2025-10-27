import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import PageContainer from '../PageContainer.vue'

describe('PageContainer', () => {
	it('render correctly', async () => {
		const wrapper = mount(PageContainer)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('render correctly with slot', async () => {
		const wrapper = mount(PageContainer, {
			slots: {
				default: 'slot content',
			},
		})

		expect(wrapper.html()).toContain('slot content')
	})

	it('render correctly with spacing class', async () => {
		const wrapper = mount(PageContainer, {
			props: {
				spacing: 'sm',
			},
		})

		expect(wrapper.vm.spacingClass).toBe('py-10 px-4')
	})

	it('containerSize computed property', async () => {
		const wrapper = mount(PageContainer, {
			props: {
				size: 'md',
			},
		})

		expect(wrapper.vm.containerSize).toBe(800)
	})
})
