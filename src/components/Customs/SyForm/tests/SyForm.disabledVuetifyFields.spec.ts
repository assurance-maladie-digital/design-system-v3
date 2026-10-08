import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type Component } from 'vue'
import { VTextField } from 'vuetify/components'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

// VForm.validate() évalue les `rules` des champs désactivés : comme pour les champs Synapse,
// un champ désactivé ne doit ni bloquer la soumission du SyForm ni afficher de message.
const requiredRule = [(value: unknown) => Boolean(value) || 'Requis (Vuetify)']

const fields: { name: string, component: Component, props: Record<string, unknown> }[] = [
	{ name: 'SyTextField with use-vuetify-validation', component: SyTextField, props: { useVuetifyValidation: true } },
	{ name: 'native VTextField', component: VTextField, props: {} },
]

const settle = async () => {
	await flushPromises()
	await nextTick()
}

describe.each(fields)('SyForm with a $name carrying failing rules', ({ component, props }) => {
	const createForm = (disabled: boolean) => defineComponent({
		emits: ['submit'],
		setup(_, { emit }) {
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
					default: () => h(component, { modelValue: '', label: 'Nom', rules: requiredRule, disabled, ...props }),
				}),
			])
		},
	})

	const submit = async (wrapper: ReturnType<typeof mount>) => {
		await settle()
		await wrapper.find('form').trigger('submit')
		await settle()
		return wrapper.emitted('submit')?.at(-1)?.[0]
	}

	it('ignores the field when it is disabled', async () => {
		const wrapper = mount(createForm(true))

		expect(await submit(wrapper)).toEqual({ isValid: true })
		expect(wrapper.text()).not.toContain('Requis (Vuetify)')
	})

	it('keeps the form v-model valid before any submit when the field is disabled', async () => {
		const wrapper = mount(createForm(true))
		await settle()

		// Sans exclusion, le VForm laisse le statut à null : un bouton
		// `:disabled="formValid !== true"` resterait grisé pour toujours.
		expect(wrapper.get('[data-testid="form-validity"]').text()).toBe('true')
	})

	it('blocks the submit when the field is enabled', async () => {
		const wrapper = mount(createForm(false))

		expect(await submit(wrapper)).toEqual({ isValid: false })
		expect(wrapper.text()).toContain('Requis (Vuetify)')
	})
})
