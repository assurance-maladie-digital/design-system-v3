<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { required as RequiredRule } from '@/utils/rules/required'
	import { exactLength } from '@/utils/rules/exactLength'
	import { mdiPhone, mdiInformation } from '@mdi/js'
	import { indicatifs } from './indicatifs'
	import { locales } from './locales'
	import { vMaska } from 'maska/vue'
	import GenericMenu from '@/components/Generics/GenericMenu.vue'

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

	const selectedCountry = computed(() => {
		return countryCodeList.value.find(ind => ind.code === selectedCountryCode.value) || null
	})

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
			rawPhone = '0' + rawPhone
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

	const validateOnBlur = () => {
		hasError.value = false
		hasSelectError.value = false

		const requiredValidation = props.required ? RequiredRule(internalValue.value) : true
		const lengthValidation = exactLength(counter.value, true)(internalValue.value)
		if (requiredValidation !== true || lengthValidation !== true) {
			hasError.value = true
		}

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
    :aria-required="props.required"
		tabindex="0"
		@input="setInternalValue"
		@change="emitChangeEvent"
		@blur="validateOnBlur"
	>
		<template #prepend-inner>
			<GenericMenu
				v-if="withCountryCode"
				v-model="selectedCountryCode"
				:items="countryCodeList"
				item-key="code"
				item-label="code"
				label="Indicatif"
				placeholder="Indicatif"
				:has-select-error="hasSelectError"
				:btn-class="outlined ? 'mr-n2 text-body-1' : 'text-body-1 mr-n4 h-0 mt-1'"
			/>
		</template>
		<template #append-inner>
			<VIcon v-if="hasError">
				{{ infoIcon }}
			</VIcon>
			<VIcon>
				{{ phoneIcon }}
			</VIcon>
		</template>
	</VTextField>
</template>
