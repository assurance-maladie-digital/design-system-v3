import { type ValidationRule } from '@/composables/validation/useValidation'
import { computed, ref, type Ref } from 'vue'
import { useValidation } from '@/composables/unifyValidation/useValidation'
import type { locales } from './locales'
import type { VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'
import type { Indicatif } from './types'

export function usePhoneFieldValidation(params: {
	modelValue: Ref<string>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	required: Ref<boolean>
	counter: Ref<number>
	phoneFieldIdentifier: Ref<string>
	shouldDisableErrorHandling: Ref<boolean>
	hasError: Ref<boolean>
	hasWarning: Ref<boolean>
	hasSuccess: Ref<boolean>
	showSuccessMessages: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	isValidateOnBlur: Ref<boolean>
	focused: Ref<boolean>
	customRules: Ref<ValidationRule[]>
	warningRules?: Ref<ValidationRule[]>
	successRules?: Ref<ValidationRule[]>
	rules?: Ref<VuetifyValidationRule[] | undefined>
	errorMessages?: Ref<string[] | null | undefined>
	warningMessages?: Ref<string[] | null | undefined>
	successMessages?: Ref<string[] | null | undefined>
	locales: Ref<typeof locales>
	useVuetifyValidation?: Ref<boolean>
	dialCode?: Ref<Indicatif>
	withCountryCode?: Ref<boolean>
}) {
	const validationRules = computed<ValidationRule[]>(() => {
		const rules = [] as ValidationRule[]

		rules.push({
			type: 'exactLength',
			options: {
				length: params.counter.value,
				ignoreSpace: true,
				message: params.locales.value.errorLength(params.counter.value),
				successMessage: params.locales.value.success(params.phoneFieldIdentifier.value),
				fieldIdentifier: params.phoneFieldIdentifier.value,
			},
		})

		if (params.required.value) {
			rules.unshift({
				type: 'required',
				options: {
					length: params.counter.value,
					ignoreSpace: true,
					message: params.locales.value.errorRequired(params.phoneFieldIdentifier.value),
					fieldIdentifier: params.phoneFieldIdentifier.value,
				},
			})
		}

		return rules
	})

	const { hasError, hasWarning, hasSuccess, errors, warnings, successes, state, validate, clearValidation } = useValidation({
		modelValue: params.modelValue,
		readonly: params.readonly,
		disabled: params.disabled,
		required: params.required,
		isValidateOnBlur: params.isValidateOnBlur,
		showSuccessMessages: params.showSuccessMessages,
		disableErrorHandling: params.disableErrorHandling,
		label: params.phoneFieldIdentifier,
		focused: params.focused,
		customRules: computed(() => [
			...validationRules.value,
			...params.customRules.value,
		]),
		customWarningRules: params.warningRules ?? ref([]),
		customSuccessRules: params.successRules ?? ref([]),
		useVuetifyValidation: params.useVuetifyValidation ?? ref(false),
		rules: params.rules ?? ref(undefined),
		hasErrorProp: params.hasError,
		hasWarningProp: params.hasWarning,
		hasSuccessProp: params.hasSuccess,
		errorMessages: params.errorMessages,
		warningMessages: params.warningMessages,
		successMessages: params.successMessages,
	})

	const iconColor = computed(() => {
		if (params.shouldDisableErrorHandling.value) return '#222324'
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return '#222324'
	})

	const clearButtonColorClass = computed(() => {
		if (hasError.value) return 'error-field'
		if (hasWarning.value) return 'warning-field'
		if (hasSuccess.value) return 'success-field'
		return 'text-icon-base'
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
		validationRules,
		state,
		validate,
		clearValidation,
	}
}
