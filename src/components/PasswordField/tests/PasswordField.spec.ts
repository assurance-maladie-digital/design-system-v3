import { mount, flushPromises } from '@vue/test-utils'
import PasswordField from '../PasswordField.vue'
import { describe, it, expect } from 'vitest'

interface PasswordFieldVM {
	showEyeIcon: boolean
	errors: string[]
	warnings: string[]
	successes: string[]
	validateOnSubmit: () => Promise<boolean>
	hasError: boolean
	hasWarning: boolean
	hasSuccess: boolean
}

describe('PasswordField.vue', () => {
	it('renders the password field', () => {
		const wrapper = mount(PasswordField)
		expect(wrapper.exists()).toBe(true)
	})

	it('toggles password visibility', async () => {
		const wrapper = mount(PasswordField)
		const vm = wrapper.vm as unknown as PasswordFieldVM

		const button = wrapper.find('.password-toggle-button')
		expect(vm.showEyeIcon).toBe(false)
		await button.trigger('click')
		expect(vm.showEyeIcon).toBe(true)
		await button.trigger('click')
		expect(vm.showEyeIcon).toBe(false)
	})

	it('emits update:modelValue event on input', async () => {
		const wrapper = mount(PasswordField)
		const input = wrapper.find('input')
		await input.setValue('new-password')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['new-password'])
	})

	it('shows clear button and clears value when clearable is enabled', async () => {
		const withoutClearWrapper = mount(PasswordField, {
			props: {
				label: 'Password',
				modelValue: 'initial-password',
				clearable: false,
			},
		})
		expect(withoutClearWrapper.find('.password-clear-button').exists()).toBe(false)

		const wrapper = mount(PasswordField, {
			props: {
				label: 'Password',
				modelValue: 'initial-password',
				clearable: true,
			},
		})

		const clearButton = wrapper.find('.password-clear-button')
		expect(clearButton.exists()).toBe(true)

		await clearButton.trigger('click')

		const emitted = wrapper.emitted('update:modelValue')?.at(-1)
		expect(emitted).toEqual([''])
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
		await input.trigger('focus')
		await wrapper.vm.$nextTick()
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(vm.errors).toContain('Le mot de passe est requis')
	})

	it('validates fields on submit', async () => {
		const emptyWrapper = mount(PasswordField, {
			props: { modelValue: '', variantStyle: 'underlined', required: true, label: 'Password' },
		})
		const emptyVm = emptyWrapper.vm as unknown as PasswordFieldVM
		const result = await emptyVm.validateOnSubmit()
		expect(result).toBe(false)
		expect(emptyVm.errors).toContain('Le mot de passe est requis')

		const validWrapper = mount(PasswordField, {
			props: { modelValue: 'valid-password', variantStyle: 'underlined', required: true, label: 'Password' },
		})
		const validVm = validWrapper.vm as unknown as PasswordFieldVM
		const validResult = await validVm.validateOnSubmit()
		expect(validResult).toBe(true)
	})

	it('displays warning and success messages', async () => {
		const warningWrapper = mount(PasswordField, {
			props: {
				label: 'Password',
				modelValue: 'test',
				warningMessages: ['Attention: mot de passe court'],
				successMessages: ['Mot de passe valide'],
			},
		})
		const messages = warningWrapper.findAll('.v-messages__message')
		expect(messages.length).toBe(1)
		expect(messages[0]?.text()).toBe('Attention: mot de passe court')

		const successWrapper = mount(PasswordField, {
			props: {
				label: 'Password',
				modelValue: 'test',
				successMessages: ['Mot de passe valide'],
			},
		})
		const successMessages = successWrapper.findAll('.v-messages__message')
		expect(successMessages.length).toBe(1)
		expect(successMessages[0]?.text()).toBe('Mot de passe valide')
	})

	it('handles custom validation rules', async () => {
		async function mountAndBlur(modelValue: string) {
			const wrapper = mount(PasswordField, {
				props: {
					label: 'Password',
					modelValue,
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
			await wrapper.find('input').trigger('focus')
			await wrapper.vm.$nextTick()
			await wrapper.find('input').trigger('blur')
			await wrapper.vm.$nextTick()
			await flushPromises()
			await wrapper.vm.$nextTick()
			return wrapper
		}

		const errorWrapper = await mountAndBlur('test')
		expect((errorWrapper.vm as unknown as PasswordFieldVM).errors).toContain('Le mot de passe doit contenir au moins 8 caractères')

		const warningWrapper = await mountAndBlur('testpassword')
		const warningMessages = warningWrapper.findAll('.v-messages__message')
		expect(warningMessages[0]?.text()).toBe('Le mot de passe pourrait être plus fort')

		const successWrapper = await mountAndBlur('TestPassword123')
		expect((successWrapper.vm as unknown as PasswordFieldVM).successes).toContain('Mot de passe fort')
	})

	it('displays validation states based on validation rules', async () => {
		async function mountAndBlur(modelValue: string) {
			const wrapper = mount(PasswordField, {
				props: {
					label: 'Password',
					modelValue,
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
			await wrapper.find('input').trigger('focus')
			await wrapper.vm.$nextTick()
			await wrapper.find('input').trigger('blur')
			await wrapper.vm.$nextTick()
			await flushPromises()
			await wrapper.vm.$nextTick()
			return wrapper.vm as unknown as PasswordFieldVM
		}

		expect((await mountAndBlur('test')).hasError).toBe(true)
		expect((await mountAndBlur('testpassword')).hasWarning).toBe(true)
		expect((await mountAndBlur('TestPassword123')).hasSuccess).toBe(true)
	})
})
