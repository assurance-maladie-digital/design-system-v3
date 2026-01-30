import { computed, type Ref } from 'vue'
import { type FieldValidationProps } from './FieldValidationController'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFieldValidationProps(props: any): Ref<FieldValidationProps> {
	return computed(() => ({
		readonly: props.readonly,
		disabled: props.disabled,
		required: props.required,
		isValidateOnBlur: props.isValidateOnBlur,
		showSuccessMessages: props.showSuccessMessages,
		disableErrorHandling: props.disableErrorHandling,
		useVuetifyValidation: props.useVuetifyValidation ?? false,
		label: props.label,
		customRules: props.customRules,
		customWarningRules: props.customWarningRules,
		customSuccessRules: props.customSuccessRules,
		errorMessages: props.errorMessages,
		warningMessages: props.warningMessages,
		successMessages: props.successMessages,
	}))
}
