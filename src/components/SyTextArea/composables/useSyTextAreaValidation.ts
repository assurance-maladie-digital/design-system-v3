import { computed, ref } from 'vue'
import { mdiAlertCircle, mdiAlertOutline, mdiCheck } from '@mdi/js'
import type { Ref } from 'vue'
import { useDefaultValidationRules } from '../useDefaultValidationRules'
import { useValidation, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'

export function useSyTextAreaValidation(
	props: FieldValidationProps & { maxLines?: number },
	{
		internalValue,
		hasInteracted,
	}: {
		internalValue: Ref<string>
		hasInteracted: Ref<boolean>
	},
) {
	const focused = ref(false)

	const { vuetifyRules: defaultVuetifyRules, customRules: defaultCustomRules } = useDefaultValidationRules({
		required: computed(() => props.required ?? false),
		maxLines: computed(() => props.maxLines),
		hasInteracted,
	})

	const mergedCustomRules = computed<SyValidationRule[]>(() => [
		...defaultCustomRules.value,
		...(props.customRules ?? []),
	])

	const mergedVuetifyRules = computed(() => [
		...(props.rules ?? []),
		...defaultVuetifyRules.value,
	])

	const { validate, clearValidation, errors, warnings, successes, hasError, hasWarning, hasSuccess } = useValidation({
		modelValue: internalValue,
		readonly: computed(() => props.readonly ?? false),
		disabled: computed(() => props.disabled ?? false),
		required: computed(() => props.required ?? false),
		isValidateOnBlur: computed(() => props.isValidateOnBlur ?? true),
		showSuccessMessages: computed(() => props.showSuccessMessages ?? true),
		disableErrorHandling: computed(() => props.disableErrorHandling ?? false),
		useVuetifyValidation: computed(() => props.useVuetifyValidation ?? false),
		label: computed(() => props.label ?? ''),
		rules: mergedVuetifyRules,
		customRules: mergedCustomRules,
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
		if (hasSuccess.value) return mdiCheck
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
		mergedVuetifyRules,
	}
}
