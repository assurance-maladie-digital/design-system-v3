import type { ValidationRule as SyValidationRule, ValidationResult } from '@/composables/validation/useValidation'
import { computed, ref, toRef, watch, type Ref } from 'vue'
import type { ValidationRule } from 'vuetify'
import { useCustomValidation } from './useCustomValidation'
import { useVuetifyValidation as useVuetifyValidationComposable } from './useVuetifyValidation'
export interface FieldValidationProps {
	modelValue: unknown
	readonly?: boolean
	disabled?: boolean
	required?: boolean
	isValidateOnBlur?: boolean
	showSuccessMessages?: boolean
	disableErrorHandling?: boolean
	// When true (Vuetify native mode), the controller should not handle errors/successes
	useVuetifyValidation?: boolean
	label: string
	rules?: ValidationRule[]
	customRules?: SyValidationRule[]
	customWarningRules?: SyValidationRule[]
	customSuccessRules?: SyValidationRule[]
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
	hasError?: boolean
	hasWarning?: boolean
	hasSuccess?: boolean
}

export const validationPropsDefaults = {
	readonly: false,
	disabled: false,
	required: false,
	isValidateOnBlur: true,
	showSuccessMessages: true,
	disableErrorHandling: false,
	customRules: () => [],
	customWarningRules: () => [],
	customSuccessRules: () => [],
	errorMessages: null,
	warningMessages: null,
	successMessages: null,
	useVuetifyValidation: false,
	hasError: false,
	hasWarning: false,
	hasSuccess: false,
}

export function useValidation(
	modelValue: Ref<unknown>,
	readonly: Ref<boolean>,
	disabled: Ref<boolean>,
	required: Ref<boolean>,
	isValidateOnBlur: Ref<boolean>,
	showSuccessMessages: Ref<boolean>,
	disableErrorHandling: Ref<boolean>,
	useVuetifyValidation: Ref<boolean>,
	label: Ref<string>,
	rules: Ref<ValidationRule[] | undefined>,
	customRules: Ref<SyValidationRule[]>,
	customWarningRules: Ref<SyValidationRule[]>,
	customSuccessRules: Ref<SyValidationRule[]>,
	errorMessages: Ref<string[] | null | undefined>,
	warningMessages: Ref<string[] | null | undefined>,
	successMessages: Ref<string[] | null | undefined>,
	hasErrorProp: Ref<boolean>,
	hasWarningProp: Ref<boolean>,
	hasSuccessProp: Ref<boolean>,
) {
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])

	watch(errorMessages, (newVal) => {
		errors.value = newVal || []
	}, { immediate: true })

	watch(warningMessages, (newVal) => {
		warnings.value = newVal || []
	}, { immediate: true })

	watch(successMessages, (newVal) => {
		successes.value = newVal || []
	}, { immediate: true })

	const vuetifyValidator = useVuetifyValidationComposable(
		modelValue,
		rules,
		disabled,
		errors,
		hasErrorProp,
		computed(() => errorMessages.value || []),
		ref(false), // focused
		ref(1), // maxErrors
		label,
		label,
		readonly,
		'input',
	)

	const customValidator = useCustomValidation(
		modelValue,
		customRules,
		customWarningRules,
		customSuccessRules,
		errors,
		warnings,
		successes,
		showSuccessMessages,
		label,
	)

	async function validate(): Promise<boolean> {
		if (readonly.value || disabled.value || disableErrorHandling.value) {
			errors.value = []
			warnings.value = []
			successes.value = []

			return true
		}
		console.log('useVuetifyValidation.value', useVuetifyValidation.value)

		if (useVuetifyValidation.value) {
			const result = await vuetifyValidator.validate()
			console.log('Vuetify validation result:', result)
			return result.length === 0
		}

		else {
			const result = await customValidator.validate()
			return result.state.errors.length === 0
		}
	}

	const hasError = computed(() => errors.value.length > 0 || hasErrorProp.value)
	const hasWarning = computed(() => warnings.value.length > 0 || hasWarningProp.value)
	const hasSuccess = computed(() => (successes.value.length > 0 && !hasError.value && !hasWarning.value) || hasSuccessProp.value)

	return {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validate,
	}
}
