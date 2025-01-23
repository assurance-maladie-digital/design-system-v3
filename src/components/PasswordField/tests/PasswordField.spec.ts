import { mount } from '@vue/test-utils'
import PasswordField from '../PasswordField.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'

// 1. Define an interface for the properties/methods you're testing
interface PasswordFieldVM {
	showEyeIcon: boolean
	errors: string[]
	isValidating: boolean
	validateOnSubmit: () => boolean
}

describe('PasswordField.vue', () => {
	let vuetify

	beforeEach(() => {
		vuetify = createVuetify()
	})

	it('renders the password field', () => {
		const wrapper = mount(PasswordField, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.exists()).toBe(true)
	})

	it('toggles password visibility', async () => {
		const wrapper = mount(PasswordField, {
			global: {
				plugins: [vuetify],
			},
		})
		// 2. Cast wrapper.vm as your interface
		const vm = wrapper.vm as unknown as PasswordFieldVM

		const button = wrapper.find('button')
		expect(vm.showEyeIcon).toBe(false) // from your interface
		await button.trigger('click')
		expect(vm.showEyeIcon).toBe(true)
		await button.trigger('click')
		expect(vm.showEyeIcon).toBe(false)
	})

	it('emits update:modelValue event on input', async () => {
		const wrapper = mount(PasswordField, {
			global: {
				plugins: [vuetify],
			},
		})
		const input = wrapper.find('input')
		await input.setValue('new-password')
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['new-password'])
	})

	it('validates the password field on blur', async () => {
		const wrapper = mount(PasswordField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true,
			},
		})
		const vm = wrapper.vm as unknown as PasswordFieldVM

		const input = wrapper.find('input')
		await input.trigger('blur')
		expect(vm.errors).toContain('Le mot de passe est requis.')
	})

	it('validates fields on submit and sets validating flag', async () => {
		const wrapper = mount(PasswordField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				outlined: false,
				required: true,
			},
		})
		const vm = wrapper.vm as unknown as PasswordFieldVM

		const result = vm.validateOnSubmit()
		expect(vm.isValidating).toBe(true)
		expect(result).toBe(false)

		// This awaits the Vue microtask queue to let any reactive data settle
		await wrapper.vm.$nextTick()

		expect(vm.errors).toContain('Le mot de passe est requis.')
	})
})
