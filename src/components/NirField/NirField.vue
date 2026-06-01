<script lang="ts" setup>
	import { ref, watch, computed, nextTick, toRef, onMounted, useId, onBeforeUnmount } from 'vue'
	import { vMaska } from 'maska/vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import { locales } from './locales'
	import { useValidation } from '@/composables/unifyValidation/useValidation'
	import { useNirValidation, type NirValidationProps } from './useNirValidation'

	const props = withDefaults(defineProps<{
		modelValue?: string | undefined | null
		label?: string
		numberLabel?: string
		keyLabel?: string
		displayKey?: boolean
		nirTooltip?: string
		keyTooltip?: string
		nirTooltipPosition?: 'prepend' | 'append'
		keyTooltipPosition?: 'prepend' | 'append'
		displayAsterisk?: boolean
		width?: string
		bgColor?: string
		density?: 'default' | 'comfortable' | 'compact'
		hideDetails?: boolean | 'auto'
		hideSpinButtons?: boolean
		placeholder?: string
		variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo'
		clearable?: boolean
		counter?: boolean | number | string
		numberHint?: string
		keyHint?: string
		persistentHint?: boolean
		persistentPlaceholder?: boolean
		disableErrorHandling?: boolean
		nirType?: 'simple' | 'complexe'
		withoutFieldset?: boolean
		customLocale?: Record<keyof typeof locales, string>
	} & NirValidationProps>(), {
		modelValue: undefined,
		label: 'Identifiant d\'assuré',
		numberLabel: 'Numéro de sécurité sociale',
		keyLabel: 'Clé de validation',
		displayKey: true,
		nirTooltip: undefined,
		keyRules: () => [],
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
		successDisplay: 'none',
		width: '100%',
		bgColor: 'white',
		disabled: false,
		density: 'default',
		hideDetails: false,
		hideSpinButtons: false,
		isValidateOnBlur: true,
		placeholder: undefined,
		readonly: false,
		variant: 'outlined',
		clearable: false,
		counter: false,
		numberHint: undefined,
		keyHint: undefined,
		persistentHint: false,
		persistentPlaceholder: false,
		disableErrorHandling: false,
		numberRules: () => [],
		nirType: 'simple',
		withoutFieldset: false,
		customLocale: () => locales,
	})

	const emit = defineEmits(['update:modelValue'])
	const modelValueRef = toRef(props, 'modelValue')

	// Champs
	const numberValue = ref('')
	const keyValue = ref('')

	// Flag pour éviter les boucles infinies lors de la synchronisation
	const isInternalUpdate = ref(false)

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

	const fieldWidth = computed(() => props.width || '100%')
	const nirFieldWidth = computed(() => props.clearable ? '0 0 calc(68% - 8px)' : '0 0 calc(68% - 8px)')
	const keyFieldWidth = computed(() => props.clearable ? '0 0 calc(32% - 8px)' : '0 0 calc(32% - 8px)')

	const fieldId = useId()
	const numberFieldErrorId = `nir-number-error-${fieldId}`
	const keyFieldErrorId = `nir-key-error-${fieldId}`
	const numberFieldWarningId = `nir-number-warning-${fieldId}`
	const keyFieldWarningId = `nir-key-warning-${fieldId}`
	const numberFieldSuccessId = `nir-number-success-${fieldId}`
	const keyFieldSuccessId = `nir-key-success-${fieldId}`

	const container = ref<HTMLElement | null>(null)

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
		if (newValue.length === 0 && props.displayKey) {
			focusField(numberField)
		}
	})

	// Watch pour détecter la suppression des chiffres de la clé
	watch(keyValue, (newValue, oldValue) => {
		if (!props.displayKey) return

		// Si l'ancienne valeur avait des chiffres et la nouvelle est vide ou ne contient que des espaces
		if (oldValue && newValue !== null && oldValue.trim() && !newValue.trim()) {
			focusField(numberField)
		}
		else if (oldValue && newValue === null) {
			// Cas où newValue est null (effacement avec clearable)
			focusField(numberField)
		}
	})

	// Synchronisation avec modelValue
	watch(modelValueRef, (newValue) => {
		// Ignorer les mises à jour internes pour éviter les boucles infinies
		if (isInternalUpdate.value) return

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

		// Marquer comme mise à jour interne pour éviter la boucle
		isInternalUpdate.value = true

		if (!number && !key) {
			emit('update:modelValue', undefined)
		}
		else {
			emit('update:modelValue', `${number}${key}`)
		}

		// Réactiver la synchronisation au prochain tick
		nextTick(() => {
			isInternalUpdate.value = false
		})
	}

	const {
		numberValidation,
		keyValidation,
		validateFields,
		hasFieldErrors,
	} = useNirValidation(
		numberValue,
		keyValue,
		unmaskedNumberValue,
		unmaskedKeyValue,
		toRef(props, 'readonly'),
		toRef(props, 'disabled'),
		toRef(props, 'required'),
		numberField,
		keyField,
		toRef(props, 'customLocale'),
		toRef(props, 'numberLabel'),
		toRef(props, 'keyLabel'),
		toRef(props, 'customNumberRules'),
		toRef(props, 'customKeyRules'),
		toRef(props, 'customNumberWarningRules'),
		toRef(props, 'customKeyWarningRules'),
		toRef(props, 'displayKey'),
		toRef(props, 'customRulesPrecedence'),
		toRef(props, 'nirType'),
		toRef(props, 'label'),
		toRef(props, 'successDisplay'),
		toRef(props, 'disableErrorHandling'),
		toRef(props, 'isValidateOnBlur'),
		toRef(props, 'useVuetifyValidation'),
		toRef(props, 'numberRules'),
		toRef(props, 'keyRules'),
	)

	const validateOnSubmit = () => {
		return validateFields(true)
	}

	// Propriétés calculées pour les attributs ARIA et les états d'erreur
	const ariaRequired = computed(() => props.required ? 'true' : undefined)
	const ariaInvalidNumber = computed(() => hasFieldErrors.value ? 'true' : undefined)
	const ariaInvalidKey = computed(() => keyValidation.hasError.value ? 'true' : undefined)

	const numberLabelWithAsterisk = computed(() => {
		return props.required && props.displayAsterisk ? `${props.numberLabel} *` : props.numberLabel
	})

	const keyLabelWithAsterisk = computed(() => {
		return props.required && props.displayAsterisk ? `${props.keyLabel} *` : props.keyLabel
	})

	const handleKeyInput = () => {
		emitValue()

		// Si on supprime le contenu de la clé, on revient au champ NIR
		if (props.displayKey && unmaskedKeyValue.value.length === 0) {
			nextTick(() => {
				numberField.value?.$el?.querySelector?.('input')?.focus()
			})
		}
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
		// N'ajouter l'écouteur keydown QUE si on affiche la clé
		if (props.displayKey) {
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
						const fieldsetNumberInput = container.value?.querySelector('.number-field input')
						if (fieldsetNumberInput) {
							fieldsetNumberInput.addEventListener('keydown', handleNumberKeydown)
						}
					}, 100)
				}
			})
		}
	})

	onBeforeUnmount(() => {
		if (props.displayKey) {
			const numberInput = numberField.value?.$el?.querySelector?.('input')
			if (numberInput) {
				numberInput.removeEventListener('keydown', handleNumberKeydown)
			}
		}
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
	<component
		:is="displayKey && !withoutFieldset ? 'fieldset' : 'div'"
		ref="container"
		:aria-label="displayKey && withoutFieldset ? label : undefined"
		:role="displayKey && withoutFieldset ? 'group' : undefined"
		:class="displayKey && !withoutFieldset ? 'nir-field nir-field--fieldset' : 'nir-field'"
	>
		<legend v-if="label && displayKey && !withoutFieldset">
			{{ label }}
		</legend>
		<div class="number-field-container">
			<SyTextField
				ref="numberField"
				v-model="numberValue"
				v-maska="numberMask"
				:label="numberLabelWithAsterisk"
				:variant-style="props.variant"
				:prepend-icon="nirTooltip && nirTooltipPosition === 'prepend' ? 'info' : undefined"
				:append-icon="nirTooltip && nirTooltipPosition === 'append' ? 'info' : undefined"
				:prepend-tooltip="nirTooltip && nirTooltipPosition === 'prepend' ? nirTooltip : undefined"
				:append-tooltip="nirTooltip && nirTooltipPosition === 'append' ? nirTooltip : undefined"
				:error="numberValidation.errors.value.length > 0"
				:aria-required="ariaRequired"
				:has-error="numberValidation.hasError.value"
				:has-warning="numberValidation.hasWarning.value"
				:has-success="numberValidation.hasSuccess.value"
				:aria-invalid="ariaInvalidNumber"
				:disabled="disabled"
				:disable-error-handling="true"
				:bg-color="bgColor"
				:density="props.density"
				:hide-details="props.hideDetails"
				:hide-spin-buttons="props.hideSpinButtons"
				:placeholder="props.placeholder"
				:readonly="props.readonly"
				:clearable="props.clearable"
				:counter="props.counter"
				:hint="props.numberHint || locales.numberHint"
				:persistent-hint="props.persistentHint"
				:persistent-placeholder="props.persistentPlaceholder"
				class="number-field"
				:class="{
					'sy-hide-detail': props.hideDetails,
				}"
				:display-asterisk="false"
				:aria-describedby="numberFieldErrorId + ' ' + numberFieldWarningId + ' ' + numberFieldSuccessId"
				:show-success-messages="false"
				@input="emitValue"
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
				:variant-style="props.variant"
				:prepend-icon="keyTooltip && keyTooltipPosition === 'prepend' ? 'info' : undefined"
				:append-icon="keyTooltip && keyTooltipPosition === 'append' ? 'info' : undefined"
				:prepend-tooltip="keyTooltip && keyTooltipPosition === 'prepend' ? keyTooltip : undefined"
				:append-tooltip="keyTooltip && keyTooltipPosition === 'append' ? keyTooltip : undefined"
				:error="keyValidation.errors.value.length > 0"
				:disabled="disabled"
				:bg-color="bgColor"
				:density="props.density"
				:disable-error-handling="true"
				:hide-details="props.hideDetails"
				:hide-spin-buttons="props.hideSpinButtons"
				:placeholder="props.placeholder"
				:readonly="props.readonly"
				:clearable="props.clearable"
				:counter="props.counter"
				:hint="props.keyHint || locales.keyHint"
				:persistent-hint="props.persistentHint"
				:persistent-placeholder="props.persistentPlaceholder"
				:aria-required="ariaRequired"
				:has-error="keyValidation.hasError.value"
				:has-warning="keyValidation.hasWarning.value"
				:has-success="keyValidation.hasSuccess.value"
				:aria-invalid="ariaInvalidKey"
				class="key-field"
				:class="{
					'sy-hide-detail': props.hideDetails,
				}"
				:display-asterisk="false"
				:aria-describedby="keyFieldErrorId + ' ' + keyFieldWarningId + ' ' + keyFieldSuccessId"
				:show-success-messages="false"
				@input="handleKeyInput"
			/>
		</div>
		<div
			class="sy-messages"
			style="flex: 1 0 100%;"
		>
			<div
				:id="numberFieldErrorId"
				class="sy-number-errors"
			>
				<VMessages
					v-show="numberValidation.hasError.value"
					:active="numberValidation.hasError.value"
					:messages="numberValidation.errors.value"
				/>
			</div>
			<div
				:id="keyFieldErrorId"
				class="sy-key-errors"
			>
				<VMessages
					v-show="keyValidation.hasError.value"
					:active="keyValidation.hasError.value"
					:messages="keyValidation.errors.value"
				/>
			</div>
			<div
				:id="numberFieldWarningId"
				class="sy-number-warnings"
			>
				<VMessages
					v-show="numberValidation.hasWarning.value"
					:active="numberValidation.hasWarning.value"
					:messages="numberValidation.warnings.value"
				/>
			</div>
			<div
				:id="keyFieldWarningId"
				class="sy-key-warnings"
			>
				<VMessages
					v-show="keyValidation.hasWarning.value"
					:active="keyValidation.hasWarning.value"
					:messages="keyValidation.warnings.value"
				/>
			</div>
			<div
				:id="numberFieldSuccessId"
				class="sy-number-success"
			>
				<VMessages
					v-show="numberValidation.hasSuccess.value && successDisplay !== 'none'"
					:active="numberValidation.hasSuccess.value"
					:messages="numberValidation.successes.value"
				/>
			</div>
			<div
				:id="keyFieldSuccessId"
				class="sy-key-success"
			>
				<VMessages
					v-show="keyValidation.hasSuccess.value && successDisplay !== 'none'"
					:active="keyValidation.hasSuccess.value"
					:messages="keyValidation.successes.value"
				/>
			</div>
		</div>
	</component>
