import { computed, ref, type Ref } from 'vue'

type UseSyAutocompleteValidationOptions = {
	required: Ref<boolean>
	errorMessages: Ref<readonly string[]>
	readonly: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	multiple: Ref<boolean>
	selectedItem: Ref<unknown>
}

export function useSyAutocompleteValidation(options: UseSyAutocompleteValidationOptions) {
	// État interne: "touched" permet de ne pas afficher l'erreur required trop tôt.
	const hasError = ref(false)
	const isTouched = ref(false)

	// Message unique pour required (conservé volontairement, pas de locale ici pour l'instant).
	const requiredErrorMessage = computed(() => 'Le champ est requis.')

	const isRequired = computed(() => {
		// Ne rien afficher en lecture seule / gestion d'erreur désactivée.
		if (options.disableErrorHandling.value) return false
		if (options.readonly.value) return false

		if (options.multiple.value) {
			// Multiple: la valeur est valide si le tableau n'est pas vide.
			const selected = options.selectedItem.value as unknown[] | null | undefined
			return (options.required.value || options.errorMessages.value.length > 0)
				&& (!selected || selected.length === 0)
		}

		// Single: la valeur est valide si selectedItem est défini.
		return (options.required.value || options.errorMessages.value.length > 0) && !options.selectedItem.value
	})

	const computedHasError = computed(() => {
		if (options.disableErrorHandling.value || options.readonly.value) return false
		// Les errorMessages externes ont priorité.
		if (options.errorMessages.value.length > 0) return true
		// Sinon: on affiche l'erreur required uniquement après interaction.
		return Boolean(isTouched.value && isRequired.value)
	})

	const computedErrorMessages = computed(() => {
		if (options.disableErrorHandling.value) return []
		// Les errorMessages externes masquent l'erreur required.
		if (options.errorMessages.value.length > 0) return options.errorMessages.value
		return computedHasError.value ? [requiredErrorMessage.value] : []
	})

	const textFieldErrorMessages = computed(() => {
		return computedErrorMessages.value.length > 0 ? computedErrorMessages.value : undefined
	})

	const requiredRules = computed(() => {
		// Règle utilisée par Vuetify (VTextField) pour l'intégration VForm.
		if (options.disableErrorHandling.value || options.readonly.value) return []
		if (!(options.required.value || options.errorMessages.value.length > 0)) return []
		return [() => (!isRequired.value || requiredErrorMessage.value)]
	})

	const markTouched = () => {
		// Appelée sur blur / clear: marque le champ comme touché et synchronise hasError.
		isTouched.value = true
		hasError.value = computedHasError.value
	}

	const validateOnSubmit = (): boolean => {
		// Appelée par useValidatable (SyForm) lors de la soumission.
		if (options.readonly.value || options.disableErrorHandling.value) {
			return true
		}

		isTouched.value = true
		const isValid = !isRequired.value
		hasError.value = !isValid || options.errorMessages.value.length > 0
		return isValid
	}

	return {
		hasError,
		isTouched,
		isRequired,
		requiredErrorMessage,
		computedHasError,
		computedErrorMessages,
		textFieldErrorMessages,
		requiredRules,
		markTouched,
		validateOnSubmit,
	}
}
