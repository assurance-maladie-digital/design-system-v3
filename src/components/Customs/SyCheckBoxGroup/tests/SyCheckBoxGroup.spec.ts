import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import type { ValidationRule } from '@/composables/unifyValidation/useValidation'

describe('SyCheckBoxGroup', () => {
	it('should render correctly', () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				label: 'Test checkbox group',
				options: [
					{ label: 'A', value: 'A', id: 'opt-a' },
					{ label: 'B', value: 'B', id: 'opt-b' },
				],
			},
		})

		expect(wrapper.find('.sy-checkbox-group').exists()).toBe(true)
		expect(wrapper.text()).toContain('Test checkbox group')
		expect(wrapper.findAll('input[type="checkbox"]').length).toBe(2)
	})

	it('should handle v-model correctly (single)', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
					{ label: 'Option B', value: 'B', id: 'opt-b' },
				],
			},
		})

		const checkboxes = wrapper.findAllComponents(SyCheckbox)
		expect(checkboxes.length).toBe(2)

		await checkboxes[0]?.find('input').setValue(true)

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['A'])

		// Uncheck
		await checkboxes[0]?.find('input').setValue(false)
		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([null])
	})

	it('should handle v-model correctly (multiple)', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'multiple': true,
				'modelValue': [],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
					{ label: 'Option B', value: 'B', id: 'opt-b' },
				],
			},
		})

		const checkboxes = wrapper.findAllComponents(SyCheckbox)
		expect(checkboxes.length).toBe(2)

		await checkboxes[0]?.find('input').setValue(true)
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['A']])

		await checkboxes[1]?.find('input').setValue(true)
		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['A', 'B']])
	})

	it('should handle validation correctly (required)', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'label': 'Required CheckBoxGroup',
				'required': true,
				'isValidateOnBlur': false,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [{ label: 'X', value: 'X', id: 'opt-x' }],
			},
		})

		const isValidInitial = await wrapper.vm.validateOnSubmit()
		await nextTick()
		expect(isValidInitial).toBe(false)
		expect(wrapper.text()).toContain('est requis')

		await wrapper.find('input').setValue(true)

		const isValidAfterSelection = await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(isValidAfterSelection).toBe(true)
		expect(wrapper.props('modelValue')).toBe('X')
	})

	it('should handle validation correctly (required, multiple)', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'multiple': true,
				'modelValue': [],
				'label': 'Required CheckBoxGroup',
				'required': true,
				'isValidateOnBlur': false,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
					{ label: 'Option B', value: 'B', id: 'opt-b' },
				],
			},
		})

		// Sélection vide (tableau vide) → le champ doit être en erreur au submit
		const isValidInitial = await wrapper.vm.validateOnSubmit()
		await nextTick()
		expect(isValidInitial).toBe(false)
		expect(wrapper.text()).toContain('est requis')

		// Après sélection d'au moins une option → valide, plus d'erreur
		await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)

		const isValidAfterSelection = await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(isValidAfterSelection).toBe(true)
		expect(wrapper.props('modelValue')).toEqual(['A'])
		expect(wrapper.text()).not.toContain('est requis')
	})

	it('should handle readonly and disabled states', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				modelValue: null,
				readonly: true,
				options: [{ label: 'X', value: 'X', id: 'opt-x' }],
			},
		})

		wrapper.findComponent(SyCheckbox).vm.$emit('update:modelValue', true)
		await nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		await wrapper.setProps({ readonly: false, disabled: true })
		wrapper.findComponent(SyCheckbox).vm.$emit('update:modelValue', true)
		await nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('should handle custom validation rules', async () => {
		const customRule = {
			type: 'custom',
			options: {
				validate: (value: unknown) => value === 'OK',
				message: 'Vous devez sélectionner une option.',
				fieldIdentifier: 'Custom CheckBoxGroup',
			},
		}

		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'required': true,
				'customRules': [customRule],
				'isValidateOnBlur': false,
				'options': [
					{ label: 'Non', value: 'NO', id: 'opt-no' },
					{ label: 'Oui', value: 'OK', id: 'opt-ok' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		const isValidInitial = await wrapper.vm.validateOnSubmit()
		expect(isValidInitial).toBe(false)
		// Vérifier que le message d'erreur de la règle required ou custom est affiché
		expect(wrapper.text()).toContain('requis') // Le message required par défaut

		await wrapper.setProps({ modelValue: 'OK' })

		const isValidCorrect = await wrapper.vm.validateOnSubmit()
		expect(isValidCorrect).toBe(true)
		// Vérifier que le message d'erreur n'est plus présent
		expect(wrapper.text()).not.toContain('requis')
	})

	it('should display asterisk when displayAsterisk is true and required', () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				label: 'Required Field',
				required: true,
				displayAsterisk: true,
				options: [{ label: 'X', value: 'X', id: 'opt-x' }],
			},
		})

		expect(wrapper.text()).toContain('Required Field *')
	})

	it('should not display asterisk when displayAsterisk is false', () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				label: 'Required Field',
				required: true,
				displayAsterisk: false,
				options: [{ label: 'X', value: 'X', id: 'opt-x' }],
			},
		})

		expect(wrapper.text()).not.toContain('Required Field *')
	})

	it('should handle external error messages', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				label: 'CheckBox Group',
				options: [{ label: 'X', value: 'X', id: 'opt-x' }],
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
				validate: (value: unknown) => {
					if (value !== 'A') {
						return 'Vous devez sélectionner l\'option A'
					}
					return true
				},
			},
		}

		const successRule: ValidationRule = {
			type: 'custom',
			options: {
				validate: (value: unknown) => value === 'A',
				successMessage: 'Option A sélectionnée',
			},
		}

		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'customWarningRules': [warningRule],
				'customSuccessRules': [successRule],
				'showSuccessMessages': true,
				'isValidateOnBlur': false,
				'options': [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
					{ label: 'Option B', value: 'B', id: 'opt-b' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		// Sélectionner B devrait afficher un warning
		await wrapper.setProps({ modelValue: 'B' })
		await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(wrapper.text()).toContain('Vous devez sélectionner l\'option A')

		// Sélectionner A devrait afficher un succès
		await wrapper.setProps({ modelValue: 'A' })
		await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(wrapper.text()).toContain('Option A sélectionnée')

		const isValid = await wrapper.vm.validateOnSubmit()
		expect(isValid).toBe(true)
	})

	it('should validate on selection change when isValidateOnBlur is false', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'required': true,
				'isValidateOnBlur': false,
				'options': [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
					{ label: 'Option B', value: 'B', id: 'opt-b' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		// Pas d'erreur au montage car pas de validation forcée
		await nextTick()

		// Sélectionner une option valide
		await wrapper.setProps({ modelValue: 'A' })
		await nextTick()

		const isValid = await wrapper.vm.validateOnSubmit()
		expect(isValid).toBe(true)
	})

	it('should handle useVuetifyValidation mode', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'required': true,
				'useVuetifyValidation': true,
				'rules': [(v: unknown) => !!v || 'Champ requis'],
				'options': [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		// Vérifier que la validation Vuetify est active
		await nextTick()
		const isValidInitial = await wrapper.vm.validateOnSubmit()
		expect(isValidInitial).toBe(false)
		expect(wrapper.text()).toContain('Champ requis')

		// Sélectionner une option
		await wrapper.setProps({ modelValue: 'A' })
		const isValidAfter = await wrapper.vm.validateOnSubmit()
		expect(isValidAfter).toBe(true)
	})

	it('should expose checkErrorOnBlur method', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				modelValue: null,
				required: true,
				isValidateOnBlur: true,
				options: [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
				],
			},
		})

		// Vérifier que la méthode est exposée
		expect(typeof wrapper.vm.checkErrorOnBlur).toBe('function')

		// Appeler la méthode (simule le blur)
		await wrapper.vm.checkErrorOnBlur()
		await nextTick()

		// Devrait afficher l'erreur car champ vide
		expect(wrapper.text()).toContain('requis')
	})
})
