import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import SelectBtnField from '../SelectBtnField.vue'

// Le reset du SyForm doit vider la valeur via `update:modelValue`, sans tenter d'écrire
// dans la prop (warning Vue « Write operation failed: computed value is readonly »).
const items = [{ text: 'Option A', value: 'a' }, { text: 'Option B', value: 'b' }]

const createForm = (multiple: boolean) => defineComponent({
	setup(_, { expose }) {
		const value = ref<unknown>(multiple ? ['b'] : 'b')
		const formRef = ref<InstanceType<typeof SyForm>>()
		expose({ value, reset: () => formRef.value?.reset() })

		return () => h(SyForm, { ref: formRef }, {
			default: () => h(SelectBtnField, {
				'modelValue': value.value,
				'onUpdate:modelValue': (newValue: unknown) => {
					value.value = newValue
				},
				'label': 'Choix',
				items,
				multiple,
			}),
		})
	},
})

describe('SelectBtnField reset by SyForm', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	// VForm.reset() émet `null` depuis le composant (useProxiedModel de Vuetify), y compris en
	// mode multiple : la valeur vidée peut donc être `null` ou `[]`.
	it.each([
		['single', false],
		['multiple', true],
	])('clears the %s value without writing to a readonly ref', async (_, multiple) => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const wrapper = mount(createForm(multiple))
		await flushPromises()

		const vm = wrapper.vm as unknown as { value: unknown, reset: () => void }
		vm.reset()
		await flushPromises()
		await nextTick()

		expect(vm.value === null || (Array.isArray(vm.value) && vm.value.length === 0)).toBe(true)
		expect(warn.mock.calls.flat().join(' ')).not.toContain('readonly')
	})
})
