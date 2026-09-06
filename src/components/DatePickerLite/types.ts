import { type TextFieldProps } from '@/components/Common/Calendar/useTextField'
import { type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import { locales as defaultLocales } from './locales'
import type { DeepPartial } from '@/utils/locales/mergeLocales'
import type { DatePickerLiteVisualProps } from './DatePickerLiteVisual/DatePickerLiteVisualProps'

export type DatePickerLiteProps =
	TextFieldProps
	& FieldValidationProps
	& Partial<DatePickerLiteVisualProps>
	& {
		modelValue?: Date
		locales?: DeepPartial<typeof defaultLocales>
		disabled?: boolean
		readonly?: boolean
		displayAsterisk?: boolean
	}
