import { ref, computed, watch } from 'vue'

// Types
type ValidationRule = (value: unknown) => boolean | string
type InputValidationRules = ValidationRule[]
type InputMessage = string | string[]

export function useValidatable(props: {
	value: unknown
	rules?: InputValidationRules
	error?: boolean
	errorMessages?: InputMessage
	success?: boolean
	successMessages?: InputMessage
	validateOnBlur?: boolean
	errorCount?: number
}) {
	const lazyValue = ref(props.value)
	const errorBucket = ref<string[]>([])
	const hasInput = ref(false)
	const hasFocused = ref(false)
	const isFocused = ref(false)
	const isResetting = ref(false)
	const valid = ref(false)

	// Calculer si la validation doit être effectuée
	const shouldValidate = computed(() =>
		props.error || isResetting.value
			? false
			: props.validateOnBlur
				? hasFocused.value && !isFocused.value
				: hasInput.value || hasFocused.value,
	)

	const hasError = computed(() =>
		errorBucket.value.length > 0 || props.error,
	)

	const hasSuccess = computed(() =>
		props.success && !hasError.value,
	)

	// Méthodes de validation
	function validate(force = false, value?: unknown): boolean {
		if (!force && !shouldValidate.value) {
			return valid.value // Évite de recalculer si la validation n'est pas nécessaire
		}

		const errors: string[] = []
		value = value || lazyValue.value

		props.rules?.forEach((rule) => {
			const result = typeof rule === 'function' ? rule(value) : rule
			if (typeof result === 'string') {
				errors.push(result)
			}
		})

		errorBucket.value = errors
		valid.value = errors.length === 0
		return valid.value
	}

	function reset() {
		isResetting.value = true
		lazyValue.value = Array.isArray(lazyValue.value) ? [] : undefined
		validate()
	}

	function resetValidation() {
		isResetting.value = true
		errorBucket.value = []
		valid.value = true
	}

	// Watchers pour suivre les changements d'état
	watch(() => props.value, (val) => {
		lazyValue.value = val
		validate()
	})

	watch(isFocused, (val) => {
		if (!val && shouldValidate.value) {
			validate() // Valide uniquement si `shouldValidate` est vrai
		}
	})

	return {
		lazyValue,
		errorBucket,
		hasError,
		hasSuccess,
		shouldValidate,
		validate,
		reset,
		resetValidation,
		isFocused,
		hasInput,
		hasFocused,
	}
}
