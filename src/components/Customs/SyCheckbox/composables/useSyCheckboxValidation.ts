import { computed, toRef, type ComputedRef, type Ref } from 'vue'
import { useValidation, type ValidationRule } from '@/composables/unifyValidation/useValidation'
import type { SyCheckboxValidationProps } from '../types'
import { locales as defaultLocales } from '../locales'
import { mergeLocales } from '@/utils/locales/mergeLocales'

export interface UseSyCheckboxValidationReturn {
	validate: () => Promise<boolean>
	validateOnSubmit: () => Promise<boolean>
	clearValidation: () => void
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	hasError: ComputedRef<boolean | undefined>
	hasWarning: ComputedRef<boolean | undefined>
	hasSuccess: ComputedRef<boolean | undefined>
	defaultRules: ComputedRef<ValidationRule[]>
}

/**
 * Composable de validation du composant SyCheckbox
 *
 * Version simplifiée du système unifié : pour une case à cocher, « required » signifie
 * que la case doit être cochée (`value === true`). On utilise donc une règle `custom`
 * plutôt que la règle `required` générique, qui considère `false` comme une valeur valide.
 *
 * @example
 * const { validate, errors, hasError } = useSyCheckboxValidation(props, model, focused)
 */
export function useSyCheckboxValidation(
	props: SyCheckboxValidationProps,
	model: Ref<boolean | null>,
	focused: Ref<boolean>,
): UseSyCheckboxValidationReturn {
	// « required » pour une case = doit être cochée (true)
	const locales = mergeLocales(defaultLocales, props.locales)
	const defaultRules = computed<ValidationRule[]>(() =>
		props.required
			? [{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === true,
						message: locales.requiredField(props.label),
						fieldIdentifier: props.label,
					},
				}]
			: [],
	)

	// Vuetify ne gère pas les messages de succès : on les désactive en mode Vuetify
	const effectiveShowSuccessMessages = computed(() =>
		props.useVuetifyValidation ? false : (props.showSuccessMessages ?? false),
	)

	const {
		validate,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
	} = useValidation({
		modelValue: model,
		readonly: toRef(() => props.readonly ?? false),
		disabled: toRef(() => props.disabled ?? false),
		required: toRef(() => props.required ?? false),
		isValidateOnBlur: toRef(() => props.isValidateOnBlur ?? false),
		showSuccessMessages: effectiveShowSuccessMessages,
		disableErrorHandling: toRef(() => props.disableErrorHandling ?? false),
		useVuetifyValidation: toRef(() => props.useVuetifyValidation ?? false),
		label: toRef(() => props.label ?? ''),
		rules: toRef(() => props.rules),
		customRules: computed(() => [...defaultRules.value, ...(props.customRules ?? [])]),
		customWarningRules: toRef(() => props.customWarningRules ?? []),
		customSuccessRules: toRef(() => props.customSuccessRules ?? []),
		errorMessages: toRef(() => props.errorMessages ?? null),
		warningMessages: toRef(() => props.warningMessages ?? null),
		successMessages: toRef(() => props.successMessages ?? null),
		hasErrorProp: toRef(() => props.hasError ?? false),
		hasWarningProp: toRef(() => props.hasWarning ?? false),
		hasSuccessProp: toRef(() => props.hasSuccess ?? false),
		maxErrors: toRef(() => props.maxErrors ?? 1),
		focused: focused,
	})

	const validateOnSubmit = async (): Promise<boolean> => {
		return await validate()
	}

	return {
		validate,
		validateOnSubmit,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		defaultRules,
	}
}
