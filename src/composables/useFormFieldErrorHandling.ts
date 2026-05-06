import { computed, watch, type Ref } from 'vue'
import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
import { useValidatable } from '@/composables/validation/useValidatable'

export interface UseFormFieldErrorHandlingProps {
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
	hasError?: boolean
	hasWarning?: boolean
	hasSuccess?: boolean
	customRules?: ValidationRule[]
	customWarningRules?: ValidationRule[]
	customSuccessRules?: ValidationRule[]
	showSuccessMessages?: boolean
	disableErrorHandling?: boolean
	required?: boolean
	label?: string
	isValidateOnBlur?: boolean
}

export interface UseFormFieldErrorHandlingReturn {
	validation: ReturnType<typeof useValidation>
	hasError: Ref<boolean>
	hasWarning: Ref<boolean>
	hasSuccess: Ref<boolean>
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	validateField: (value: unknown) => Promise<boolean>
	validateOnSubmit: () => Promise<boolean>
	checkErrorOnBlur: () => void
}

export const useFormFieldErrorHandling = (
	props: UseFormFieldErrorHandlingProps,
	modelValue: Ref<unknown>,
	emitUpdate?: () => void,
): UseFormFieldErrorHandlingReturn => {
	const validation = useValidation({
		showSuccessMessages: props.showSuccessMessages ?? true,
		fieldIdentifier: props.label,
		disableErrorHandling: props.disableErrorHandling ?? false,
	})

	// Synchronisation des messages externes
	watch(() => props.errorMessages, (newVal) => {
		validation.errors.value = newVal || []
	}, { immediate: true })

	watch(() => props.warningMessages, (newVal) => {
		validation.warnings.value = newVal || []
	}, { immediate: true })

	watch(() => props.successMessages, (newVal) => {
		validation.successes.value = newVal || []
	}, { immediate: true })

	// Construction des règles de validation
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

	const validateField = async (value: unknown) => {
		if (props.disableErrorHandling) {
			validation.clearValidation()
			return true
		}

		const isEmptyArray = Array.isArray(value) && value.length === 0

		// Ne pas valider si la valeur est vide et non requise
		if ((value == null || isEmptyArray) && !props.required) {
			validation.clearValidation()
			return true
		}

		const result = await validation.validateField(
			value,
			[...defaultRules.value, ...props.customRules!],
			props.customWarningRules!,
		)

		return !result.hasError
	}

	const validateOnSubmit = () => {
		return validateField(modelValue.value)
	}

	const checkErrorOnBlur = () => {
		validateField(modelValue.value)
		if (emitUpdate) {
			emitUpdate()
		}
	}

	watch(modelValue, (newValue) => {
		if (!props.isValidateOnBlur) {
			validateField(newValue)
		}
	})

	watch(() => props.disableErrorHandling, (isDisabled) => {
		if (isDisabled) {
			validation.clearValidation()
		}
	})

	watch([() => props.required, () => props.label], () => {
		// Re-valider quand les règles changent
		if (modelValue.value != null) {
			validateField(modelValue.value)
		}
	}, { immediate: true })

	const hasError = computed(() => validation.hasError.value || (props.hasError ?? false))
	const hasWarning = computed(() => validation.hasWarning.value || (props.hasWarning ?? false))
	const hasSuccess = computed(() =>
		(validation.hasSuccess.value && !hasError.value && !hasWarning.value)
		|| (props.hasSuccess ?? false),
	)

	const errors = computed(() => [...validation.errors.value, ...(props.errorMessages || [])])
	const warnings = computed(() => validation.warnings.value)
	const successes = computed(() => validation.successes.value)

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit, validation.clearValidation)

	return {
		validation,
		hasError,
		hasWarning,
		hasSuccess,
		errors,
		warnings,
		successes,
		validateField,
		validateOnSubmit,
		checkErrorOnBlur,
	}
}
