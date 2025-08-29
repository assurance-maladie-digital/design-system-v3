<script setup lang="ts">
	import { ref, watch, computed, nextTick, toRef } from 'vue'
	import { Mask } from 'maska'
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

	// Champs (valeurs masquées)
	const numberValue = ref('') // NIR (masqué avec espaces)
	const keyValue = ref('') // Clé (masquée)

	// Refs SyTextField
	const keyField = ref<InstanceType<typeof SyTextField> | null>(null)
	const numberField = ref<InstanceType<typeof SyTextField> | null>(null)

	// Masques programmatiques
	const numberMaskPattern = '# ## ## #C ### ###'
	const numberMask = new Mask({
		mask: numberMaskPattern,
		tokens: {
			'#': { pattern: /[0-9]/ },
			'C': { pattern: /[0-9AB]/ },
		},
	})
	const keyMask = new Mask({
		mask: '##',
		tokens: {
			'#': { pattern: /[0-9]/ },
		},
	})

	// Valeurs non masquées
	const unmaskedNumberValue = computed(() =>
		numberValue.value ? numberValue.value.replace(/\s/g, '').toUpperCase() : '',
	)
	const unmaskedKeyValue = computed(() =>
		keyValue.value ? keyValue.value.replace(/\s/g, '') : '',
	)

	// Helpers de normalisation / découpe
	const sanitizeNumberRaw = (s: string) => s.toUpperCase().replace(/[^0-9AB]/g, '')

	/** découpe une saisie brute potentiellement longue en: 13 pour NIR + surplus redirigé vers clé */
	const splitNir = (raw: string) => {
		const cleaned = sanitizeNumberRaw(raw)
		const numberRaw = cleaned.slice(0, 13)
		const overflowForKey = cleaned.slice(13).replace(/[^0-9]/g, '')
		return { numberRaw, overflowForKey }
	}

	// Focus helper
	const focusField = (field: typeof numberField | typeof keyField) => {
		nextTick(() => {
			const input = field.value?.$el?.querySelector?.('input') as HTMLInputElement | null
			if (input) {
				input.focus()
				setTimeout(() => input.click(), 50)
			}
		})
	}

	// Auto focus selon longueur
	watch(unmaskedNumberValue, (newValue) => {
		if (newValue && newValue.length >= 13 && props.displayKey) {
			focusField(keyField)
		}
	})
	watch(unmaskedKeyValue, (newValue) => {
		if (newValue.length === 0) {
			focusField(numberField)
		}
	})

	// Validations
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
		if (props.customRulesPrecedence && props.customNumberRules?.length) {
			rules.push(...props.customNumberRules.map(rule => ({ ...rule, options: rule.options || {} })))
		}
		rules.push({
			type: 'custom',
			options: {
				validate: (value: string) => {
					if (!value) return true
					if (value.length < 13) return 'Le numéro de sécurité sociale est invalide.'
					const result = checkNIR(value, props.nirType)
					return result === true ? true : 'Le numéro de sécurité sociale est invalide.'
				},
				message: 'Le numéro de sécurité sociale est invalide.',
				successMessage: 'Le numéro de sécurité sociale est valide.',
				fieldIdentifier: props.numberLabel,
			},
		})
		if (!props.customRulesPrecedence && props.customNumberRules?.length) {
			rules.push(...props.customNumberRules.map(rule => ({ ...rule, options: rule.options || {} })))
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
		if (props.customKeyRules?.length) {
			rules.push(...props.customKeyRules)
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry ;)
		if (!props.customKeyRules?.some(rule => (rule as any).options?.validate)) {
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

	// Émission consolidée
	const emitValue = () => {
		const number = unmaskedNumberValue.value
		const key = unmaskedKeyValue.value
		if (!number && !key) {
			emit('update:modelValue', undefined)
			return
		}
		emit('update:modelValue', `${number}${key}`)
	}

	// Validation
	const isValidating = ref(false)
	const shouldValidateOnBlur = ref(false)

	const createDebouncedFunction = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
		let timeout: number | undefined
		return (...args: Parameters<T>) => {
			window.clearTimeout(timeout)
			timeout = window.setTimeout(() => fn(...args), delay)
		}
	}

	const validateFields = async (onBlur = false) => {
		if (isValidating.value) {
			shouldValidateOnBlur.value = shouldValidateOnBlur.value || onBlur
			return true
		}
		isValidating.value = true

		const numberResult = numberValidation.validateField(
			unmaskedNumberValue.value,
			defaultNumberRules.value,
			unmaskedNumberValue.value?.length === 13 ? props.customNumberWarningRules : [],
		)
		let keyResult = { hasError: false }
		if (props.displayKey) {
			keyResult = keyValidation.validateField(
				unmaskedKeyValue.value,
				defaultKeyRules.value,
				unmaskedKeyValue.value?.length === 2 ? props.customKeyWarningRules : [],
			)
		}

		if (onBlur || shouldValidateOnBlur.value) {
			await nextTick()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry ;)
			if ((numberResult as any).hasError) {
				numberField.value?.$el?.querySelector?.('input')?.focus()
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry ;)
			else if ((keyResult as any).hasError) {
				keyField.value?.$el?.querySelector?.('input')?.focus()
			}
			shouldValidateOnBlur.value = false
		}

		isValidating.value = false
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry ;)
		return !(numberResult as any).hasError && !(keyResult as any).hasError
	}

	const validateOnSubmit = () => validateFields(true)

	const hasNumberErrors = computed(() => numberValidation.hasError.value)
	const hasNumberWarning = computed(() => !hasNumberErrors.value && numberValidation.hasWarning.value)
	const hasNumberSuccess = computed(() => !hasNumberErrors.value && !hasNumberWarning.value && numberValidation.hasSuccess.value)

	const hasKeyErrors = computed(() => keyValidation.hasError.value)
	const hasKeyWarning = computed(() => !hasKeyErrors.value && keyValidation.hasWarning.value)
	const hasKeySuccess = computed(() => !hasKeyErrors.value && !hasKeyWarning.value && keyValidation.hasSuccess.value)

	const hasFieldErrors = computed(() => hasNumberErrors.value || hasKeyErrors.value)
	const ariaRequired = computed(() => props.required ? 'true' : undefined)
	const ariaInvalidNumber = computed(() => hasFieldErrors.value ? 'true' : undefined)
	const ariaInvalidKey = computed(() => hasKeyErrors.value ? 'true' : undefined)

	const numberMessages = computed(() => {
		if (hasNumberErrors.value) return numberValidation.errors.value
		if (hasNumberWarning.value) return numberValidation.warnings.value
		if (hasNumberSuccess.value && props.showSuccessMessages) return numberValidation.successes.value
		return []
	})
	const combinedErrorMessages = computed(() => [
		...numberValidation.errors.value,
		...keyValidation.errors.value,
	])

	const numberLabelWithAsterisk = computed(() =>
		props.required && props.displayAsterisk ? `${props.numberLabel} *` : props.numberLabel,
	)
	const keyLabelWithAsterisk = computed(() =>
		props.required && props.displayAsterisk ? `${props.keyLabel} *` : props.keyLabel,
	)

	const debouncedValidate = createDebouncedFunction(() => {
		validateFields(false)
	}, 300)

	// Gestion curseur
	const calculateAdjustedPosition = (cursorPosition: number, originalValue: string, maskedValue: string): number => {
		const digitsBeforeCursor = originalValue.substring(0, cursorPosition).replace(/\s/g, '').length
		let newPosition = 0
		let digitCount = 0
		for (let i = 0; i < maskedValue.length; i++) {
			if (maskedValue[i] !== ' ') digitCount++
			if (digitCount > digitsBeforeCursor) break
			newPosition = i + 1
		}
		return newPosition
	}

	// Handlers d'input (acceptent string ou Event pour compat SyTextField)
	const handleNumberInput = (payload: Event | string) => {
		let inputEl: HTMLInputElement | null = null
		let input: string

		if (typeof payload === 'string') {
			input = payload
		}
		else {
			inputEl = payload.target as HTMLInputElement
			input = inputEl?.value ?? ''
		}

		const cursor = inputEl?.selectionStart ?? 0
		const { numberRaw, overflowForKey } = splitNir(input)
		const masked = numberMask.masked(numberRaw)

		numberValue.value = masked

		// Pousser le surplus vers la clé (max 2)
		if (props.displayKey && overflowForKey) {
			const nextKeyRaw = (unmaskedKeyValue.value + overflowForKey).slice(0, 2)
			keyValue.value = keyMask.masked(nextKeyRaw)
		}

		emitValue()
		debouncedValidate()

		// Auto-switch si NIR complet ou si surplus poussé
		if (props.displayKey && (numberRaw.length >= 13 || overflowForKey)) {
			focusField(keyField)
		}

		if (inputEl) {
			nextTick(() => {
				const pos = overflowForKey ? masked.length : calculateAdjustedPosition(cursor, input, masked)
				inputEl!.setSelectionRange(pos, pos)
			})
		}
	}

	const handleKeyInput = (payload: Event | string) => {
		let inputEl: HTMLInputElement | null = null
		let input: string

		if (typeof payload === 'string') {
			input = payload
		}
		else {
			inputEl = payload.target as HTMLInputElement
			input = inputEl?.value ?? ''
		}

		const cursor = inputEl?.selectionStart ?? 0
		const cleaned = input.replace(/\D/g, '').slice(0, 2) // cap à 2
		const masked = keyMask.masked(cleaned)

		keyValue.value = masked
		emitValue()
		debouncedValidate()

		// Si la clé devient vide → retour au NIR
		if (unmaskedKeyValue.value.length === 0) {
			nextTick(() => {
				numberField.value?.$el?.querySelector?.('input')?.focus()
			})
		}

		if (inputEl) {
			nextTick(() => {
				const pos = calculateAdjustedPosition(cursor, input, masked)
				inputEl!.setSelectionRange(pos, pos)
			})
		}
	}

	const handleNumberBlur = () => {
		void validateFields(true)
	}
	const handleKeyBlur = () => {
		void validateFields(true)
	}

	// Sync depuis modelValue (collages longs gérés)
	watch(modelValueRef, (newValue) => {
		if (newValue == null) {
			numberValue.value = ''
			keyValue.value = ''
			return
		}
		const raw = newValue.toString().toUpperCase()
		const { numberRaw, overflowForKey } = splitNir(raw)
		numberValue.value = numberMask.masked(numberRaw)

		const rawKeyTail = raw.slice(13).replace(/\D/g, '')
		const keyRaw = (rawKeyTail || overflowForKey).slice(0, 2)
		keyValue.value = keyMask.masked(keyRaw)
	}, { immediate: true })

	defineExpose({
		validateOnSubmit,
		// Exposition "compat" pour ne rien casser en dehors
		numberMask: { mask: numberMaskPattern, preProcess: (v: string) => v.toUpperCase(), tokens: { '#': {}, 'C': {} } },
		keyMask: { mask: '##', tokens: { '#': {} } },
		numberValidation,
		keyValidation,
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
				:model-value="numberValue"
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
				@update:model-value="handleNumberInput"
				@blur="handleNumberBlur"
			/>
		</div>

		<div
			v-if="displayKey"
			class="key-field-container"
		>
			<SyTextField
				ref="keyField"
				:model-value="keyValue"
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
				@update:model-value="handleKeyInput"
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
				:model-value="numberValue"
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
				@update:model-value="handleNumberInput"
				@blur="handleNumberBlur"
			/>
		</div>

		<div
			v-if="displayKey"
			class="key-field-container"
		>
			<SyTextField
				ref="keyField"
				:model-value="keyValue"
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
				@update:model-value="handleKeyInput"
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

/* Mode standard (div) */
.nir-field:not(.nir-field--fieldset) .number-field-container { flex: 0 0 80%; }
.nir-field:not(.nir-field--fieldset) .key-field-container { flex: 0 0 20%; }

/* Mode fieldset */
.nir-field--fieldset .number-field-container { flex: v-bind('props.clearable ? "0 0 70%" : "0 0 78%"'); }
.nir-field--fieldset .key-field-container { flex: v-bind('props.clearable ? "0 0 29%" : "0 0 18%"'); }

.number-field,
.key-field { width: 100%; }
</style>
