import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

// Le validator Vuetify s'enregistre dans le VForm sous l'id `name` (= label). Deux
// champs avec le même label partagent le même id : Vuetify log « Duplicate input
// name » et `form.update(id)` ne met à jour que le premier item trouvé — l'état de
// validité du second champ n'est jamais propagé. Ici, le champ désactivé absorbe
// l'id : la règle en échec du champ actif n'apparaît ni dans le v-model, ni comme
// bloquante à la soumission.
const failingRule = [(v: unknown) => Boolean(v) || 'Requis (Vuetify)']

const DuplicateNamesForm = defineComponent({
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
				default: () => [
					// Même label → même id VForm sans correction.
					h(SyTextField, { modelValue: '', label: 'Nom', useVuetifyValidation: true, rules: failingRule, disabled: true }),
					h(SyTextField, { modelValue: '', label: 'Nom', useVuetifyValidation: true, rules: failingRule }),
				],
			}),
		])
	},
})

const settle = async () => {
	await flushPromises()
	await nextTick()
}

const validity = (wrapper: ReturnType<typeof mount>) =>
	wrapper.get('[data-testid="form-validity"]').text()

describe('SyForm with two Vuetify fields sharing the same label', () => {
	it('tracks each field independently: the failing enabled field blocks the submit', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const wrapper = mount(DuplicateNamesForm)
		await settle()

		await wrapper.find('form').trigger('submit')
		await settle()

		expect(wrapper.emitted('submit')?.at(-1)?.[0]).toEqual({ isValid: false })
		expect(validity(wrapper)).not.toBe('null')
		warn.mockRestore()
	})

	it('does not warn about a duplicate input name once ids are unique', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		mount(DuplicateNamesForm)
		await settle()

		const duplicates = warn.mock.calls.filter(call => String(call[0]).includes('Duplicate input name'))
		expect(duplicates).toHaveLength(0)
		warn.mockRestore()
	})
})
