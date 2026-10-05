import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type PropType, type VNode } from 'vue'
import { VTextField } from 'vuetify/components'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

// une erreur injectée par le parent via `error-messages` (ex. erreur
// renvoyée par le serveur) doit invalider le SyForm, et pas seulement s'afficher.

type FieldRenderer = (props: {
	modelValue: string
	onUpdate: (value: string) => void
	errorMessages: string[]
}) => VNode

const createExternalErrorForm = (renderField: FieldRenderer) => defineComponent({
	props: {
		errorMessages: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
	},
	emits: ['submit'],
	setup(props, { emit }) {
		const validity = ref<boolean | null>(null)
		const name = ref('Jean Dupont')

		return () => h('div', [
			h('span', { 'data-testid': 'form-validity' }, String(validity.value)),
			h(SyForm, {
				'modelValue': validity.value,
				'onUpdate:modelValue': (value: boolean | null) => {
					validity.value = value
				},
				'onSubmit': (payload: { isValid: boolean }) => emit('submit', payload),
			}, {
				default: () => renderField({
					modelValue: name.value,
					onUpdate: (value) => {
						name.value = value
					},
					errorMessages: props.errorMessages,
				}),
			}),
		])
	},
})

const requiredRules = [(value: unknown) => Boolean(value) || 'Ce champ est obligatoire']

const synapseTextField: FieldRenderer = ({ modelValue, onUpdate, errorMessages }) => h(SyTextField, {
	modelValue,
	'onUpdate:modelValue': onUpdate,
	'label': 'Nom',
	'required': true,
	errorMessages,
})

// Champs validés par Vuetify (rules) : VForm.validate() ne vérifie que les rules
// et ignore les error-messages injectés par le parent.
const vuetifyFields: { name: string, render: FieldRenderer }[] = [
	{
		name: 'SyTextField with use-vuetify-validation',
		render: ({ modelValue, onUpdate, errorMessages }) => h(SyTextField, {
			modelValue,
			'onUpdate:modelValue': onUpdate,
			'label': 'Nom',
			'useVuetifyValidation': true,
			'rules': requiredRules,
			errorMessages,
		}),
	},
	{
		name: 'native VTextField',
		render: ({ modelValue, onUpdate, errorMessages }) => h(VTextField, {
			modelValue,
			'onUpdate:modelValue': onUpdate,
			'label': 'Nom',
			'rules': requiredRules,
			errorMessages,
		}),
	},
]

const settle = async () => {
	await flushPromises()
	await nextTick()
}

const getFormValidity = (wrapper: ReturnType<typeof mount>) =>
	wrapper.get('[data-testid="form-validity"]').text()

const submit = async (wrapper: ReturnType<typeof mount>) => {
	await wrapper.find('form').trigger('submit')
	await settle()
}

const lastSubmitPayload = (wrapper: ReturnType<typeof mount>) =>
	wrapper.emitted('submit')?.at(-1)?.[0]

describe('SyForm with error messages injected by the parent', () => {
	const ExternalErrorForm = createExternalErrorForm(synapseTextField)

	it('invalidates the form when an error is injected after a valid submit', async () => {
		const wrapper = mount(ExternalErrorForm)
		await settle()

		await submit(wrapper)
		expect(lastSubmitPayload(wrapper)).toEqual({ isValid: true })
		expect(getFormValidity(wrapper)).toBe('true')

		await wrapper.setProps({ errorMessages: ['Ce nom est déjà utilisé'] })
		await settle()

		expect(wrapper.text()).toContain('Ce nom est déjà utilisé')
		expect(getFormValidity(wrapper)).toBe('false')
	})

	it('emits an invalid submit while an injected error is displayed', async () => {
		const wrapper = mount(ExternalErrorForm, {
			props: { errorMessages: ['Ce nom est déjà utilisé'] },
		})
		await settle()

		await submit(wrapper)

		expect(lastSubmitPayload(wrapper)).toEqual({ isValid: false })
		expect(getFormValidity(wrapper)).toBe('false')
	})

	it('becomes valid again once the injected error is removed', async () => {
		const wrapper = mount(ExternalErrorForm, {
			props: { errorMessages: ['Ce nom est déjà utilisé'] },
		})
		await settle()
		expect(getFormValidity(wrapper)).toBe('false')

		await wrapper.setProps({ errorMessages: [] })
		await submit(wrapper)

		expect(lastSubmitPayload(wrapper)).toEqual({ isValid: true })
		expect(getFormValidity(wrapper)).toBe('true')
	})
})

describe.each(vuetifyFields)('SyForm with a $name and error messages injected by the parent', ({ render }) => {
	const ExternalErrorForm = createExternalErrorForm(render)

	it('emits an invalid submit while an injected error is displayed', async () => {
		const wrapper = mount(ExternalErrorForm)
		await settle()

		await wrapper.setProps({ errorMessages: ['Ce nom est déjà utilisé'] })
		await settle()
		expect(wrapper.text()).toContain('Ce nom est déjà utilisé')

		await submit(wrapper)

		expect(lastSubmitPayload(wrapper)).toEqual({ isValid: false })
		expect(getFormValidity(wrapper)).toBe('false')
	})

	it('emits a valid submit once the injected error is removed', async () => {
		const wrapper = mount(ExternalErrorForm, {
			props: { errorMessages: ['Ce nom est déjà utilisé'] },
		})
		await settle()

		await wrapper.setProps({ errorMessages: [] })
		await settle()
		await submit(wrapper)

		expect(lastSubmitPayload(wrapper)).toEqual({ isValid: true })
		expect(getFormValidity(wrapper)).toBe('true')
	})
})
