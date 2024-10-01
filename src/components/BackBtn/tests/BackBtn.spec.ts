import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import BackBtn from '@/components/BackBtn/BackBtn.vue'
import { mdiArrowLeft } from '@mdi/js'
import { vuetify } from '@tests/unit/setup'

describe('BackBtn.vue', () => {
	it('render correctly', async () => {
		const wrapper = mount(BackBtn, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
	it('renders with default props', () => {
		const wrapper = mount(BackBtn)
		expect(wrapper.find('.vd-back-btn').exists()).toBe(true)
		expect(wrapper.find('VIcon').text()).toBe(mdiArrowLeft)
		expect(wrapper.find('VIcon').attributes('color')).toBe('primary')
	})

	it('renders with dark theme', () => {
		const wrapper = mount(BackBtn, {
			props: { dark: true },
		})
		expect(wrapper.find('VIcon').attributes('color')).toBe('white')
	})

	it('hides back icon when hideBackIcon is true', () => {
		const wrapper = mount(BackBtn, {
			props: { hideBackIcon: true },
		})
		expect(wrapper.find('VIcon').exists()).toBe(false)
	})

	it('applies correct button classes based on props', () => {
		const wrapper = mount(BackBtn, {
			props: { dark: false, hideBackIcon: false },
		})
		expect(wrapper.find('.vd-back-btn').classes()).toContain('pr-1')
	})

	it('applies correct button classes when dark is true and hideBackIcon is false', () => {
		const wrapper = mount(BackBtn, {
			props: { dark: true, hideBackIcon: false },
		})
		expect(wrapper.find('.vd-back-btn').classes()).not.toContain('pr-1')
	})
	it('returns false when dark prop is not provided', () => {
		const wrapper = mount(BackBtn)
		expect(wrapper.vm.dark).toBe(false)
	})

	it('returns true when dark prop is true', () => {
		const wrapper = mount(BackBtn, {
			props: { dark: true },
		})
		expect(wrapper.vm.dark).toBe(true)
	})

	it('returns false when dark prop is false', () => {
		const wrapper = mount(BackBtn, {
			props: { dark: false },
		})
		expect(wrapper.vm.dark).toBe(false)
	})
})
