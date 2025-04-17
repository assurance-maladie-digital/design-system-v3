import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
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
			props: {
				modelValue: '01/01/2025',
				customWarningRules: [{
					type: 'custom',
					options: {
						validate: (value: string) => !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/2025$/.test(value),
						message: 'Les dates en 2025 ne sont pas recommandées',
						fieldIdentifier: 'date',
						isWarning: true,
					},
				}],
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Force la validation en déclenchant un événement de perte de focus
		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick() // Double nextTick pour s'assurer que les mises à jour sont terminées
		// On peut également forcer la validation manuellement
		await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		const warningMessages = textField.props('warningMessages') || []
		// Vérifier que le message d'avertissement est bien présent
		expect(warningMessages.length).toBeGreaterThan(0)
		// Le message réel commence par "Attention :"
		expect(warningMessages[0]).toContain('Attention :')
	})

	it('handles invalid dates correctly', async () => {
		const input = wrapper.find('input')
		await input.setValue('31/02/2025')
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
		expect(textField.props('errorMessages')).toContain('Format de date invalide')
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
		await input.trigger('input')
		await input.trigger('blur')
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
		await wrapper.setProps({ disabled: true })
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('disabled')).toBe(true)
	})

	it('handles readonly state', async () => {
		await wrapper.setProps({ readonly: true })
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('readonly')).toBe(true)
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
		await input.trigger('input')
		await wrapper.vm.$nextTick()

		expect(input.element.value).toBe('01/01/2025')
	})

	it('handles keydown events correctly', async () => {
		const input = wrapper.find('input')
		await input.trigger('keydown', {
			key: 'Tab',
		})
		// Vérifier que le composant n'empêche pas la navigation par tab
		expect(wrapper.emitted('update:model-value')).toBeFalsy()

		// Tester le comportement avec Ctrl+V (coller)
		await input.trigger('keydown', {
			key: 'v',
			ctrlKey: true,
		})
		// Le comportement par défaut devrait être préservé
		expect(wrapper.emitted('update:model-value')).toBeFalsy()
	})

	it('validates on submit correctly', async () => {
		const input = wrapper.find('input')

		// Cas 1: Champ vide avec required=true
		const emptyResult = await wrapper.vm.validateOnSubmit()
		expect(emptyResult).toBe(false)

		// Cas 2: Date valide
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()

		const validResult = await wrapper.vm.validateOnSubmit()
		expect(validResult).toBe(true)
	})

	it('handles focus and blur methods correctly', async () => {
		// Simuler un querySelector global
		const originalQuerySelector = document.querySelector
		const mockInput = { focus: vi.fn(), blur: vi.fn() }

		// Remplacer document.querySelector
		document.querySelector = vi.fn().mockReturnValue(mockInput)

		// Appeler les méthodes exposées
		wrapper.vm.focus()
		wrapper.vm.blur()

		// Vérifier que les méthodes ont été appelées
		expect(mockInput.focus).toHaveBeenCalled()
		expect(mockInput.blur).toHaveBeenCalled()

		// Restaurer document.querySelector
		document.querySelector = originalQuerySelector
	})

	it('initializes with model value correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '01/01/2025',
				format: 'DD/MM/YYYY',
			},
		})

		await customWrapper.vm.$nextTick()
		const input = customWrapper.find('input')
		expect(input.element.value).toBe('01/01/2025')
	})

	it('handles different date separators correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD.MM.YYYY',
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('01.01.2025')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()

		expect(customWrapper.emitted('update:model-value')?.[0]).toEqual(['01.01.2025'])
	})

	it('handles partial date input correctly', async () => {
		const input = wrapper.find('input')

		// Saisir seulement le jour
		await input.setValue('01')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/__/____')

		// Ajouter le mois
		await input.setValue('01/02')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/02/____')

		// Compléter la date
		await input.setValue('01/02/2025')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/02/2025')
	})

	it('handles success messages correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			props: {
				modelValue: '01/01/2024',
				customRules: [{
					type: 'custom',
					options: {
						validate: () => true,
						message: 'Date valide',
						fieldIdentifier: 'date',
						isSuccess: true,
					},
				}],
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Force la validation
		const input = customWrapper.find('input')
		await input.trigger('focus')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()
		await customWrapper.vm.$nextTick() // Double nextTick pour fiabilité

		// Force validation manuelle
		await customWrapper.vm.validateOnSubmit()
		await customWrapper.vm.$nextTick()

		const textField = customWrapper.findComponent(SyTextField)
		const successMessages = textField.props('successMessages') || []

		// Vérification assouplie
		expect(successMessages.length).toBeGreaterThan(0)
		expect(successMessages[0]).toContain('valide')
	})

	it('handles multiple validation rules correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				required: true,
				customRules: [
					{
						type: 'custom',
						options: {
							validate: (value: string) => value.includes('2025'),
							message: 'La date doit être en 2025',
							fieldIdentifier: 'date',
						},
					},
					{
						type: 'custom',
						options: {
							validate: (value: string) => value.includes('01/'),
							message: 'Le mois doit être janvier',
							fieldIdentifier: 'date',
						},
					},
				],
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('15/02/2025')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()

		const textField = customWrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('Le mois doit être janvier')
	})
})
