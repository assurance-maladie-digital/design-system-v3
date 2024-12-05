import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserMenuBtn from '../UserMenuBtn.vue'
import { vuetify } from '@tests/unit/setup'
import { nextTick } from 'vue'

describe('UserMenuBtn', () => {
	it('renders the component', () => {
		const wrapper = mount(UserMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				menuItems: [{ text: 'Item 1', value: 'item1' }],
				additionalInformation: 'Additional Info',
				fullName: 'John Doe',
				hideLogoutBtn: false,
				isMobileView: false,
				hideUserIcon: false,
			},
		})
		expect(wrapper.exists()).toBe(true)
	})

	it('displays the full name', () => {
		const wrapper = mount(UserMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				fullName: 'John Doe',
			},
		})
		expect(wrapper.text()).toContain('John Doe')
	})

	it('does not render logout button when hidden', () => {
		const wrapper = mount(UserMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				hideLogoutBtn: true,
			},
		})
		expect(wrapper.find('.logout').exists()).toBe(false)
	})

	it('renders user icon when not hidden', () => {
		const wrapper = mount(UserMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				hideUserIcon: false,
			},
		})
		expect(wrapper.find('.vd-user-icon').exists()).toBe(true)
	})

	it('does not render user icon when hidden', () => {
		const wrapper = mount(UserMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				hideUserIcon: true,
			},
		})
		expect(wrapper.find('.vd-user-icon').exists()).toBe(false)
	})

	it('emits "update:modelValue" when selected changes', async () => {
		const wrapper = mount(UserMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
			},
		})
		wrapper.vm.$emit('update:modelValue', 'item1')
		await nextTick()
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		if (emitted && emitted[0]) {
			expect(emitted[0]).toEqual(['item1'])
		}
	})

	it('computes mobile view correctly based on props and display', () => {
		const wrapper = mount(UserMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				isMobileView: true,
			},
		})
		expect(wrapper.vm.isMobileView).toBe(true)
	})
	it('emits "update:modelValue" when updateModelValue is called via event', async () => {
		const wrapper = mount(UserMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				menuItems: [{ text: 'Item 1', value: 'item1' }],
			},
		})

		const customBtnSelect = wrapper.findComponent({ name: 'CustomBtnSelect' })
		await customBtnSelect.vm.$emit('update:model-value', 'test-value')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test-value'])
	})
})
