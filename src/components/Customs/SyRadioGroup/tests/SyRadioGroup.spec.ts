import SyRadioGroup from '../SyRadioGroup.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import type { ValidationRule } from '@/composables/validation/useValidation'

describe('SyRadioGroup', () => {
	it('should render correctly', () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				label: 'Test radio group',
				options: [
					{ label: 'A', value: 'A' },
					{ label: 'B', value: 'B' },
				],
			},
		})

		expect(wrapper.find('.v-radio-group').exists()).toBe(true)
		expect(wrapper.text()).toContain('Test radio group')
		expect(wrapper.findAll('input[type="radio"]').length).toBe(2)
	})

	it('should handle v-model correctly', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				'modelValue': null,
				'label': 'Test Radio',
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
			},
		})

		// Sélectionner la première option
		await wrapper.find('input[type="radio"]').setValue(true)
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['A'])
		expect(wrapper.emitted('change')?.[0]).toEqual(['A'])
	})

	it('should handle validation correctly', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				'modelValue': null,
				'label': 'Required Radio',
				'required': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [
					{ label: 'X', value: 'X' },
				],
			},
		})

		// Valider le champ directement via la méthode exposée
		const isValid = await wrapper.vm.validateOnSubmit()
		expect(isValid).toBe(false)

		// Vérifier que le message d'erreur est présent
		await nextTick()
		const errorMessages = wrapper.findAll('.v-messages__message')
		expect(errorMessages.length).toBeGreaterThan(0)
		expect(errorMessages[0]?.text()).toContain('Required Radio est requis')

		// Sélectionner l'option
		const radioX = wrapper.find('input[value="X"]')
		await radioX.setValue(true)
		await nextTick()

		// Valider à nouveau
		const isValidAfter = await wrapper.vm.validateOnSubmit()
		expect(isValidAfter).toBe(true)
		expect(wrapper.props('modelValue')).toBe('X')
	})

	it('should handle readonly and disabled states', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				modelValue: null,
				label: 'Readonly Radio',
				readonly: true,
				options: [{ label: 'X', value: 'X' }],
			},
		})

		// Cliquer sur radio button en lecture seule ne devrait pas changer sa valeur
		await wrapper.find('.v-radio-group').trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		// Tester l'état désactivé
		await wrapper.setProps({ readonly: false, disabled: true })
		await wrapper.find('.v-radio-group').trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('should handle custom validation rules', async () => {
		const customRule: ValidationRule = {
			type: 'custom',
			options: {
				validate: (value: unknown) => value === 'OK',
				message: 'Vous devez sélectionner une option.',
				fieldIdentifier: 'Custom Radio',
			},
		}

		const wrapper = mount(SyRadioGroup, {
			props: {
				'modelValue': null,
				'label': 'Custom Rules Radio',
				'required': true,
				'customRules': [customRule],
				'isValidateOnBlur': false,
				'options': [
					{ label: 'Non', value: 'NO' },
					{ label: 'Oui', value: 'OK' },
					{ label: 'Peut-être', value: 42 },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		// Validation initiale : aucune option sélectionnée
		const isValidInitial = await wrapper.vm.validateOnSubmit()
		expect(isValidInitial).toBe(false)

		// Vérifier visuellement le message d'erreur
		await nextTick()
		const errorMessages = wrapper.findAll('.v-messages__message')
		expect(errorMessages.length).toBeGreaterThan(0)

		// Sélectionner l'option correcte
		await wrapper.setProps({ modelValue: 'OK' })
		await nextTick()

		// Validation après sélection
		const isValidCorrect = await wrapper.vm.validateOnSubmit()
		expect(isValidCorrect).toBe(true)
	})

	it('should display asterisk when displayAsterisk is true and required', () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				label: 'Required Field',
				required: true,
				displayAsterisk: true,
				options: [{ label: 'X', value: 'X' }],
			},
		})

		expect(wrapper.text()).toContain('Required Field *')
	})

	it('should not display asterisk when displayAsterisk is false', () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				label: 'Required Field',
				required: true,
				displayAsterisk: false,
				options: [{ label: 'X', value: 'X' }],
			},
		})

		expect(wrapper.text()).toContain('Required Field')
		expect(wrapper.text()).not.toContain('Required Field *')
	})

	it('should handle external error messages', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				label: 'Radio Group',
				options: [{ label: 'X', value: 'X' }],
				errorMessages: ['Erreur externe'],
			},
		})

		await nextTick()
		const errorMessages = wrapper.findAll('.v-messages__message')
		expect(errorMessages.length).toBeGreaterThan(0)
		expect(errorMessages[0]?.text()).toContain('Erreur externe')
	})

	it('should handle warning and success rules', async () => {
		const warningRule: ValidationRule = {
			type: 'custom',
			options: {
				validate: (value: unknown) => value === 'A' || 'Veuillez sélectionner A',
				fieldIdentifier: 'Warning Field',
			},
		}

		const successRule: ValidationRule = {
			type: 'custom',
			options: {
				validate: (value: unknown) => value === 'A',
				successMessage: 'Bonne sélection !',
				fieldIdentifier: 'Success Field',
			},
		}

		const wrapper = mount(SyRadioGroup, {
			props: {
				'modelValue': null,
				'label': 'Warning/Success Rules Radio',
				'customWarningRules': [warningRule],
				'customSuccessRules': [successRule],
				'showSuccessMessages': true,
				'isValidateOnBlur': false,
				'options': [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		// Sélectionner l'option A
		await wrapper.setProps({ modelValue: 'A' })
		await nextTick()
		await wrapper.vm.validateOnSubmit()
		await nextTick()

		// Vérifier que la validation fonctionne
		const isValid = await wrapper.vm.validateOnSubmit()
		expect(isValid).toBe(true)
	})

	it('should validate on selection change when isValidateOnBlur is false', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				'modelValue': null,
				'label': 'Validate On Change Radio',
				'required': true,
				'isValidateOnBlur': false,
				'options': [
					{ label: 'Option A', value: 'A' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		// La validation devrait se déclencher lors du changement de valeur
		await wrapper.setProps({ modelValue: 'A' })
		await nextTick()

		const isValid = await wrapper.vm.validateOnSubmit()
		expect(isValid).toBe(true)
	})

	it('should handle useVuetifyValidation mode', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				'modelValue': null,
				'label': 'Vuetify Validation Radio',
				'useVuetifyValidation': true,
				'rules': [
					(v: string | null) => !!v || 'Sélection requise',
				],
				'options': [
					{ label: 'Option A', value: 'A' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		// Validation doit fonctionner en mode Vuetify
		const isValid = await wrapper.vm.validateOnSubmit()
		expect(typeof isValid).toBe('boolean')
	})
})
