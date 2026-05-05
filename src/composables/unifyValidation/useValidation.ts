import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'
import { computed, ref, toValue, type Ref } from 'vue'
import type { ValidationRule as VuetifyValidationRule } from 'vuetify'
import { useCustomValidation } from './useCustomValidation'
import { useVuetifyValidation as useVuetifyValidationComposable } from './useVuetifyValidation'

export interface FieldValidationProps {
	modelValue?: unknown
	readonly?: boolean
	disabled?: boolean
	required?: boolean
	isValidateOnBlur?: boolean
	showSuccessMessages?: boolean
	disableErrorHandling?: boolean
	// Quand cette prop vaut true (mode natif Vuetify), c'est Vuetify qui gère les erreurs, avertissements et succès
	useVuetifyValidation?: boolean
	label?: string
	rules?: VuetifyValidationRule[]
	// Règles de validation personnalisées d'erreur (bloquantes), évaluées à partir de la valeur du champ
	customRules?: SyValidationRule[]
	// Règles de validation personnalisées d'avertissement (non bloquantes), évaluées à partir de la valeur du champ
	customWarningRules?: SyValidationRule[]
	// Règles de validation personnalisées de succès, évaluées à partir de la valeur du champ
	customSuccessRules?: SyValidationRule[]
	// Messages d'erreur injectés par le parent ; ils n'exécutent aucune logique de validation
	errorMessages?: string[] | null
	// Messages d'avertissement injectés par le parent ; ils n'exécutent aucune logique de validation
	warningMessages?: string[] | null
	// Messages de succès injectés par le parent ; ils n'exécutent aucune logique de validation
	successMessages?: string[] | null
	hasError?: boolean
	hasWarning?: boolean
	hasSuccess?: boolean
	maxErrors?: number
}

/**
 * Point d'entrée de la validation pour les composants de champ.
 * Gère à la fois la validation native Vuetify (si useVuetifyValidation vaut true)
 * et la validation custom Synapse (si customRules/customWarningRules/customSuccessRules sont fournis).
 * customRules correspond aux règles d'erreur bloquantes.
 * errorMessages/warningMessages/successMessages sont des messages externes injectés par le parent
 * et ne déclenchent aucun calcul de validation.
 * Expose aussi une interface unifiée pour les erreurs, avertissements, succès et la validation à la demande.
 */
export const validationPropsDefaults = {
	readonly: false,
	disabled: false,
	required: false,
	isValidateOnBlur: true,
	showSuccessMessages: true,
	disableErrorHandling: false,
	customRules: () => [],
	customWarningRules: () => [],
	customSuccessRules: () => [],
	errorMessages: null,
	warningMessages: null,
	successMessages: null,
	useVuetifyValidation: false,
	hasError: false,
	hasWarning: false,
	hasSuccess: false,
	maxErrors: 1,
}

export function useValidation(params: {
	modelValue: Ref<unknown>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	required: Ref<boolean>
	isValidateOnBlur: Ref<boolean>
	showSuccessMessages: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	label: Ref<string | undefined>
	focused: Ref<boolean>
	errorMessages?: Ref<string[] | null | undefined>
	warningMessages?: Ref<string[] | null | undefined>
	successMessages?: Ref<string[] | null | undefined>
	hasErrorProp?: Ref<boolean>
	hasWarningProp?: Ref<boolean>
	hasSuccessProp?: Ref<boolean>
} & ({
	useVuetifyValidation: true
	rules: Ref<VuetifyValidationRule[] | undefined>
	customRules?: never
	customWarningRules?: never
	customSuccessRules?: never
	maxErrors?: Ref<number>
} | {
	useVuetifyValidation: false
	customRules: Ref<SyValidationRule[]>
	customWarningRules?: Ref<SyValidationRule[]>
	customSuccessRules?: Ref<SyValidationRule[]>
	rules?: never
} | {
	useVuetifyValidation: Ref<boolean>
	customRules: Ref<SyValidationRule[]>
	customWarningRules?: Ref<SyValidationRule[]>
	customSuccessRules?: Ref<SyValidationRule[]>
	rules: Ref<VuetifyValidationRule[] | undefined>
	maxErrors?: Ref<number>
})) {
	if (params.disableErrorHandling.value) {
		return {
			errors: ref<string[]>([]),
			warnings: ref<string[]>([]),
			successes: ref<string[]>([]),
			hasError: computed(() => params.hasErrorProp?.value ?? false),
			hasWarning: computed(() => params.hasWarningProp?.value ?? false),
			hasSuccess: computed(() => params.hasSuccessProp?.value ?? false),
			validate: async () => true,
		}
	}
	const vuetifyErrors = ref<string[]>([])
	const customErrors = ref<string[]>([])
	const innerWarnings = ref<string[]>([])
	const innerSuccesses = ref<string[]>([])

	let vuetifyValidator: ReturnType<typeof useVuetifyValidationComposable> | null = null

	if (params.useVuetifyValidation !== false) {
		vuetifyValidator = useVuetifyValidationComposable(
			params.modelValue,
			params.rules,
			params.disabled,
			vuetifyErrors,
			params.hasErrorProp || ref(false),
			computed(() => params.errorMessages?.value || []),
			params.focused,
			params.maxErrors,
			params.label,
			params.label,
			params.readonly,
			computed(() => params.isValidateOnBlur.value ? 'blur' : 'input'),
		)
	}

	const customValidator = useCustomValidation(
		params.modelValue,
		params.customRules,
		params.customWarningRules,
		params.customSuccessRules,
		customErrors,
		innerWarnings,
		innerSuccesses,
		params.showSuccessMessages,
		params.label,
		params.focused,
		params.isValidateOnBlur,
		params.disableErrorHandling,
		params.readonly,
		params.disabled,
	)

	async function validate(): Promise<boolean> {
		if (params.readonly.value || params.disabled.value || params.disableErrorHandling.value) {
			vuetifyErrors.value = []
			customErrors.value = []
			innerWarnings.value = []
			innerSuccesses.value = []

			return true
		}

		if (toValue(params.useVuetifyValidation)) {
			const result = await vuetifyValidator!.validate()
			return result?.length === 0
		}

		else {
			const result = await customValidator.validate()
			return result.state.errors.length === 0
		}
	}

	const errors = computed(() => [...new Set([
		...vuetifyErrors.value,
		...customErrors.value,
		...(params.errorMessages?.value || []),
	])])
	const warnings = computed(() => [...new Set([
		...innerWarnings.value,
		...(params.warningMessages?.value || []),
	])])
	const successes = computed(() => [...new Set([
		...(params.showSuccessMessages.value ? innerSuccesses.value : []),
		...(params.successMessages?.value || []),
	])])
	const internalHasSuccess = computed(() => toValue(params.useVuetifyValidation)
		? innerSuccesses.value.length > 0
		: customValidator.hasSuccess.value)

	const hasError = computed(() => errors.value.length > 0 || params.hasErrorProp?.value)
	const hasWarning = computed(() => warnings.value.length > 0 || params.hasWarningProp?.value)
	const hasSuccess = computed(() =>
		(
			(internalHasSuccess.value || (params.successMessages?.value?.length ?? 0) > 0)
			&& !hasError.value
			&& !hasWarning.value
		) || params.hasSuccessProp?.value,
	)

	return {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validate,
	}
}
