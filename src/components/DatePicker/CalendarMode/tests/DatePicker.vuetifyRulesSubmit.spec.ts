import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import DatePicker from '../DatePicker.vue'

// En mode Vuetify, une `rule` en échec doit bloquer le submit du SyForm, même si le
// champ n'a jamais été touché, quel que soit le mode du DatePicker.
const modes = [
	{ name: 'calendar', props: {} },
	{ name: 'noCalendar', props: { noCalendar: true } },
	{ name: 'useCombinedMode', props: { useCombinedMode: true } },
]

const settle = async () => {
	await flushPromises()
	await nextTick()
}

describe.each(modes)('DatePicker ($name) in SyForm with useVuetifyValidation', ({ props }) => {
	const createForm = (rules: ((value: unknown) => boolean | string)[]) => defineComponent({
		emits: ['submit'],
		setup(_, { emit }) {
			return () => h(SyForm, {
				onSubmit: (payload: { isValid: boolean }) => emit('submit', payload),
			}, {
				default: () => h(DatePicker, {
					modelValue: '12/06/2030',
					label: 'Date de rendez-vous',
					useVuetifyValidation: true,
					rules,
					...props,
				}),
			})
		},
	})

	const submit = async (wrapper: ReturnType<typeof mount>) => {
		await settle()
		await wrapper.find('form').trigger('submit')
		await settle()
		return wrapper.emitted('submit')?.at(-1)?.[0]
	}

	it('blocks the submit of a pristine field when a rule fails', async () => {
		const wrapper = mount(createForm([() => 'Date refusée (Vuetify)']))

		expect(await submit(wrapper)).toEqual({ isValid: false })
		expect(wrapper.text()).toContain('Date refusée (Vuetify)')
	})

	it('lets the submit pass when the rules are satisfied', async () => {
		const wrapper = mount(createForm([() => true]))

		expect(await submit(wrapper)).toEqual({ isValid: true })
	})
})
