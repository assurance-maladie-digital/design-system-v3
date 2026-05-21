import { computed, type Ref } from 'vue'
import { useValidation } from '@/composables/unifyValidation/useValidation'
import type { ValidationRule as SyValidationRule, VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'
import { mdiAlertOutline, mdiCheck, mdiAlertCircle } from '@mdi/js'

export function useSyTextFieldValidation(params: {
	modelValue: Ref<string | number | null | undefined>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	required: Ref<boolean>
	isValidateOnBlur: Ref<boolean>
	showSuccessMessages: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	useVuetifyValidation: Ref<boolean>
	label: Ref<string | undefined>
	focused: Ref<boolean>
	customRules: Ref<SyValidationRule[]>
	customWarningRules: Ref<SyValidationRule[] | undefined>
	customSuccessRules: Ref<SyValidationRule[] | undefined>
	rules: Ref<VuetifyValidationRule[] | undefined>
	errorMessages: Ref<string[] | null | undefined>
	warningMessages: Ref<string[] | null | undefined>
	successMessages: Ref<string[] | null | undefined>
	hasErrorProp: Ref<boolean>
	hasWarningProp: Ref<boolean>
	hasSuccessProp: Ref<boolean>
	maxErrors: Ref<number>
}) {
	const defaultRules = computed<SyValidationRule[]>(() =>
		params.required.value
			? [{
				type: 'required',
				options: {
					message: `Le champ ${params.label.value || 'ce champ'} est requis.`,
					fieldIdentifier: params.label.value,
				},
			}]
			: [],
	)

	const { validate, errors, warnings, successes, hasError, hasWarning, hasSuccess, clearValidation } = useValidation({
		modelValue: params.modelValue,
		readonly: params.readonly,
		disabled: params.disabled,
		required: params.required,
		isValidateOnBlur: params.isValidateOnBlur,
		showSuccessMessages: params.showSuccessMessages,
		disableErrorHandling: params.disableErrorHandling,
		useVuetifyValidation: params.useVuetifyValidation,
		label: params.label,
		rules: params.rules,
		customRules: computed(() => [
			...defaultRules.value,
			...(params.customRules.value ?? []),
		]),
		customWarningRules: params.customWarningRules as Ref<SyValidationRule[]>,
		customSuccessRules: params.customSuccessRules as Ref<SyValidationRule[]>,
		errorMessages: params.errorMessages,
		warningMessages: params.warningMessages,
		successMessages: params.successMessages,
		hasErrorProp: params.hasErrorProp,
		hasWarningProp: params.hasWarningProp,
		hasSuccessProp: params.hasSuccessProp,
		maxErrors: params.maxErrors,
		focused: params.focused,
	})

	const iconColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return 'rgba(0, 0, 0, 1)'
	})

	const clearButtonColorClass = computed(() => {
		if (hasError.value) return 'error-field'
		if (hasWarning.value) return 'warning-field'
		if (hasSuccess.value) return 'success-field'
		return 'text-iconBase'
	})

	const validationIcon = computed(() => {
		if (hasError.value) return mdiAlertCircle
		if (hasWarning.value) return mdiAlertOutline
		if (hasSuccess.value) return mdiCheck
		return null
	})

	const hasMessages = computed(() => {
		if (params.disableErrorHandling.value) return false
		return (params.errorMessages.value?.length ?? 0) > 0 || hasError.value || hasWarning.value || (hasSuccess.value && params.showSuccessMessages.value)
	})

	return {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		iconColor,
		clearButtonColorClass,
		validationIcon,
		hasMessages,
		validate,
		clearValidation,
	}
}
