import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
import { useValidatable } from '@/composables/validation/useValidatable'
import { reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'

export interface UseCustomValidationOptions {
	registerWithForm?: boolean
	reactiveValidation?: boolean
	formRegistration?: {
		validateOnSubmit?: () => Promise<boolean> | boolean
		clearValidation?: () => void
		reset?: () => void
	}
}

/**
 * Interface between the validation entrypoint "useValidation" composable and the custom validation logic.
 */
export function useCustomValidation(
	modelValue: Ref<unknown>,
	customRules: Ref<ValidationRule[]> | undefined,
	customWarningRules: Ref<ValidationRule[]> | undefined,
	customSuccessRules: Ref<ValidationRule[]> | undefined,
	errors: Ref<string[]>,
	warnings: Ref<string[]>,
	successes: Ref<string[]>,
	showSuccessMessages: Ref<boolean>,
	label: Ref<string | undefined>,
	focused: Ref<boolean>,
	isValidateOnBlur: Ref<boolean>,
	disableErrorHandling: Ref<boolean>,
	readonly?: Ref<boolean>,
	disabled?: Ref<boolean>,
	options: UseCustomValidationOptions = {},
) {
	const hasSuccess = ref(false)

	const validatorOptions = reactive({
		showSuccessMessages: showSuccessMessages.value,
		fieldIdentifier: label.value,
		disableErrorHandling: disableErrorHandling.value,
	})

	const validator = useValidation(validatorOptions)

	const emptyValidationResult = () => ({
		hasError: false,
		hasWarning: false,
		hasSuccess: false,
		state: {
			errors: [] as string[],
			warnings: [] as string[],
			successes: [] as string[],
		},
	})

	const applyValidationResult = (result: Awaited<ReturnType<typeof validator.validateField>>) => {
		errors.value = result.state.errors
		warnings.value = result.state.warnings
		successes.value = result.state.successes
		hasSuccess.value = result.hasSuccess

		return result
	}

	function validateValue(
		value = modelValue.value,
		rules = customRules?.value,
		warningRules = customWarningRules?.value,
		successRules = customSuccessRules?.value,
	) {
		if (readonly?.value || disabled?.value) {
			errors.value = []
			warnings.value = []
			successes.value = []
			hasSuccess.value = false
			return emptyValidationResult()
		}

		const result = validator.validateField(
			value,
			rules,
			warningRules,
			successRules,
		)

		if (result instanceof Promise) {
			return result.then(applyValidationResult)
		}

		return applyValidationResult(result)
	}
	const validate = () => validateValue()

	function clearValidation() {
		errors.value = []
		warnings.value = []
		successes.value = []
		hasSuccess.value = false
	}

	const validateOnSubmit = options.formRegistration?.validateOnSubmit ?? (async () => {
		const result = await validate()
		return result.state.errors.length === 0
	})

	const reset = options.formRegistration?.reset ?? (() => {
		modelValue.value = undefined
	})

	if (options.registerWithForm !== false) {
		useValidatable(
			validateOnSubmit,
			options.formRegistration?.clearValidation ?? clearValidation,
			reset,
		)
	}

	if (options.reactiveValidation !== false) {
		watch(
			() => [showSuccessMessages.value, label.value, disableErrorHandling.value],
			() => {
				validatorOptions.showSuccessMessages = showSuccessMessages.value
				validatorOptions.fieldIdentifier = label.value
				validatorOptions.disableErrorHandling = disableErrorHandling.value

				const isDirty = errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0 || hasSuccess.value
				if (isDirty) {
					validate()
				}
			},
		)

		watch(
			() => [customRules?.value, customWarningRules?.value, customSuccessRules?.value],
			() => {
				const isDirty = errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0 || hasSuccess.value
				if (isDirty) {
					validate()
				}
			},
			{ deep: true },
		)

		watch(focused, (newVal) => {
			if (isValidateOnBlur.value && !newVal && !disableErrorHandling.value) {
				validate()
			}
		})

		watch(modelValue, () => {
			if (!isValidateOnBlur.value && !disableErrorHandling.value) {
				validate()
			}
		})
	}

	return { validate, validateValue, hasSuccess, clearValidation }
}
