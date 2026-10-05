import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type PropType } from 'vue'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

// une erreur injectée par le parent via `error-messages` (ex. erreur
// renvoyée par le serveur) doit invalider le SyForm, et pas seulement s'afficher.
const ExternalErrorForm = defineComponent({
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
				default: () => h(SyTextField, {
					'modelValue': name.value,
					'onUpdate:modelValue': (value: string) => {
						name.value = value
					},
					'label': 'Nom',
					'required': true,
					'errorMessages': props.errorMessages,
				}),
			}),
		])
	},
})

describe('SyForm with error messages injected by the parent', () => {
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
