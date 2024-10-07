import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import BackBtn from '../BackBtn.vue'
import { vuetify } from '@tests/unit/setup'
import { VIcon, VBtn } from 'vuetify/components'

describe('BackBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(BackBtn, {
			global: {
				plugins: [vuetify],
			},
			component: {
				VIcon,
				VBtn,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('hides back icon when hideBackIcon is true', () => {
		const wrapper = mount(BackBtn, {
			global: {
				plugins: [vuetify],
			},
			component: {
				VIcon,
				VBtn,
			},
			props: { hideBackIcon: true },
		})
		expect(wrapper.find('VIcon').exists()).toBe(false)
	})

	it('applies correct button classes based on props', () => {
		const wrapper = mount(BackBtn, {
			global: {
				plugins: [vuetify],
			},
			component: {
				VIcon,
				VBtn,
			},
			props: { dark: false, hideBackIcon: false },
		})
		expect(wrapper.find('.vd-back-btn').classes()).toContain('pr-1')
	})

	it('applies correct button classes when dark is true and hideBackIcon is false', () => {
		const wrapper = mount(BackBtn, {
			global: {
				plugins: [vuetify],
			},
			component: {
				VIcon,
				VBtn,
			},
			props: { dark: true, hideBackIcon: false },
		})
		expect(wrapper.find('.vd-back-btn').classes()).not.toContain('pr-1')
	})
	it('returns false when dark prop is not provided', () => {
		const wrapper = mount(BackBtn, {
			global: {
				plugins: [vuetify],
			},
			component: {
				VIcon,
				VBtn,
			},
		})
		expect(wrapper.vm.dark).toBe(false)
	})

	it('returns true when dark prop is true', () => {
		const wrapper = mount(BackBtn, {
			global: {
				plugins: [vuetify],
			},
			component: {
				VIcon,
				VBtn,
			},
			props: { dark: true },
		})
		expect(wrapper.vm.dark).toBe(true)
	})

	it('returns false when dark prop is false', () => {
		const wrapper = mount(BackBtn, {
			global: {
				plugins: [vuetify],
			},
			component: {
				VIcon,
				VBtn,
			},
			props: { dark: false },
		})
		expect(wrapper.vm.dark).toBe(false)
	})
})
