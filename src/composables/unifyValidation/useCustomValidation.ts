import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
import { useValidatable } from '@/composables/validation/useValidatable'
import { reactive, watch, computed, ref } from 'vue'
import type { Ref } from 'vue'

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
) {
	const hasSuccess = ref(false)

	const validatorOptions = reactive({
		showSuccessMessages: showSuccessMessages.value,
		fieldIdentifier: label.value,
		disableErrorHandling: disableErrorHandling.value,
	})

	const validator = useValidation(validatorOptions)

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

	const isPristine = ref(true)
	const skipNextAutoValidation = ref(false)

	async function validate() {
		if (readonly?.value || disabled?.value) {
			errors.value = []
			warnings.value = []
			successes.value = []
			hasSuccess.value = false
			return { hasError: false, hasWarning: false, hasSuccess: false, state: { errors: [] as string[], warnings: [] as string[], successes: [] as string[] } }
		}

		const result = await validator.validateField(
			modelValue.value,
			customRules?.value,
			customWarningRules?.value,
			customSuccessRules?.value,
		)

		isPristine.value = false

		errors.value = result.state.errors
		warnings.value = result.state.warnings
		successes.value = result.state.successes
		hasSuccess.value = result.hasSuccess

		return result
	}

	useValidatable(
		async () => {
			const result = await validate()
			return result.state.errors.length === 0
		},
		() => {
			errors.value = []
			warnings.value = []
			successes.value = []
			isPristine.value = true
			hasSuccess.value = false
		},
		() => modelValue.value = undefined,
		computed(() => isPristine.value ? null : errors.value.length < 1),
		computed(() => !disableErrorHandling.value || errors.value.length > 0),
	)

	watch(focused, (newVal) => {
		if (isValidateOnBlur.value && !newVal && !disableErrorHandling.value) {
			validate()
		}
	})

	watch(modelValue, () => {
		if (skipNextAutoValidation.value) {
			skipNextAutoValidation.value = false
			return
		}

		if (!isValidateOnBlur.value && !disableErrorHandling.value) {
			validate()
		}
	})

	function clearValidation(options?: { silent?: boolean }) {
		errors.value = []
		warnings.value = []
		successes.value = []
		hasSuccess.value = false
		isPristine.value = true

		// Silent clear also skips the immediate auto-validation triggered by the model reset.
		if (options?.silent) {
			skipNextAutoValidation.value = true
		}
	}

	return { validate, hasSuccess, clearValidation }
}
