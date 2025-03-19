<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import type { PropType } from 'vue'
	import { required as RequiredRule } from '@/utils/rules/required'
	import { exactLength } from '@/utils/rules/exactLength'
	import { mdiPhone, mdiInformation } from '@mdi/js'
	import { indicatifs } from './indicatifs'
	import { vMaska } from 'maska/vue'
	import { locales } from './locales'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

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
	})

	const emit = defineEmits(['update:modelValue', 'update:selectedDialCode', 'change'])

	const phoneNumber = ref(props.modelValue || '')
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const dialCode = ref<string | Record<string, any>>(props.dialCodeModel || '')
	const counter = ref(10)
	const phoneMask = ref('## ## ## ## ##')
	const hasError = ref(false)
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
		})),
	)

	function generateDisplayText(ind: Indicatif): string {
		const format = {
			'code': ind.code,
			'code-abbreviation': `${ind.code} (${ind.abbreviation})`,
			'code-country': `${ind.code} ${ind.country}`,
			'country': ind.country,
			'abbreviation': ind.abbreviation,
		}
		return format[props.displayFormat] || ind.code
	}

	const validationRules = computed(() => {
		const rules = [exactLength(counter.value, true)]
		if (props.required) {
			rules.unshift(RequiredRule)
		}
		return rules
	})

	function validateInputOnBlur() {
		if (!props.isValidatedOnBlur) return

		hasError.value = false
		const requiredValidation = !props.required || RequiredRule(phoneNumber.value) === true
		const lengthValidation = exactLength(counter.value, true)(phoneNumber.value) === true

		hasError.value = !(requiredValidation && lengthValidation)
		onBlur.value = true
	}

	defineExpose({
		computedValue,
		dialCode,
		phoneMask,
		counter,
		hasError,
		phoneNumber,
		mergedDialCodes,
	})
</script>

<template>
	<div class="phone-field-container">
		<SySelect
			v-if="props.withCountryCode"
			v-model="dialCode"
			:items="dialCodeOptions"
			:label="locales.indicatifLabel"
			:outlined="outlinedIndicatif"
			:required="props.countryCodeRequired"
			:display-asterisk="props.displayAsterisk"
			class="custom-select"
			text-key="displayText"
			value-key="code"
		/>
		<SyTextField
			v-model="phoneNumber"
			v-maska="phoneMask"
			:counter="counter"
			:counter-value="(value: string) => value.replace(/\s/g, '').length"
			:label="locales.label"
			:required="props.required"
			:rules="validationRules"
			:variant="outlined ? 'outlined' : 'underlined'"
			:display-asterisk="props.displayAsterisk"
			class="phone-field"
			color="primary"
			@blur="validateInputOnBlur"
			@input="handlePhoneInput"
		>
			<template #append-inner>
				<VIcon
					class="mr-2"
					color="#222324"
				>
					{{ mdiPhone }}
				</VIcon>
				<VIcon v-if="hasError">
					{{ mdiInformation }}
				</VIcon>
			</template>
		</SyTextField>
	</div>
</template>

<style scoped>
.phone-field-container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
}

.phone-field {
	width: 100%;
}

.custom-select {
	width: 30%;
}

@media (width >= 600px) {
	.phone-field-container {
		flex-direction: row;
		align-items: center;
	}

	.custom-select {
		margin-right: 1rem;
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
