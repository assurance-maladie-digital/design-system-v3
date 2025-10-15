<script lang="ts" setup>
	import { computed, ref, watch, nextTick } from 'vue'
	import type { PropType } from 'vue'
	import { mdiPhone } from '@mdi/js'
	import { indicatifs } from './indicatifs'
	import { Mask } from 'maska'
	import { locales } from './locales'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import {
		mdiAlertOutline,
		mdiCheck,
		mdiInformation,
	} from '@mdi/js'

	type DisplayFormat = 'code' | 'code-abbreviation' | 'code-country' | 'country' | 'abbreviation'
	type Indicatif = {
		code: string
		abbreviation: string
		country: string
		countryFr?: string
		mask?: string
		phoneLength: number
	}

	const props = defineProps({
		modelValue: { type: String, default: '' },
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		dialCodeModel: { type: [String, Object] as PropType<string | Record<string, any>>, default: '' },
		required: { type: Boolean, default: false },
		outlined: { type: Boolean, default: true },
		outlinedIndicatif: { type: Boolean, default: true },
		withCountryCode: { type: Boolean, default: false },
		countryCodeRequired: { type: Boolean, default: false },
		displayFormat: { type: String as PropType<DisplayFormat>, default: 'code' },
		customIndicatifs: { type: Array as PropType<Indicatif[]>, default: () => [] },
		useCustomIndicatifsOnly: { type: Boolean, default: false },
		isValidatedOnBlur: { type: Boolean, default: true },
		displayAsterisk: { type: Boolean, default: false },
		disableErrorHandling: { type: Boolean, default: false },
		bgColor: { type: String, default: 'white' },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		helpText: { type: String, default: '' },
		autocompleteCountryCode: { type: String, default: 'tel-country-code' },
		autocompletePhone: { type: String, default: 'tel-national' },
		withoutFieldset: { type: Boolean, default: false },
	})

	const emit = defineEmits(['update:modelValue', 'update:selectedDialCode', 'change'])

	const phoneNumber = ref(props.modelValue || '')
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const dialCode = ref<string | Record<string, any>>(props.dialCodeModel || '')
	const counter = ref(10)
	const phoneMask = ref('## ## ## ## ##')
	const onBlur = ref(false)

	function formatPhoneNumber(value: string): string {
		if (!value) return ''
		const cleaned = value.replace(/\D/g, '')
		return cleaned.replace(/(.{2})/g, '$1 ').trim()
	}

	const computedValue = computed(() => formatPhoneNumber(phoneNumber.value))

	watch(() => props.modelValue, (newVal) => {
		if (newVal) {
			// Apply mask to incoming value to ensure consistent formatting
			const mask = new Mask({ mask: phoneMask.value })
			phoneNumber.value = mask.masked(newVal)
		}
		else {
			phoneNumber.value = ''
		}
	}, { immediate: true })

	watch(dialCode, (newVal) => {
		emit('update:selectedDialCode', newVal)
		if (typeof newVal === 'object' && newVal !== null) {
			counter.value = newVal.phoneLength || 10
			phoneMask.value = newVal.mask || '#'.repeat(newVal.phoneLength || 10).replace(/(.{2})/g, '$1 ').trim()
			const mask = new Mask({ mask: phoneMask.value })
			const maskedValue = mask.masked(phoneNumber.value)
			emit('update:modelValue', maskedValue)
		}
	})

	/**
	 * Calcule la position ajustée du curseur en tenant compte des espaces ajoutés par le masque
	 * @param cursorPosition - Position originale du curseur
	 * @param originalValue - Valeur avant application du masque
	 * @param maskedValue - Valeur après application du masque
	 * @returns Position ajustée du curseur
	 */
	const calculateAdjustedPosition = (cursorPosition: number, originalValue: string, maskedValue: string): number => {
		// Compte combien de caractères non-espace se trouvent avant la position du curseur dans la valeur originale
		const digitsBeforeCursor = originalValue.substring(0, cursorPosition).replace(/\s/g, '').length

		// Parcours la valeur masquée pour trouver la position qui contient le même nombre de caractères non-espace
		let newPosition = 0
		let digitCount = 0

		for (let i = 0; i < maskedValue.length; i++) {
			if (maskedValue[i] !== ' ') {
				digitCount++
			}

			if (digitCount > digitsBeforeCursor) {
				break
			}

			newPosition = i + 1
		}

		return newPosition
	}

	const handlePhoneInput = (event: Event) => {
		const inputElement = event.target as HTMLInputElement
		const input = inputElement.value

		// Sauvegarder la position du curseur
		const cursorPosition = inputElement.selectionStart || 0

		// Appliquer le masque
		const mask = new Mask({ mask: phoneMask.value })
		const maskedValue = mask.masked(input)

		// Mettre à jour la valeur
		phoneNumber.value = maskedValue
		emit('update:modelValue', maskedValue)
		emit('change', maskedValue)

		// Restaurer la position du curseur sur le prochain cycle de rendu
		nextTick(() => {
			const adjustedPosition = calculateAdjustedPosition(cursorPosition, input, maskedValue)
			inputElement.setSelectionRange(adjustedPosition, adjustedPosition)
		})
	}

	const mergedDialCodes = computed(() =>
		props.useCustomIndicatifsOnly ? props.customIndicatifs : [...indicatifs, ...props.customIndicatifs],
	)

	const dialCodeOptions = computed(() =>
		mergedDialCodes.value.map(ind => ({
			...ind,
			displayText: generateDisplayText(ind),
			plainDisplayText: generatePlainDisplayText(ind),
		})),
	)

	watch(() => props.readonly, () => {
		if (onBlur.value && !shouldDisableErrorHandling.value) {
			const cleanedValue = phoneNumber.value.replace(/\s/g, '')
			validation.validateField(cleanedValue, validationRules.value)
		}
	})

	// Watcher pour initialiser dialCode à partir de props.dialCodeModel
	watch(() => props.dialCodeModel, (newVal) => {
		if (!newVal) {
			dialCode.value = ''
			return
		}

		// Si c'est un objet, on cherche l'indicatif correspondant dans la liste des options
		if (typeof newVal === 'object') {
			// On cherche l'indicatif avec le même code
			const matchingOption = dialCodeOptions.value.find((opt) => {
				return opt.code === newVal.code
			})

			if (matchingOption) {
				// On utilise directement l'objet de la liste pour éviter les problèmes de référence
				dialCode.value = matchingOption
			}
			else {
				dialCode.value = newVal
			}
		}
		else {
			// Si c'est une chaîne ou autre chose, on l'utilise directement
			dialCode.value = newVal
		}
	}, { immediate: true })

	function generateDisplayText(ind: Indicatif): string {
		const countryName = ind.countryFr || ind.country
		const format = {
			'code': ind.code,
			'code-abbreviation': `${ind.code} (<abbr title="${countryName}">${ind.abbreviation}</abbr>)`,
			'code-country': `${ind.code} ${countryName}`,
			'country': countryName,
			'abbreviation': `<abbr title="${countryName}">${ind.abbreviation}</abbr>`,
		}
		return format[props.displayFormat] || ind.code
	}

	function generatePlainDisplayText(ind: Indicatif): string {
		const countryName = ind.countryFr || ind.country
		const format = {
			'code': ind.code,
			'code-abbreviation': `${ind.code} (${ind.abbreviation})`,
			'code-country': `${ind.code} ${countryName}`,
			'country': countryName,
			'abbreviation': ind.abbreviation,
		}
		return format[props.displayFormat] || ind.code
	}

	const validationRules = computed<ValidationRule[]>(() => {
		const rules = [{
			type: 'exactLength',
			options: {
				length: counter.value,
				ignoreSpace: true,
				message: `Le numéro de téléphone doit contenir ${counter.value} chiffres.`,
				fieldIdentifier: locales.label,
			},
		}] as ValidationRule[]

		if (props.required) {
			rules.unshift({
				type: 'required',
				options: {
					length: counter.value,
					ignoreSpace: true,
					message: `Le champ ${locales.label} est requis.`,
					fieldIdentifier: locales.label,
				},
			})
		}

		return rules
	})

	const shouldDisableErrorHandling = computed(() => props.disableErrorHandling || props.readonly)

	const validation = useValidation({
		customRules: validationRules.value,
		showSuccessMessages: true,
		fieldIdentifier: locales.label,
		disableErrorHandling: shouldDisableErrorHandling.value,
	})

	const hasError = computed(() => validation.hasError.value)
	const hasWarning = computed(() => validation.hasWarning.value)
	const hasSuccess = computed(() => validation.hasSuccess.value)

	const iconColor = computed(() => {
		if (shouldDisableErrorHandling.value) return '#222324'
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return '#222324'
	})

	const errors = computed(() => validation.errors.value)
	const warnings = computed(() => validation.warnings.value)
	const successes = computed(() => validation.successes.value)

	const showHelpTextBelow = computed(() => {
		// Display help text below by default if it exists
		return props.helpText && props.helpText.trim() !== ''
	})

	function validateInputOnBlur() {
		if (!props.isValidatedOnBlur || shouldDisableErrorHandling.value) return

		onBlur.value = true
		const cleanedValue = phoneNumber.value.replace(/\s/g, '')
		validation.validateField(cleanedValue, validationRules.value)
	}

	watch(phoneNumber, (newValue) => {
		if ((!props.isValidatedOnBlur || onBlur.value) && !shouldDisableErrorHandling.value) {
			const cleanedValue = newValue.replace(/\s/g, '')
			validation.validateField(cleanedValue, validationRules.value)
		}
	})

	watch(validationRules, () => {
		if (onBlur.value && !shouldDisableErrorHandling.value) {
			const cleanedValue = phoneNumber.value.replace(/\s/g, '')
			validation.validateField(cleanedValue, validationRules.value)
		}
	})

	/**
	 * Valide le champ lors de la soumission d'un formulaire
	 * @returns Promise<boolean> - true si le champ est valide, false sinon
	 */
	const validateOnSubmit = async (): Promise<boolean> => {
		if (shouldDisableErrorHandling.value) {
			return true
		}

		onBlur.value = true

		const cleanedValue = phoneNumber.value.replace(/\s/g, '')
		validation.validateField(cleanedValue, validationRules.value)

		if (props.withCountryCode && props.countryCodeRequired && !dialCode.value) {
			validation.errors.value.push(`Le champ ${locales.indicatifLabel} est requis.`)
		}

		return !validation.hasError.value
	}

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit)

	defineExpose({
		computedValue,
		dialCode,
		phoneMask,
		counter,
		hasError,
		phoneNumber,
		mergedDialCodes,
		validation,
		validateOnSubmit,
	})
