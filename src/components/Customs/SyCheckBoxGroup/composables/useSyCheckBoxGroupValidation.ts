import { computed, ref, toRef, type ComputedRef, type Ref } from 'vue'
import { useValidation, type FieldValidationProps, type ValidationRule, type VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'

export interface SyCheckBoxGroupValidationProps extends FieldValidationProps {
	modelValue?: (string | number) | (string | number)[] | null
	multiple?: boolean
	required?: boolean
	readonly?: boolean
	disabled?: boolean
	customRules?: ValidationRule[]
	customWarningRules?: ValidationRule[]
	customSuccessRules?: ValidationRule[]
	isValidateOnBlur?: boolean
	showSuccessMessages?: boolean
	useVuetifyValidation?: boolean
	rules?: VuetifyValidationRule[]
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
	hasError?: boolean
	hasWarning?: boolean
	hasSuccess?: boolean
	maxErrors?: number
	disableErrorHandling?: boolean
	fieldIdentifier?: string
}

export interface UseSyCheckBoxGroupValidationReturn {
	validate: () => Promise<boolean>
	validateOnSubmit: () => Promise<boolean>
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
	focused?: Ref<boolean>,
): UseSyCheckBoxGroupValidationReturn {
	// Utiliser la variable focused passée en paramètre, sinon en créer une locale
	const focusedRef = focused || ref(false)

	// Construction des règles de validation par défaut (required)
	const defaultRules = computed<ValidationRule[]>(() =>
		props.required
			? [{
					type: 'required',
					options: {
						message: `Le champ ${props.fieldIdentifier || props.label || 'ce champ'} est requis.`,
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
		focused: focusedRef,
	})

	const validateOnSubmit = async (): Promise<boolean> => {
		return await validate()
	}

	return {
		validate,
		validateOnSubmit,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		defaultRules,
		focused: focusedRef,
	}
}
