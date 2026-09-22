import { computed, type Ref } from 'vue'
import { useValidation } from '@/composables/unifyValidation/useValidation'
import type { ValidationRule as SyValidationRule, VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'
import type { SyTextFieldLocales } from './locales'

export function useSyTextFieldValidation(params: {
	modelValue: Ref<string | number | null | undefined | string[]>
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
	locales: Ref<SyTextFieldLocales>
}) {
	const defaultRules = computed<SyValidationRule[]>(() =>
		params.required.value
			? [{
					type: 'required',
					options: {
						message: params.locales.value.requiredField(params.label.value),
						fieldIdentifier: params.label.value,
					},
				}]
			: [],
	)

	const { validate, errors, warnings, successes, hasError, hasWarning, hasSuccess, state, clearValidation } = useValidation({
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
		return 'rgb(var(--v-theme-on-surface))'
	})

	const hasMessages = computed(() => {
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
		hasMessages,
		state,
		validate,
		clearValidation,
	}
}
