import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
import NirField from '@/components/NirField/NirField.vue'
import { VTextField } from 'vuetify/components/VTextField'
import { nextTick } from 'vue'

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

	it('keeps the form invalid when a required clearable SyTextArea is cleared without showing the error', async () => {
		const TestWrapper = {
			components: { SyForm, SyTextArea },
			template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextArea v-model="text" required clearable label="Description" />
						<button type="submit">Valider</button>
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
		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('Texte initial')
		await textarea.trigger('blur')
		await flushPromises()
		expect(wrapper.vm.formValide).toBe(true)
		expect(wrapper.text()).not.toContain('Ce champ est requis')

		await wrapper.find('.sy-textarea__clear-button').trigger('click')
		await flushPromises()

		expect(wrapper.vm.formValide).toBe(false)
		expect(wrapper.text()).not.toContain('Ce champ est requis')
	})

	it('keeps the form invalid when a required clearable SyTextField is cleared without showing the error', async () => {
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formValide" ref="form">
						<SyTextField v-model="text" required is-clearable label="Nom" />
						<button type="submit">Valider</button>
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
		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('Jean Dupont')
		await input.trigger('blur')
		await flushPromises()
		expect(wrapper.vm.formValide).toBe(true)
		expect(wrapper.text()).not.toContain('Le champ Nom est requis.')

		await wrapper.find('.sy-text-field__clear').trigger('click')
		await flushPromises()

		expect(wrapper.vm.formValide).toBe(false)
		expect(wrapper.text()).not.toContain('Le champ Nom est requis.')
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
})
