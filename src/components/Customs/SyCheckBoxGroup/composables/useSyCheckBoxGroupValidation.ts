import { computed, toRef, type ComputedRef, type Ref } from 'vue'
import { useValidation, type ValidationRule } from '@/composables/unifyValidation/useValidation'
import type { SyCheckBoxGroupValidationProps } from '../types'

export interface UseSyCheckBoxGroupValidationReturn {
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
	focused: Ref<boolean>
}

/**
 * Composable pour gérer la validation du composant SyCheckBoxGroup
 *
 * Ce composable encapsule toute la logique de validation spécifique aux groupes de checkboxes :
 * - Validation required avec message personnalisé (supporte les modes single et multiple)
 * - Support des customRules, customWarningRules, customSuccessRules
 * - Désactivation automatique des messages de succès en mode Vuetify
 * - Intégration avec useValidation du design system
 *
 * @example
 * const { validate, errors, hasError, defaultRules } = useSyCheckBoxGroupValidation(props, model)
 */
export function useSyCheckBoxGroupValidation(
	props: SyCheckBoxGroupValidationProps,
	model: Ref<(string | number) | (string | number)[] | null>,
	focused: Ref<boolean>,
	locales: Ref<{
		requiredField: (identifier: string | undefined) => string
	}>,
): UseSyCheckBoxGroupValidationReturn {
	const defaultRules = computed<ValidationRule[]>(() =>
		props.required
			? [{
					type: 'required',
					options: {
						message: locales.value.requiredField(props.fieldIdentifier || props.label),
						fieldIdentifier: props.label,
					},
				}]
			: [],
	)

	// Vuetify ne gère pas les messages de succès, on désactive automatiquement en mode Vuetify
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
		customRules: computed(() => [...defaultRules.value, ...(props.customRules || [])]),
		customWarningRules: toRef(() => props.customWarningRules ?? []),
		customSuccessRules: toRef(() => props.customSuccessRules ?? []),
		errorMessages: toRef(() => props.errorMessages ?? null),
		warningMessages: toRef(() => props.warningMessages ?? null),
		successMessages: toRef(() => props.successMessages ?? null),
		hasErrorProp: toRef(() => props.hasError ?? false),
		hasWarningProp: toRef(() => props.hasWarning ?? false),
		hasSuccessProp: toRef(() => props.hasSuccess ?? false),
		maxErrors: toRef(() => props.maxErrors ?? 1),
		focused,
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
		focused,
	}
}
