import { computed, toValue, type Ref } from 'vue'
import { useValidation, type VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'
import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'
import type { locales as defaultLocales } from './locales'

export function useCaptchaValidation(params: {
	modelValue: Ref<string | null>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	required: Ref<boolean>
	isValidateOnBlur: Ref<boolean>
	showSuccessMessages: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	useVuetifyValidation: Ref<boolean>
	label: Ref<string>
	rules: Ref<VuetifyValidationRule[] | undefined>
	customRules: Ref<SyValidationRule[] | undefined>
	customWarningRules: Ref<SyValidationRule[] | undefined>
	customSuccessRules: Ref<SyValidationRule[] | undefined>
	errorMessages: Ref<string[] | undefined | null>
	warningMessages: Ref<string[] | undefined | null>
	successMessages: Ref<string[] | undefined | null>
	hasErrorProp: Ref<boolean>
	hasWarningProp: Ref<boolean>
	hasSuccessProp: Ref<boolean>
	maxErrors: Ref<number | undefined>
	focused: Ref<boolean>
	locales: Ref<typeof defaultLocales>
},
) {
	const defaultRules = computed<SyValidationRule[]>(() => params.required
		? [{
				type: 'required',
				options: {
					message: params.locales.value.required,
					fieldIdentifier: params.label.value,
				},
			}]
		: [],
	)

	const { validate, clearValidation, errors, warnings, successes, hasError, hasWarning, hasSuccess } = useValidation({
		modelValue: params.modelValue,
		readonly: params.readonly,
		disabled: params.disabled,
		required: params.required,
		isValidateOnBlur: params.isValidateOnBlur,
		showSuccessMessages: params.showSuccessMessages,
		disableErrorHandling: params.disableErrorHandling,
		useVuetifyValidation: params.useVuetifyValidation,
		label: params.label ?? '',
		rules: params.rules ?? [],
		customRules: computed(() => [...toValue(defaultRules.value), ...(params.customRules.value ?? [])]),
		customWarningRules: computed(() => params.customWarningRules.value ?? []),
		customSuccessRules: computed(() => params.customSuccessRules.value ?? []),
		errorMessages: params.errorMessages,
		warningMessages: params.warningMessages,
		successMessages: params.successMessages,
		hasErrorProp: params.hasErrorProp,
		hasWarningProp: params.hasWarningProp,
		hasSuccessProp: params.hasSuccessProp,
		maxErrors: computed(() => params.maxErrors.value ?? 1),
		focused: params.focused,
	})

	return {
		validate,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
	}
}
