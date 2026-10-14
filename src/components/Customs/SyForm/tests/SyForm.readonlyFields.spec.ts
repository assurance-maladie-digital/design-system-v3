import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type Component } from 'vue'
import { VTextField } from 'vuetify/components'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

// Doc SyForm.mdx : une erreur injectée (error-messages / has-error) sur un champ
// readonly s'affiche mais ne bloque pas — ni la soumission, ni le v-model (sinon
// :disabled="valid !== true" reste grisé sans recours). En revanche, une erreur
// issue des `rules` d'un champ Vuetify readonly reste bloquante (limite documentée :
// l'activateur du DatePicker en mode calendrier est readonly et porte ses rules).
const injectedErrors = ['Erreur serveur']

const settle = async () => {
	await flushPromises()
	await nextTick()
}

const createForm = (component: Component, fieldProps: Record<string, unknown>) => defineComponent({
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
				default: () => h(component, { modelValue: 'Jean', label: 'Nom', ...fieldProps }),
			}),
		])
	},
})

const submit = async (wrapper: ReturnType<typeof mount>) => {
	await wrapper.find('form').trigger('submit')
	await settle()
	return wrapper.emitted('submit')?.at(-1)?.[0]
}

const validity = (wrapper: ReturnType<typeof mount>) =>
	wrapper.get('[data-testid="form-validity"]').text()

describe('SyForm with a readonly field carrying injected errors', () => {
	const fields: { name: string, component: Component, props: Record<string, unknown> }[] = [
		{ name: 'SyTextField (Synapse mode)', component: SyTextField, props: {} },
		{ name: 'SyTextField (use-vuetify-validation)', component: SyTextField, props: { useVuetifyValidation: true } },
		{ name: 'native VTextField', component: VTextField, props: {} },
	]

	describe.each(fields)('$name', ({ component, props }) => {
		it('displays the injected error but does not invalidate the v-model', async () => {
			const wrapper = mount(createForm(component, {
				readonly: true,
				errorMessages: injectedErrors,
				...props,
			}))
			await settle()

			expect(wrapper.text()).toContain('Erreur serveur')
			expect(validity(wrapper)).toBe('true')
		})

		it('lets the submit pass', async () => {
			const wrapper = mount(createForm(component, {
				readonly: true,
				errorMessages: injectedErrors,
				...props,
			}))

			expect(await submit(wrapper)).toEqual({ isValid: true })
		})
	})
})

describe('SyForm with a readonly Vuetify field carrying failing rules', () => {
	const fields: { name: string, component: Component, props: Record<string, unknown> }[] = [
		{ name: 'SyTextField (use-vuetify-validation)', component: SyTextField, props: { useVuetifyValidation: true } },
		{ name: 'native VTextField', component: VTextField, props: {} },
	]

	// Limite documentée (SyForm.mdx) : les règles d'un champ readonly restent évaluées
	// et bloquent — le v-model doit être cohérent avec la soumission.
	describe.each(fields)('$name', ({ component, props }) => {
		it('blocks the submit and reports the field as invalid', async () => {
			const wrapper = mount(createForm(component, {
				modelValue: '',
				readonly: true,
				rules: [(v: unknown) => Boolean(v) || 'Requis (Vuetify)'],
				...props,
			}))
			await settle()

			expect(await submit(wrapper)).toEqual({ isValid: false })
			expect(validity(wrapper)).toBe('false')
		})
	})
})
