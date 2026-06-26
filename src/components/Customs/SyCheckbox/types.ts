import type { FieldValidationProps, ValidationRule, VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'

/**
 * Props du composant SyCheckbox
 */
export interface SyCheckboxProps extends FieldValidationProps {
	modelValue?: boolean | null
	indeterminate?: boolean
	label?: string
	helpText?: string
	ariaLabel?: string
	ariaLabelledby?: string
	title?: string
	color?: string
	hideDetails?: boolean | 'auto'
	density?: 'default' | 'comfortable' | 'compact'
	id?: string
	name?: string
	value?: unknown
	trueValue?: unknown
	falseValue?: unknown
	controlsIds?: string[]
	displayAsterisk?: boolean
	decorative?: boolean
}

/**
 * Props de validation passées au composable dédié
 */
export interface SyCheckboxValidationProps extends FieldValidationProps {
	modelValue?: boolean | null
	required?: boolean
	readonly?: boolean
	disabled?: boolean
	label?: string
	customRules?: ValidationRule[]
	customWarningRules?: ValidationRule[]
	customSuccessRules?: ValidationRule[]
	isValidateOnBlur?: boolean
	showSuccessMessages?: boolean
	useVuetifyValidation?: boolean
	rules?: VuetifyValidationRule[]
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
	hasError?: boolean
	hasWarning?: boolean
	hasSuccess?: boolean
	maxErrors?: number
	disableErrorHandling?: boolean
}
