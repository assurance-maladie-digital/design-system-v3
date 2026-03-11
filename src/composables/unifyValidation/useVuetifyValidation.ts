import { watch, type Ref } from 'vue'
import type { ValidationRule } from 'vuetify'
import { useValidation } from 'vuetify/lib/composables/validation.mjs'

export function useVuetifyValidation(
	modelValue: Ref<unknown>,
	rules: Ref<ValidationRule[] | undefined>,
	disabled: Ref<boolean>,
	errors: Ref<string[]>,
	error: Ref<boolean>,
	errorMessages: Ref<string[]>,
	focused: Ref<boolean>,
	maxErrors: Ref<number>,
	name: Ref<string>,
	label: Ref<string>,
	readonly: Ref<boolean>,
	validateOn: 'input' | 'blur' | 'submit',
) {
	const proxifiedProps = {
		get 'disabled'() {
			return !!disabled.value
		},
		get 'error'() {
			return !!error.value
		},
		get 'errorMessages'() {
			return errorMessages.value
		},
		get 'focused'() {
			return !!focused.value
		},
		get 'maxErrors'() {
			return maxErrors.value
		},
		get 'name'() {
			return name.value
		},
		get 'label'() {
			return label.value
		},
		get 'readonly'() {
			return !!readonly.value
		},
		get 'rules'() {
			return rules.value || []
		},
		get 'modelValue'() {
			return modelValue.value
		},
		set 'modelValue'(value: unknown) {
			modelValue.value = value
		},
		get 'validateOn'() {
			return validateOn
		},
		get 'validationValue'() {
			return modelValue.value
		},
		'onUpdate:modelValue': (value: unknown) => {
			modelValue.value = value
		},
	}
	const vuetifyValidator = useValidation(
		proxifiedProps,
	)

	watch (() => vuetifyValidator.errorMessages.value, (newVal) => {
		if (vuetifyValidator.isPristine.value) {
			return
		}
		errors.value = newVal
	})

	return vuetifyValidator
}
