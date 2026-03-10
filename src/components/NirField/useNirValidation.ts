import { type ValidationRule } from '@/composables/validation/useValidation'
import { computed, nextTick, ref, type Ref } from 'vue'
import { checkNIR, isNIRKeyValid } from './nirValidation'
import type { locales } from './locales'
import { useValidation } from '@/composables/unifyValidation/useValidation'
import type { SyTextField } from '@/main'

export type NirValidationProps = {
	numberRules?: ValidationRule[]
	keyRules?: ValidationRule[]
	useVuetifyValidation?: boolean
	customNumberRules?: ValidationRule[]
	customKeyRules?: ValidationRule[]
	customNumberWarningRules?: ValidationRule[]
	customKeyWarningRules?: ValidationRule[]
	customRulesPrecedence?: boolean
	showSuccessMessages?: boolean
	disabled?: boolean
	readonly?: boolean
	customLocale: typeof locales
	required?: boolean
	numberLabel?: string
	keyLabel?: string
	nirType?: 'simple' | 'complexe'
}

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
	customNumberRules: Ref<ValidationRule[]>,
	customKeyRules: Ref<ValidationRule[]>,
	customNumberWarningRules: Ref<ValidationRule[]>,
	customKeyWarningRules: Ref<ValidationRule[]>,
	displayKey: Ref<boolean>,
	customRulesPrecedence: Ref<boolean>,
	nirType: Ref<'simple' | 'complexe'>,
	label: Ref<string>,
	showSuccessMessages: Ref<boolean>,
	disableErrorHandling: Ref<boolean>,
) {
	// Règles de validation
	const defaultNumberRules = computed(() => {
		const rules: ValidationRule[] = []
		if (required.value) {
			rules.push({
				type: 'required',
				options: {
					message: customLocale.value.errorRequiredNumber,
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

		// Règle de validation standard du NIR
		rules.push({
			type: 'custom',
			options: {
				validate: (value: string) => {
					if (!value) return true
					// Ne valider que si tous les caractères sont saisis
					if (value.length < 13) {
						return customLocale.value.errorInvalidNumber || customLocale.value.errorInvalidNumber
					}
					const result = checkNIR(value, nirType.value)
					return result ? true : customLocale.value.errorInvalidNumber || customLocale.value.errorInvalidNumber
				},
				message: customLocale.value.errorInvalidNumber,
				successMessage: customLocale.value.successNumberValid,
				fieldIdentifier: numberLabel.value,
			},
		})

		// Ajout des règles personnalisées sans prévalence (comportement par défaut)
		if (!customRulesPrecedence.value && customNumberRules.value && customNumberRules.value.length > 0) {
			rules.push(...customNumberRules.value.map(rule => ({
				...rule,
				options: rule.options || {},
			})))
		}

		return rules
	})

	const defaultKeyRules = computed(() => {
		const rules: ValidationRule[] = []
		if (required.value) {
			rules.push({
				type: 'required',
				options: {
					message: customLocale.value.errorRequiredKey,
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
					message: customLocale.value.errorInvalidKey,
					successMessage: customLocale.value.successKeyValid,
					fieldIdentifier: keyLabel.value,
				},
			})
		}

		return rules
	})

	// État pour suivre si une validation est en cours
	const isValidating = ref(false)
	const shouldValidateOnBlur = ref(false)

	const numberValidation = useValidation({
		modelValue: numberValue,
		readonly,
		disabled,
		required,
		isValidateOnBlur: ref(true),
		showSuccessMessages,
		disableErrorHandling,
		useVuetifyValidation: false,
		label,
		customRules: computed(() => [...(defaultNumberRules.value ? defaultNumberRules.value : []), ...(customNumberRules.value ? customNumberRules.value : [])]),
		customWarningRules: computed(() => unmaskedNumberValue.value.length === 13 ? customNumberWarningRules.value : []),
	})

	const keyValidation = useValidation({
		modelValue: keyValue,
		readonly,
		disabled,
		required,
		isValidateOnBlur: ref(true),
		showSuccessMessages,
		disableErrorHandling,
		useVuetifyValidation: false,
		label,
		customRules: computed(() => displayKey.value ? [...(defaultKeyRules.value ? defaultKeyRules.value : []), ...(customKeyRules.value ? customKeyRules.value : [])] : []),
		customWarningRules: computed(() => (displayKey.value && unmaskedKeyValue.value.length === 2) ? customKeyWarningRules.value : []),
	})

	// Validation des champs
	const validateFields = async (onBlur = false) => {
		// Éviter les validations redondantes
		if (isValidating.value) {
			shouldValidateOnBlur.value = shouldValidateOnBlur.value || onBlur
			return true
		}

		isValidating.value = true

		// Valider le numéro
		await numberValidation.validate()

		// Valider la clé si elle est affichée
		if (displayKey.value) {
			await keyValidation.validate()
		}

		// Si on est en mode blur et qu'il y a des erreurs, focus sur le premier champ en erreur
		if (onBlur || shouldValidateOnBlur.value) {
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
		return !numberValidation.hasError.value && !keyValidation.hasError.value
	}

	const hasFieldErrors = computed(() => numberValidation.hasError.value || keyValidation.hasError.value)

	return {
		numberValidation,
		keyValidation,
		validateFields,
		hasFieldErrors,
	}
}