</script>

<template>
	<component
		:is="!withoutFieldset ? 'fieldset' : 'div'"
		:class="!withoutFieldset ? 'phone-field-fieldset' : ''"
	>
		<legend
			v-if="!withoutFieldset"
			class="phone-field-legend"
		>
			{{ locales.label }}
		</legend>
		<div class="phone-field-container">
			<SySelect
				v-if="withCountryCode"
				v-model="dialCode"
				:items="dialCodeOptions"
				:label="locales.indicatifLabel"
				:outlined="outlinedIndicatif"
				:required="countryCodeRequired"
				:aria-required="countryCodeRequired"
				:error="hasError"
				:error-messages="errors[1]"
				:display-asterisk="displayAsterisk"
				:disable-error-handling="shouldDisableErrorHandling"
				:return-object="true"
				:bg-color="bgColor"
				:readonly="readonly"
				:disabled="disabled"
				:allow-html="displayFormat === 'code-abbreviation' || displayFormat === 'abbreviation'"
				:autocomplete="autocompleteCountryCode"
				width="30%"
				class="custom-select mr-4"
				text-key="displayText"
				plain-text-key="plainDisplayText"
				value-key="code"
			/>
			<SyTextField
				ref="phoneField"
				:model-value="phoneNumber"
				:counter="counter"
				:counter-value="(value: string) => value.replace(/\s/g, '').length"
				:label="withCountryCode ? locales.phoneNumberWithoutCountryLabel : locales.label"
				:required="required"
				:aria-required="required"
				:error="hasError"
				:error-messages="errors"
				:warning-messages="warnings"
				:success-messages="successes"
				:variant="outlined ? 'outlined' : 'underlined'"
				:display-asterisk="displayAsterisk"
				:readonly="readonly"
				:bg-color="bgColor"
				:disabled="disabled"
				:autocomplete="autocompletePhone"
				:class="{
					'phone-field': true,
					'error-field': hasError,
					'warning-field': hasWarning,
					'success-field': hasSuccess
				}"
				width="70%"
				color="primary"
				type="tel"
				@blur="validateInputOnBlur"
				@input="handlePhoneInput"
			>
				<template #append-inner>
					<div class="d-flex align-center">
						<SyIcon
							v-if="hasError && !shouldDisableErrorHandling"
							color="error"
							:icon="mdiInformation"
							decorative
						/>
						<SyIcon
							v-else-if="hasWarning && !shouldDisableErrorHandling"
							color="warning"
							:icon="mdiAlertOutline"
							decorative
						/>
						<SyIcon
							v-else-if="hasSuccess && !shouldDisableErrorHandling"
							color="success"
							:icon="mdiCheck"
							decorative
						/>
						<SyIcon
							class="ml-2"
							:color="iconColor"
							:icon="mdiPhone"
							decorative
						/>
					</div>
				</template>
			</SyTextField>
		</div>
		<div
			v-if="showHelpTextBelow"
			class="help-text-below px-4 mt-1"
			:class="{ 'text-disabled': disabled }"
		>
			{{ helpText }}
		</div>
	</component>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.phone-field-fieldset {
	border: 1px solid #b9b9b9;
	border-radius: 4px;
	padding: 25px;
	margin: 0;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	min-width: 0;
}

.phone-field-legend {
	padding: 0 8px;
	font-weight: 500;
	color: #666;
}

.required-asterisk {
	color: #d32f2f;
	margin-left: 4px;
}

.phone-field-container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
}

.phone-field {
	width: 100%;
}

@media (width >= 600px) {
	.phone-field-container {
		flex-direction: row;
		align-items: center;
	}

	.custom-select {
		margin-bottom: 0;
		min-width: 144px;
	}

	.phone-field {
		min-width: 350px;
	}
}

:deep(.v-list) {
	position: absolute;
	left: inherit !important;
	background-color: white;
	max-height: 300px;
	padding: 0;
	box-shadow: 0 2px 5px rgb(0 0 0 / 12%), 0 2px 10px rgb(0 0 0 / 8%);
	border-radius: 4px;
	overflow-y: auto;
	z-index: 2;
}

.help-text-below {
	font-size: 0.75rem;
	line-height: 1.25rem;
	color: rgb(var(--v-theme-on-surface));
	opacity: 0.6;

	&.text-disabled {
		opacity: 0.38;
	}
}
</style>
