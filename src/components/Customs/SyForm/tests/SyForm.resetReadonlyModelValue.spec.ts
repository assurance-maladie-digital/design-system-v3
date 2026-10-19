import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import SyForm from '../SyForm.vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

// Le validator Vuetify est instancié pour tout champ passant `useVuetifyValidation`
// en Ref — y compris en mode Synapse. VForm.reset() appelle `item.reset()` qui écrit
// `model = null` dans le modelValue proxifié : sur un champ dont le modelValue est un
// computed en lecture seule (DatePicker), Vue émet « Write operation failed:
// computed value is readonly » en dev. Le reset ne doit produire aucun warning.
const ResetForm = defineComponent({
	setup(_, { expose }) {
		const formRef = ref<InstanceType<typeof SyForm>>()
		expose({ reset: () => formRef.value?.reset() })

		return () => h(SyForm, { ref: formRef }, {
			default: () => h(DatePicker, { modelValue: '12/06/2030', label: 'Date de rendez-vous' }),
		})
	},
})

describe('SyForm.reset() with a field backed by a readonly modelValue', () => {
	it('does not write into a readonly computed (no Vue warning)', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const wrapper = mount(ResetForm)
		await flushPromises()
		await nextTick()

		const vm = wrapper.vm as unknown as { reset: () => void }
		vm.reset()
		await flushPromises()
		await nextTick()

		const readonlyWarnings = warn.mock.calls.flat().filter(message => String(message).includes('readonly'))
		expect(readonlyWarnings).toHaveLength(0)
		warn.mockRestore()
	})
})
