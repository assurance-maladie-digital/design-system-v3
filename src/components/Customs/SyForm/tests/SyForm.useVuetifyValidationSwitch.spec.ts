/* eslint-disable vue/one-component-per-file */
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type PropType } from 'vue'
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

// `rules` ne s'appliquent qu'en mode Vuetify : après une bascule vers le mode
// Synapse, l'erreur Vuetify ne doit plus être affichée, ni bloquer la soumission,
// ni figer le v-model (sinon l'état de l'item VForm est périmé).
const StaleVuetifyStateForm = defineComponent({
	props: {
		useVuetifyValidation: {
			type: Boolean as PropType<boolean>,
			required: true,
		},
	},
	emits: ['submit'],
	setup(props, { emit }) {
		const validity = ref<boolean | null>(null)

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
					modelValue: '',
					label: 'Nom',
					useVuetifyValidation: props.useVuetifyValidation,
					rules: [(v: unknown) => Boolean(v) || 'Requis (Vuetify)'],
				}),
			}),
		])
	},
})

describe('SyForm with a field switching away from a failed Vuetify validation', () => {
	it('clears the Vuetify error and unblocks the submit after switching to Synapse mode', async () => {
		const wrapper = mount(StaleVuetifyStateForm, { props: { useVuetifyValidation: true } })
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: false })
		expect(wrapper.text()).toContain('Requis (Vuetify)')

		await wrapper.setProps({ useVuetifyValidation: false })
		await settle()

		expect(wrapper.text()).not.toContain('Requis (Vuetify)')
		expect(await submit(wrapper)).toEqual({ isValid: true })
		expect(wrapper.get('[data-testid="form-validity"]').text()).toBe('true')
	})
})