</template>

<style lang="scss" scoped>
.nir-field {
	display: flex;
	flex-wrap: wrap;
	gap: 0 16px;
	width: calc(v-bind(fieldWidth) - 16px);
	align-items: flex-start;
}

.nir-field--fieldset {
	width: calc(v-bind(fieldWidth) + 5px);
	border: 1px solid #949494;
	border-radius: 4px;
	padding: 25px;
	margin: 0;
	display: flex;
	gap: 0 16px;
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
	flex: 0 0 calc(68% - 8px);
}

.nir-field:not(.nir-field--fieldset) .key-field-container {
	flex: 0 0 calc(32% - 8px);
}

/* Styles pour le mode fieldset */
.nir-field--fieldset .number-field-container {
	flex: v-bind(nirFieldWidth);
}

.nir-field--fieldset .key-field-container {
	flex: v-bind(keyFieldWidth);
}

.number-field,
.key-field {
	width: 100%;
}

.key-field {
	min-width: 110px;
	flex-wrap: wrap;

	:deep(.v-messages .v-messages__message) {
		min-width: 100px !important;
		margin-left: -10px !important;
	}
}

.sy-messages {
	font-size: 0.875rem;
	font-weight: 400;
	letter-spacing: 0.0333em;
	line-height: 16px;
	padding-inline: 16px;

	:deep(.v-messages) {
		opacity: 1;
	}
}

.sy-hide-detail {
	padding-bottom: 6px;
}

.sy-number-errors,
.sy-key-errors {
	color: rgb(var(--v-theme-error));
}

.sy-number-warnings,
.sy-key-warnings {
	color: rgb(var(--v-theme-onWarningVariant));
}

.sy-number-success,
.sy-key-success {
	color: rgb(var(--v-theme-onSuccessVariant));
}
</style>
