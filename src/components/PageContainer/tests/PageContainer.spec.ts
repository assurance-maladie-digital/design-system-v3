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

	describe('role prop', () => {
		it('should render with role="main"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'main',
				},
			})

			expect(wrapper.attributes('role')).toBe('main')
		})

		it('should render with role="region"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'region',
				},
			})

			expect(wrapper.attributes('role')).toBe('region')
		})

		it('should render with role="navigation"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'navigation',
				},
			})

			expect(wrapper.attributes('role')).toBe('navigation')
		})

		it('should render with role="contentinfo"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'contentinfo',
				},
			})

			expect(wrapper.attributes('role')).toBe('contentinfo')
		})

		it('should not render role attribute when role prop is undefined', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: undefined,
				},
			})

			expect(wrapper.attributes('role')).toBeUndefined()
		})
	})
})
