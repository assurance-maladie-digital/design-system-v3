<script lang="ts" setup>
	import { ref, watch, computed, nextTick, toRef, onMounted } from 'vue'
	import { vMaska } from 'maska/vue'
	import { checkNIR, isNIRKeyValid } from './nirValidation'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import { locales } from './locales'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'

	const props = withDefaults(defineProps<{
		modelValue?: string | undefined | null
		label?: string
		numberLabel?: string
		keyLabel?: string
		displayKey?: boolean
		outlined?: boolean
		nirTooltip?: string
		keyTooltip?: string
		nirTooltipPosition?: 'prepend' | 'append'
		keyTooltipPosition?: 'prepend' | 'append'
		required?: boolean
		displayAsterisk?: boolean
		customNumberRules?: ValidationRule[]
		customKeyRules?: ValidationRule[]
		customNumberWarningRules?: ValidationRule[]
		customKeyWarningRules?: ValidationRule[]
		customRulesPrecedence?: boolean
		showSuccessMessages?: boolean
		width?: string
		bgColor?: string
		disabled?: boolean
		density?: 'default' | 'comfortable' | 'compact'
		hideDetails?: boolean | 'auto'
		hideSpinButtons?: boolean
		placeholder?: string
		readonly?: boolean
		variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo'
		clearable?: boolean
		counter?: boolean | number | string
		hint?: string
		persistentHint?: boolean
		persistentPlaceholder?: boolean
		disableErrorHandling?: boolean
		nirType?: 'simple' | 'complexe'
		withoutFieldset?: boolean
	}>(), {
		modelValue: undefined,
		label: 'NirField',
		numberLabel: 'Numéro de sécurité sociale',
		keyLabel: 'Clé',
		displayKey: true,
		outlined: true,
		nirTooltip: undefined,
		keyTooltip: undefined,
		nirTooltipPosition: 'append',
		keyTooltipPosition: 'append',
		required: false,
		displayAsterisk: false,
		customNumberRules: () => [],
		customKeyRules: () => [],
		customNumberWarningRules: () => [],
		customKeyWarningRules: () => [],
		customRulesPrecedence: false,
		showSuccessMessages: true,
		width: '100%',
		bgColor: 'white',
		disabled: false,
		density: 'default',
		hideDetails: false,
		hideSpinButtons: false,
		placeholder: undefined,
		readonly: false,
		variant: 'outlined',
		clearable: false,
		counter: false,
		hint: undefined,
		persistentHint: false,
		persistentPlaceholder: false,
		disableErrorHandling: false,
		nirType: 'simple',
		withoutFieldset: false,
	})

	const emit = defineEmits(['update:modelValue'])
	const modelValueRef = toRef(props, 'modelValue')
	// const options = useCustomizableOptions(defaultOptions, props)

	// Champs
	const numberValue = ref('')
	const keyValue = ref('')

	// Refs pour les champs
	const keyField = ref<InstanceType<typeof SyTextField> | null>(null)
	const numberField = ref<InstanceType<typeof SyTextField> | null>(null)

	// Valeurs non masquées
	const unmaskedNumberValue = computed(() => numberValue.value ? numberValue.value.replace(/\s/g, '') : '')
	const unmaskedKeyValue = computed(() => keyValue.value ? keyValue.value.replace(/\s/g, '') : '')

	// Masques
	const numberMask = {
		mask: '# ## ## #C ### ###',
		preProcess: (value: string) => value.toUpperCase(),
		tokens: {
			'#': {
				pattern: /[0-9]/,
			},
			'C': {
				pattern: /[0-9AB]/,
				transform: (char: string) => char.toUpperCase(),
			},
		},
	}
	const keyMask = {
		mask: '##',
		tokens: {
			'#': {
				pattern: /[0-9]/,
			},
		},
	}

	// Fonction pour gérer le focus des champs
	const focusField = (field: typeof numberField | typeof keyField) => {
		nextTick(() => {
			const input = field.value?.$el?.querySelector?.('input')
			if (input) {
				// Focus and select all text
				input.focus()
				// Adding a slight delay to ensure focus is applied
				setTimeout(() => {
					input.click()
				}, 50)
			}
		})
	}

	// Watch sur la valeur non masquée du numéro pour gérer le focus automatique
	watch(unmaskedNumberValue, (newValue) => {
		if (newValue && newValue.length === 13 && props.displayKey) {
			focusField(keyField)
		}
	})

	watch(unmaskedKeyValue, (newValue) => {
		if (newValue.length === 0) {
			focusField(numberField)
		}
	})

	// Watch pour détecter la suppression des chiffres de la clé
	watch(keyValue, (newValue, oldValue) => {
		// Si l'ancienne valeur avait des chiffres et la nouvelle est vide ou ne contient que des espaces
		if (oldValue && newValue !== null && oldValue.trim() && !newValue.trim()) {
			focusField(numberField)
		}
		else if (oldValue && newValue === null) {
			// Cas où newValue est null (effacement avec clearable)
			focusField(numberField)
		}
	})

	// Initialisation des validations
	const numberValidation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: props.numberLabel,
		disableErrorHandling: props.disableErrorHandling,
	})

	const keyValidation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: props.keyLabel,
		disableErrorHandling: props.disableErrorHandling,
	})

	// Règles de validation
	const defaultNumberRules = computed(() => {
		const rules: ValidationRule[] = []
		if (props.readonly) return
		if (props.required) {
			rules.push({
				type: 'required',
				options: {
					message: `Le champ ${props.numberLabel} est requis.`,
					fieldIdentifier: props.numberLabel,
				},
			})
		}

		// Ajout des règles personnalisées avec prévalence si demandé
		if (props.customRulesPrecedence && props.customNumberRules && props.customNumberRules.length > 0) {
			rules.push(...props.customNumberRules.map(rule => ({
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
						return 'Le numéro de sécurité sociale est invalide.'
					}
					const result = checkNIR(value, props.nirType)
					return result === true ? true : 'Le numéro de sécurité sociale est invalide.'
				},
				message: 'Le numéro de sécurité sociale est invalide.',
				successMessage: 'Le numéro de sécurité sociale est valide.',
				fieldIdentifier: props.numberLabel,
			},
		})

		// Ajout des règles personnalisées sans prévalence (comportement par défaut)
		if (!props.customRulesPrecedence && props.customNumberRules && props.customNumberRules.length > 0) {
			rules.push(...props.customNumberRules.map(rule => ({
				...rule,
				options: rule.options || {},
			})))
		}

		return rules
	})

	const defaultKeyRules = computed(() => {
		const rules: ValidationRule[] = []
		if (props.readonly) return
		if (props.required) {
			rules.push({
				type: 'required',
				options: {
					message: `Le champ ${props.keyLabel} est requis.`,
					fieldIdentifier: props.keyLabel,
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
		if (props.customKeyRules) {
			rules.push(...props.customKeyRules)
		}

		// Ajout de la règle de validation par défaut si pas de règle personnalisée avec validation de clé
		if (!props.customKeyRules?.some(rule => rule.options.validate)) {
			rules.push({
				type: 'custom',
				options: {
					validate: validateKey,
					message: 'Le numéro de sécurité sociale est invalide.',
					successMessage: 'Le numéro de sécurité sociale est valide.',
					fieldIdentifier: props.keyLabel,
				},
			})
		}

		return rules
	})

	// Synchronisation avec modelValue
	watch(modelValueRef, (newValue) => {
		if (newValue === undefined || newValue === null) {
			numberValue.value = ''
			keyValue.value = ''
			return
		}
		if (newValue.length === 15) {
			const number = newValue.slice(0, -2)
			const key = newValue.slice(-2)
			numberValue.value = number
			keyValue.value = key
		}
		if (newValue.length === 14) {
			const number = newValue.slice(0, -1)
			const key = newValue.slice(-1)
			numberValue.value = number
			keyValue.value = key
		}
		if (newValue.length <= 13) {
			const number = newValue
			numberValue.value = number
			keyValue.value = ''
		}
	}, { immediate: true })

	// Émission de la valeur
	const emitValue = () => {
		const number = unmaskedNumberValue.value
		const key = unmaskedKeyValue.value

		if (!number && !key) {
			emit('update:modelValue', undefined)
			return
		}

		emit('update:modelValue', `${number}${key}`)
	}

	// État pour suivre si une validation est en cours
	const isValidating = ref(false)
	const shouldValidateOnBlur = ref(false)

	// Fonction utilitaire pour créer une fonction debounced
	const createDebouncedFunction = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
		let timeout: number | undefined
		return (...args: Parameters<T>) => {
			window.clearTimeout(timeout)
			timeout = window.setTimeout(() => fn(...args), delay)
		}
	}

	// Validation des champs
	const validateFields = async (onBlur = false) => {
		// Éviter les validations redondantes
		if (isValidating.value) {
			shouldValidateOnBlur.value = shouldValidateOnBlur.value || onBlur
			return true
		}

		isValidating.value = true

		// Valider le numéro
		const numberResult = numberValidation.validateField(
			unmaskedNumberValue.value,
			defaultNumberRules.value,
			// N'appliquer les warnings que si le numéro est complet
			unmaskedNumberValue.value?.length === 13 ? props.customNumberWarningRules : [],
		)

		// Valider la clé si elle est affichée
		let keyResult = { hasError: false }
		if (props.displayKey) {
			keyResult = keyValidation.validateField(
				keyValue.value,
				defaultKeyRules.value,
				// N'appliquer les warnings que si la clé est complète
				keyValue.value?.length === 2 ? props.customKeyWarningRules : [],
			)
		}

		// Si on est en mode blur et qu'il y a des erreurs, focus sur le premier champ en erreur
		if (onBlur || shouldValidateOnBlur.value) {
			await nextTick()
			if (numberResult.hasError) {
				numberField.value?.$el?.querySelector?.('input')?.focus()
			}
			else if (keyResult.hasError) {
				keyField.value?.$el?.querySelector?.('input')?.focus()
			}
			shouldValidateOnBlur.value = false
		}

		isValidating.value = false
		return !numberResult.hasError && !keyResult.hasError
	}

	const validateOnSubmit = () => {
		return validateFields(true)
	}

	const hasNumberErrors = computed(() => numberValidation.hasError.value)
	const hasNumberWarning = computed(() => !hasNumberErrors.value && numberValidation.hasWarning.value)
	const hasNumberSuccess = computed(() => !hasNumberErrors.value && !hasNumberWarning.value && numberValidation.hasSuccess.value)

	const hasKeyErrors = computed(() => keyValidation.hasError.value)
	const hasKeyWarning = computed(() => !hasKeyErrors.value && keyValidation.hasWarning.value)
	const hasKeySuccess = computed(() => !hasKeyErrors.value && !hasKeyWarning.value && keyValidation.hasSuccess.value)

	// Propriétés calculées pour les attributs ARIA et les états d'erreur
	const hasFieldErrors = computed(() => hasNumberErrors.value || hasKeyErrors.value)
	const ariaRequired = computed(() => props.required ? 'true' : undefined)
	const ariaInvalidNumber = computed(() => hasFieldErrors.value ? 'true' : undefined)
	const ariaInvalidKey = computed(() => hasKeyErrors.value ? 'true' : undefined)

	// Propriétés calculées pour les messages
	const numberMessages = computed(() => {
		if (hasNumberErrors.value) {
			return numberValidation.errors.value
		}
		else if (hasNumberWarning.value) {
			return numberValidation.warnings.value
		}
		else if (hasNumberSuccess.value && props.showSuccessMessages) {
			return numberValidation.successes.value
		}
		return []
	})

	// Messages d'erreur combinés pour le champ numéro
	const combinedErrorMessages = computed(() => [
		...numberValidation.errors.value,
		...keyValidation.errors.value,
	])

	const numberLabelWithAsterisk = computed(() => {
		return props.required && props.displayAsterisk ? `${props.numberLabel} *` : props.numberLabel
	})

	const keyLabelWithAsterisk = computed(() => {
		return props.required && props.displayAsterisk ? `${props.keyLabel} *` : props.keyLabel
	})

	// Utilisation de debounce pour limiter les validations pendant la saisie
	const debouncedValidate = createDebouncedFunction(() => {
		validateFields(false)
	}, 300) // 300ms de délai

	const handleNumberInput = () => {
		emitValue()
		// Utiliser la validation debounced pour la saisie
		debouncedValidate()
	}

	const handleKeyInput = () => {
		emitValue()
		// Utiliser la validation debounced pour la saisie
		debouncedValidate()

		// Si on supprime le contenu de la clé, on revient au champ NIR
		if (unmaskedKeyValue.value.length === 0) {
			nextTick(() => {
				numberField.value?.$el?.querySelector?.('input')?.focus()
			})
		}
	}

	const handleNumberBlur = () => {
		validateFields(true)
	}

	const handleKeyBlur = () => {
		validateFields(true)
	}

	// Gestion des touches pour le champ NIR
	const handleNumberKeydown = (e: Event) => {
		const keyEvent = e as KeyboardEvent
		// Si le NIR est complet et que le champ clé est affiché
		if (unmaskedNumberValue.value?.length === 13 && props.displayKey) {
			// Si la touche est un chiffre
			if (keyEvent.key && keyEvent.key.length === 1 && /[0-9]/.test(keyEvent.key)) {
				// Ajouter le caractère à la valeur de la clé
				keyValue.value = (keyValue.value || '') + keyEvent.key
				// Focus sur le champ clé
				focusField(keyField)
				// Empêcher la saisie dans le champ NIR
				keyEvent.preventDefault()
			}
		}
	}

	// Ajouter des écouteurs d'événements keydown aux champs NIR après le montage du composant
	onMounted(() => {
		// Attendre que les refs soient disponibles
		nextTick(() => {
			// Ajouter l'écouteur d'événement au premier champ NIR
			const numberInput = numberField.value?.$el?.querySelector?.('input')
			if (numberInput) {
				numberInput.addEventListener('keydown', handleNumberKeydown)
			}

			// Si le composant est en mode withoutFieldset, ajouter l'écouteur au deuxième champ NIR
			if (props.withoutFieldset) {
				// Attendre un peu pour s'assurer que le DOM est complètement rendu
				setTimeout(() => {
					const fieldsetNumberInput = document.querySelector('.fieldset-container .number-field input')
					if (fieldsetNumberInput) {
						fieldsetNumberInput.addEventListener('keydown', handleNumberKeydown)
					}
				}, 100)
			}
		})
	})

	defineExpose({
		validateOnSubmit,
		numberMask,
		keyMask,
		numberValidation,
		keyValidation,
	} satisfies {
		validateOnSubmit: () => Promise<boolean>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		numberMask: { mask: string, preProcess: (value: string) => string, tokens: Record<string, any> }
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		keyMask: { mask: string, tokens: Record<string, any> }
		numberValidation: ReturnType<typeof useValidation>
		keyValidation: ReturnType<typeof useValidation>
	})
</script>

<template>
	<fieldset
		v-if="displayKey && !withoutFieldset"
		class="nir-field nir-field--fieldset"
	>
		<legend v-if="label">
			{{ label }}
		</legend>
		<div class="number-field-container">
			<SyTextField
				ref="numberField"
				v-model="numberValue"
				v-maska="numberMask"
				:label="numberLabelWithAsterisk"
				:variant-style="outlined ? 'outlined' : 'underlined'"
				:prepend-icon="nirTooltip && nirTooltipPosition === 'prepend' ? 'info' : undefined"
				:append-icon="nirTooltip && nirTooltipPosition === 'append' ? 'info' : undefined"
				:prepend-tooltip="nirTooltip && nirTooltipPosition === 'prepend' ? nirTooltip : undefined"
				:append-tooltip="nirTooltip && nirTooltipPosition === 'append' ? nirTooltip : undefined"
				:max-errors="2"
				:error-messages="[...new Set([...numberValidation.errors.value, ...keyValidation.errors.value])]"
				:warning-messages="numberValidation.warnings.value"
				:success-messages="numberValidation.successes.value"
				:show-success-messages="showSuccessMessages"
				:has-warning="hasNumberWarning"
				:has-success="hasNumberSuccess"
				:error="hasNumberErrors || hasKeyErrors"
				:messages="hasNumberErrors || hasKeyErrors ? numberValidation.errors.value ?? keyValidation.errors.value : (hasNumberWarning ? numberValidation.warnings.value : (hasNumberSuccess && props.showSuccessMessages ? numberValidation.successes.value : []))"
				:has-error="hasNumberErrors || hasKeyErrors"
				:required="required"
				:aria-required="ariaRequired"
				:aria-invalid="ariaInvalidNumber"
				:disabled="disabled"
				:bg-color="bgColor"
				:density="props.density"
				:hide-details="props.hideDetails"
				:hide-spin-buttons="props.hideSpinButtons"
				:placeholder="props.placeholder"
				:readonly="props.readonly"
				:variant="props.variant"
				:clearable="props.clearable"
				:counter="props.counter"
				:persistent-hint="props.persistentHint"
				:persistent-placeholder="props.persistentPlaceholder"
				:hint="props.hint || locales.numberHint"
				class="number-field"
				:display-asterisk="false"
				@input="handleNumberInput"
				@blur="handleNumberBlur"
			/>
		</div>
		<div
			v-if="displayKey"
			class="key-field-container"
		>
			<SyTextField
				ref="keyField"
				v-model="keyValue"
				v-maska="keyMask"
				:label="keyLabelWithAsterisk"
				:variant-style="outlined ? 'outlined' : 'underlined'"
				:prepend-icon="keyTooltip && keyTooltipPosition === 'prepend' ? 'info' : undefined"
				:append-icon="keyTooltip && keyTooltipPosition === 'append' ? 'info' : undefined"
				:prepend-tooltip="keyTooltip && keyTooltipPosition === 'prepend' ? keyTooltip : undefined"
				:append-tooltip="keyTooltip && keyTooltipPosition === 'append' ? keyTooltip : undefined"
				:error-messages="keyValidation.errors.value.length > 0 ? [''] : []"
				:warning-messages="keyValidation.warnings.value"
				:show-success-messages="false"
				:has-warning="hasKeyWarning"
				:has-success="hasKeySuccess"
				:hint="props.hint || locales.keyHint"
				:has-error="hasKeyErrors"
				:disabled="disabled"
				:bg-color="bgColor"
				:density="props.density"
				:hide-details="props.hideDetails"
				:hide-spin-buttons="props.hideSpinButtons"
				:placeholder="props.placeholder"
				:readonly="props.readonly"
				:variant="props.variant"
				:clearable="props.clearable"
				:counter="props.counter"
				:persistent-hint="props.persistentHint"
				:persistent-placeholder="props.persistentPlaceholder"
				:aria-required="ariaRequired"
				:aria-invalid="ariaInvalidKey"
				class="key-field"
				:display-asterisk="false"
				@input="handleKeyInput"
				@blur="handleKeyBlur"
			/>
		</div>
	</fieldset>
	<div
		v-else
		class="nir-field"
	>
		<div class="number-field-container">
			<SyTextField
				ref="numberField"
				v-model="numberValue"
				v-maska="numberMask"
				:label="numberLabelWithAsterisk"
				:variant-style="outlined ? 'outlined' : 'underlined'"
				:prepend-icon="nirTooltip && nirTooltipPosition === 'prepend' ? 'info' : undefined"
				:append-icon="nirTooltip && nirTooltipPosition === 'append' ? 'info' : undefined"
				:prepend-tooltip="nirTooltip && nirTooltipPosition === 'prepend' ? nirTooltip : undefined"
				:append-tooltip="nirTooltip && nirTooltipPosition === 'append' ? nirTooltip : undefined"
				:max-errors="2"
				:error-messages="combinedErrorMessages"
				:warning-messages="numberValidation.warnings.value"
				:success-messages="numberValidation.successes.value"
				:show-success-messages="showSuccessMessages"
				:has-warning="hasNumberWarning"
				:has-success="hasNumberSuccess"
				:error="hasNumberErrors || hasKeyErrors"
				:messages="numberMessages"
				:has-error="hasNumberErrors || hasKeyErrors"
				:required="required"
				:aria-required="ariaRequired"
				:aria-invalid="ariaInvalidNumber"
				:disabled="disabled"
				:bg-color="bgColor"
				:density="props.density"
				:hide-details="props.hideDetails"
				:hide-spin-buttons="props.hideSpinButtons"
				:placeholder="props.placeholder"
				:readonly="props.readonly"
				:variant="props.variant"
				:clearable="props.clearable"
				:counter="props.counter"
				:persistent-hint="props.persistentHint"
				:persistent-placeholder="props.persistentPlaceholder"
				:hint="props.hint || locales.numberHint"
				class="number-field"
				:display-asterisk="false"
				@input="handleNumberInput"
				@blur="handleNumberBlur"
			/>
		</div>
		<div
			v-if="displayKey"
			class="key-field-container"
		>
			<SyTextField
				ref="keyField"
				v-model="keyValue"
				v-maska="keyMask"
				:label="keyLabelWithAsterisk"
				:variant-style="outlined ? 'outlined' : 'underlined'"
				:prepend-icon="keyTooltip && keyTooltipPosition === 'prepend' ? 'info' : undefined"
				:append-icon="keyTooltip && keyTooltipPosition === 'append' ? 'info' : undefined"
				:prepend-tooltip="keyTooltip && keyTooltipPosition === 'prepend' ? keyTooltip : undefined"
				:append-tooltip="keyTooltip && keyTooltipPosition === 'append' ? keyTooltip : undefined"
				:error-messages="keyValidation.errors.value.length > 0 ? [''] : []"
				:warning-messages="keyValidation.warnings.value"
				:show-success-messages="false"
				:has-warning="hasKeyWarning"
				:has-success="hasKeySuccess"
				:hint="props.hint || locales.keyHint"
				:has-error="hasKeyErrors"
				:disabled="disabled"
				:bg-color="bgColor"
				:density="props.density"
				:hide-details="props.hideDetails"
				:hide-spin-buttons="props.hideSpinButtons"
				:placeholder="props.placeholder"
				:readonly="props.readonly"
				:variant="props.variant"
				:clearable="props.clearable"
				:counter="props.counter"
				:persistent-hint="props.persistentHint"
				:persistent-placeholder="props.persistentPlaceholder"
				:aria-required="ariaRequired"
				:aria-invalid="ariaInvalidKey"
				class="key-field"
				:display-asterisk="false"
				@input="handleKeyInput"
				@blur="handleKeyBlur"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.nir-field {
	display: flex;
	gap: 16px;
	width: calc(v-bind('props.width || "100%"') - 16px);
	align-items: flex-start;
}

.nir-field--fieldset {
	width: calc(v-bind('props.width || "100%"') + 5px);
	border: 1px solid #b9b9b9;
	border-radius: 4px;
	padding: 25px;
	margin: 0;
	display: flex;
	gap: 16px;
	align-items: flex-start;
	box-sizing: border-box;
}

.nir-field--fieldset legend {
	padding: 0 8px;
	font-weight: 500;
	color: #666;
}

/* Styles pour le mode standard (div) */
.nir-field:not(.nir-field--fieldset) .number-field-container {
	flex: 0 0 80%;
}

.nir-field:not(.nir-field--fieldset) .key-field-container {
	flex: 0 0 20%;
}

/* Styles pour le mode fieldset */
.nir-field--fieldset .number-field-container {
	flex: v-bind('props.clearable ? "0 0 70%" : "0 0 78%"');
}

.nir-field--fieldset .key-field-container {
	flex: v-bind('props.clearable ? "0 0 29%" : "0 0 18%"');
}

.number-field,
.key-field {
	width: 100%;
}

.key-field {
	min-width: 110px;

	:deep(.v-messages .v-messages__message) {
		min-width: 100px !important;
		margin-left: -10px !important;
	}
}
</style>
