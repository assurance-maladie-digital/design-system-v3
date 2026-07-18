import { type locales } from './locales'
import type { FieldValidationProps, ValidationRule, VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'

export type Option = {
	label: string
	value: string | number
	disabled?: boolean
	readonly?: boolean
	id?: string
	name?: string
	ariaLabel?: string
	title?: string
}

/**
 * Props du composant SyCheckBoxGroup
 */
export interface SyCheckBoxGroupProps extends FieldValidationProps {
	ariaLabel?: string
	ariaLabelledby?: string
	color?: string
	density?: 'default' | 'comfortable' | 'compact'
	displayAsterisk?: boolean
	helpText?: string
	hideDetails?: boolean | 'auto'
	id?: string
	label?: string
	modelValue?: (string | number) | (string | number)[] | null
	multiple?: boolean
	name?: string
	options?: Option[]
	title?: string
	locales?: typeof locales
}

/**
 * Props de validation étendant FieldValidationProps du système unifié
 */
export interface SyCheckBoxGroupValidationProps extends FieldValidationProps {
	modelValue?: (string | number) | (string | number)[] | null
	multiple?: boolean
	required?: boolean
	readonly?: boolean
	disabled?: boolean
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
	fieldIdentifier?: string
	locales?: typeof locales
}
