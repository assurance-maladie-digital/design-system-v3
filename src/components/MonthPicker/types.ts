import { type TextFieldProps } from './MonthPickerText/useTextField'
import { type MonthPickerVisualProps } from './MonthPickerVisual/MonthPickerVisualProps'
import { type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import { locales as defaultLocales } from './locales'
import type { DeepPartial } from '@/utils/locales/mergeLocales'

export type MonthPickerProps =
	TextFieldProps
	& FieldValidationProps
	& Partial<MonthPickerVisualProps>
	& {
		modelValue?: string
		locales?: DeepPartial<typeof defaultLocales>
		disabled?: boolean
		readonly?: boolean
		displayAsterisk?: boolean
	}
