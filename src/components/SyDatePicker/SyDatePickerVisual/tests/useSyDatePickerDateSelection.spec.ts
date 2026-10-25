import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { SyDatePickerValue } from '../../types'
import { useSyDatePickerDateSelection } from '../useSyDatePickerDateSelection'

describe('useSyDatePickerDateSelection', () => {
	it('should update the selected date then close the dialog', () => {
		const onUpdateModelValue = vi.fn()
		const close = vi.fn()
		const selectedDate = new Date(2026, 8, 11)
		const { setDay } = useSyDatePickerDateSelection({
			mode: ref('single'),
			modelValue: ref<SyDatePickerValue>(null),
			readonly: ref(false),
			disabled: ref(false),
			onUpdateModelValue,
			close,
		})

		setDay(selectedDate)

		expect(onUpdateModelValue).toHaveBeenCalledWith(selectedDate)
		expect(close).toHaveBeenCalledOnce()
	})

	it('should toggle the date without closing the dialog in multiple mode', () => {
		const close = vi.fn()
		const modelValue = ref<Date[]>([new Date(2026, 8, 11)])
		const onUpdateModelValue = vi.fn((value: SyDatePickerValue) => {
			if (Array.isArray(value)) modelValue.value = value
		})
		const { setDay } = useSyDatePickerDateSelection({
			mode: ref('multiple'),
			modelValue,
			readonly: ref(false),
			disabled: ref(false),
			onUpdateModelValue,
			close,
		})

		setDay(new Date(2026, 8, 18))
		expect(onUpdateModelValue).toHaveBeenCalledWith([new Date(2026, 8, 11), new Date(2026, 8, 18)])

		setDay(new Date(2026, 8, 11))
		expect(onUpdateModelValue).toHaveBeenLastCalledWith([new Date(2026, 8, 18)])

		expect(close).not.toHaveBeenCalled()
	})

	it('should toggle by day regardless of the time component in multiple mode', () => {
		const close = vi.fn()
		const modelValue = ref<Date[]>([new Date(2026, 8, 11, 14, 30)])
		const onUpdateModelValue = vi.fn((value: SyDatePickerValue) => {
			if (Array.isArray(value)) modelValue.value = value
		})
		const { setDay } = useSyDatePickerDateSelection({
			mode: ref('multiple'),
			modelValue,
			readonly: ref(false),
			disabled: ref(false),
			onUpdateModelValue,
			close,
		})

		// A click on the day cell (midnight) toggles off the same day selected at 14:30
		setDay(new Date(2026, 8, 11))
		expect(onUpdateModelValue).toHaveBeenLastCalledWith([])
	})
})
