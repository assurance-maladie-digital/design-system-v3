<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import type { PropType } from 'vue'
	import { mdiPhone } from '@mdi/js'
	import { indicatifs } from './indicatifs'
	import { vMaska } from 'maska/vue'
	import { locales } from './locales'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
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
		phoneNumber.value = (newVal || '').replace(/\s/g, '')
	}, { immediate: true })

	watch(dialCode, (newVal) => {
		emit('update:selectedDialCode', newVal)
		if (typeof newVal === 'object' && newVal !== null) {
			counter.value = newVal.phoneLength || 10
			phoneMask.value = newVal.mask || '#'.repeat(newVal.phoneLength || 10).replace(/(.{2})/g, '$1 ').trim()
		}
	})

	function handlePhoneInput(event: Event) {
		const input = (event.target as HTMLInputElement).value
		const cleanedInput = input.replace(/\D/g, '')
		phoneNumber.value = cleanedInput
		emit('update:modelValue', cleanedInput)
		emit('change', cleanedInput)
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
		const format = {
			'code': ind.code,
			'code-abbreviation': `${ind.code} (<abbr title="${ind.country}">${ind.abbreviation}</abbr>)`,
			'code-country': `${ind.code} ${ind.country}`,
			'country': ind.country,
			'abbreviation': `<abbr title="${ind.country}">${ind.abbreviation}</abbr>`,
		}
		return format[props.displayFormat] || ind.code
	}

	function generatePlainDisplayText(ind: Indicatif): string {
		const format = {
			'code': ind.code,
			'code-abbreviation': `${ind.code} (${ind.abbreviation})`,
			'code-country': `${ind.code} ${ind.country}`,
			'country': ind.country,
			'abbreviation': ind.abbreviation,
		}
		return format[props.displayFormat] || ind.code
	}

	const validationRules = computed<ValidationRule[]>(() => {
		const rules = [{
			type: 'exactLength',
			options: {
				length: counter.value,
				ignoreSpace: true, // Ignorer les espaces dans la validation
				message: `Le numéro de téléphone doit contenir ${counter.value} chiffres.`,
				fieldIdentifier: locales.label,
			},
		}]
		if (props.required) {
			rules.unshift({
				type: 'required',
				options: {
					length: counter.value,
					ignoreSpace: true, // Ignorer les espaces dans la validation
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
	<div class="phone-field-container">
		<SySelect
			v-if="withCountryCode"
			v-model="dialCode"
			:items="dialCodeOptions"
			:label="locales.indicatifLabel"
			:outlined="outlinedIndicatif"
			:required="countryCodeRequired"
			:error="hasError"
			:error-messages="errors[1]"
			:display-asterisk="displayAsterisk"
			:disable-error-handling="shouldDisableErrorHandling"
			:return-object="true"
			:bg-color="bgColor"
			:readonly="readonly"
			:disabled="disabled"
			:allow-html="displayFormat === 'code-abbreviation' || displayFormat === 'abbreviation'"
			width="30%"
			class="custom-select mr-4"
			text-key="displayText"
			plain-text-key="plainDisplayText"
			value-key="code"
		/>
		<SyTextField
			v-model="phoneNumber"
			v-maska="phoneMask"
			:counter="counter"
			:counter-value="(value: string) => value.replace(/\s/g, '').length"
			:label="locales.label"
			:required="required"
			:error="hasError"
			:error-messages="errors"
			:warning-messages="warnings"
			:success-messages="successes"
			:variant="outlined ? 'outlined' : 'underlined'"
			:display-asterisk="displayAsterisk"
			:readonly="readonly"
			:bg-color="bgColor"
			:disabled="disabled"
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
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

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
</style>
