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
	const valid = ref(false)

	const hasError = computed(() =>
		errorBucket.value.length > 0 || props.error,
	)

	const hasSuccess = computed(() =>
		props.success && !hasError.value,
	)

	function validate(force = false, value?: unknown): boolean {
		const errors: string[] = []
		value = value || lazyValue.value

		if (force) {
			hasInput.value = true
			hasFocused.value = true
		}

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

	// function reset() {
	// 	isResetting.value = true
	// 	lazyValue.value = Array.isArray(lazyValue.value) ? [] : undefined
	// 	validate()
	// }
	//
	// function resetValidation() {
	// 	isResetting.value = true
	// 	errorBucket.value = []
	// 	valid.value = true
	// }

	watch(() => props.value, (val) => {
		lazyValue.value = val
		validate()
	})

	return {
		lazyValue,
		errorBucket,
		hasError,
		hasSuccess,
		validate,
		isFocused,
		hasInput,
		hasFocused,
	}
}
