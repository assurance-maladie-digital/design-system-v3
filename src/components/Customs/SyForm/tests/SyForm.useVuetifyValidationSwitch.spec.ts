import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, type PropType } from 'vue'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

// `use-vuetify-validation` peut basculer dynamiquement : après true → false, les
// customRules doivent s'appliquer au submit, et ne plus s'appliquer après false → true.

const SwitchForm = defineComponent({
	props: {
		useVuetifyValidation: {
			type: Boolean as PropType<boolean>,
			required: true,
		},
		errorMessages: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
	},
	emits: ['submit'],
	setup(props, { emit }) {
		return () => h(SyForm, {
			onSubmit: (payload: { isValid: boolean }) => emit('submit', payload),
		}, {
			default: () => h(SyTextField, {
				modelValue: '',
				label: 'Nom',
				useVuetifyValidation: props.useVuetifyValidation,
				customRules: [{ type: 'required', options: { message: 'Requis (Synapse)' } }],
				errorMessages: props.errorMessages,
			}),
		})
	},
})

const settle = async () => {
	await flushPromises()
	await nextTick()
}

const submit = async (wrapper: ReturnType<typeof mount>) => {
	await wrapper.find('form').trigger('submit')
	await settle()
	return wrapper.emitted('submit')?.at(-1)?.[0]
}

describe('SyForm with a field switching useVuetifyValidation', () => {
	it('applies customRules after switching from Vuetify to Synapse mode', async () => {
		const wrapper = mount(SwitchForm, { props: { useVuetifyValidation: true } })
		await settle()
		expect(await submit(wrapper)).toEqual({ isValid: true })

		await wrapper.setProps({ useVuetifyValidation: false })
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: false })
		expect(wrapper.text()).toContain('Requis (Synapse)')
	})

	it('stops applying customRules after switching from Synapse to Vuetify mode', async () => {
		const wrapper = mount(SwitchForm, { props: { useVuetifyValidation: false } })
		await settle()
		expect(await submit(wrapper)).toEqual({ isValid: false })

		await wrapper.setProps({ useVuetifyValidation: true })
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: true })
		expect(wrapper.text()).not.toContain('Requis (Synapse)')
	})

	it('does not keep a stale invalid state once the injected error is removed during the switch', async () => {
		const wrapper = mount(SwitchForm, {
			props: { useVuetifyValidation: false, errorMessages: ['Erreur serveur'] },
		})
		await settle()

		// Le champ est rempli : seule l'erreur injectée le rend invalide.
		await wrapper.find('input').setValue('Jean')
		expect(await submit(wrapper)).toEqual({ isValid: false })

		await wrapper.setProps({ useVuetifyValidation: true, errorMessages: [] })
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: true })
	})
})
