import { computed, nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { checkNIR, isNIRKeyValid } from './nirValidation'
import { locales } from './locales'
import { useValidation, type ValidationRule as SyValidationRule } from '@/composables/unifyValidation/useValidation'
import type { SyTextField } from '@/main'
import type { ValidationRule as VuetifyValidationRule } from 'vuetify'

export type NirValidationProps = {
	customKeyRules?: SyValidationRule[]
	customKeyWarningRules?: SyValidationRule[]
	customNumberRules?: SyValidationRule[]
	customNumberWarningRules?: SyValidationRule[]
	customRulesPrecedence?: boolean
	disabled?: boolean
	errorMessages?: string[] | null
	hasError?: boolean
	hasSuccess?: boolean
	hasWarning?: boolean
	isValidateOnBlur?: boolean
	keyLabel?: string
	keyRules?: VuetifyValidationRule[]
	maxErrors?: number
	nirType?: 'simple' | 'complexe'
	numberLabel?: string
	numberRules?: VuetifyValidationRule[]
	readonly?: boolean
	required?: boolean
	showSuccessMessages?: boolean
	successMessages?: string[] | null
	useVuetifyValidation?: boolean
	warningMessages?: string[] | null
}

/**
 * Handle validation for NIR fields, including both the number and the key
 */
export function useNirValidation(
	numberValue: Ref<string>,
	keyValue: Ref<string>,
	unmaskedNumberValue: Ref<string>,
	unmaskedKeyValue: Ref<string>,
	readonly: Ref<boolean>,
	disabled: Ref<boolean>,
	required: Ref<boolean>,
	numberField: Ref<InstanceType<typeof SyTextField> | null>,
	keyField: Ref<InstanceType<typeof SyTextField> | null>,
	customLocale: Ref<typeof locales>,
	numberLabel: Ref<string>,
	keyLabel: Ref<string>,
	customNumberRules: Ref<SyValidationRule[]>,
	customKeyRules: Ref<SyValidationRule[]>,
	customNumberWarningRules: Ref<SyValidationRule[]>,
	customKeyWarningRules: Ref<SyValidationRule[]>,
	displayKey: Ref<boolean>,
	customRulesPrecedence: Ref<boolean>,
	nirType: Ref<'simple' | 'complexe'>,
	label: Ref<string>,
	showSuccessMessages: Ref<boolean>,
	disableErrorHandling: Ref<boolean>,
	isValidateOnBlur: Ref<boolean>,
	useVuetifyValidation: Ref<boolean>,
	vuetifyNumberRules: Ref<VuetifyValidationRule[]>,
	vuetifyKeyRules: Ref<VuetifyValidationRule[]>,
	errorMessages: Ref<string[] | null | undefined>,
	warningMessages: Ref<string[] | null | undefined>,
	successMessages: Ref<string[] | null | undefined>,
	hasErrorProp: Ref<boolean>,
	hasWarningProp: Ref<boolean>,
	hasSuccessProp: Ref<boolean>,
	maxErrors: Ref<number>,
) {
	// Règles de validation
	const numberRules = computed(() => {
		if (useVuetifyValidation.value) {
			return []
		}
		const rules: SyValidationRule[] = []
		if (required.value) {
			rules.push({
				type: 'required',
				options: {
					message: customLocale.value.errorRequiredNumber || locales.errorRequiredNumber,
					fieldIdentifier: numberLabel.value,
				},
			})
		}

		// Ajout des règles personnalisées avec prévalence si demandé
		if (customRulesPrecedence.value && customNumberRules.value && customNumberRules.value.length > 0) {
			rules.push(...customNumberRules.value.map(rule => ({
				...rule,
				options: rule.options || {},
			})))
		}

		// Règle de validation standard du NIR (ignorée si customRulesPrecedence est activé)
		if (!customRulesPrecedence.value) {
			rules.push({
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value) return true
						// Ne valider que si tous les caractères sont saisis
						if (value.length < 13) {
							return customLocale.value.errorInvalidNumber || locales.errorInvalidNumber
						}
						const result = checkNIR(value, nirType.value)
						return result ? true : customLocale.value.errorInvalidNumber || locales.errorInvalidNumber
					},
					message: customLocale.value.errorInvalidNumber || locales.errorInvalidNumber,
					successMessage: customLocale.value.successNumberValid || locales.successNumberValid,
					fieldIdentifier: numberLabel.value,
				},
			})
		}

		// Ajout des règles personnalisées sans prévalence (comportement par défaut)
		if (!customRulesPrecedence.value && customNumberRules.value && customNumberRules.value.length > 0) {
			rules.push(...customNumberRules.value.map(rule => ({
				...rule,
				options: rule.options || {},
			})))
		}

		return rules
	})

	const keyRules = computed(() => {
		if (useVuetifyValidation.value || !displayKey.value) {
			return []
		}
		const rules: SyValidationRule[] = []
		if (required.value) {
			rules.push({
				type: 'required',
				options: {
					message: customLocale.value.errorRequiredKey || locales.errorRequiredKey,
					fieldIdentifier: keyLabel.value,
				},
			})
		}

		const validateKey = (value: string) => {
			if (!value) return true
			if (!unmaskedNumberValue.value) return true
			const fullNir = unmaskedNumberValue.value + value
			return isNIRKeyValid(fullNir)
		}

		// Ajout des règles personnalisées
		if (customKeyRules.value) {
			rules.push(...customKeyRules.value)
		}

		// Ajout de la règle de validation par défaut si pas de règle personnalisée avec validation de clé
		if (!customKeyRules.value?.some(rule => rule.options.validate)) {
			rules.push({
				type: 'custom',
				options: {
					validate: validateKey,
					message: customLocale.value.errorInvalidKey || locales.errorInvalidKey,
					successMessage: customLocale.value.successKeyValid || locales.successKeyValid,
					fieldIdentifier: keyLabel.value,
				},
			})
		}

		return rules
	})

	// État pour suivre si une validation est en cours
	const isValidating = ref(false)
	const shouldValidateOnBlur = ref(false)
	let validationPromise: Promise<boolean> | null = null
	const numberFieldFocused = ref(false)
	const keyFieldFocused = ref(false)

	// update focus state on blur and focus
	const onNumberFocus = () => {
		numberFieldFocused.value = true
	}
	const onNumberBlur = () => {
		numberFieldFocused.value = false
	}
	const onKeyFocus = () => {
		keyFieldFocused.value = true
	}
	const onKeyBlur = () => {
		keyFieldFocused.value = false
	}

	let numberInput: HTMLInputElement | null = null
	let keyInput: HTMLInputElement | null = null

	onMounted(() => {
		numberInput = numberField.value?.$el?.querySelector('input') ?? null
		if (numberInput) {
			numberInput.addEventListener('focus', onNumberFocus)
			numberInput.addEventListener('blur', onNumberBlur)
		}

		keyInput = keyField.value?.$el?.querySelector('input') ?? null
		if (keyInput) {
			keyInput.addEventListener('focus', onKeyFocus)
			keyInput.addEventListener('blur', onKeyBlur)
		}
	})

	onBeforeUnmount(() => {
		numberInput?.removeEventListener('focus', onNumberFocus)
		numberInput?.removeEventListener('blur', onNumberBlur)
		keyInput?.removeEventListener('focus', onKeyFocus)
		keyInput?.removeEventListener('blur', onKeyBlur)
	})

	const numberValidation = useValidation({
		modelValue: numberValue,
		readonly,
		disabled,
		required,
		isValidateOnBlur,
		showSuccessMessages,
		disableErrorHandling,
		useVuetifyValidation,
		label,
		customRules: numberRules,
		customWarningRules: computed(() => unmaskedNumberValue.value.length === 13 ? customNumberWarningRules.value : []),
		rules: vuetifyNumberRules,
		focused: numberFieldFocused,
		errorMessages,
		warningMessages,
		successMessages,
		hasErrorProp,
		hasWarningProp,
		hasSuccessProp,
		maxErrors,
	})

	const keyValidation = useValidation({
		modelValue: keyValue,
		readonly,
		disabled,
		required,
		isValidateOnBlur,
		showSuccessMessages,
		disableErrorHandling,
		useVuetifyValidation,
		label,
		customRules: keyRules,
		customWarningRules: computed(() => (displayKey.value && unmaskedKeyValue.value.length === 2) ? customKeyWarningRules.value : []),
		rules: vuetifyKeyRules,
		focused: keyFieldFocused,
	})

	// Validation des champs
	const validateFields = (onBlur = false): Promise<boolean> => {
		shouldValidateOnBlur.value = shouldValidateOnBlur.value || onBlur

		if (validationPromise) {
			return validationPromise
		}

		validationPromise = (async () => {
			isValidating.value = true

			await numberValidation.validate()

			if (displayKey.value) {
				await keyValidation.validate()
			}

			if (shouldValidateOnBlur.value) {
				await nextTick()
				if (numberValidation.hasError.value) {
					numberField.value?.$el?.querySelector?.('input')?.focus()
				}
				else if (keyValidation.hasError.value) {
					keyField.value?.$el?.querySelector?.('input')?.focus()
				}
				shouldValidateOnBlur.value = false
			}

			isValidating.value = false
			validationPromise = null
			return !numberValidation.hasError.value && (!displayKey.value || !keyValidation.hasError.value)
		})()

		return validationPromise
	}

	const hasFieldErrors = computed(() => numberValidation.hasError.value || (displayKey.value && keyValidation.hasError.value))

	const clearValidation = () => {
		numberValidation.clearValidation()
		keyValidation.clearValidation()
	}

	return {
		numberValidation,
		keyValidation,
		validateFields,
		hasFieldErrors,
		clearValidation,
	}
}
