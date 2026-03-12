import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
import { useValidatable } from '@/main'
import { watch } from 'vue'
import type { Ref } from 'vue'

export function useCustomValidation(
	modelValue: Ref<unknown>,
	customRules: Ref<ValidationRule[]>,
	customWarningRules: Ref<ValidationRule[]>,
	customSuccessRules: Ref<ValidationRule[]>,
	errors: Ref<string[]>,
	warnings: Ref<string[]>,
	successes: Ref<string[]>,
	showSuccessMessages: Ref<boolean>,
	label: Ref<string>,
	focused: Ref<boolean>,
) {
	const validator = useValidation({
		showSuccessMessages: showSuccessMessages.value,
		fieldIdentifier: label.value,
		customRules: customRules.value,
		warningRules: customWarningRules.value,
		successRules: customSuccessRules.value,
		disableErrorHandling: false,
	})

	async function validate() {
		const result = await validator.validateField(
			modelValue.value,
			customRules.value,
			customWarningRules.value,
			customSuccessRules.value,
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
		if (!newVal) {
			validate()
		}
	})

	return { validate }
}
