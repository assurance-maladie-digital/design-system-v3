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

	const emit = defineEmits<{ (e: 'update:modelValue', value?: string): void }>()
	const modelValueRef = toRef(props, 'modelValue')

	// Masques pour le formatage du NIR (numéro et clé)
	const numberMaskPattern = '# ## ## #C ### ###'
	const numberMask = new Mask({ mask: numberMaskPattern, tokens: { '#': { pattern: /[0-9]/ }, 'C': { pattern: /[0-9AB]/ } } })
	const keyMask = new Mask({ mask: '##', tokens: { '#': { pattern: /[0-9]/ } } })

	// Champs (masqués)
	const numberValue = ref('')
	const keyValue = ref('')

	// Refs SyTextField
	const keyField = ref<InstanceType<typeof SyTextField> | null>(null)
	const numberField = ref<InstanceType<typeof SyTextField> | null>(null)

	// Valeurs non masquées
	const unmaskedNumberValue = computed(() => numberValue.value ? numberValue.value.replace(/\s/g, '').toUpperCase() : '')
	const unmaskedKeyValue = computed(() => keyValue.value ? keyValue.value.replace(/\s/g, '') : '')

	// Helpers caret
	const getNativeInput = (field: typeof numberField | typeof keyField) => {
		// Vérification plus robuste pour compatibilité avec les tests unitaires
		try {
			if (!field.value || !field.value.$el || typeof field.value.$el.querySelector !== 'function') {
				return null
			}
			return field.value.$el.querySelector('input') as HTMLInputElement | null
		}
		catch {
			return null
		}
	}
	const placeCursorAtEnd = (el: HTMLInputElement, value?: string) => {
		const len = (value ?? el.value)?.length ?? 0
		try {
			el.setSelectionRange(len, len)
		}
		catch {
			return
		}
	}

	// Nettoyage et séparation des valeurs (numéro + clé)
	const sanitizeNumberRaw = (s: string) => s.toUpperCase().replace(/[^0-9AB]/g, '')
	const splitNir = (raw: string) => {
		const cleaned = sanitizeNumberRaw(raw)
		const numberRaw = cleaned.slice(0, 13)
		const overflowForKey = cleaned.slice(13).replace(/[^0-9]/g, '')
		return { numberRaw, overflowForKey }
	}

	// Gestion automatique du focus entre le champ numéro et clé
	watch(unmaskedNumberValue, (val) => {
		if (val && val.length >= 13 && props.displayKey) {
			nextTick(() => {
				const keyInput = getNativeInput(keyField)
				if (keyInput) {
					keyInput.focus()
					placeCursorAtEnd(keyInput, keyValue.value)
					requestAnimationFrame(() => placeCursorAtEnd(keyInput, keyValue.value))
				}
			})
		}
	})
	watch(unmaskedKeyValue, (val) => {
		if (val.length === 0) {
			nextTick(() => {
				const nirInput = getNativeInput(numberField)
				if (nirInput) {
					nirInput.focus()
					placeCursorAtEnd(nirInput, numberValue.value)
					requestAnimationFrame(() => placeCursorAtEnd(nirInput, numberValue.value))
				}
			})
		}
	})

	// Système de validation des champs
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
		if (props.readonly) return rules
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
				validate: (v: string) => {
					if (!v) return true
					if (v.length < 13) return 'Le numéro de sécurité sociale est invalide.'
					return checkNIR(v, props.nirType) === true || 'Le numéro de sécurité sociale est invalide.'
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
		if (props.readonly) return rules
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
			return isNIRKeyValid(unmaskedNumberValue.value + value)
		}
		if (props.customKeyRules?.length) rules.push(...props.customKeyRules)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	// Émission de la valeur complète (numéro + clé) vers le parent
	const emitValue = () => {
		const number = unmaskedNumberValue.value
		const key = unmaskedKeyValue.value
		// Émettre la valeur complète ou undefined si les deux champs sont vides
		const value = (!number && !key) ? undefined : `${number}${key}`
		emit('update:modelValue', value)
	}

	// Système de validation avec gestion d'erreurs, warnings et messages de succès
	const isValidating = ref(false)
	const shouldValidateOnBlur = ref(false)
	const createDebouncedFunction = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
		let timeout: number | undefined
		return (...args: Parameters<T>) => {
			window.clearTimeout(timeout)
			timeout = window.setTimeout(() => fn(...args), delay)
		}
	}
	const debouncedValidate = createDebouncedFunction(() => {
		void validateFields(false)
	}, 300)

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
		let keyResult: unknown = { hasError: false }
		if (props.displayKey) {
			keyResult = keyValidation.validateField(
				unmaskedKeyValue.value,
				defaultKeyRules.value,
				unmaskedKeyValue.value?.length === 2 ? props.customKeyWarningRules : [],
			)
		}

		if (onBlur || shouldValidateOnBlur.value) {
			await nextTick()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((numberResult as any).hasError) numberField.value?.$el?.querySelector?.('input')?.focus()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			else if ((keyResult as any).hasError) keyField.value?.$el?.querySelector?.('input')?.focus()
			shouldValidateOnBlur.value = false
		}

		isValidating.value = false
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return !(numberResult as any).hasError && !(keyResult as any as { hasError: boolean }).hasError
	}

	const validateOnSubmit = () => validateFields(true)

	// États dérivés pour l'affichage et attributs d'accessibilité.
	const hasNumberErrors = computed(() => numberValidation.hasError.value)
	const hasNumberWarning = computed(() => !hasNumberErrors.value && numberValidation.hasWarning.value)
	const hasNumberSuccess = computed(() => !hasNumberErrors.value && !hasNumberWarning.value && numberValidation.hasSuccess.value)

	const hasKeyErrors = computed(() => keyValidation.hasError.value)
	const hasKeyWarning = computed(() => !hasKeyErrors.value && keyValidation.hasWarning.value)
	const hasKeySuccess = computed(() => !hasKeyErrors.value && !hasKeyWarning.value && keyValidation.hasSuccess.value)

	const hasFieldErrors = computed(() => hasNumberErrors.value || hasKeyErrors.value)
	const ariaRequired = computed(() => (props.required ? 'true' : undefined))
	const ariaInvalidNumber = computed(() => (hasFieldErrors.value ? 'true' : undefined))
	const ariaInvalidKey = computed(() => (hasKeyErrors.value ? 'true' : undefined))

	const numberMessages = computed(() => {
		if (hasNumberErrors.value) return numberValidation.errors.value
		if (hasNumberWarning.value) return numberValidation.warnings.value
		if (hasNumberSuccess.value && props.showSuccessMessages) return numberValidation.successes.value
		return [] as string[]
	})
	const combinedErrorMessages = computed(() => [
		...numberValidation.errors.value,
		...keyValidation.errors.value,
	])

	const numberLabelWithAsterisk = computed(() => (props.required && props.displayAsterisk ? `${props.numberLabel} *` : props.numberLabel))
	const keyLabelWithAsterisk = computed(() => (props.required && props.displayAsterisk ? `${props.keyLabel} *` : props.keyLabel))

	// Caret adjust util
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

	// Handlers pour la saisie utilisateur — IMPORTANT : on n'écoute QUE update:model-value côté template/bindings
	const handleNumberInput = (payload: Event | string) => {
		let inputEl: HTMLInputElement | null = null
		let input: string
		if (typeof payload === 'string') input = payload
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

		const switchingToKey = !!(props.displayKey && (numberRaw.length >= 13 || overflowForKey))
		if (switchingToKey) {
			nextTick(() => {
				const keyInput = getNativeInput(keyField)
				if (keyInput) {
					keyInput.focus()
					placeCursorAtEnd(keyInput, keyValue.value)
					requestAnimationFrame(() => placeCursorAtEnd(keyInput, keyValue.value))
				}
			})
		}

		if (inputEl && !switchingToKey) {
			nextTick(() => {
				const pos = overflowForKey ? masked.length : calculateAdjustedPosition(cursor, input, masked)
				try {
					inputEl.setSelectionRange(pos, pos)
				}
				catch {
					console.error('Error setting cursor position')
				}
			})
		}
	}

	const handleKeyInput = (payload: Event | string) => {
		let inputEl: HTMLInputElement | null = null
		let input: string
		if (typeof payload === 'string') input = payload
		else {
			inputEl = payload.target as HTMLInputElement
			input = inputEl?.value ?? ''
		}

		const cleaned = input.replace(/\D/g, '').slice(0, 2) // 2 chiffres max
		const masked = keyMask.masked(cleaned)
		keyValue.value = masked

		emitValue()
		debouncedValidate()

		if (masked.length === 0) {
			// Clé vidée -> retour NIR + caret fin
			nextTick(() => {
				const nirInput = getNativeInput(numberField)
				if (nirInput) {
					nirInput.focus()
					placeCursorAtEnd(nirInput, numberValue.value)
					requestAnimationFrame(() => placeCursorAtEnd(nirInput, numberValue.value))
				}
			})
		}
		else {
			// Toujours caret fin dans la clé
			nextTick(() => {
				const keyInput = getNativeInput(keyField)
				if (keyInput) {
					keyInput.focus()
					placeCursorAtEnd(keyInput, keyValue.value)
					requestAnimationFrame(() => placeCursorAtEnd(keyInput, keyValue.value))
				}
			})
		}
	}

	// Synchronisation depuis la prop modelValue (gère les collages de NIR complet)
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

	// Configuration des propriétés transmises aux champs internes
	const variantStyle = computed(() => (props.outlined ? 'outlined' : 'underlined'))

	const numberBind = computed(() => ({
		'ref': numberField,
		'model-value': numberValue.value,
		'label': numberLabelWithAsterisk.value,
		'variant-style': variantStyle.value,
		'prepend-icon': props.nirTooltip && props.nirTooltipPosition === 'prepend' ? 'info' : undefined,
		'append-icon': props.nirTooltip && props.nirTooltipPosition === 'append' ? 'info' : undefined,
		'prepend-tooltip': props.nirTooltip && props.nirTooltipPosition === 'prepend' ? props.nirTooltip : undefined,
		'append-tooltip': props.nirTooltip && props.nirTooltipPosition === 'append' ? props.nirTooltip : undefined,
		'max-errors': 2,
		'error-messages': (props.displayKey && !props.withoutFieldset)
			? [...new Set([
				...numberValidation.errors.value,
				...keyValidation.errors.value,
			])]
			: combinedErrorMessages.value,
		'warning-messages': numberValidation.warnings.value,
		'success-messages': numberValidation.successes.value,
		'show-success-messages': props.showSuccessMessages,
		'has-warning': hasNumberWarning.value,
		'has-success': hasNumberSuccess.value,
		'error': hasNumberErrors.value || hasKeyErrors.value,
		'messages': numberMessages.value,
		'has-error': hasNumberErrors.value || hasKeyErrors.value,
		'required': props.required,
		'aria-required': ariaRequired.value,
		'aria-invalid': ariaInvalidNumber.value,
		'disabled': props.disabled,
		'bg-color': props.bgColor,
		'density': props.density,
		'hide-details': props.hideDetails,
		'hide-spin-buttons': props.hideSpinButtons,
		'placeholder': props.placeholder,
		'readonly': props.readonly,
		'variant': props.variant,
		'clearable': props.clearable,
		'counter': props.counter,
		'persistent-hint': props.persistentHint,
		'persistent-placeholder': props.persistentPlaceholder,
		'hint': props.hint || locales.numberHint,
		'class': 'number-field',
		'display-asterisk': false,
		// IMPORTANT : on n'écoute QUE l'update ici (pas @input) pour éviter les doubles traitements
		'onUpdate:modelValue': handleNumberInput,
		'onBlur': () => { void validateFields(true) },
	}))

	const keyBind = computed(() => ({
		'ref': keyField,
		'model-value': keyValue.value,
		'label': keyLabelWithAsterisk.value,
		'variant-style': variantStyle.value,
		'prepend-icon': props.keyTooltip && props.keyTooltipPosition === 'prepend' ? 'info' : undefined,
		'append-icon': props.keyTooltip && props.keyTooltipPosition === 'append' ? 'info' : undefined,
		'prepend-tooltip': props.keyTooltip && props.keyTooltipPosition === 'prepend' ? props.keyTooltip : undefined,
		'append-tooltip': props.keyTooltip && props.keyTooltipPosition === 'append' ? props.keyTooltip : undefined,
		'error-messages': keyValidation.errors.value.length > 0 ? [''] : [],
		'warning-messages': keyValidation.warnings.value,
		'show-success-messages': false,
		'has-warning': hasKeyWarning.value,
		'has-success': hasKeySuccess.value,
		'hint': props.hint || locales.keyHint,
		'has-error': hasKeyErrors.value,
		'disabled': props.disabled,
		'bg-color': props.bgColor,
		'density': props.density,
		'hide-details': props.hideDetails,
		'hide-spin-buttons': props.hideSpinButtons,
		'placeholder': props.placeholder,
		'readonly': props.readonly,
		'variant': props.variant,
		'clearable': props.clearable,
		'counter': props.counter,
		'persistent-hint': props.persistentHint,
		'persistent-placeholder': props.persistentPlaceholder,
		'aria-required': ariaRequired.value,
		'aria-invalid': ariaInvalidKey.value,
		'class': 'key-field',
		'display-asterisk': false,
		// IMPORTANT : uniquement l'update
		'onUpdate:modelValue': handleKeyInput,
		'onBlur': () => { void validateFields(true) },
	}))

	// Configuration du conteneur (fieldset ou div) pour l'accessibilité
	const useFieldset = computed(() => props.displayKey && !props.withoutFieldset)
	const wrapperTag = computed(() => (useFieldset.value ? 'fieldset' : 'div'))
	const wrapperClasses = computed(() => ({ 'nir-field': true, 'nir-field--fieldset': useFieldset.value }))

	// Expose les méthodes et propriétés pour l'API publique
	defineExpose({
		validateOnSubmit,
		numberMask: { mask: numberMaskPattern, preProcess: (v: string) => v.toUpperCase(), tokens: { '#': {}, 'C': {} } },
		keyMask: { mask: '##', tokens: { '#': {} } },
		numberValidation,
		keyValidation,
	})
</script>

<template>
	<component
		:is="wrapperTag"
		:class="wrapperClasses"
	>
		<legend v-if="useFieldset && label">
			{{ label }}
		</legend>

		<div class="number-field-container">
			<SyTextField v-bind="numberBind" />
		</div>

		<div
			v-if="displayKey"
			class="key-field-container"
		>
			<SyTextField v-bind="keyBind" />
		</div>
	</component>
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
