import { ref, watch, type Ref } from 'vue'

export interface UseDatePickerLiteDialogParams {
	toggleBtn: Ref<HTMLElement | null>
	resetViewOnOpen: () => void
	onUpdateOpen: (value: boolean) => void
}

export function useDatePickerLiteDialog({
	toggleBtn,
	resetViewOnOpen,
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

	const setOpen = (value: boolean): void => {
		open.value = value
	}

	return {
		open,
		setOpen,
	}
}
