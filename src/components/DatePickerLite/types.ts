import { type Ref } from 'vue'
import { type TextFieldProps } from '@/components/Common/Calendar/useTextField'
import { type PickerView } from '@/components/Common/Calendar/locales'
import { type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import { locales as defaultLocales } from './locales'
import type { DeepPartial } from '@/utils/locales/mergeLocales'
import type { DatePickerLiteVisualProps } from './DatePickerLiteVisual/DatePickerLiteVisualProps'

export type DatePickerLiteRange = [Date, Date]
export type DatePickerLiteMultiple = Date[]
export type DatePickerLiteMode = 'single' | 'range' | 'multiple'
// The model's empty value follows the Vuetify convention: a cleared field emits `null`.
export type DatePickerLiteValue = Date | DatePickerLiteRange | DatePickerLiteMultiple | null

export type DatePickerLiteProps =
	TextFieldProps
	& FieldValidationProps
	& Partial<DatePickerLiteVisualProps>
	& {
		modelValue?: Date | DatePickerLiteRange | DatePickerLiteMultiple | null
		mode?: DatePickerLiteMode
		inputFormat?: string
		separator?: string
		locales?: DeepPartial<typeof defaultLocales>
		disabled?: boolean
		readonly?: boolean
	}

/** Props ready to be v-bind on a custom text field (attrs + field props + validation state) */
export type DatePickerLiteInputProps =
	TextFieldProps
	& {
		required?: boolean
		displayAsterisk?: boolean
		inputFormat?: string
		separator?: string
		locale?: string
		errorMessages?: string[] | null
		warningMessages?: string[] | null
		successMessages?: string[] | null
		hasError?: boolean
		hasWarning?: boolean
		hasSuccess?: boolean
		showSuccessMessages?: boolean
	}
	// Attributes forwarded by the root (classes, listeners, etc.)
	& Record<string, unknown>

/** Slot props for the `input` slot of DatePickerLite */
export interface DatePickerLiteInputSlotProps {
	/** Selection mode, so a custom input can adapt to single, range, or multiple values */
	mode: DatePickerLiteMode
	locale: string
	modelValue: DatePickerLiteValue
	updateModelValue: (value: DatePickerLiteValue) => void
	inputProps: DatePickerLiteInputProps
	updateTextValue: (value: string | undefined) => void
	setFocused: (value: boolean) => void
	/** Attach via `:ref` to the button that opens the visual picker */
	toggleBtnRef: Ref<HTMLButtonElement | null>
}

/** Slot props for the `menu` slot of DatePickerLite */
export interface DatePickerLiteMenuSlotProps {
	modelValue: DatePickerLiteValue
	locale: string
	view: PickerView
	readonly: boolean
	disabled: boolean
	isOpen: boolean
	setOpen: (value: boolean) => void
}

/** Slot props for the `header` slot of DatePickerLite */
export interface DatePickerLiteHeaderSlotProps {
	view: PickerView
	modelValue: Date | undefined
	currentMonth: Date
	minYear: number
	maxYear: number
	previousMonth: () => void
	nextMonth: () => void
}
