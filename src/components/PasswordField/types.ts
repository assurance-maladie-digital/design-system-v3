import type { ValidationRule } from '@/composables/validation/useValidation'
import type { FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { CustomizableOptions } from '@/composables/useCustomizableOptions'
import type { ColorType } from '@/components/Customs/SyTextField/types'

export interface PasswordFieldProps extends CustomizableOptions, FieldValidationProps {
	modelValue?: string | null
	variantStyle?: 'outlined' | 'underlined'
	color?: ColorType
	label: string
	required?: boolean
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
	readonly?: boolean
	disabled?: boolean
	placeholder?: string
	customRules?: ValidationRule[]
	customWarningRules?: ValidationRule[]
	customSuccessRules?: ValidationRule[]
	showSuccessMessages?: boolean
	displayAsterisk?: boolean
	isValidateOnBlur?: boolean
	disableErrorHandling?: boolean
	bgColor?: string
	autocompleteType?: 'current-password' | 'new-password'
}
