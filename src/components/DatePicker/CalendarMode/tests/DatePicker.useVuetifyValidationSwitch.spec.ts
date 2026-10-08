import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, type PropType } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import DatePicker from '../DatePicker.vue'

// `use-vuetify-validation` peut basculer dynamiquement : après true → false, les
// customRules du DatePicker doivent s'appliquer au submit, et plus après false → true.
const refusedDateRule = [{ type: 'custom', options: { validate: () => false, message: 'Date refusée (Synapse)' } }]

const createSwitchForm = (modeProps: Record<string, boolean>) => defineComponent({
	props: {
		useVuetifyValidation: {
			type: Boolean as PropType<boolean>,
			required: true,
		},
	},
	emits: ['submit'],
	setup(props, { emit }) {
		return () => h(SyForm, {
			onSubmit: (payload: { isValid: boolean }) => emit('submit', payload),
		}, {
			default: () => h(DatePicker, {
				modelValue: '12/06/2030',
				label: 'Date de rendez-vous',
				useVuetifyValidation: props.useVuetifyValidation,
				customRules: refusedDateRule,
				...modeProps,
			}),
		})
	},
})

const modes = [
	{ name: 'calendar', props: {} },
	{ name: 'noCalendar', props: { noCalendar: true } },
	{ name: 'useCombinedMode', props: { useCombinedMode: true } },
]

const settle = async () => {
	await flushPromises()
	await nextTick()
}

const submit = async (wrapper: ReturnType<typeof mount>) => {
	await wrapper.find('form').trigger('submit')
	await settle()
	return wrapper.emitted('submit')?.at(-1)?.[0]
}

describe.each(modes)('DatePicker ($name) in SyForm switching useVuetifyValidation', ({ props }) => {
	const SwitchForm = createSwitchForm(props)

	it('applies customRules after switching from Vuetify to Synapse mode', async () => {
		const wrapper = mount(SwitchForm, { props: { useVuetifyValidation: true } })
		await settle()
		expect(await submit(wrapper)).toEqual({ isValid: true })

		await wrapper.setProps({ useVuetifyValidation: false })
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: false })
		expect(wrapper.text()).toContain('Date refusée (Synapse)')
	})

	it('stops applying customRules after switching from Synapse to Vuetify mode', async () => {
		const wrapper = mount(SwitchForm, { props: { useVuetifyValidation: false } })
		await settle()
		expect(await submit(wrapper)).toEqual({ isValid: false })

		await wrapper.setProps({ useVuetifyValidation: true })
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: true })
		expect(wrapper.text()).not.toContain('Date refusée (Synapse)')
	})
})
