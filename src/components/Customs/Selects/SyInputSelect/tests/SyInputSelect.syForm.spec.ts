import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import SyInputSelect from '../SyInputSelect.vue'

// SyInputSelect doit s'enregistrer auprès du SyForm : un champ requis jamais touché
// doit bloquer la soumission, et le reset du formulaire doit le ramener à l'état neutre.
const items = [{ text: 'Option A', value: 'a' }, { text: 'Option B', value: 'b' }]

const createForm = (fieldProps: Record<string, unknown> = {}) => defineComponent({
	emits: ['submit'],
	setup(_, { emit, expose }) {
		const value = ref<Record<string, unknown> | null>(null)
		const formRef = ref<InstanceType<typeof SyForm>>()
		expose({ value, reset: () => formRef.value?.reset() })

		return () => h(SyForm, {
			ref: formRef,
			onSubmit: (payload: { isValid: boolean }) => emit('submit', payload),
		}, {
			default: () => h(SyInputSelect, {
				'modelValue': value.value,
				'onUpdate:modelValue': (newValue: Record<string, unknown> | null) => {
					value.value = newValue
				},
				'label': 'Choix',
				items,
				...fieldProps,
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

describe('SyInputSelect in SyForm', () => {
	it('blocks the submit of a pristine required field and displays the error', async () => {
		const wrapper = mount(createForm({ required: true }))
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: false })
		expect(wrapper.text()).toContain('Choix')
		expect(wrapper.find('.v-messages__message').exists()).toBe(true)
	})

	it('lets the submit pass once an option is selected', async () => {
		const wrapper = mount(createForm({ required: true }))
		await settle()

		const vm = wrapper.vm as unknown as { value: Record<string, unknown> | null }
		vm.value = items[0]!
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: true })
	})

	it('blocks the submit when a custom rule fails', async () => {
		const wrapper = mount(createForm({
			customRules: [{ type: 'custom', options: { validate: () => false, message: 'Option refusée' } }],
		}))
		await settle()

		const vm = wrapper.vm as unknown as { value: Record<string, unknown> | null }
		vm.value = items[1]!
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: false })
		expect(wrapper.text()).toContain('Option refusée')
	})

	it('does not block the submit when readonly', async () => {
		const wrapper = mount(createForm({ required: true, readonly: true }))
		await settle()

		expect(await submit(wrapper)).toEqual({ isValid: true })
	})

	it('clears the value without displaying an error on form reset', async () => {
		const wrapper = mount(createForm({ required: true }))
		await settle()

		const vm = wrapper.vm as unknown as { value: Record<string, unknown> | null, reset: () => void }
		vm.value = items[0]!
		await settle()

		vm.reset()
		await settle()

		expect(vm.value).toBeNull()
		expect(wrapper.find('.v-messages__message').exists()).toBe(false)
	})
})
