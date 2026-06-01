import { computed, ref } from 'vue'
import { mdiAlertCircle, mdiAlertOutline, mdiCheck } from '@mdi/js'
import { useValidation, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { ValidationRule } from '@/composables/validation/useValidation'

export function useSySelectValidation(props: FieldValidationProps & { modelValue?: unknown }) {
	const focused = ref(false)

	const defaultRules = computed<ValidationRule[]>(() => props.required
		? [{
				type: 'required',
				options: {
					message: `Le champ ${props.label || 'ce champ'} est requis.`,
					fieldIdentifier: props.label,
				},
			}]
		: [],
	)

	const { validate, clearValidation, errors, warnings, successes, hasError, hasWarning, hasSuccess } = useValidation({
		modelValue: computed(() => props.modelValue),
		readonly: computed(() => props.readonly ?? false),
		disabled: computed(() => props.disabled ?? false),
		required: computed(() => props.required ?? false),
		isValidateOnBlur: computed(() => props.isValidateOnBlur ?? false),
		showSuccessMessages: computed(() => props.successDisplay === 'all'),
		disableErrorHandling: computed(() => props.disableErrorHandling ?? false),
		useVuetifyValidation: computed(() => props.useVuetifyValidation ?? false),
		label: computed(() => props.label ?? ''),
		rules: computed(() => props.rules ?? []),
		customRules: computed(() => [...defaultRules.value, ...(props.customRules ?? [])]),
		customWarningRules: computed(() => props.customWarningRules ?? []),
		customSuccessRules: computed(() => props.customSuccessRules ?? []),
		errorMessages: computed(() => props.errorMessages ?? []),
		warningMessages: computed(() => props.warningMessages ?? []),
		successMessages: computed(() => props.successMessages ?? []),
		hasErrorProp: computed(() => props.hasError ?? false),
		hasWarningProp: computed(() => props.hasWarning ?? false),
		hasSuccessProp: computed(() => props.hasSuccess ?? false),
		maxErrors: computed(() => props.maxErrors ?? 1),
		focused,
	})

	const validationIcon = computed(() => {
		if (props.useVuetifyValidation) return null
		if (hasError.value) return mdiAlertCircle
		if (hasWarning.value) return mdiAlertOutline
		if (hasSuccess.value && props.successDisplay !== 'none') return mdiCheck
		return null
	})

	return {
		focused,
		validate,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validationIcon,
	}
}
