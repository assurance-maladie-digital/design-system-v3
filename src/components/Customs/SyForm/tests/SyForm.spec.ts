import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import NirField from '@/components/NirField/NirField.vue'
import { VTextField } from 'vuetify/components/VTextField'
import { defineComponent, h, nextTick } from 'vue'
import { useValidatable } from '@/composables/validation/useValidatable'

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
		expect(wrapper.vm.formValide).toBe(null)

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

		// Le reset doit ramener le champ à un état neutre/vierge, pas le ré-invalider
		expect(wrapper.vm.formValide).toBe(null)
		expect(wrapper.findComponent(SyTextField).text()).not.toContain('Le champ est obligatoire')
	})

	// Contrat de compatibilité avec les composants non migrés (« legacy ») :
	// ceux enregistrés via useValidatable() sans fournir d'état réactif `valide`
	// (ex. les DatePickers) n'alimentent pas le v-model tri-état de SyForm. Le
	// formulaire ne peut donc pas conclure « valide » en temps réel (reste `null`),
	// mais la soumission — qui s'appuie sur validateOnSubmit() — fonctionne.
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

	it('keeps the live tri-state v-model at null when a legacy field (no reactive `valide`) is registered, while submission still works', async () => {
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

		// Un champ sans `valide` réactif → SyForm ne peut pas conclure « valide »
		expect(wrapper.vm.formValide).toBe(null)

		// La soumission fonctionne malgré tout (via validateOnSubmit)
		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: true }))

		// …et le v-model live reste `null`, même après une soumission valide
		expect(wrapper.vm.formValide).toBe(null)

		wrapper.unmount()
	})

	it('a legacy invalid field reports invalid on submit but the live v-model stays null', async () => {
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

		// Pas d'état live : « inconnu », pas « invalide »
		expect(wrapper.vm.formValide).toBe(null)

		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: false }))

		// Le v-model live ne bascule pas à false (le champ legacy ne publie rien)
		expect(wrapper.vm.formValide).toBe(null)

		wrapper.unmount()
	})

	it('a fully valid migrated field cannot bring the tri-state v-model to true while a legacy field coexists', async () => {
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

		// …mais le formulaire reste `null` car le champ legacy est « inconnu »
		expect(wrapper.vm.formValide).toBe(null)

		wrapper.unmount()
	})
})
