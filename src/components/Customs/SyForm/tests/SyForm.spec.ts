import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import NirField from '@/components/NirField/NirField.vue'
import { VTextField } from 'vuetify/components/VTextField'
import { defineComponent, h, nextTick, type InstanceType } from 'vue'
import { useValidatable } from '@/composables/validation/useValidatable'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'

describe('SyForm', () => {
	it('modelValue should reflect validity of the form', async () => {
		const TestWrapper = {
			components: { SyForm, SyTextField, NirField },
			template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextField v-model="text" required label="Nom" />
						<NirField v-model="nir" required />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					nir: '',
					formValide: null as boolean | null,
				}
			},
		}

		const wrapper = mount(TestWrapper)
		expect(wrapper.vm.formValide).toBeNull()

		// Champs invalides
		const numberFieldNir = wrapper.findComponent(NirField).find('input')
		const keyFieldNir = wrapper.findComponent(NirField).findAll('input')![1]!
		await numberFieldNir.trigger('focus')
		await numberFieldNir.setValue('123')
		await numberFieldNir.trigger('blur')

		await flushPromises()
		await nextTick()
		expect(wrapper.vm.formValide).toBe(false)

		// Champs valides
		await numberFieldNir.trigger('focus')
		await numberFieldNir.setValue('1800671234567')
		await numberFieldNir.trigger('blur')

		await keyFieldNir.trigger('focus')
		await keyFieldNir.setValue('08')
		await keyFieldNir.trigger('blur')
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.trigger('focus')
		await textFieldInput.setValue('John Doe')
		await textFieldInput.trigger('blur')

		await flushPromises()
		expect(wrapper.vm.formValide).toBe(true)
	})

	it('should trigger the validation on submit', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<SyTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: false }))
		expect(wrapper.vm.formValide).toBe(false)
	})

	it('handle valid form submission', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<SyTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.trigger('focus')
		await textFieldInput.setValue('John Doe')
		await textFieldInput.trigger('blur')

		await flushPromises()
		expect(wrapper.vm.formValide).toBe(true)

		// Soumettre le formulaire avec des champs valides
		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: true }))
	})

	it('handle form with custom validation rules', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<SyTextField v-model="text" required label="Nom" :customRules="customRules" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => value === 'valid',
								message: 'Le champ doit être "valid"',
							},
						},
					],
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.setValue('invalid')

		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: false }))
	})

	it('handle form with custom validation rules - valid case', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<SyTextField v-model="text" required label="Nom" :customRules="customRules" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => value === 'valid',
								message: 'Le champ doit être "valid"',
							},
						},
					],
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.setValue('valid')

		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: true }))
	})

	it('return an invalid form when a field is invalid and an other is valid', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<SyTextField v-model="text" required label="Nom" :customRules="customRules" />
						<SyTextField v-model="text2" required label="Prénom" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					text2: '',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => value === 'valid',
								message: 'Le champ doit être "valid"',
							},
						},
					],
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput1 = wrapper.findAllComponents(SyTextField)[0]!.find('input')
		const textFieldInput2 = wrapper.findAllComponents(SyTextField)[1]!.find('input')

		await textFieldInput1.setValue('valid')
		await textFieldInput2.setValue('')

		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: false }))
		expect(wrapper.vm.formValide).toBe(false)
	})

	it('handle form with a Vuetify field and a custom field', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, VTextField, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<VTextField v-model="text" required label="Nom" />
						<SyTextField v-model="text2" required label="Prénom" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					text2: '',
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput1 = wrapper.findComponent(VTextField).find('input')
		const textFieldInput2 = wrapper.findComponent(SyTextField).find('input')

		await textFieldInput1.setValue('John')
		await textFieldInput2.setValue('Doe')

		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: true }))
		expect(wrapper.vm.formValide).toBe(true)
	})

	it('handle form with a Vuetify field valid and a custom field invalid', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, VTextField, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<VTextField v-model="text" required label="Nom" :rules="vuetifyRules" />
						<SyTextField v-model="text2" required label="Prénom" :customRules="customRules" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					text2: '',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => value === 'John',
								message: 'Le nom doit être "John"',
							},
						},
					],
					vuetifyRules: [
						(value: string) => value === 'John' || 'Le nom doit être "John"',
					],
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput1 = wrapper.findComponent(VTextField).find('input')
		const textFieldInput2 = wrapper.findComponent(SyTextField).find('input')

		await textFieldInput1.trigger('focus')
		await textFieldInput1.setValue('John')
		await textFieldInput1.trigger('blur')

		await textFieldInput2.trigger('focus')
		await textFieldInput2.setValue('Mike')
		await textFieldInput2.trigger('blur')

		expect(wrapper.vm.formValide).toBe(false)
	})

	it('handle form with a Vuetify field invalid and a custom field valid', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, VTextField, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<VTextField v-model="text" required label="Nom" :rules="vuetifyRules" />
						<SyTextField v-model="text2" required label="Prénom" :customRules="customRules" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					text2: '',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: (value: string) => value === 'Doe',
								message: 'Le prénom doit être "Doe"',
							},
						},
					],
					vuetifyRules: [
						(value: string) => value === 'John' || 'Le nom doit être "John"',
					],
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput1 = wrapper.findComponent(VTextField).find('input')
		const textFieldInput2 = wrapper.findComponent(SyTextField).find('input')

		await textFieldInput1.trigger('focus')
		await textFieldInput1.setValue('Mike')
		await textFieldInput1.trigger('blur')

		await textFieldInput2.trigger('focus')
		await textFieldInput2.setValue('Doe')
		await textFieldInput2.trigger('blur')

		expect(wrapper.vm.formValide).toBe(false)
	})

	it('handle form with async validation rules', async () => {
		vi.useFakeTimers()
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<SyTextField v-model="text" required label="Nom" :customRules="customRules" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: async (value: string) => {
									await new Promise(resolve => setTimeout(resolve, 100))
									return value === 'valid'
								},
								message: 'Le champ doit être "valid"',
							},
						},
					],
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.setValue('valid')

		await wrapper.find('form').trigger('submit.prevent')
		expect(submitHandler).not.toHaveBeenCalled()
		vi.advanceTimersByTime(100)
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: true }))
		expect(wrapper.vm.formValide).toBe(true)
	})

	it('handle form with async validation rules - invalid case', async () => {
		vi.useFakeTimers()
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<SyTextField v-model="text" required label="Nom" :customRules="customRules" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: async (value: string) => {
									await new Promise(resolve => setTimeout(resolve, 100))
									return value === 'valid'
								},
								message: 'Le champ doit être "valid"',
							},
						},
					],
					formValide: null as boolean | null,
				}
			},
			methods: {
				submitHandler,
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.setValue('invalid')

		await wrapper.find('form').trigger('submit.prevent')
		expect(submitHandler).not.toHaveBeenCalled()
		vi.advanceTimersByTime(100)
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: false }))
		expect(wrapper.vm.formValide).toBe(false)
	})

	it('reset() returns a live-validated required field to a neutral (pristine) state, not invalid', async () => {
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextField v-model="text" required label="Nom" :is-validate-on-blur="false" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					formValide: null as boolean | null,
				}
			},
		}

		const wrapper = mount(TestWrapper)
		await flushPromises()

		// Saisie d'une valeur valide → validation live → formulaire valide
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.setValue('John Doe')
		await flushPromises()
		expect(wrapper.vm.formValide).toBe(true)

		// Reset via la méthode exposée (équivalent d'un bouton type="reset")
		;(wrapper.vm.$refs.form as InstanceType<typeof SyForm>).reset()
		await flushPromises()
		await nextTick()
		await flushPromises()

		// Le reset doit ramener le champ à un état neutre/vierge, pas le ré-invalider :
		// comme un champ Vuetify qui ne remonte aucune erreur, le formulaire redevient valide.
		expect(wrapper.vm.formValide).toBe(true)
		expect(wrapper.findComponent(SyTextField).text()).not.toContain('Le champ est obligatoire')
	})

	// Contrat de compatibilité avec les composants non migrés (« legacy ») :
	// ceux enregistrés via useValidatable() sans fournir d'état réactif `valide`
	// (ex. les DatePickers) exposent `valide === undefined`. Comportement aligné
	// sur Vuetify : un champ qui ne remonte pas d'erreur réactive est considéré
	// valide par défaut, y compris après une soumission (validateOnSubmit() n'écrit
	// pas dans `valide`).
	//
	// Ces tests VERROUILLENT ce comportement : s'ils changent (ex. migration des
	// DatePickers vers le tri-état), c'est un choix volontaire à acter ici.
	const LegacyField = defineComponent({
		name: 'LegacyField',
		props: { valid: { type: Boolean, default: true } },
		setup(props) {
			// Legacy : n'expose que validateOnSubmit, aucun état réactif `valide`.
			useValidatable(() => props.valid)
			return () => h('div', { class: 'legacy-field' }, 'legacy')
		},
	})

	it('publishes a valid result after submitting a legacy field without reactive `valide`', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, LegacyField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<LegacyField :valid="true" />
					</SyForm>
				`,
			data() {
				return { formValide: null as boolean | null }
			},
			methods: { submitHandler },
		}

		const wrapper = mount(TestWrapper)
		await flushPromises()

		// Un champ sans `valide` réactif ne remonte pas d'erreur → considéré valide
		expect(wrapper.vm.formValide).toBe(true)

		// La soumission fonctionne malgré tout (via validateOnSubmit)
		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: true }))
		expect(wrapper.vm.formValide).toBe(true)

		wrapper.unmount()
	})

	it('publishes an invalid submit event for an invalid legacy field without flipping the v-model', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, LegacyField },
			template: `
					<SyForm v-model="formValide" ref="form" @submit="submitHandler">
						<LegacyField :valid="false" />
					</SyForm>
				`,
			data() {
				return { formValide: null as boolean | null }
			},
			methods: { submitHandler },
		}

		const wrapper = mount(TestWrapper)
		await flushPromises()

		// Pas d'état réactif → considéré valide, comme un champ Vuetify jamais validé
		expect(wrapper.vm.formValide).toBe(true)

		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		// Le verdict de soumission est correct (validateOnSubmit() est bien appelé)…
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: false }))
		// …mais comme le champ legacy n'écrit jamais dans un état `valide` réactif,
		// le v-model du formulaire ne reflète pas ce verdict (contrat volontaire).
		expect(wrapper.vm.formValide).toBe(true)

		wrapper.unmount()
	})

	it('a legacy field without reactive `valide` does not block the v-model from becoming true', async () => {
		const TestWrapper = {
			components: { SyForm, SyTextField, LegacyField },
			template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextField v-model="text" required label="Nom" />
						<LegacyField :valid="true" />
					</SyForm>
				`,
			data() {
				return { text: '', formValide: null as boolean | null }
			},
		}

		const wrapper = mount(TestWrapper)
		await flushPromises()

		// Le champ migré devient valide…
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.trigger('focus')
		await textFieldInput.setValue('John Doe')
		await textFieldInput.trigger('blur')
		await flushPromises()

		// …et le champ legacy, n'ayant jamais remonté d'erreur, ne bloque pas le formulaire
		expect(wrapper.vm.formValide).toBe(true)

		wrapper.unmount()
	})

	describe('Integration with DatePicker (legacy fields)', () => {
		it('SyForm.clearValidation() clears validation errors for DatePicker in Calendar mode', async () => {
			const wrapper = mount({
				components: { SyForm, DatePicker },
				template: `
					<SyForm ref="form">
						<DatePicker v-model="date" label="Date" required />
					</SyForm>
				`,
				data() { return { date: null } },
				global: {
					stubs: {
						VDatePicker: { template: '<div class="v-date-picker-mock"></div>' },
						VMenu: { template: '<div class="v-menu-mock"><slot name="activator"></slot><slot></slot></div>' },
					},
				},
			})

			const formRef = wrapper.vm.$refs.form as InstanceType<typeof SyForm>

			// Trigger form validation (should fail because required but null)
			await wrapper.find('form').trigger('submit.prevent')
			await flushPromises()

			// Verify error messages are displayed in the DOM
			const errorMessagesBefore = wrapper.findAll('.v-messages__message')
			expect(errorMessagesBefore.length).toBeGreaterThan(0)

			// Clear validation via SyForm
			formRef.clearValidation()
			await nextTick()

			// Verify errors are cleared (no error messages in DOM)
			const errorMessagesAfter = wrapper.findAll('.v-messages__message')
			expect(errorMessagesAfter.length).toBe(0)

			wrapper.unmount()
		})

		it('passe le v-model à true au submit quand un DatePicker optionnel est vide', async () => {
			const wrapper = mount({
				components: { SyForm, DatePicker },
				template: `
					<SyForm v-model="isValid">
						<DatePicker v-model="date" label="Date de naissance" format="DD/MM/YYYY" />
					</SyForm>
				`,
				data: () => ({ isValid: null as boolean | null, date: '' }),
				global: {
					stubs: {
						VDatePicker: { template: '<div class="v-date-picker-mock"></div>' },
						VMenu: { template: '<div class="v-menu-mock"><slot name="activator"></slot><slot></slot></div>' },
					},
				},
			})

			await wrapper.find('form').trigger('submit')
			await flushPromises()

			expect(wrapper.vm.isValid).toBe(true)

			wrapper.unmount()
		})

		it('SyForm.reset() resets DatePicker in Calendar mode', async () => {
			const wrapper = mount({
				components: { SyForm, DatePicker },
				template: `
					<SyForm>
						<DatePicker v-model="date" label="Date" required />
						<button type="reset">Reset</button>
					</SyForm>
				`,
				data() { return { date: null } },
				global: {
					stubs: {
						VDatePicker: { template: '<div class="v-date-picker-mock"></div>' },
						VMenu: { template: '<div class="v-menu-mock"><slot name="activator"></slot><slot></slot></div>' },
					},
				},
			})

			// Set a date value (using DD/MM/YYYY format to match DatePicker default)
			await wrapper.setData({ date: '23/09/2026' })
			await nextTick()

			// Trigger validation (should pass)
			await wrapper.find('form').trigger('submit.prevent')
			await flushPromises()

			// Verify no errors
			const errorMessagesBefore = wrapper.findAll('.v-messages__message')
			expect(errorMessagesBefore.length).toBe(0)

			// Reset form
			await wrapper.find('button[type="reset"]').trigger('click')
			await flushPromises()

			// Verify DatePicker is reset (v-model is null)
			expect(wrapper.vm.date).toBeNull()
			// Verify no error messages are displayed
			const errorMessagesAfter = wrapper.findAll('.v-messages__message')
			expect(errorMessagesAfter.length).toBe(0)

			wrapper.unmount()
		})
	})

	describe('Initial v-model validation', () => {
		it('sets null when a pristine custom field is initially invalid', async () => {
			const TestWrapper = {
				components: { SyForm, SyTextField },
				template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
				data() {
					return {
						text: '',
						formValide: null as boolean | null,
					}
				},
			}

			const wrapper = mount(TestWrapper)
			await flushPromises()

			// Le formulaire connaît la validité initiale, sans afficher l'erreur du champ pristine.
			expect(wrapper.vm.formValide).toBeNull()
		})

		it('defers to vFormStatus when form has only Vuetify fields', async () => {
			const TestWrapper = {
				components: { SyForm, VTextField },
				template: `
					<SyForm v-model="formValide" ref="form">
						<VTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
				data() {
					return {
						text: '',
						formValide: null as boolean | null,
					}
				},
			}

			const wrapper = mount(TestWrapper)
			await flushPromises()

			// Aucun champ custom → défère à vFormStatus (VForm retourne true pour un formulaire pristine)
			// Le changement du commit : avant on aurait forcé true par vacuité, maintenant on utilise vFormStatus
			expect(wrapper.vm.formValide).toBe(true)
		})

		it('initializes v-model immediately on mount with immediate watch', async () => {
			const TestWrapper = {
				components: { SyForm, VTextField },
				template: `
					<SyForm v-model="formValide" ref="form">
						<VTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
				data() {
					return {
						text: '',
						formValide: null as boolean | null,
					}
				},
			}

			const wrapper = mount(TestWrapper)
			await flushPromises()

			// Le watch a { immediate: true }, donc le v-model est initialisé immédiatement
			// Avec des champs Vuetify seulement, vFormStatus est true par défaut
			expect(wrapper.vm.formValide).toBe(true)
		})

		it('defers to vFormStatus for multiple Vuetify fields when pristine', async () => {
			const TestWrapper = {
				components: { SyForm, VTextField },
				template: `
					<SyForm v-model="formValide" ref="form">
						<VTextField v-model="text1" required label="Nom" />
						<VTextField v-model="text2" required label="Prénom" />
					</SyForm>
				`,
				data() {
					return {
						text1: '',
						text2: '',
						formValide: null as boolean | null,
					}
				},
			}

			const wrapper = mount(TestWrapper)
			await flushPromises()

			// Aucun champ custom enregistré → v-model défère à vFormStatus (true pour VForm pristine)
			expect(wrapper.vm.formValide).toBe(true)
		})

		it('reports null when form has pristine invalid custom fields', async () => {
			const TestWrapper = {
				components: { SyForm, SyTextField },
				template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
				data() {
					return {
						text: '',
						formValide: null as boolean | null,
					}
				},
			}

			const wrapper = mount(TestWrapper)
			await flushPromises()

			expect(wrapper.vm.formValide).toBeNull()
		})

		it('transitions from null to true when all custom fields become valid', async () => {
			const TestWrapper = {
				components: { SyForm, SyTextField },
				template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
				data() {
					return {
						text: '',
						formValide: null as boolean | null,
					}
				},
			}

			const wrapper = mount(TestWrapper)
			await flushPromises()
			expect(wrapper.vm.formValide).toBeNull()

			// Remplir et valider le champ
			const textFieldInput = wrapper.findComponent(SyTextField).find('input')
			await textFieldInput.trigger('focus')
			await textFieldInput.setValue('John Doe')
			await textFieldInput.trigger('blur')
			await flushPromises()

			// Tous les champs sont valides → v-model passe à true
			expect(wrapper.vm.formValide).toBe(true)
		})

		it('keeps false when a custom field remains invalid', async () => {
			const TestWrapper = {
				components: { SyForm, SyTextField },
				template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
				data() {
					return {
						text: '',
						formValide: null as boolean | null,
					}
				},
			}

			const wrapper = mount(TestWrapper)
			await flushPromises()
			expect(wrapper.vm.formValide).toBeNull()

			// Toucher le champ mais le laisser vide (invalide)
			const textFieldInput = wrapper.findComponent(SyTextField).find('input')
			await textFieldInput.trigger('focus')
			await textFieldInput.trigger('blur')
			await flushPromises()

			// Champ invalide → v-model passe à false
			expect(wrapper.vm.formValide).toBe(false)
		})
	})

	describe('clearValidation and v-model', () => {
		it('keeps the v-model neutral when only one of several fields is completed after clearValidation()', async () => {
			const wrapper = mount({
				components: { SyForm, SyTextField },
				template: `
					<SyForm ref="form" v-model="formValid">
						<SyTextField v-model="firstName" required label="Prénom" />
						<SyTextField v-model="lastName" required label="Nom" />
					</SyForm>
				`,
				data() {
					return {
						firstName: '',
						lastName: '',
						formValid: null as boolean | null,
					}
				},
			})

			await wrapper.find('form').trigger('submit.prevent')
			await flushPromises()
			expect(wrapper.vm.formValid).toBe(false)

			const formRef = wrapper.vm.$refs.form as InstanceType<typeof SyForm>
			formRef.clearValidation()
			await flushPromises()
			expect(wrapper.vm.formValid).toBeNull()

			const firstFieldInput = wrapper.findAllComponents(SyTextField)[0]!.find('input')
			await firstFieldInput.trigger('focus')
			await firstFieldInput.setValue('Jean')
			await firstFieldInput.trigger('blur')
			await flushPromises()

			expect(wrapper.vm.formValid).toBeNull()
			wrapper.unmount()
		})

		it('clearValidation() resets the v-model to null and clears displayed errors (SyAutocomplete)', async () => {
			const wrapper = mount({
				components: { SyForm, SyAutocomplete },
				template: `
					<SyForm ref="form" v-model="formValid">
						<SyAutocomplete
							v-model="doctor"
							label="Médecin traitant"
							required
							:items="[{ text: 'Dr Martin', value: 'martin' }]"
						/>
					</SyForm>
				`,
				data() {
					return {
						doctor: null,
						formValid: null as boolean | null,
					}
				},
			})

			// Soumission avec un champ requis vide : le v-model passe à false
			await wrapper.find('form').trigger('submit.prevent')
			await flushPromises()
			expect(wrapper.vm.formValid).toBe(false)
			expect(wrapper.findAll('.v-messages__message').length).toBeGreaterThan(0)

			// clearValidation masque les erreurs et remet le statut à l'état neutre.
			const formRef = wrapper.vm.$refs.form as InstanceType<typeof SyForm>
			formRef.clearValidation()
			await flushPromises()
			await nextTick()
			expect(wrapper.findAll('.v-messages__message').length).toBe(0)
			expect(wrapper.vm.formValid).toBeNull()

			wrapper.unmount()
		})

		it('clearValidation() clears errors of a field in Vuetify validation mode (SySelect + rules)', async () => {
			const wrapper = mount({
				components: { SyForm, SySelect },
				template: `
					<SyForm ref="form" v-model="formValid">
						<SySelect
							v-model="category"
							label="Catégorie d'assuré"
							:items="[{ title: 'Assuré social', value: 'assure' }]"
							required
							use-vuetify-validation
							:rules="[(value) => !!value || 'Veuillez sélectionner une catégorie']"
						/>
					</SyForm>
				`,
				data() {
					return {
						category: null,
						formValid: null as boolean | null,
					}
				},
			})

			// Soumission avec un champ requis vide : erreur affichée, v-model à false
			await wrapper.find('form').trigger('submit.prevent')
			await flushPromises()
			expect(wrapper.vm.formValid).toBe(false)
			expect(wrapper.findAll('.v-messages__message').length).toBeGreaterThan(0)

			// clearValidation : les erreurs du validator Vuetify disparaissent aussi
			const formRef = wrapper.vm.$refs.form as InstanceType<typeof SyForm>
			formRef.clearValidation()
			await flushPromises()
			await nextTick()
			expect(wrapper.findAll('.v-messages__message').length).toBe(0)

			// Une revalidation ultérieure (saisie) ne doit pas resynchroniser
			// les anciennes erreurs du validator Vuetify resté « sale ».
			wrapper.vm.$data.category = 'assure'
			await flushPromises()
			await nextTick()
			expect(wrapper.findAll('.v-messages__message').length).toBe(0)

			wrapper.unmount()
		})
	})
})
