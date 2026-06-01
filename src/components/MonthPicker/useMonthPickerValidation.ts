import { type ValidationRule } from '@/composables/validation/useValidation'
import { computed } from 'vue'

export type ValidationProps = {
	customRules?: ValidationRule[]
	customWarningRules?: ValidationRule[]
	customSuccessRules?: ValidationRule[]
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
	hasError?: boolean
	hasWarning?: boolean
	hasSuccess?: boolean
	successDisplay?: 'none' | 'icon' | 'all'
}

export function useMonthPickerValidation(props: ValidationProps) {
	return computed(() => ({
		customRules: props.customRules,
		customWarningRules: props.customWarningRules,
		customSuccessRules: props.customSuccessRules,
		errorMessages: props.errorMessages,
		warningMessages: props.warningMessages,
		successMessages: props.successMessages,
		hasError: props.hasError,
		hasWarning: props.hasWarning,
		hasSuccess: props.hasSuccess,
		successDisplay: props.successDisplay,
	}))
}
