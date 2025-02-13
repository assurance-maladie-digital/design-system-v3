import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { vuetify } from '@tests/unit/setup'
import DateTextInput from '../DateTextInput.vue'
import SyTextField from '../../Customs/SyTextField/SyTextField.vue'

describe('DateTextInput.vue', () => {
	let wrapper

	beforeEach(() => {
		wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				required: true,
			},
		})
	})

	it('renders the component', () => {
		expect(wrapper.exists()).toBe(true)
	})

	it('validates required field', async () => {
		const input = wrapper.find('input')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('La date est requise')
	})

	it('validates date format', async () => {
		const input = wrapper.find('input')
		await input.setValue('invalid-date')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('La date est requise')
	})

	it('accepts valid date format', async () => {
		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toHaveLength(0)
		expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['01/01/2025'])
	})

	it('formats date according to dateFormatReturn', async () => {
		const wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
			},
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['2025-01-01'])
	})

	it('validates custom rules', async () => {
		const wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string) => !value.includes('2024'),
						message: 'Les dates en 2024 ne sont pas autorisées',
						fieldIdentifier: 'date',
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2024')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('Les dates en 2024 ne sont pas autorisées')
	})

	it('validates warning rules', async () => {
		const wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				customWarningRules: [{
					type: 'custom',
					options: {
						validate: (value: string) => !value.includes('2025'),
						warningMessage: 'Les dates en 2025 ne sont pas recommandées',
						fieldIdentifier: 'date',
						isWarning: true,
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('messages')).toContain('Les dates en 2025 ne sont pas recommandées')
	})

	it('handles invalid dates correctly', async () => {
		const input = wrapper.find('input')
		await input.setValue('31/02/2025') // Invalid date (February 31st)
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('Format de date invalide')
	})

	it('formats input while typing', async () => {
		const input = wrapper.find('input')
		await input.setValue('01012025')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/01/2025')
	})

	it('validates modelValue with different dateFormatReturn format', async () => {
		const wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '2025-1-1',
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-M-D',
				required: true,
			},
		})

		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toHaveLength(0)
		await wrapper.setProps({ modelValue: null })
		await wrapper.vm.$nextTick()
		const input = wrapper.find('input')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		expect(textField.props('errorMessages')).toContain('La date est requise')
	})
})
