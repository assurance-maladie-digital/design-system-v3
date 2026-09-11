import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useDatePickerLiteDateSelection } from '../useDatePickerLiteDateSelection'

describe('useDatePickerLiteDateSelection', () => {
	it('should update the selected date then close the dialog', () => {
		const onUpdateModelValue = vi.fn()
		const close = vi.fn()
		const selectedDate = new Date(2026, 8, 11)
		const { setDay } = useDatePickerLiteDateSelection({
			mode: ref('single'),
			modelValue: ref(undefined),
			readonly: ref(false),
			disabled: ref(false),
			onUpdateModelValue,
			close,
		})

		setDay(selectedDate)

		expect(onUpdateModelValue).toHaveBeenCalledWith(selectedDate)
		expect(close).toHaveBeenCalledOnce()
	})
})
