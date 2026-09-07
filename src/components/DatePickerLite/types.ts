import { type Ref } from 'vue'
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

/** Props prêtes à être v-bind sur un champ de saisie custom (attrs + props de champ + état de validation) */
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
	// Attrs transmis par la racine (classe, listeners, etc.)
	& Record<string, unknown>

/** Slot props du slot `input` de DatePickerLite */
export interface DatePickerLiteInputSlotProps {
	modelValue: Date | undefined
	updateModelValue: (value: Date | undefined) => void
	inputProps: DatePickerLiteInputProps
	/** Alimente la validation uniquement : le parsing texte → Date reste à la charge de l'input custom */
	textValue: string | undefined
	updateTextValue: (value: string | undefined) => void
	setFocused: (value: boolean) => void
	/** À attacher via `:ref` sur le bouton qui ouvre le sélecteur visuel */
	toggleBtnRef: Ref<HTMLButtonElement | null>
}
