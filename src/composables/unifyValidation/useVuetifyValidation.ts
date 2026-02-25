import { computed, useId, type Ref } from 'vue'
import type { ValidationRule } from 'vuetify'
import { useValidation } from 'vuetify/lib/composables/validation.mjs'

export function useVuetifyValidation(
	modelValue: Ref<unknown>,
	rules: Ref<ValidationRule[] | undefined>,
	errors: Ref<string[]>,
	disabled: Ref<boolean>,
	error: Ref<boolean>,
	errorMessages: Ref<string[]>,
	focused: Ref<boolean>,
	maxErrors: Ref<number>,
	name: Ref<string>,
	label: Ref<string>,
	readonly: Ref<boolean>,
	validateOn: 'input' | 'blur' | 'submit',
	validationValue: unknown,
) {
	const uid = useId()
	useValidation(
		{
			'disabled': computed(() => !!disabled.value),
			error,
			errorMessages,
			focused,
			maxErrors,
			name,
			label,
			readonly,
			rules,
			modelValue,
			'onUpdate:modelValue': (value: unknown) => modelValue.value = value,
			'validateOn': 'input',
			'validationValue': modelValue.value,

		},
	)

	function validate(): void {
		errors.value = []
		if (!rules.value) return

		for (const rule of rules.value) {
			if (!rule) continue
			const result = rule(modelValue.value)
			if (result === true) continue
			if (typeof result === 'string') {
				errors.value.push(result)
			}
			else {
				errors.value.push('Invalid field.')
			}
		}
	}

	return {
		validate,
	}
}
