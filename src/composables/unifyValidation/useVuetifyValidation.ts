import { computed, reactive, watch, type Ref } from 'vue'
import type { ValidationRule } from 'vuetify'
import { useValidation } from 'vuetify/lib/composables/validation.mjs'

/** Interface between the validation entrypoint "useValidation" composable and the Vuetify validation logic. */
export function useVuetifyValidation(
	modelValue: Ref<unknown>,
	rules: Ref<ValidationRule[] | undefined>,
	disabled: Ref<boolean>,
	errors: Ref<string[]>,
	error: Ref<boolean>,
	errorMessages: Ref<string[]>,
	focused: Ref<boolean>,
	maxErrors: Ref<number> | undefined,
	name: Ref<string | undefined>,
	label: Ref<string | undefined>,
	readonly: Ref<boolean>,
	validateOn: Ref<'input' | 'blur' | 'submit'>,
) {
	// The vuetify validation composable expects props to be passed as a single object, so we create a reactive proxified object to pass the relevant props and keep them reactive.
	const proxifiedProps = reactive({
		'disabled': computed(() => !!disabled.value),
		'error': computed(() => !!error.value),
		'errorMessages': computed(() => errorMessages.value),
		'focused': computed(() => !!focused.value),
		'maxErrors': computed(() => maxErrors?.value || 1),
		'name': computed(() => name.value),
		'label': computed(() => label.value),
		'readonly': computed(() => !!readonly.value),
		'rules': computed(() => rules.value || []),
		'modelValue': computed({
			get: () => modelValue.value,
			set: (value: unknown) => { modelValue.value = value },
		}),
		'validateOn': computed(() => validateOn.value),
		'validationValue': computed(() => modelValue.value),
		'onUpdate:modelValue': (value: unknown) => {
			modelValue.value = value
		},
	})

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
