import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
import { useValidatable } from '@/composables/validation/useValidatable'
import { reactive, watch, computed, ref, nextTick } from 'vue'
import type { Ref } from 'vue'

/**
 * Interface between the validation entrypoint "useValidation" composable and the custom validation logic.
 */
export function useCustomValidation(
	modelValue: Ref<unknown>,
	customRules: Ref<ValidationRule[]> | undefined,
	customWarningRules: Ref<ValidationRule[]> | undefined,
	customSuccessRules: Ref<ValidationRule[]> | undefined,
	errors: Ref<string[]>,
	warnings: Ref<string[]>,
	successes: Ref<string[]>,
	showSuccessMessages: Ref<boolean>,
	label: Ref<string | undefined>,
	focused: Ref<boolean>,
	isValidateOnBlur: Ref<boolean>,
	disableErrorHandling: Ref<boolean>,
	readonly?: Ref<boolean>,
	disabled?: Ref<boolean>,
) {
	const hasSuccess = ref(false)

	const validatorOptions = reactive({
		showSuccessMessages: showSuccessMessages.value,
		fieldIdentifier: label.value,
		disableErrorHandling: disableErrorHandling.value,
	})

	const validator = useValidation(validatorOptions)

	watch(
		() => [showSuccessMessages.value, label.value, disableErrorHandling.value],
		() => {
			validatorOptions.showSuccessMessages = showSuccessMessages.value
			validatorOptions.fieldIdentifier = label.value
			validatorOptions.disableErrorHandling = disableErrorHandling.value

			const isDirty = errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0 || hasSuccess.value
			if (isDirty) {
				validate()
			}
		},
	)

	watch(
		() => [customRules?.value, customWarningRules?.value, customSuccessRules?.value],
		() => {
			const isDirty = errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0 || hasSuccess.value
			if (isDirty) {
				validate()
			}
		},
		{ deep: true },
	)

	const isPristine = ref(true)

	async function validate() {
		if (readonly?.value || disabled?.value) {
			errors.value = []
			warnings.value = []
			successes.value = []
			hasSuccess.value = false
			return { hasError: false, hasWarning: false, hasSuccess: false, state: { errors: [] as string[], warnings: [] as string[], successes: [] as string[] } }
		}

		const result = await validator.validateField(
			modelValue.value,
			customRules?.value,
			customWarningRules?.value,
			customSuccessRules?.value,
		)

		isPristine.value = false

		errors.value = result.state.errors
		warnings.value = result.state.warnings
		successes.value = result.state.successes
		hasSuccess.value = result.hasSuccess

		return result
	}

	// Le reset (via useValidatable) remet `modelValue` à `undefined`. En validation
	// live (isValidateOnBlur === false), le watch(modelValue) relancerait aussitôt
	// `validate()` et, pour un champ requis, ré-invaliderait le champ au lieu de le
	// ramener à un état neutre/pristine. On neutralise donc la validation déclenchée
	// par ce reset précis.
	let skipValidationForReset = false

	useValidatable(
		async () => {
			const result = await validate()
			return result.state.errors.length === 0
		},
		() => {
			errors.value = []
			warnings.value = []
			successes.value = []
			isPristine.value = true
			hasSuccess.value = false
		},
		() => {
			skipValidationForReset = true
			modelValue.value = undefined
			// Filet de sécurité : si la valeur était déjà `undefined`, le watch ne se
			// déclenche pas — on lève la garde au tick suivant pour ne pas ignorer une
			// modification utilisateur ultérieure.
			nextTick(() => {
				skipValidationForReset = false
			})
		},
		computed(() => isPristine.value ? null : errors.value.length < 1),
		computed(() => !disableErrorHandling.value || errors.value.length > 0),
	)

	watch(focused, (newVal) => {
		if (isValidateOnBlur.value && !newVal && !disableErrorHandling.value) {
			validate()
		}
	})

	watch(modelValue, () => {
		if (skipValidationForReset) {
			skipValidationForReset = false
			return
		}
		if (!isValidateOnBlur.value && !disableErrorHandling.value) {
			validate()
		}
	})

	function clearValidation() {
		errors.value = []
		warnings.value = []
		successes.value = []
		hasSuccess.value = false
		// Repasser en état vierge : sans ça, un champ précédemment invalidé
		// (isPristine=false) rapporterait `valide=true` après nettoyage au lieu
		// de `null`, alors qu'il n'a pas été revalidé (cf. le reset de useValidatable).
		isPristine.value = true
	}

	return { validate, hasSuccess, clearValidation }
}
