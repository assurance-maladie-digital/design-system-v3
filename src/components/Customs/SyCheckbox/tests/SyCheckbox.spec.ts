import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick, ref, defineComponent } from 'vue'
import SyCheckbox from '../SyCheckbox.vue'
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from '@mdi/js'
import SyIcon from '../../SyIcon/SyIcon.vue'

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

	it('en mode simple avec `value`, coche émet true (et non la valeur)', async () => {
		// Vuetify replie trueValue sur value quand trueValue est undefined :
		// il ne faut pas transmettre value hors mode multiple, sinon l'émission
		// devient ['foo'] au lieu de [true].
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'value': 'foo',
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

	it('should update indeterminate state when prop changes', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				modelValue: false,
				indeterminate: false,
			},
		})
		const vCheckbox = () => wrapper.findComponent({ name: 'VCheckbox' })

		expect(vCheckbox().props('indeterminate')).toBe(false)

		await wrapper.setProps({ indeterminate: true })
		await nextTick()

		expect(vCheckbox().props('indeterminate')).toBe(true)

		await wrapper.setProps({
			modelValue: true,
			indeterminate: false,
		})
		await nextTick()

		expect(vCheckbox().props('indeterminate')).toBe(false)
		expect(vCheckbox().props('modelValue')).toBe(true)
	})

	it('should toggle between states correctly', async () => {
		// Monter le composant avec des handlers pour les événements
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'cycleIndeterminate': true,
				'onUpdate:modelValue': (e: boolean) => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': (e: boolean) => wrapper.setProps({ indeterminate: e }),
			},
		})

		// État initial: non coché
		expect(wrapper.props('modelValue')).toBe(false)

		// Premier toggle: passe à indéterminé
		await wrapper.vm.toggleMixed()
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([true])
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		// Simuler la mise à jour des props par le parent
		await wrapper.setProps({
			indeterminate: false,
			modelValue: true,
		})

		// Deuxième toggle: passe à non coché
		await wrapper.vm.toggleMixed()
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

		// Simuler un état partiel réel depuis les enfants
		await wrapper.setProps({
			indeterminate: true,
			modelValue: false,
		})

		// Troisième toggle: un état partiel activé passe à coché
		await wrapper.vm.toggleMixed()
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[1]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([true])
	})

	it('should keep controlled parent binary with Space key when children are not partial', async () => {
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

	it('should include mixed in controlled parent rotation with Space key when cycleIndeterminate is true', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': false,
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
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('input[type="checkbox"]').setValue(true)
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('should keep controlled parent binary with click when children are not partial', async () => {
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

	it('should include mixed in controlled parent rotation with click when cycleIndeterminate is true', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': false,
				'indeterminate': false,
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
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		await wrapper.find('input[type="checkbox"]').setValue(true)
		await nextTick()

		expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([false])
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('should not cycle controlled tri-state checkbox when readonly or disabled', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				modelValue: false,
				cycleIndeterminate: true,
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

	it('should keep standard checkbox binary without cycleIndeterminate', async () => {
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

	it('cycleIndeterminate est ignoré en mode multiple (pas de booléen injecté)', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				'modelValue': [] as string[],
				'value': 'a',
				'cycleIndeterminate': true,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'onUpdate:indeterminate': e => wrapper.setProps({ indeterminate: e }),
			},
		})

		// 1er clic : ajoute la valeur au tableau (comportement normal), n'émet pas de booléen
		await wrapper.find('input[type="checkbox"]').setValue(true)
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])
		expect(wrapper.emitted('update:indeterminate')).toBeFalsy()

		// 2e clic : retire la valeur
		await wrapper.find('input[type="checkbox"]').setValue(false)
		await nextTick()

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]])
		expect(wrapper.emitted('update:modelValue')?.some(e => e[0] === true)).toBe(false)
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

	it('displays the helpText when no validation message is present', () => {
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

	it('hides the helpText and displays the error when validation fails', async () => {
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

	it('does not display an error when required and unchecked if disableErrorHandling is enabled', async () => {
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

	it('displays a warning message from customWarningRules', async () => {
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

	it('displays a success message from customSuccessRules with showSuccessMessages true', async () => {
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

	it('displays external messages (errorMessages + hasError)', () => {
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

	describe('multiple mode', () => {
		it('adds the value to the array when checked', async () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					'modelValue': [] as string[],
					'value': 'identity',
					'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				},
			})

			await wrapper.find('input[type="checkbox"]').setValue(true)
			await nextTick()

			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['identity']])
			expect(wrapper.props('modelValue')).toEqual(['identity'])
		})

		it('removes the value from the array when unchecked', async () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					'modelValue': ['identity', 'nir'] as string[],
					'value': 'identity',
					'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				},
			})

			await wrapper.find('input[type="checkbox"]').setValue(false)
			await nextTick()

			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['nir']])
			expect(wrapper.props('modelValue')).toEqual(['nir'])
		})

		it('passes `value` and `multiple` to the child VCheckbox`', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: ['identity'],
					value: 'identity',
					multiple: true,
				},
			})
			const vCheckbox = wrapper.findComponent({ name: 'VCheckbox' })

			expect(vCheckbox.props('value')).toBe('identity')
			expect(vCheckbox.props('multiple')).toBe(true)
		})

		it('checks the checkbox when it\'s value is present in the array', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: ['identity', 'nir'],
					value: 'nir',
				},
			})

			expect((wrapper.find('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(true)
		})

		it('unchecks the checkbox when value is absent from the array', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: ['identity'],
					value: 'nir',
				},
			})

			expect((wrapper.find('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)
		})

		it('sets aria-checked="true" when value is present in the array', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: ['identity'],
					value: 'identity',
				},
			})

			expect(wrapper.find('input[type="checkbox"]').attributes('aria-checked')).toBe('true')
		})

		it('sets aria-checked="false" when value is absent from the array', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: ['nir'],
					value: 'identity',
				},
			})

			expect(wrapper.find('input[type="checkbox"]').attributes('aria-checked')).toBe('false')
		})

		// aria-checked étant forcé à la main, il doit rester cohérent avec le état
		// natif du input. La règle isMultiple doit suivre celle de Vuetify
		// (!!multiple || multiple == null && Array.isArray(...)).
		it('garde aria-checked cohérent avec input.checked en mode booléen', () => {
			const cases = [
				{ modelValue: true, expected: 'true' },
				{ modelValue: false, expected: 'false' },
			]
			for (const { modelValue, expected } of cases) {
				const wrapper = mount(SyCheckbox, { props: { modelValue, multiple: false } })
				const input = wrapper.find('input[type="checkbox"]')
				expect(input.attributes('aria-checked')).toBe(expected)
				expect((input.element as HTMLInputElement).checked).toBe(expected === 'true')
			}
		})

		it('garde aria-checked cohérent avec input.checked en mode tableau', () => {
			const cases = [
				{ modelValue: ['identity'], expected: 'true' },
				{ modelValue: ['nir'], expected: 'false' },
			]
			for (const { modelValue, expected } of cases) {
				const wrapper = mount(SyCheckbox, { props: { modelValue, value: 'identity' } })
				const input = wrapper.find('input[type="checkbox"]')
				expect(input.attributes('aria-checked')).toBe(expected)
				expect((input.element as HTMLInputElement).checked).toBe(expected === 'true')
			}
		})

		it('allows two checkboxes to share the same array', async () => {
			const shared = ref<string[]>([])
			const Parent = defineComponent({
				components: { SyCheckbox },
				setup() {
					return { shared }
				},
				template: `
					<div>
						<SyCheckbox v-model="shared" value="identity" label="Identité" />
						<SyCheckbox v-model="shared" value="nir" label="NIR" />
					</div>
				`,
			})
			const wrapper = mount(Parent)
			const inputs = wrapper.findAll('input[type="checkbox"]')

			await inputs[0]!.setValue(true)
			await inputs[1]!.setValue(true)
			await nextTick()

			expect(shared.value).toEqual(['identity', 'nir'])

			await inputs[0]!.setValue(false)
			await nextTick()

			expect(shared.value).toEqual(['nir'])
		})

		it('reset() émet un tableau vide (et non false) en mode multiple', async () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					'modelValue': ['identity', 'nir'] as string[],
					'value': 'identity',
					'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				},
			})

			;(wrapper.vm as unknown as { reset: () => void }).reset()
			await nextTick()

			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			expect(emitted!.at(-1)).toEqual([[]])
		})

		it('reset() émet false en mode booléen', async () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					'modelValue': true,
					'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				},
			})

			;(wrapper.vm as unknown as { reset: () => void }).reset()
			await nextTick()

			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			expect(emitted!.at(-1)).toEqual([false])
		})
	})

	describe('rendu décoratif (decorative)', () => {
		const iconOf = (wrapper: ReturnType<typeof mount>) =>
			wrapper.findComponent(SyIcon).props('icon')

		it('rend une case cochée quand la valeur est présente dans le tableau', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: ['a'],
					value: 'a',
					decorative: true,
				},
			})

			expect(iconOf(wrapper)).toBe(mdiCheckboxMarked)
		})

		it('rend une case vide quand le tableau ne contient pas la valeur', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: ['b'],
					value: 'a',
					decorative: true,
				},
			})

			expect(iconOf(wrapper)).toBe(mdiCheckboxBlankOutline)
		})

		it('rend une case vide pour un tableau vide (même si truthy)', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: [] as string[],
					value: 'a',
					decorative: true,
				},
			})

			expect(iconOf(wrapper)).toBe(mdiCheckboxBlankOutline)
		})

		it('rend une case cochée en mode booléen true', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: true,
					decorative: true,
				},
			})

			expect(iconOf(wrapper)).toBe(mdiCheckboxMarked)
		})

		it('rend une case vide en mode booléen false', () => {
			const wrapper = mount(SyCheckbox, {
				props: {
					modelValue: false,
					decorative: true,
				},
			})

			expect(iconOf(wrapper)).toBe(mdiCheckboxBlankOutline)
		})
	})
})
