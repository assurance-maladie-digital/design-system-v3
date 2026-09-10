import { ref, watch, type Ref } from 'vue'
import type { DatePickerLiteRange } from '../types'

export interface UseDatePickerLiteDialogParams {
	mode: Ref<'single' | 'range'>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	toggleBtn: Ref<HTMLElement | null>
	resetViewOnOpen: () => void
	onUpdateModelValue: (value: Date | DatePickerLiteRange | undefined) => void
	onUpdateOpen: (value: boolean) => void
}

export function useDatePickerLiteDialog({
	mode,
	readonly,
	disabled,
	toggleBtn,
	resetViewOnOpen,
	onUpdateModelValue,
	onUpdateOpen,
}: UseDatePickerLiteDialogParams) {
	// `open` is the menu state. It controls both the popup visibility and the focus behavior.
	const open = ref(false)

	watch(open, (isOpen) => {
		if (isOpen) {
			// When the popup opens, we reset the calendar to the current selection to avoid a stale month.
			resetViewOnOpen()
		}
		else {
			// On close, focus returns to the trigger to preserve keyboard navigation continuity.
			toggleBtn.value?.focus()
		}

		onUpdateOpen(isOpen)
	})

	function setDay(value: Date) {
		if (mode.value === 'range') return
		if (!readonly.value && !disabled.value) {
			onUpdateModelValue(value)
		}
		open.value = false
	}

	function handleRangeSelected(value: [Date, Date]) {
		if (!readonly.value && !disabled.value) {
			onUpdateModelValue(value)
		}
		open.value = false
	}

	function setDayFromFooter(value: string | Date) {
		if (value instanceof Date) {
			setDay(value)
		}
	}

	return {
		open,
		setDay,
		handleRangeSelected,
		setDayFromFooter,
	}
}
