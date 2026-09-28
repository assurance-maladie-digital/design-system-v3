import { useId } from 'vue'

export interface DatePickerIds {
	contentId: string
	dialogId: string
	titleId: string
	headingId: string
	inputId: string
}

export const useDatePickerIds = (): DatePickerIds => {
	const contentId = `date-picker-${useId()}`

	return {
		contentId,
		dialogId: `${contentId}-dialog`,
		titleId: `${contentId}-title`,
		headingId: `${contentId}-heading`,
		inputId: `${contentId}-input`,
	}
}
