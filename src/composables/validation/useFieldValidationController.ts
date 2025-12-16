import { computed, ref, type Ref } from 'vue'
import { useValidation, type ValidationRule, type ValidationOptions } from './useValidation'

export interface FieldValidationProps {
	readonly?: boolean
	disabled?: boolean
	required?: boolean
	isValidateOnBlur?: boolean
	showSuccessMessages?: boolean
	disableErrorHandling?: boolean
	label?: string
	customRules?: ValidationRule[]
	customWarningRules?: ValidationRule[]
	customSuccessRules?: ValidationRule[]
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
}

export interface UseFieldValidationControllerOptions<T> {
	value: Ref<T | null | undefined>
	props: FieldValidationProps
	baseRules?: ValidationRule[]
	validationOptions?: Omit<ValidationOptions, 'customRules' | 'warningRules' | 'successRules'>
}

export function useFieldValidationController<T>(options: UseFieldValidationControllerOptions<T>) {
	const { value, props, baseRules = [], validationOptions } = options

	const internalErrorMessages = ref<string[]>([])
	const internalWarningMessages = ref<string[]>([])
	const internalSuccessMessages = ref<string[]>([])

	const shouldDisableErrorHandling = computed(() => props.disableErrorHandling)

	const validation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: props.label,
		disableErrorHandling: props.disableErrorHandling,
		...validationOptions,
	})

	const allRules = computed<ValidationRule[]>(() => [
		...(baseRules || []),
		...(props.customRules || []),
	])

	const warningRules = computed<ValidationRule[]>(() => props.customWarningRules || [])
	const successRules = computed<ValidationRule[]>(() => props.customSuccessRules || [])

	const hasExternalErrors = computed(() => (props.errorMessages?.length || 0) > 0)
	const hasExternalWarnings = computed(() => (props.warningMessages?.length || 0) > 0)
	const hasExternalSuccesses = computed(() => (props.successMessages?.length || 0) > 0)

	const errors = computed(() => {
		if (shouldDisableErrorHandling.value) return []
		if (hasExternalErrors.value && props.errorMessages) return props.errorMessages
		return internalErrorMessages.value
	})

	const warnings = computed(() => {
		if (shouldDisableErrorHandling.value) return []
		if (hasExternalWarnings.value && props.warningMessages) return props.warningMessages
		return internalWarningMessages.value
	})

	const successes = computed(() => {
		if (shouldDisableErrorHandling.value || props.showSuccessMessages === false) return []
		if (hasExternalSuccesses.value && props.successMessages) return props.successMessages
		return internalSuccessMessages.value
	})

	const hasError = computed(() => errors.value.length > 0)
	const hasWarning = computed(() => warnings.value.length > 0)
	const hasSuccess = computed(() => successes.value.length > 0 && !hasError.value && !hasWarning.value)

	const clearValidation = () => {
		internalErrorMessages.value = []
		internalWarningMessages.value = []
		internalSuccessMessages.value = []
		validation.clearValidation()
	}

	const runValidation = () => {
		if (props.readonly || props.disabled || props.disableErrorHandling) {
			clearValidation()
			return true
		}

		if (
			(value.value === null || value.value === undefined || value.value === '')
			&& !props.required
			&& !(props.customRules || []).some(rule => rule.type === 'required')
		) {
			clearValidation()
			return true
		}

		internalErrorMessages.value = []
		internalWarningMessages.value = []
		internalSuccessMessages.value = []

		const result = validation.validateField(
			value.value as unknown,
			allRules.value,
			warningRules.value,
			successRules.value,
		)

		internalErrorMessages.value = [...validation.errors.value]
		internalWarningMessages.value = [...validation.warnings.value]
		internalSuccessMessages.value = [...validation.successes.value]

		return !result.hasError
	}

	const isBlurred = ref(false)

	const validateOnBlur = () => {
		isBlurred.value = true
		if (props.isValidateOnBlur && !shouldDisableErrorHandling.value) {
			return runValidation()
		}
		return true
	}

	const validateOnChange = () => {
		if (!props.isValidateOnBlur && !shouldDisableErrorHandling.value) {
			return runValidation()
		}
		return true
	}

	const validateOnSubmit = () => {
		if (props.readonly) return true
		isBlurred.value = true
		return runValidation()
	}

	return {
		// états
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		isBlurred,

		// méthodes
		validateOnBlur,
		validateOnChange,
		validateOnSubmit,
		clearValidation,
	}
}
