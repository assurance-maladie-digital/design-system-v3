import { computed, ref } from 'vue'
import { mdiAlertCircle, mdiAlertOutline, mdiCheck } from '@mdi/js'
import { useValidation, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { ValidationRule } from '@/composables/validation/useValidation'
import { locales as defaultLocales } from '../locales'
import { mergeLocales, type DeepPartial } from '@/utils/locales/mergeLocales'

/**
 * Composable de validation dédié au composant SelectBtnField.
 * - règle `required` par défaut avec message personnalisé,
 * - support des customRules / customWarningRules / customSuccessRules,
 * - messages externes (errorMessages / warningMessages / successMessages),
 * - validation immédiate à la sélection (isValidateOnBlur à `false` par défaut, comme un groupe de boutons),
 * - intégration automatique au SyForm via le useValidatable interne à useValidation.
 */
export function useSelectBtnFieldValidation(props: FieldValidationProps & { modelValue?: unknown, locales?: DeepPartial<typeof defaultLocales> }) {
	const focused = ref(false)

	const locales = mergeLocales(defaultLocales, props.locales)

	const defaultRules = computed<ValidationRule[]>(() => props.required
		? [{
				type: 'required',
				options: {
					message: locales.requiredField(props.label),
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
		showSuccessMessages: computed(() => props.showSuccessMessages ?? false),
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

	// Un champ simplement rempli n'est pas « en succès » : sans cela, le composable legacy
	// marque succès dès qu'une valeur est saisie (successRules vides + valeur remplie),
	// ce qui ferait passer l'item sélectionné en vert sur toutes les stories. On n'autorise
	// donc l'état de succès que s'il existe une source explicite (règle de succès, règle
	// portant un successMessage, message de succès injecté, ou succès forcé).
	const hasExplicitSuccessSource = computed(() =>
		(props.customSuccessRules?.length ?? 0) > 0
		|| (props.customRules ?? []).some(rule => !!rule.options?.successMessage)
		|| (props.successMessages?.length ?? 0) > 0
		|| (props.hasSuccess ?? false),
	)

	const effectiveHasSuccess = computed(() => hasExplicitSuccessSource.value && hasSuccess.value)
	const effectiveSuccesses = computed(() => hasExplicitSuccessSource.value ? successes.value : [])

	const validationIcon = computed(() => {
		if (props.useVuetifyValidation) return null
		if (hasError.value) return mdiAlertCircle
		if (hasWarning.value) return mdiAlertOutline
		if (effectiveHasSuccess.value) return mdiCheck
		return null
	})

	return {
		focused,
		validate,
		clearValidation,
		errors,
		warnings,
		successes: effectiveSuccesses,
		hasError,
		hasWarning,
		hasSuccess: effectiveHasSuccess,
		validationIcon,
	}
}
