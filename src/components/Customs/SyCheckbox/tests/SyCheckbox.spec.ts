import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import SyCheckbox from '../SyCheckbox.vue'

describe('SyCheckbox', () => {
	it('should render correctly', () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'Test checkbox',
			},
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
		})

		await wrapper.find('input[type="checkbox"]').setValue(true)
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('should handle indeterminate state correctly', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		// Vérifier que l'état indéterminé est actif
		expect(wrapper.props('indeterminate')).toBe(true)

		// Cocher la case devrait changer l'état indéterminé à checked
		await wrapper.find('input[type="checkbox"]').setValue(true)
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
		})

		// État initial: non coché
		expect(wrapper.props('modelValue')).toBe(false)

		// Premier toggle: passe à coché
		await wrapper.vm.toggleMixed()
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()

		// Simuler la mise à jour des props par le parent
		await wrapper.setProps({
			indeterminate: false,
			modelValue: true,
		})

		// Deuxième toggle: passe à non coché
		await wrapper.vm.toggleMixed()
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])

		// Simuler un état partiel réel depuis les enfants
		await wrapper.setProps({
			indeterminate: true,
			modelValue: false,
		})

		// Troisième toggle: un état partiel activé passe à coché
		await wrapper.vm.toggleMixed()
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([true])
	})

	it('should keep controlled parent binary with Space key when children are not partial', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': false,
				'controlsIds': ['child-1', 'child-2'],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('.v-checkbox').trigger('keydown', { key: ' ' })
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()

		await wrapper.find('.v-checkbox').trigger('keydown', { key: ' ' })
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()
	})

	it('should include mixed in controlled parent rotation with Space key when cycleIndeterminate is true', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': false,
				'controlsIds': ['child-1', 'child-2'],
				'cycleIndeterminate': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('.v-checkbox').trigger('keydown', { key: ' ' })
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([true])
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		await wrapper.find('.v-checkbox').trigger('keydown', { key: ' ' })
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[1]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])

		await wrapper.find('.v-checkbox').trigger('keydown', { key: ' ' })
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
	})

	it('should turn real mixed controlled parent into checked with Space key', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': true,
				'controlsIds': ['child-1', 'child-2'],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('.v-checkbox').trigger('keydown', { key: ' ' })
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('should keep controlled parent binary with click when children are not partial', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': false,
				'controlsIds': ['child-1', 'child-2'],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('.v-checkbox').trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()

		await wrapper.find('.v-checkbox').trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()
	})

	it('should include mixed in controlled parent rotation with click when cycleIndeterminate is true', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': false,
				'controlsIds': ['child-1', 'child-2'],
				'cycleIndeterminate': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('.v-checkbox').trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([true])
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		await wrapper.find('.v-checkbox').trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[1]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])

		await wrapper.find('.v-checkbox').trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
	})

	it('should turn real mixed controlled parent into checked with click', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': true,
				'controlsIds': ['child-1', 'child-2'],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('.v-checkbox').trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('should not cycle controlled tri-state checkbox when readonly or disabled', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				modelValue: false,
				controlsIds: ['child-1', 'child-2'],
				readonly: true,
			},
		})

		await wrapper.find('.v-checkbox').trigger('keydown', { key: ' ' })
		await wrapper.find('.v-checkbox').trigger('click')

		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		await wrapper.setProps({ readonly: false, disabled: true })

		await wrapper.find('.v-checkbox').trigger('keydown', { key: ' ' })
		await wrapper.find('.v-checkbox').trigger('click')

		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('should keep standard checkbox binary without controlsIds', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': false,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('input[type="checkbox"]').setValue(true)
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()

		await wrapper.find('input[type="checkbox"]').setValue(false)
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()
	})

	it('should handle validation correctly', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'label': 'Required checkbox',
				'required': true,
				'isValidateOnBlur': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		const input = wrapper.find('input[type="checkbox"]')

		// Simuler un evenement blur pour déclencher la validation
		await input.trigger('focus')
		await input.trigger('blur')
		await nextTick()

		// Vérifier que le message d'erreur est affiché
		expect(wrapper.find('.v-messages').exists()).toBe(true)
		expect(wrapper.find('.v-messages').text()).toContain('Required checkbox est requis')
	})

	it('should handle custom validation rules', async () => {
		// Créer une règle de validation au format attendu par le composant
		const customRule = {
			type: 'custom',
			options: {
				validate: (value: boolean) => value === true,
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
		})

		// Cliquer sur une case à cocher en lecture seule ne devrait pas changer sa valeur
		await wrapper.find('.v-checkbox').trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		// Tester l'état désactivé
		await wrapper.setProps({ readonly: false, disabled: true })
		await wrapper.find('.v-checkbox').trigger('click')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('affiche le helpText quand aucun message de validation n\'est présent', () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'CGU',
				helpText: 'Texte d\'aide',
			},
		})

		const help = wrapper.find('.help-text-below')
		expect(help.exists()).toBe(true)
		expect(help.text()).toContain('Texte d\'aide')
	})

	it('masque le helpText et affiche l\'erreur quand la validation échoue', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'CGU',
				helpText: 'Texte d\'aide',
				required: true,
				modelValue: false,
			},
		})

		await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(wrapper.find('.help-text-below').exists()).toBe(false)
		expect(wrapper.find('.v-messages').text()).toContain('CGU est requis')
	})

	it('disableErrorHandling : aucune erreur affichée même si requis et décoché', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'CGU',
				required: true,
				disableErrorHandling: true,
				modelValue: false,
			},
		})

		const isValid = await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(isValid).toBe(true)
		expect(wrapper.find('.error-field').exists()).toBe(false)
		expect(wrapper.find('.v-messages__message').exists()).toBe(false)
	})

	it('affiche un message d\'avertissement via customWarningRules', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'CGU',
				modelValue: false,
				customWarningRules: [{
					type: 'custom',
					options: {
						validate: (value: boolean) => value === true,
						warningMessage: 'Avertissement de test',
					},
				}],
			},
		})

		await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(wrapper.find('.warning-field').exists()).toBe(true)
		expect(wrapper.find('.v-messages').text()).toContain('Avertissement de test')
	})

	it('affiche un message de succès via customSuccessRules et showSuccessMessages', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'CGU',
				modelValue: true,
				showSuccessMessages: true,
				customSuccessRules: [{
					type: 'custom',
					options: {
						validate: (value: boolean) => value === true,
						successMessage: 'Succès de test',
					},
				}],
			},
		})

		await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(wrapper.find('.success-field').exists()).toBe(true)
		expect(wrapper.find('.v-messages').text()).toContain('Succès de test')
	})

	it('affiche les messages externes (errorMessages + hasError)', () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'CGU',
				hasError: true,
				errorMessages: ['Erreur externe'],
			},
		})

		expect(wrapper.find('.error-field').exists()).toBe(true)
		expect(wrapper.find('.v-messages').text()).toContain('Erreur externe')
	})
})
