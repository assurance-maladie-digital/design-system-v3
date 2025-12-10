import SyRadioGroup from '../SyRadioGroup.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

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
		expect(errorMessages[0].text()).toContain('Required Radio est requis')

		// Sélectionner l'option
		const radioX = wrapper.find('input[value="X"]')
		await radioX.setValue(true)
		await nextTick()

		// Valider à nouveau
		const isValidAfter = await wrapper.vm.validateOnSubmit()
		expect(isValidAfter).toBe(true)
		expect(wrapper.vm.modelValue).toBe('X')
	})

	it('should handle readonly and disabled states', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				modelValue: null,
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
		const customRule = {
			type: 'custom',
			validator: (value: string | null) => {
				console.log('validator value :' + value)
				return value === 'OK'
			},

			options: {
				message: 'Value must be OK',
				fieldIdentifier: 'Custom Radio',
			},
		}

		const wrapper = mount(SyRadioGroup, {
			props: {
				'modelValue': null,
				'customRules': [customRule],
				'isValidateOnBlur': false,
				'options': [
					{ label: 'Non', value: 'NO' },
					{ label: 'Oui', value: 'OK' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		// Trouver le radio "OK" dans le DOM du composant
		// const radioOk = wrapper.find('input[value="OK"]')
		// console.log(radioOk.html())

		// // Simuler le clic utilisateur
		// await radioOk.trigger('click')
		// await nextTick()
		// // Vérifier que l'événement v-model a été émis
		// console.log(wrapper.emitted())
		// expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		// expect(wrapper.emitted('update:modelValue')![0]).toEqual(['OK'])

		// // Validation après mise à jour
		// const isValidAfterCheck = await wrapper.vm.validateOnSubmit()
		// expect(isValidAfterCheck).toBe(true)

		// Vérifier l'état initial
		expect(wrapper.props('modelValue')).toBe(null)

		// Simuler la validation du formulaire
		const isValid = await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()

		// La validation devrait échouer car la case n'est pas cochée
		expect(isValid).toBe(false)

		// Cocher la case
		const test = await wrapper.setProps({ modelValue: 'OK' })
		console.log(test)

		// Simuler à nouveau la validation du formulaire
		const isValidAfterCheck = await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()
		console.log(isValidAfterCheck)
		// La validation devrait réussir maintenant
		expect(isValidAfterCheck).toBe(true)
	})
})
