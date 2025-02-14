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
		await input.setValue('32/13/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('Format de date invalide')
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

	it('formats date during input', async () => {
		const input = wrapper.find('input')
		await input.setValue('01012025')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/01/2025')
	})

	it('handles date deletion', async () => {
		// D'abord on met une date valide
		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()

		// Puis on la supprime
		await input.setValue('')
		await input.trigger('input') // Déclencher l'événement input
		await input.trigger('blur') // Et le blur pour la validation
		await wrapper.vm.$nextTick()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted?.[emitted.length - 1]).toEqual([null])
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('La date est requise')
	})

	it('supports different date formats', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'YYYY-MM-DD',
				required: true,
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('2025-01-01')
		await input.trigger('input')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()

		const emitted = customWrapper.emitted('update:model-value')
		expect(emitted?.[emitted.length - 1]).toEqual(['2025-01-01'])
	})

	it('handles disabled state', async () => {
		await wrapper.setProps({ isDisabled: true })
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('isDisabled')).toBe(true)
	})

	it('handles readonly state', async () => {
		await wrapper.setProps({ isReadOnly: true })
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('isReadOnly')).toBe(true)
	})

	it('emits focus and blur events', async () => {
		const input = wrapper.find('input')
		await input.trigger('focus')
		expect(wrapper.emitted('focus')).toBeTruthy()
		await input.trigger('blur')
		expect(wrapper.emitted('blur')).toBeTruthy()
	})

	it('handles custom date format return', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
				required: true,
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()
		expect(customWrapper.emitted('update:model-value')?.[0]).toEqual(['2025-01-01'])
	})

	it('preserves cursor position during formatting', async () => {
		const input = wrapper.find('input')
		await input.setValue('01')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/__/____')

		// Simuler une position de curseur après le "01"
		input.element.setSelectionRange(2, 2)
		await input.trigger('input')
		await wrapper.vm.$nextTick()

		// La position du curseur devrait rester après le "01"
		expect(input.element.selectionStart).toBe(2)
	})

	it('handles paste event with valid date', async () => {
		const input = wrapper.find('input')

		// Créer un événement de collage avec les données
		const clipboardData = {
			getData: () => '01/01/2025',
		}

		await input.trigger('paste', {
			clipboardData,
		})
		await input.trigger('input') // Déclencher l'événement input après le collage
		await wrapper.vm.$nextTick()

		expect(input.element.value).toBe('01/01/2025')
	})
})
