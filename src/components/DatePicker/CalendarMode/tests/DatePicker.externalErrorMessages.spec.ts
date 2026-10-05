import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type PropType } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import DatePicker from '../DatePicker.vue'

// Une erreur injectée par le parent via `error-messages` (ex. erreur renvoyée par
// le serveur) doit faire échouer le submit du SyForm, quel que soit le mode du DatePicker.
const createExternalErrorForm = (modeProps: Record<string, boolean>) => defineComponent({
	props: {
		errorMessages: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
	},
	emits: ['submit'],
	setup(props, { emit }) {
		const validity = ref<boolean | null>(null)
		const date = ref<string | null>('15/06/2030')

		return () => h('div', [
			h('span', { 'data-testid': 'form-validity' }, String(validity.value)),
			h(SyForm, {
				'modelValue': validity.value,
				'onUpdate:modelValue': (value: boolean | null) => {
					validity.value = value
				},
				'onSubmit': (payload: { isValid: boolean }) => emit('submit', payload),
			}, {
				default: () => h(DatePicker, {
					'modelValue': date.value,
					'onUpdate:modelValue': (value: string | null) => {
						date.value = value
					},
					'label': 'Date de rendez-vous',
					'required': true,
					'errorMessages': props.errorMessages,
					...modeProps,
				}),
			}),
		])
	},
})

const modes = [
	{ name: 'calendar', props: {} },
	{ name: 'noCalendar', props: { noCalendar: true } },
	{ name: 'useCombinedMode', props: { useCombinedMode: true } },
]

describe('DatePicker in SyForm with error messages injected by the parent', () => {
	const settle = async () => {
		await flushPromises()
		await nextTick()
	}

	const submit = async (wrapper: ReturnType<typeof mount>) => {
		await wrapper.find('form').trigger('submit')
		await settle()
	}

	const lastSubmitPayload = (wrapper: ReturnType<typeof mount>) =>
		wrapper.emitted('submit')?.at(-1)?.[0]

	describe.each(modes)('$name mode', ({ props: modeProps }) => {
		it('emits an invalid submit while an injected error is displayed', async () => {
			const wrapper = mount(createExternalErrorForm(modeProps), {
				attachTo: document.body,
			})
			await settle()

			await wrapper.setProps({ errorMessages: ['Ce créneau n’est plus disponible'] })
			await settle()
			expect(wrapper.text()).toContain('Ce créneau n’est plus disponible')

			await submit(wrapper)

			expect(lastSubmitPayload(wrapper)).toEqual({ isValid: false })
			expect(wrapper.get('[data-testid="form-validity"]').text()).toBe('false')

			wrapper.unmount()
		})

		it('emits a valid submit once the injected error is removed', async () => {
			const wrapper = mount(createExternalErrorForm(modeProps), {
				props: { errorMessages: ['Ce créneau n’est plus disponible'] },
				attachTo: document.body,
			})
			await settle()

			await wrapper.setProps({ errorMessages: [] })
			await settle()
			await submit(wrapper)

			expect(lastSubmitPayload(wrapper)).toEqual({ isValid: true })

			wrapper.unmount()
		})
	})
})
