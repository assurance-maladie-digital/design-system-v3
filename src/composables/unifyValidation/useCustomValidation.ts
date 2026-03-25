import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
import { useValidatable } from '@/composables/validation/useValidatable'
import { watch } from 'vue'
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
	label: Ref<string>,
	focused: Ref<boolean>,
	isValidateOnBlur: Ref<boolean>,
	disableErrorHandling: Ref<boolean>,
) {
	let validator = useValidation({
		showSuccessMessages: showSuccessMessages.value,
		fieldIdentifier: label.value,
		customRules: customRules?.value,
		warningRules: customWarningRules?.value,
		successRules: customSuccessRules?.value,
		disableErrorHandling: disableErrorHandling.value,
	})

	watch(
		() => [showSuccessMessages.value, label.value, customRules?.value, customWarningRules?.value, customSuccessRules?.value, disableErrorHandling.value],
		() => {
			validator = useValidation({
				showSuccessMessages: showSuccessMessages.value,
				fieldIdentifier: label.value,
				customRules: customRules?.value,
				warningRules: customWarningRules?.value,
				successRules: customSuccessRules?.value,
				disableErrorHandling: disableErrorHandling.value,
			})

			const isDirty = errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0
			if (isDirty) {
				validate()
			}
		},
		{ deep: true },
	)

	async function validate() {
		const result = await validator.validateField(
			modelValue.value,
			customRules?.value,
			customWarningRules?.value,
			customSuccessRules?.value,
		)

		errors.value = result.state.errors
		warnings.value = result.state.warnings
		successes.value = result.state.successes

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
		},
		() => modelValue.value = undefined,
	)

	watch(focused, (newVal) => {
		if (!newVal && !disableErrorHandling.value) {
			validate()
		}
	})

	watch(modelValue, () => {
		if (!isValidateOnBlur.value && !disableErrorHandling.value) {
			validate()
		}
	})

	return { validate }
}
