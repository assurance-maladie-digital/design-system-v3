import { type Ref } from 'vue'
import { type TextFieldProps } from '@/components/Common/Calendar/useTextField'
import { type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import { locales as defaultLocales } from './locales'
import type { DeepPartial } from '@/utils/locales/mergeLocales'
import type { DatePickerLiteVisualProps } from './DatePickerLiteVisual/DatePickerLiteVisualProps'

export type DatePickerLiteRange = [Date, Date]

export type DatePickerLiteProps =
	TextFieldProps
	& FieldValidationProps
	& Partial<DatePickerLiteVisualProps>
	& {
		modelValue?: Date | DatePickerLiteRange
		mode?: 'single' | 'range'
		locales?: DeepPartial<typeof defaultLocales>
		disabled?: boolean
		readonly?: boolean
		displayAsterisk?: boolean
	}

/** Props ready to be v-bind on a custom text field (attrs + field props + validation state) */
export type DatePickerLiteInputProps =
	TextFieldProps
	& {
		required?: boolean
		displayAsterisk?: boolean
		errorMessages?: string[] | null
		warningMessages?: string[] | null
		successes?: string[]
		hasError?: boolean
		hasWarning?: boolean
		hasSuccess?: boolean
		showSuccessMessages?: boolean
	}
	// Attributes forwarded by the root (classes, listeners, etc.)
	& Record<string, unknown>

/** Slot props for the `input` slot of DatePickerLite */
export interface DatePickerLiteInputSlotProps {
	modelValue: Date | DatePickerLiteRange | undefined
	updateModelValue: (value: Date | DatePickerLiteRange | undefined) => void
	inputProps: DatePickerLiteInputProps
	updateTextValue: (value: string | undefined) => void
	setFocused: (value: boolean) => void
	/** Attach via `:ref` to the button that opens the visual picker */
	toggleBtnRef: Ref<HTMLButtonElement | null>
}
