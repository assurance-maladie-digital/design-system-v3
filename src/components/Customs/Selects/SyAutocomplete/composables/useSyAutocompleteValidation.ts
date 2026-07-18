import { computed, ref, toRef, watch } from 'vue'
import type { Ref } from 'vue'
import type { ValidationRule as VuetifyValidationRule } from 'vuetify'
import { mdiAlertCircle, mdiAlertOutline, mdiCheck } from '@mdi/js'
import { type ValidationRule } from '@/composables/validation/useValidation'
import { useValidation, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import { useValidatable } from '@/composables/validation/useValidatable'
import type { locales as defaultLocales } from '../locales'

export function useSyAutocompleteValidation(props: FieldValidationProps & { locales: typeof defaultLocales }) {
	const hasInteracted = ref(false)
	const focused = ref(false)

	const defaultRules = computed<ValidationRule[]>(() =>
		props.required
			? [{
					type: 'required',
					options: {
						message: props.locales.requiredField(props.label),
						fieldIdentifier: props.label,
					},
				}]
			: [],
	)

	const { validate, clearValidation, errors, warnings, successes, hasError, hasWarning, hasSuccess } = useValidation({
		modelValue: toRef(props, 'modelValue') as Ref<unknown>,
		readonly: toRef(props, 'readonly') as Ref<boolean>,
		disabled: toRef(props, 'disabled') as Ref<boolean>,
		required: toRef(props, 'required') as Ref<boolean>,
		isValidateOnBlur: toRef(props, 'isValidateOnBlur') as Ref<boolean>,
		showSuccessMessages: toRef(props, 'showSuccessMessages') as Ref<boolean>,
		disableErrorHandling: toRef(props, 'disableErrorHandling') as Ref<boolean>,
		useVuetifyValidation: toRef(props, 'useVuetifyValidation') as Ref<boolean>,
		label: toRef(props, 'label') as Ref<string | undefined>,
		rules: toRef(props, 'rules') as Ref<VuetifyValidationRule[] | undefined>,
		customRules: computed(() => [...defaultRules.value, ...(props.customRules ?? [])]),
		customWarningRules: toRef(props, 'customWarningRules') as Ref<ValidationRule[]>,
		customSuccessRules: toRef(props, 'customSuccessRules') as Ref<ValidationRule[]>,
		errorMessages: toRef(props, 'errorMessages') as Ref<string[] | null | undefined>,
		warningMessages: toRef(props, 'warningMessages') as Ref<string[] | null | undefined>,
		successMessages: toRef(props, 'successMessages') as Ref<string[] | null | undefined>,
		hasErrorProp: toRef(props, 'hasError') as Ref<boolean>,
		hasWarningProp: toRef(props, 'hasWarning') as Ref<boolean>,
		hasSuccessProp: toRef(props, 'hasSuccess') as Ref<boolean>,
		maxErrors: toRef(props, 'maxErrors') as Ref<number>,
		focused,
	})

	watch([errors, warnings, successes], ([e, w, s]) => {
		if (e.length > 0 || w.length > 0 || s.length > 0) hasInteracted.value = true
	})

	const markInteracted = () => {
		hasInteracted.value = true
	}

	const displayErrors = computed(() => hasInteracted.value ? errors.value : [])
	const displayWarnings = computed(() => hasInteracted.value ? warnings.value : [])
	const displaySuccesses = computed(() => hasInteracted.value ? successes.value : [])
	const displayHasError = computed(() => hasInteracted.value && hasError.value)
	const displayHasWarning = computed(() => hasInteracted.value && hasWarning.value)
	const displayHasSuccess = computed(() => hasInteracted.value && hasSuccess.value)

	const validationIcon = computed(() => {
		if (props.useVuetifyValidation) return null
		if (displayHasError.value) return mdiAlertCircle
		if (displayHasWarning.value) return mdiAlertOutline
		if (displayHasSuccess.value) return mdiCheck
		return null
	})

	const validateOnSubmit = async () => {
		markInteracted()
		return await validate()
	}

	const validateOnBlur = () => {
		markInteracted()
		focused.value = false
		validate()
	}

	useValidatable(validateOnSubmit, clearValidation)

	return {
		focused,
		hasInteracted,
		markInteracted,
		validate,
		clearValidation,
		validateOnSubmit,
		validateOnBlur,
		displayErrors,
		displayWarnings,
		displaySuccesses,
		displayHasError,
		displayHasWarning,
		displayHasSuccess,
		validationIcon,
	}
}
