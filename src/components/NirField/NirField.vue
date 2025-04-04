<script lang="ts" setup>
	import { ref, watch, computed, nextTick, toRef } from 'vue'
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
	}>(), {
		modelValue: undefined,
		label: undefined,
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
		showSuccessMessages: true,
		width: '100%',
		bgColor: undefined,
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
	const unmaskedNumberValue = computed(() => numberValue.value.replace(/\s/g, ''))
	const unmaskedKeyValue = computed(() => keyValue.value.replace(/\s/g, ''))

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
			const input = field.value?.$el.querySelector('input')
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
		if (newValue.length === 13 && props.displayKey) {
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
		if (oldValue.trim() && !newValue.trim()) {
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

		if (props.required) {
			rules.push({
				type: 'required',
				options: {
					message: `Le champ ${props.numberLabel} est requis.`,
					fieldIdentifier: props.numberLabel,
				},
			})
		}

		rules.push({
			type: 'custom',
			options: {
				validate: (value: string) => {
					if (!value) return true
					// Ne valider que si tous les caractères sont saisis
					if (value.length < 13) {
						return 'Le numéro de sécurité sociale est invalide.'
					}
					const result = checkNIR(value)
					return result === true ? true : 'Le numéro de sécurité sociale est invalide.'
				},
				message: 'Le numéro de sécurité sociale est invalide.',
				successMessage: 'Le numéro de sécurité sociale est valide.',
				fieldIdentifier: props.numberLabel,
			},
		})

		// Ajout des règles personnalisées
		if (props.customNumberRules) {
			rules.push(...props.customNumberRules.map(rule => ({
				...rule,
				options: rule.options || {},
			})))
		}

		return rules
	})

	const defaultKeyRules = computed(() => {
		const rules: ValidationRule[] = []

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
					message: 'La clé du numéro de sécurité sociale est invalide.',
					successMessage: `Le champ ${props.keyLabel} est valide.`,
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

	// Validation des champs
	const validateFields = async (onBlur = false) => {
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
		if (onBlur) {
			await nextTick()
			if (numberResult.hasError) {
				numberField.value?.$el.querySelector('input')?.focus()
			}
			else if (keyResult.hasError) {
				keyField.value?.$el.querySelector('input')?.focus()
			}
		}

		return !numberResult.hasError && !keyResult.hasError
	}

	const validateOnSubmit = () => {
		return validateFields(true)
	}

	// Computed pour statut des champs
	const hasNumberErrors = computed(() => numberValidation.hasError.value)
	const hasNumberWarning = computed(() => !hasNumberErrors.value && numberValidation.hasWarning.value)
	const hasNumberSuccess = computed(() => !hasNumberErrors.value && !hasNumberWarning.value && numberValidation.hasSuccess.value)

	const hasKeyErrors = computed(() => keyValidation.hasError.value)
	const hasKeyWarning = computed(() => !hasKeyErrors.value && keyValidation.hasWarning.value)
	const hasKeySuccess = computed(() => !hasKeyErrors.value && !hasKeyWarning.value && keyValidation.hasSuccess.value)

	// Labels avec astérisque si nécessaire
	const numberLabelWithAsterisk = computed(() => {
		return props.required && props.displayAsterisk ? `${props.numberLabel} *` : props.numberLabel
	})

	const keyLabelWithAsterisk = computed(() => {
		return props.required && props.displayAsterisk ? `${props.keyLabel} *` : props.keyLabel
	})

	// Gestion des événements
	const handleNumberInput = () => {
		emitValue()
		validateFields()
	}

	const handleKeyInput = () => {
		emitValue()
		validateFields()

		// Si on supprime le contenu de la clé, on revient au champ NIR
		if (unmaskedKeyValue.value.length === 0) {
			nextTick(() => {
				numberField.value?.$el.querySelector('input')?.focus()
			})
		}
	}

	const handleNumberBlur = () => {
		validateFields(true)
	}

	const handleKeyBlur = () => {
		validateFields(true)
	}

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
	<div
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
				:error-messages="[...numberValidation.errors.value, ...keyValidation.errors.value]"
				:warning-messages="numberValidation.warnings.value"
				:success-messages="numberValidation.successes.value"
				:show-success-messages="showSuccessMessages"
				:has-warning="hasNumberWarning"
				:has-success="hasNumberSuccess"
				:error="hasNumberErrors"
				:messages="hasNumberErrors ? numberValidation.errors.value : (hasNumberWarning ? numberValidation.warnings.value : (hasNumberSuccess && props.showSuccessMessages ? numberValidation.successes.value : []))"
				:has-error="hasNumberErrors"
				:required="required"
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
				:success-messages="keyValidation.successes.value"
				:show-success-messages="showSuccessMessages"
				:has-warning="hasKeyWarning"
				:has-success="hasKeySuccess"
				:hint="props.hint || locales.keyHint"
				:messages="hasKeyErrors ? keyValidation.errors.value : (hasKeyWarning ? keyValidation.warnings.value : (hasKeySuccess && props.showSuccessMessages ? keyValidation.successes.value : []))"
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
	width: calc(v-bind('props.width') - 16px);
	align-items: flex-start;
}

.number-field-container {
	flex: 0 0 80%;
}

.key-field-container {
	flex: 0 0 20%;
}

.number-field,
.key-field {
	width: 100%;
}
</style>
