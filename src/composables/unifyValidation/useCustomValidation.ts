import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
import { useValidatable } from '@/composables/validation/useValidatable'
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'

export interface UseCustomValidationOptions {
	registerWithForm?: boolean
	reactiveValidation?: boolean
	formRegistration?: {
		validateOnSubmit?: () => Promise<boolean> | boolean
		clearValidation?: () => void
		reset?: () => void
	}
}

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
	options: UseCustomValidationOptions = {},
) {
	const hasSuccess = ref(false)
	let currentValidationToken = 0
	let pendingValidationToken: number | undefined
	// Champ jamais encore validé : permet à `useValidatable` de rapporter `valide=null`
	// (au lieu de `true`) tant qu'aucune validation réelle n'a eu lieu.
	const isPristine = ref(true)
	// Résultat de la validation silencieuse au montage (n'écrit jamais dans errors/warnings/
	// successes, donc n'affiche jamais de message) : seule source de vérité pour `valide` tant que isPristine.
	const silentValide = ref<boolean | null>(null)

	const validatorOptions = reactive({
		showSuccessMessages: computed(() => showSuccessMessages.value),
		fieldIdentifier: computed(() => label.value),
		disableErrorHandling: computed(() => disableErrorHandling.value),
	})

	const validator = useValidation(validatorOptions)

	const emptyValidationResult = () => ({
		hasError: false,
		hasWarning: false,
		hasSuccess: false,
		state: {
			errors: [] as string[],
			warnings: [] as string[],
			successes: [] as string[],
		},
	})

	const applyValidationResult = (result: Awaited<ReturnType<typeof validator.validateField>>) => {
		isPristine.value = false

		errors.value = result.state.errors
		warnings.value = result.state.warnings
		successes.value = result.state.successes
		hasSuccess.value = result.hasSuccess

		return result
	}

	function validateValue(
		value = modelValue.value,
		rules = customRules?.value,
		warningRules = customWarningRules?.value,
		successRules = customSuccessRules?.value,
	) {
		const token = ++currentValidationToken
		if (readonly?.value || disabled?.value || disableErrorHandling.value) {
			clearValidation()
			return emptyValidationResult()
		}

		const result = validator.validateField(value, rules, warningRules, successRules)

		if (result instanceof Promise) {
			pendingValidationToken = token
			return result.then(resolved => token === currentValidationToken
				? applyValidationResult(resolved)
				: emptyValidationResult()).finally(() => {
				if (pendingValidationToken === token) pendingValidationToken = undefined
			})
		}

		return applyValidationResult(result)
	}
	const validate = () => validateValue(modelValue.value)

	// Évalue la validité réelle sans jamais écrire dans errors/warnings/successes, pour que
	// `valide` sorte de `null` dès le montage sans faire apparaître de message prématuré.
	async function validateSilently() {
		if (readonly?.value || disabled?.value || disableErrorHandling.value) return

		const token = currentValidationToken
		const result = await validator.validateField(
			modelValue.value,
			customRules?.value,
			customWarningRules?.value,
			customSuccessRules?.value,
		)

		if (token !== currentValidationToken || !isPristine.value) return

		silentValide.value = result.state.errors.length === 0
	}

	function clearValidation() {
		currentValidationToken++
		pendingValidationToken = undefined
		validator.clearValidation()
		errors.value = []
		warnings.value = []
		successes.value = []
		hasSuccess.value = false
		isPristine.value = true
		silentValide.value = null
	}

	if (getCurrentInstance()) {
		onBeforeUnmount(clearValidation)
	}
	if (getCurrentInstance() && options.reactiveValidation !== false) {
		onMounted(() => {
			void validateSilently()
		})
	}
	watch([() => readonly?.value, () => disabled?.value, disableErrorHandling], () => {
		if (readonly?.value || disabled?.value || disableErrorHandling.value) clearValidation()
	}, { flush: 'sync' })

	const validateOnSubmit = options.formRegistration?.validateOnSubmit ?? (async () => {
		const result = await validate()
		return result.state.errors.length === 0
	})

	// Le reset (via useValidatable) remet `modelValue` à `undefined`. En validation
	// live (isValidateOnBlur === false), le watch(modelValue) ci-dessous relancerait
	// aussitôt `validate()` et, pour un champ requis, ré-invaliderait le champ au lieu
	// de le ramener à un état neutre/pristine. On neutralise donc la validation
	// déclenchée par ce reset précis.
	let skipValidationForReset = false

	const reset = options.formRegistration?.reset ?? (() => {
		skipValidationForReset = true
		clearValidation()
		modelValue.value = undefined
		validateSilently()
		// Filet de sécurité : si la valeur était déjà `undefined`, le watch ne se
		// déclenche pas — on lève la garde au tick suivant pour ne pas ignorer une
		// modification utilisateur ultérieure.
		nextTick(() => {
			skipValidationForReset = false
		})
	})

	if (options.registerWithForm !== false) {
		useValidatable(
			validateOnSubmit,
			options.formRegistration?.clearValidation ?? clearValidation,
			reset,
			computed(() => isPristine.value ? silentValide.value : errors.value.length < 1),
			computed(() => !disableErrorHandling.value || errors.value.length > 0),
			isPristine,
		)
	}

	if (options.reactiveValidation !== false) {
		watch(
			() => [customRules?.value, customWarningRules?.value, customSuccessRules?.value],
			() => {
				const isDirty = pendingValidationToken !== undefined || errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0 || hasSuccess.value
				if (isDirty) {
					validate()
				}
			},
			{ deep: true, flush: 'sync' },
		)

		watch(
			() => [showSuccessMessages.value, label.value, disableErrorHandling.value],
			() => {
				const isDirty = pendingValidationToken !== undefined || errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0 || hasSuccess.value
				if (isDirty) {
					validate()
				}
			},
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
			if (pendingValidationToken !== undefined) clearValidation()
			if (!isValidateOnBlur.value && !disableErrorHandling.value) {
				validate()
			}
			else if (isPristine.value && !disableErrorHandling.value) {
				validateSilently()
			}
		}, { flush: 'sync' })
	}

	return { validate, validateValue, hasSuccess, clearValidation, reset, isPristine }
}
