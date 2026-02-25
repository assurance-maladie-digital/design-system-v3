import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
import { useValidatable } from '@/main'
import type { Ref } from 'vue'

export function useCustomValidation(
	modelValue: Ref<unknown>,
	customRules: Ref<ValidationRule[]>,
	customWarningRules: Ref<ValidationRule[]> | undefined,
	customSuccessRules: Ref<ValidationRule[]> | undefined,
	errors: Ref<string[]>,
	warnings: Ref<string[]>,
	successes: Ref<string[]>,
	showSuccessMessages: Ref<boolean>,
	label: Ref<string>,
) {
	const validator = useValidation({
		showSuccessMessages: showSuccessMessages.value,
		fieldIdentifier: label.value,
		customRules: customRules.value,
		warningRules: customWarningRules?.value,
		successRules: customSuccessRules?.value,
		disableErrorHandling: false,
	})

	async function validate() {
		const result = await validator.validateField(
			modelValue.value,
			customRules.value,
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

	return { validate }
}
