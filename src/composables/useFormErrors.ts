import { ref, type Ref } from 'vue'

interface FormErrors {
	[key: string]: string[] // Key: field name, value: array of error messages
}

interface ValidationRule {
	message: string
	validate: (value: string) => boolean
}

// Required validation rule
const required: ValidationRule = {
	message: 'Ce champ est requis.',
	validate: (value: string) => value.trim() !== '',
}

// Minimum length validation rule
const minLength = (min: number): ValidationRule => ({
	message: `Ce champ doit contenir au moins ${min} caractères.`,
	validate: (value: string) => value.length >= min,
})

export function useFormErrors() {
	const errors: Ref<FormErrors> = ref({}) // Store field errors

	// Function to add an error
	const addError = (field: string, message: string) => {
		if (!errors.value[field]) {
			errors.value[field] = []
		}
		errors.value[field].push(message)
	}

	// Function to reset all errors
	const resetErrors = () => {
		errors.value = {}
	}

	// Function to validate fields based on specified rules
	const validateField = (field: string, value: string, rules: ValidationRule[]) => {
		// Apply all rules
		rules.forEach((rule) => {
			const result = rule.validate(value)
			if (!result) {
				addError(field, rule.message)
			}
		})
	}

	return {
		errors,
		addError,
		resetErrors,
		validateField,
		required,
		minLength,
	}
}
