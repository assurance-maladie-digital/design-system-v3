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
	})

	const phoneIcon = mdiPhone
	const infoIcon = mdiInformation
	const internalValue = ref<string>(props.modelValue || '')
	const countryCodeList = ref(indicatifs)
	const selectedCountryCode = ref<string | null>(null)

	const emit = defineEmits(['update:modelValue', 'change'])

	const formatPhone = (phone: string): string => {
		phone = phone.replace(/\D/g, '')
		const country = countryCodeList.value.find(ind => ind.code === selectedCountryCode.value)
		if (country?.mask) {
			const regex = new RegExp(country.mask.replace(/#/g, '\\d'))
			return phone.replace(regex, country.mask).trim()
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
			const country = countryCodeList.value.find(ind => ind.code === selectedCountryCode.value)
			if (country) {
				const countryCode = selectedCountryCode.value.replace(/\D/g, '')
				if (input.startsWith(countryCode)) {
					input = input.substring(countryCode.length)
				}
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
		if (props.withCountryCode && selectedCountryCode.value) {
			const country = countryCodeList.value.find(ind => ind.code === selectedCountryCode.value)
			return country?.mask || '## ## ## ## ##'
		}
		return '## ## ## ## ##'
	})

	const counter = computed(() => {
		const country = countryCodeList.value.find(ind => ind.code === selectedCountryCode.value)
		return country?.phoneLength || 10
	})

	const hasError = ref(false)

	const rules = computed(() => {
		const country = countryCodeList.value.find(ind => ind.code === selectedCountryCode.value)
		const phoneLength = country?.phoneLength || 10
		return props.required ? [RequiredRule, exactLength(phoneLength, true)] : [exactLength(phoneLength, true)]
	})

	const validateOnBlur = () => {
		hasError.value = false
		const requiredValidation = RequiredRule(internalValue.value)
		const lengthValidation = exactLength(counter.value, true)(internalValue.value)
		if (requiredValidation !== true || lengthValidation !== true) {
			hasError.value = true
		}
	}
</script>

<template>
	<div
		class="d-flex align-center"
		style="align-items: stretch;"
	>
		<VSelect
			v-if="withCountryCode"
			v-model="selectedCountryCode"
			:items="countryCodeList"
			:error="hasError"
			:rules="props.required ? [RequiredRule] : []"
			:variant="outlined ? 'outlined' : 'underlined'"
			item-text="country"
			item-title="code"
			max-width="120"
			color="primary"
			class="mr-3"
			label="Indicatif"
			outlined
			:allow-null="true"
		/>
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
			@input="setInternalValue"
			@change="emitChangeEvent"
			@blur="validateOnBlur"
		>
			<template #append-inner>
				<VIcon v-if="hasError">
					{{ infoIcon }}
				</VIcon>
				<VIcon>
					{{ phoneIcon }}
				</VIcon>
			</template>
		</VTextField>
	</div>
</template>
