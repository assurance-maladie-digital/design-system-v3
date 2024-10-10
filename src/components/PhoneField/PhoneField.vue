<script setup lang="ts">
	import { computed, ref, defineEmits } from 'vue'
	import { required as RequiredRule } from '@/utils/rules/required'
	import { exactLength } from '@/utils/rules/exactLength'
	import { mdiPhone, mdiInformation } from '@mdi/js'
	import { indicatifs } from './indicatifs'
	import { locales } from './locales'
	import { vMaska } from 'maska/vue'

	const props = defineProps({
		modelValue: { type: String, default: '' },
		required: { type: Boolean, default: false },
		outlined: { type: Boolean, default: false },
		withCountryCode: { type: Boolean, default: false },
		countryCodeRequired: { type: Boolean, default: false },
	})

	const phoneIcon = mdiPhone
	const infoIcon = mdiInformation
	const internalValue = ref<string>(props.modelValue || '')
	const countryCodeList = ref(indicatifs)
	const selectedCountryCode = ref<string | null>(null)

	const emit = defineEmits(['update:modelValue', 'change'])

	// Computed property to find the selected country
	const selectedCountry = computed(() => {
		return countryCodeList.value.find(ind => ind.code === selectedCountryCode.value) || null
	})

	// Formatage du numéro de téléphone
	const formatPhone = (phone: string): string => {
		phone = phone.replace(/\D/g, '')
		if (selectedCountry.value?.mask) {
			const regex = new RegExp(selectedCountry.value.mask.replace(/#/g, '\\d'))
			return phone.replace(regex, selectedCountry.value.mask).trim()
		}
		return phone.replace(/(.{2})/g, '$1 ').trim()
	}

	const noSpacesCounter = (value: string | undefined): number => {
		return value?.replace(/\s/g, '').length || 0
	}

	const setInternalValue = (event: Event): void => {
		let input = (event.target as HTMLInputElement).value
		input = input.replace(/\s/g, '').replace(/\D/g, '')
		if (props.withCountryCode && selectedCountryCode.value) {
			const countryCode = selectedCountryCode.value.replace(/\D/g, '')
			if (input.startsWith(countryCode)) {
				input = input.substring(countryCode.length)
			}
		}
		internalValue.value = input
		emitChangeEvent()
	}

	const emitChangeEvent = () => {
		let rawPhone = internalValue.value
		if (selectedCountryCode.value === '+33' && !rawPhone.startsWith('0')) {
			rawPhone = '0' + rawPhone // Rétablir le zéro initial pour la France
		}
		emit('update:modelValue', rawPhone)
		emit('change', rawPhone)
	}

	const computedValue = computed(() => {
		if (internalValue.value) {
			let displayPhone = internalValue.value
			if (selectedCountryCode.value === '+33' && displayPhone.startsWith('0')) {
				displayPhone = displayPhone.substring(1)
			}
			return formatPhone(displayPhone)
		}
		return ''
	})

	const mask = computed(() => {
		if (props.withCountryCode && selectedCountry.value) {
			return selectedCountry.value.mask || '## ## ## ## ##'
		}
		return '## ## ## ## ##'
	})

	const counter = computed(() => {
		return selectedCountry.value?.phoneLength || 10
	})

	const hasError = ref(false)
	const hasSelectError = ref(false)

	// Unified validation function
	const validateOnBlur = () => {
		hasError.value = false
		hasSelectError.value = false

		// Validation du numéro de téléphone
		const requiredValidation = props.required ? RequiredRule(internalValue.value) : true
		const lengthValidation = exactLength(counter.value, true)(internalValue.value)
		if (requiredValidation !== true || lengthValidation !== true) {
			hasError.value = true
		}

		// Validation de l'indicatif si nécessaire
		if (props.countryCodeRequired && props.withCountryCode) {
			const countryCodeValidation = RequiredRule(selectedCountryCode.value)
			if (countryCodeValidation !== true) {
				hasSelectError.value = true
			}
		}
	}

	const rules = computed(() => {
		const phoneLength = counter.value
		const validationRules = []
		if (props.required) {
			validationRules.push(RequiredRule)
		}
		validationRules.push(exactLength(phoneLength, true))
		return validationRules
	})

</script>

<template>
	<div
		class="d-flex align-center"
		style="align-items: stretch"
	>
		<VSelect
			v-if="withCountryCode"
			v-model="selectedCountryCode"
			:items="countryCodeList"
			:error="hasSelectError"
			:rules="props.countryCodeRequired ? [RequiredRule] : []"
			:variant="outlined ? 'outlined' : 'underlined'"
			item-text="country"
			item-title="code"
			max-width="120"
			color="primary"
			class="mr-3"
			label="Indicatif"
			outlined
			:allow-null="true"
			aria-label="Indicatif"
			:aria-invalid="hasSelectError"
			tabindex="0"
			@blur="validateOnBlur"
		>
			<template #append-inner>
				<VIcon v-if="hasSelectError">
					{{ infoIcon }}
				</VIcon>
			</template>
		</VSelect>

		<VTextField
			v-maska="mask"
			:model-value="computedValue"
			:counter="counter"
			:counter-value="noSpacesCounter"
			:rules="rules"
			:label="locales.label"
			:variant="outlined ? 'outlined' : 'underlined'"
			color="primary"
			max-width="700"
			:error="hasError"
			:aria-label="locales.label"
			:aria-invalid="hasError"
			aria-describedby="phone-error"
			tabindex="0"
			@input="setInternalValue"
			@change="emitChangeEvent"
			@blur="validateOnBlur"
		>
			<template #append-inner>
				<VIcon
					v-if="hasError"
				>
					{{ infoIcon }}
				</VIcon>
				<VIcon>
					{{ phoneIcon }}
				</VIcon>
			</template>
		</VTextField>
	</div>
</template>
