import { computed, ref, type Ref, watch, unref } from 'vue'
import { useValidation, type ValidationRule, type ValidationOptions } from '../useValidation'

export interface FieldValidationProps {
	readonly?: boolean
	disabled?: boolean
	required?: boolean
	isValidateOnBlur?: boolean
	showSuccessMessages?: boolean
	disableErrorHandling?: boolean
	// When true (Vuetify native mode), the controller should not handle errors/successes
	useVuetifyValidation?: boolean
	label?: string
	customRules?: ValidationRule[]
	customWarningRules?: ValidationRule[]
	customSuccessRules?: ValidationRule[]
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
}

// Alias non-breaking pour encourager l'exclusivité entre DS et Vuetify
type DsModeProps = {
	useVuetifyValidation?: false
	customRules?: ValidationRule[]
	customWarningRules?: ValidationRule[]
	customSuccessRules?: ValidationRule[]
}

type VuetifyModeProps = {
	useVuetifyValidation: true
	customRules?: never
	customWarningRules?: never
	customSuccessRules?: never
}

export type ExclusiveFieldValidationProps = Omit<
	FieldValidationProps,
	'useVuetifyValidation' | 'customRules' | 'customWarningRules' | 'customSuccessRules'
> & (DsModeProps | VuetifyModeProps)

export interface UseFieldValidationControllerOptions<T> {
	value: Ref<T | null | undefined>
	props: FieldValidationProps | Ref<FieldValidationProps>
	baseRules?: Ref<ValidationRule[]>
	validationOptions?: Ref<Omit<ValidationOptions, 'customRules' | 'warningRules' | 'successRules'>>
}

export function useFieldValidationController<T>(options: UseFieldValidationControllerOptions<T>) {
	const { value, baseRules, validationOptions } = options
	const propsRef = computed(() => unref(options.props))

	const hasCustomRules = computed(() =>
		(propsRef.value.customRules && propsRef.value.customRules.length > 0)
		|| (propsRef.value.customWarningRules && propsRef.value.customWarningRules.length > 0)
		|| (propsRef.value.customSuccessRules && propsRef.value.customSuccessRules.length > 0),
	)

	if (propsRef.value.useVuetifyValidation && hasCustomRules.value) {
		console.warn('[FieldValidationController] `useVuetifyValidation` est actif : les règles personnalisées (customRules/warning/success) seront ignorées pour éviter des comportements ambigus.')
	}

	const internalErrorMessages = ref<string[]>([])
	const internalWarningMessages = ref<string[]>([])
	const internalSuccessMessages = ref<string[]>([])

	const shouldDisableErrorHandling = computed(() => Boolean(propsRef.value.disableErrorHandling || propsRef.value.useVuetifyValidation))

	const shouldSkipValidation = computed(() =>
		propsRef.value.readonly
		|| propsRef.value.disabled
		|| propsRef.value.disableErrorHandling
		|| Boolean(validationOptions?.value?.disableErrorHandling),
	)
	const hasCustomRequiredRule = computed(() => (propsRef.value.customRules || []).some(rule => rule.type === 'required'))

	watch(() => value.value, () => {
		if (!propsRef.value.isValidateOnBlur && !shouldSkipValidation.value) {
			runValidation()
		}
	}, { immediate: false })

	const optionsRef = computed<ValidationOptions>(() => ({
		showSuccessMessages: propsRef.value.showSuccessMessages,
		fieldIdentifier: propsRef.value.label,
		disableErrorHandling: propsRef.value.disableErrorHandling,
		...(validationOptions?.value || {}),
	}))

	const validation = useValidation(optionsRef)

	const allRules = computed<ValidationRule[]>(() => [
		...(baseRules?.value || []),
		...(propsRef.value.customRules || []),
	])

	const warningRules = computed<ValidationRule[]>(() => propsRef.value.customWarningRules || [])
	const successRules = computed<ValidationRule[]>(() => propsRef.value.customSuccessRules || [])

	// Les messages externes font foi des que la propriete est fournie,
	// mm s'il s'agit d'un tableau vide (pour effacer les messages).
	const hasExternalErrors = computed(() => propsRef.value.errorMessages !== null && propsRef.value.errorMessages !== undefined)
	const hasExternalWarnings = computed(() => propsRef.value.warningMessages !== null && propsRef.value.warningMessages !== undefined)
	const hasExternalSuccesses = computed(() => propsRef.value.successMessages !== null && propsRef.value.successMessages !== undefined)

	const errors = computed(() => {
		if (shouldDisableErrorHandling.value) return []
		if (hasExternalErrors.value) return propsRef.value.errorMessages || []
		return internalErrorMessages.value
	})

	const warnings = computed(() => {
		if (shouldDisableErrorHandling.value) return []
		if (hasExternalWarnings.value) return propsRef.value.warningMessages || []
		return internalWarningMessages.value
	})

	const successes = computed(() => {
		if (shouldDisableErrorHandling.value || propsRef.value.showSuccessMessages === false) return []
		if (hasExternalSuccesses.value) return propsRef.value.successMessages || []
		return internalSuccessMessages.value
	})

	const hasError = computed(() => errors.value.length > 0)
	const hasWarning = computed(() => warnings.value.length > 0)
	const hasSuccess = computed(() => successes.value.length > 0 && !hasError.value && !hasWarning.value)

	const clearValidation = () => {
		internalErrorMessages.value = []
		internalWarningMessages.value = []
		internalSuccessMessages.value = []
		validation.clearValidation()
	}

	const runValidation = () => {
		if (shouldSkipValidation.value) {
			clearValidation()
			return true
		}

		if (
			(value.value === null || value.value === undefined || value.value === '')
			&& !propsRef.value.required
			&& !hasCustomRequiredRule.value
		) {
			clearValidation()
			return true
		}

		internalErrorMessages.value = []
		internalWarningMessages.value = []
		internalSuccessMessages.value = []

		const result = validation.validateField(
			value.value as unknown,
			allRules.value,
			warningRules.value,
			successRules.value,
		)

		internalErrorMessages.value = [...validation.errors.value]
		internalWarningMessages.value = [...validation.warnings.value]
		internalSuccessMessages.value = [...validation.successes.value]

		return !result.hasError
	}

	const isBlurred = ref(false)

	const validateOnBlur = () => {
		isBlurred.value = true
		if (propsRef.value.isValidateOnBlur && !shouldDisableErrorHandling.value) {
			return runValidation()
		}
		return true
	}

	const validateOnChange = () => {
		if (!propsRef.value.isValidateOnBlur && !shouldDisableErrorHandling.value) {
			return runValidation()
		}
		return true
	}

	const validateOnSubmit = () => {
		if (propsRef.value.readonly) return true
		isBlurred.value = true
		return runValidation()
	}

	return {
		// états
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		isBlurred,

		// méthodes
		validateOnBlur,
		validateOnChange,
		validateOnSubmit,
		clearValidation,
	}
}
