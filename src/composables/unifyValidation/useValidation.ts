import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'
import { computed, ref, toValue, type Ref } from 'vue'
import type { ValidationRule as VuetifyValidationRule } from 'vuetify'
import { useCustomValidation } from './useCustomValidation'
import { useVuetifyValidation as useVuetifyValidationComposable } from './useVuetifyValidation'

export type { VuetifyValidationRule }
export type { SyValidationRule as ValidationRule }

export interface FieldValidationProps {
	customRules?: SyValidationRule[]
	customSuccessRules?: SyValidationRule[]
	customWarningRules?: SyValidationRule[]
	disableErrorHandling?: boolean
	disabled?: boolean
	errorMessages?: string[] | null
	hasError?: boolean
	hasSuccess?: boolean
	hasWarning?: boolean
	isValidateOnBlur?: boolean
	label?: string
	maxErrors?: number
	modelValue?: unknown
	readonly?: boolean
	required?: boolean
	rules?: VuetifyValidationRule[]
	showSuccessMessages?: boolean
	successMessages?: string[] | null
	// When true (Vuetify native mode), the controller should not handle errors/successes
	useVuetifyValidation?: boolean
	warningMessages?: string[] | null
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
	showSuccessMessages: false,
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
	maxErrors?: Ref<number>
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
			errors: computed(() => params.errorMessages?.value || []),
			warnings: computed(() => params.warningMessages?.value || []),
			successes: computed(() => params.successMessages?.value || []),
			hasError: computed(() => (params.errorMessages?.value?.length ?? 0) > 0 || (params.hasErrorProp?.value ?? false)),
			hasWarning: computed(() => (params.warningMessages?.value?.length ?? 0) > 0 || (params.hasWarningProp?.value ?? false)),
			hasSuccess: computed(() => params.hasSuccessProp?.value ?? false),
			validate: async () => true,
			clearValidation: () => {},
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
			computed(() => toValue(params.useVuetifyValidation) ? params.label?.value : undefined),
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

	const errors = computed(() => {
		const allErrors = [...new Set([
			...vuetifyErrors.value,
			...customErrors.value,
			...(params.errorMessages?.value || []),
		])]
		// Plafonne le nombre d'erreurs affichées (maxErrors, défaut 1), tous modes confondus.
		const max = params.maxErrors?.value
		return max && max > 0 ? allErrors.slice(0, max) : allErrors
	})
	const warnings = computed(() => [...new Set([
		...innerWarnings.value,
		...(params.warningMessages?.value || []),
	])])
	const successes = computed(() => [...new Set([
		...(params.showSuccessMessages.value ? innerSuccesses.value : []),
		...(params.successMessages?.value || []),
	])])
	const internalHasSuccess = computed(() => customValidator.hasSuccess.value)

	const hasError = computed(() => errors.value.length > 0 || params.hasErrorProp?.value)
	const hasWarning = computed(() => warnings.value.length > 0 || params.hasWarningProp?.value)

	const state = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return 'default'
	})

	// TODO: vérifier si c'est la meilleure approche pour supprimer le succès en mode Vuetify
	const hasSuccess = computed(() => {
		if (toValue(params.useVuetifyValidation)) {
			return params.hasSuccessProp?.value ?? false
		}
		return (
			(internalHasSuccess.value || (params.successMessages?.value?.length ?? 0) > 0)
			&& !hasError.value
			&& !hasWarning.value
		) || (params.hasSuccessProp?.value ?? false)
	})

	function clearValidation() {
		vuetifyErrors.value = []
		customValidator.clearValidation()
	}

	return {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		state,
		validate,
		clearValidation,
	}
}
