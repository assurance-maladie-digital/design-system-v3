import { mount } from '@vue/test-utils'
import PasswordField from '../PasswordField.vue'
import { describe, it, expect } from 'vitest'

// 1. Define an interface for the properties/methods you're testing
interface PasswordFieldVM {
	showEyeIcon: boolean
	errors: string[]
	validateOnSubmit: () => boolean
	hasError: boolean
	hasWarning: boolean
	hasSuccess: boolean
	validationIcon: string
	validationIconColor: string
}

describe('PasswordField.vue', () => {
	it('renders the password field', () => {
		const wrapper = mount(PasswordField)
		expect(wrapper.exists()).toBe(true)
	})

	it('toggles password visibility', async () => {
		const wrapper = mount(PasswordField)
		// 2. Cast wrapper.vm as your interface
		const vm = wrapper.vm as unknown as PasswordFieldVM

		const button = wrapper.find('.password-toggle-button')
		expect(vm.showEyeIcon).toBe(false) // from your interface
		await button.trigger('click')
		expect(vm.showEyeIcon).toBe(true)
		await button.trigger('click')
		expect(vm.showEyeIcon).toBe(false)
	})

	it('emits update:modelValue event on input', async () => {
		const wrapper = mount(PasswordField)
		const input = wrapper.find('input')
		await input.setValue('new-password')
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['new-password'])
	})

	it('validates the password field on blur', async () => {
		const wrapper = mount(PasswordField, {
			props: {
				required: true,
				label: 'Password',
			},
		})
		const vm = wrapper.vm as unknown as PasswordFieldVM

		const input = wrapper.find('input')
		await input.trigger('blur')
		expect(vm.errors).toContain('Le mot de passe est requis')
	})

	it('validates fields on submit', async () => {
		const wrapper = mount(PasswordField, {
			props: {
				modelValue: '',
				variantStyle: 'underlined',
				required: true,
				label: 'Password',
			},
		})
		const vm = wrapper.vm as unknown as PasswordFieldVM

		const result = vm.validateOnSubmit()
		expect(result).toBe(false)
		expect(vm.errors).toContain('Le mot de passe est requis')

		await wrapper.setProps({ modelValue: 'valid-password' })
		const validResult = vm.validateOnSubmit()
		expect(validResult).toBe(true)
		expect(wrapper.emitted().submit).toBeTruthy()
	})

	it('displays warning and success messages', async () => {
		const wrapper = mount(PasswordField, {
			props: {
				modelValue: 'test',
				warningMessages: ['Attention: mot de passe court'],
				successMessages: ['Mot de passe valide'],
			},
		})

		const messages = wrapper.findAll('.v-messages__message')
		expect(messages.length).toBe(1)
		expect(messages[0].text()).toBe('Attention: mot de passe court')

		await wrapper.setProps({ warningMessages: [] })
		const successMessages = wrapper.findAll('.v-messages__message')
		expect(successMessages.length).toBe(1)
		expect(successMessages[0].text()).toBe('Mot de passe valide')
	})

	it('handles custom validation rules', async () => {
		const wrapper = mount(PasswordField, {
			props: {
				modelValue: 'test',
				customRules: [{
					type: 'custom',
					options: {
						message: 'Le mot de passe doit contenir au moins 8 caractères',
						validate: (value: string) => value.length >= 8,
					},
				}],
				customWarningRules: [{
					type: 'custom',
					options: {
						warningMessage: 'Le mot de passe pourrait être plus fort',
						validate: (value: string) => /[A-Z]/.test(value),
					},
				}],
				customSuccessRules: [{
					type: 'custom',
					options: {
						successMessage: 'Mot de passe fort',
						validate: (value: string) => value.length >= 12,
					},
				}],
			},
		})

		const vm = wrapper.vm as unknown as PasswordFieldVM

		await wrapper.find('input').trigger('blur')
		expect(vm.errors).toContain('Le mot de passe doit contenir au moins 8 caractères')

		await wrapper.setProps({ modelValue: 'testpassword' })
		await wrapper.find('input').trigger('blur')
		const messages = wrapper.findAll('.v-messages__message')
		expect(messages[0].text()).toBe('Le mot de passe pourrait être plus fort')

		await wrapper.setProps({ modelValue: 'TestPassword123' })
		await wrapper.find('input').trigger('blur')
		const successMessages = wrapper.findAll('.v-messages__message')
		expect(successMessages[0].text()).toBe('Mot de passe fort')
	})

	it('displays validation states based on validation rules', async () => {
		const wrapper = mount(PasswordField, {
			props: {
				modelValue: 'test',
				customRules: [{
					type: 'custom',
					options: {
						message: 'Le mot de passe doit contenir au moins 8 caractères',
						validate: (value: string) => value.length >= 8,
					},
				}],
				customWarningRules: [{
					type: 'custom',
					options: {
						warningMessage: 'Le mot de passe pourrait être plus fort',
						validate: (value: string) => /[A-Z]/.test(value),
					},
				}],
				customSuccessRules: [{
					type: 'custom',
					options: {
						successMessage: 'Mot de passe fort',
						validate: (value: string) => value.length >= 12,
					},
				}],
			},
		})

		await wrapper.find('input').trigger('blur')

		const vm = wrapper.vm as unknown as PasswordFieldVM
		expect(vm.hasError).toBe(true)

		await wrapper.setProps({ modelValue: 'testpassword' })
		await wrapper.find('input').trigger('blur')
		expect(vm.hasWarning).toBe(true)

		await wrapper.setProps({ modelValue: 'TestPassword123' })
		await wrapper.find('input').trigger('blur')
		expect(vm.hasSuccess).toBe(true)
	})
})
