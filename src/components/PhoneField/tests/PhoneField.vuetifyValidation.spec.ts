import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import PhoneField from '../PhoneField.vue'

// Avec `use-vuetify-validation`, seules les `rules` Vuetify s'appliquent : les règles
// intégrées de PhoneField (requis, longueur) sont réservées au mode Synapse.
const createForm = (fieldProps: Record<string, unknown>) => defineComponent({
	emits: ['submit'],
	setup(_, { emit }) {
		return () => h(SyForm, {
			onSubmit: (payload: { isValid: boolean }) => emit('submit', payload),
		}, {
			default: () => h(PhoneField, fieldProps),
		})
	},
})

const settle = async () => {
	await flushPromises()
	await nextTick()
}

const submit = async (wrapper: ReturnType<typeof mount>) => {
	await settle()
	await wrapper.find('form').trigger('submit')
	await settle()
	return wrapper.emitted('submit')?.at(-1)?.[0]
}

describe('PhoneField in SyForm', () => {
	it('applies only the Vuetify rules with useVuetifyValidation', async () => {
		const wrapper = mount(createForm({ modelValue: '0612', useVuetifyValidation: true, rules: [() => true] }))

		expect(await submit(wrapper)).toEqual({ isValid: true })
	})

	it('blocks the submit of a pristine field when a Vuetify rule fails', async () => {
		const wrapper = mount(createForm({ modelValue: '', useVuetifyValidation: true, rules: [() => 'Numéro refusé (Vuetify)'] }))

		expect(await submit(wrapper)).toEqual({ isValid: false })
		expect(wrapper.text()).toContain('Numéro refusé (Vuetify)')
	})

	it('keeps the built-in length rule in Synapse mode', async () => {
		const wrapper = mount(createForm({ modelValue: '0612' }))

		expect(await submit(wrapper)).toEqual({ isValid: false })
	})
})
