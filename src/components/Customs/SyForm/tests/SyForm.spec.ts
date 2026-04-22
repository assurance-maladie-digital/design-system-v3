import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import NirField from '@/components/NirField/NirField.vue'
import { nextTick } from 'vue'

describe('SyForm', () => {
	it('modelValue should reflect validity of the form', async () => {
		const TestWrapper = {
			components: { SyForm, SyTextField, NirField },
			template: `
					<SyForm v-model="formError" ref="form" @update:modelValue="console.log">
						<SyTextField v-model="text" required label="Nom" />
						<NirField v-model="nir" required />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					nir: '',
					formError: undefined as boolean | undefined,
				}
			},
		}

		const wrapper = mount(TestWrapper)
		expect(wrapper.vm.formError).toBe(undefined)

		// Champs invalides
		const numberFieldNir = wrapper.findComponent(NirField).find('input')
		const keyFieldNir = wrapper.findComponent(NirField).findAll('input')![1]!
		await numberFieldNir.trigger('focus')
		await numberFieldNir.setValue('123')
		await numberFieldNir.trigger('blur')

		await flushPromises()
		await nextTick()
		expect(wrapper.vm.formError).toBe(true)

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
		expect(wrapper.vm.formError).toBe(false)
	})

	it('should trigger the validation on submit', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formError" ref="form" @submit="handleSubmit">
						<SyTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					formError: undefined as boolean | undefined,
				}
			},
			methods: {
				handleSubmit(e) {
					console.log(e)
					submitHandler(e)
				},
			},
		}

		const wrapper = mount(TestWrapper)
		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()
		expect(submitHandler).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ isValid: false }))
		expect(wrapper.vm.formError).toBe(true)
	})

	it('handle valid form submission', async () => {
		const submitHandler = vi.fn()
		const TestWrapper = {
			components: { SyForm, SyTextField },
			template: `
					<SyForm v-model="formError" ref="form" @submit="handleSubmit">
						<SyTextField v-model="text" required label="Nom" />
					</SyForm>
				`,
			data() {
				return {
					text: '',
					formError: undefined as boolean | undefined,
				}
			},
			methods: {
				handleSubmit(e) {
					console.log(e)
					submitHandler(e)
				},
			},
		}

		const wrapper = mount(TestWrapper)
		const textFieldInput = wrapper.findComponent(SyTextField).find('input')
		await textFieldInput.trigger('focus')
		await textFieldInput.setValue('John Doe')
		await textFieldInput.trigger('blur')

		await flushPromises()
		expect(wrapper.vm.formError).toBe(false)

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
					<SyForm v-model="formError" ref="form" @submit="handleSubmit">
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
								validateq: (value: string) => value === 'valid',
								message: 'Le champ doit être "valid"',
							},
						},
					],
					formError: undefined as boolean | undefined,
				}
			},
			methods: {
				handleSubmit(e) {
					console.log(e)
					submitHandler(e)
				},
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
					<SyForm v-model="formError" ref="form" @submit="handleSubmit">
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
					formError: undefined as boolean | undefined,
				}
			},
			methods: {
				handleSubmit(e) {
					console.log(e)
					submitHandler(e)
				},
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
					<SyForm v-model="formError" ref="form" @submit="handleSubmit">
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
					formError: undefined as boolean | undefined,
				}
			},
			methods: {
				handleSubmit(e) {
					console.log(e)
					submitHandler(e)
				},
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
		expect(wrapper.vm.formError).toBe(true)
	})
})
