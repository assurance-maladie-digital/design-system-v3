import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import SyCheckbox from '../SyCheckbox.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

describe('SyCheckbox', () => {
	// Configuration de Vuetify pour les tests
	const vuetify = createVuetify({
		components,
		directives,
	})

	const global = {
		plugins: [vuetify],
	}

	it('should render correctly', () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'Test checkbox',
			},
			global,
		})

		expect(wrapper.find('.v-checkbox').exists()).toBe(true)
		expect(wrapper.text()).toContain('Test checkbox')
	})

	it('should handle v-model correctly', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
			global,
		})

		await wrapper.find('input[type="checkbox"]').setValue(true)
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
		expect(wrapper.emitted('change')?.[0]).toEqual([true])
	})

	it('should handle indeterminate state correctly', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
			global,
		})

		// Vérifier que l'état indéterminé est actif
		expect(wrapper.props('indeterminate')).toBe(true)

		// Cliquer sur la case à cocher devrait changer l'état indéterminé à checked
		await wrapper.find('.v-selection-control').trigger('click')
		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('should toggle between states correctly', async () => {
		// Monter le composant avec des handlers pour les événements
		const wrapper = mount(SyCheckbox, {
			props: {
				modelValue: false,
				controlsIds: ['child-1', 'child-2'],
			},
			global,
		})

		// État initial: non coché
		expect(wrapper.props('modelValue')).toBe(false)

		// Premier toggle: passe à indéterminé (car controlsIds est défini)
		await wrapper.vm.toggleMixed()
		await nextTick()

		// Vérifier que l'événement update:indeterminate a été émis
		const indeterminateEvents = wrapper.emitted('update:indeterminate')
		expect(indeterminateEvents).toBeTruthy()
		expect(indeterminateEvents && indeterminateEvents[0]).toEqual([true])

		// Simuler la mise à jour des props par le parent
		await wrapper.setProps({
			indeterminate: true,
			modelValue: false,
		})

		// Deuxième toggle: passe à coché
		await wrapper.vm.toggleMixed()
		await nextTick()

		// Vérifier que les événements ont été émis
		const updatedIndeterminateEvents = wrapper.emitted('update:indeterminate')
		const modelValueEvents = wrapper.emitted('update:modelValue')
		expect(updatedIndeterminateEvents && updatedIndeterminateEvents[1]).toEqual([false])
		expect(modelValueEvents).toBeTruthy()
		expect(modelValueEvents && modelValueEvents[0]).toEqual([true])

		// Simuler la mise à jour des props par le parent
		await wrapper.setProps({
			indeterminate: false,
			modelValue: true,
		})

		// Troisième toggle: passe à non coché
		await wrapper.vm.toggleMixed()
		await nextTick()

		// Vérifier que l'événement update:modelValue a été émis avec false
		const finalModelValueEvents = wrapper.emitted('update:modelValue')
		expect(finalModelValueEvents && finalModelValueEvents[1]).toEqual([false])
	})

	it('should handle validation correctly', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'label': 'Required checkbox',
				'required': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
			global,
		})

		// Simuler un événement blur pour déclencher la validation
		await wrapper.find('.v-checkbox').trigger('blur')

		// Vérifier que le message d'erreur est affiché
		expect(wrapper.find('.v-messages').exists()).toBe(true)
		expect(wrapper.find('.v-messages').text()).toContain('Required checkbox est requis')
	})

	it('should handle custom validation rules', async () => {
		// Créer une règle de validation au format attendu par le composant
		const customRule = {
			type: 'custom',
			validator: (value: boolean) => value === true,
			options: {
				message: 'This checkbox must be checked',
				fieldIdentifier: 'Custom checkbox',
			},
		}

		// Monter le composant avec la règle de validation personnalisée
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'customRules': [customRule],
				'isValidateOnBlur': false, // Valider immédiatement
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
			global,
		})

		// Vérifier l'état initial
		expect(wrapper.props('modelValue')).toBe(false)

		// Simuler la validation du formulaire
		const isValid = await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()

		// La validation devrait échouer car la case n'est pas cochée
		expect(isValid).toBe(false)

		// Cocher la case
		await wrapper.setProps({ modelValue: true })

		// Simuler à nouveau la validation du formulaire
		const isValidAfterCheck = await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()

		// La validation devrait réussir maintenant
		expect(isValidAfterCheck).toBe(true)
	})

	it('should handle readonly and disabled states', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'readonly': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
			global,
		})

		// Cliquer sur une case à cocher en lecture seule ne devrait pas changer sa valeur
		await wrapper.find('.v-checkbox').trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		// Tester l'état désactivé
		await wrapper.setProps({ readonly: false, disabled: true })
		await wrapper.find('.v-checkbox').trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})
})
