<script setup lang="ts">
	import { computed, ref, watch, toRaw } from 'vue'
	import type { PropType } from 'vue'
	import { required as RequiredRule } from '@/utils/rules/required'
	import { exactLength } from '@/utils/rules/exactLength'
	import { mdiPhone, mdiInformation } from '@mdi/js'
	import { indicatifs } from './indicatifs'
	import { vMaska } from 'maska/vue'
	import { locales } from './locales'
	import CustomSelect from '@/components/Customs/CustomSelect/CustomSelect.vue'
	import CustomTextField from '@/components/Customs/CustomTextField/CustomTextField.vue'

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
		required: { type: Boolean, default: false },
		outlined: { type: Boolean, default: false },
		outlinedIndicatif: { type: Boolean, default: false },
		withCountryCode: { type: Boolean, default: false },
		countryCodeRequired: { type: Boolean, default: false },
		displayFormat: { type: String as PropType<DisplayFormat>, default: 'code' },
		customIndicatifs: { type: Array as PropType<Indicatif[]>, default: () => [] },
		useCustomIndicatifsOnly: { type: Boolean, default: false },
		isValidatedOnBlur: { type: Boolean, default: true },
	})

	const emit = defineEmits(['update:modelValue', 'change'])
	const phoneNumber = ref(props.modelValue || '')
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const selectedDialCode = ref<string | any | undefined>(undefined)
	const counter = ref(10)
	const phoneMask = ref('## ## ## ## ##')
	const hasError = ref(false)
	const onBlur = ref(false)

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

	const currentDialCode = computed(() => {
		const rawDialCode = toRaw(selectedDialCode.value)
		return dialCodeOptions.value.find(ind => ind.code === rawDialCode)
	})

	function applyPhoneMask(phone: string): string {
		phone = phone.replace(/\D/g, '')
		if (currentDialCode.value?.mask) {
			const regex = new RegExp(currentDialCode.value.mask.replace(/#/g, '\\d'))
			return phone.replace(regex, currentDialCode.value.mask).trim()
		}
		return phone.replace(/(.{2})/g, '$1 ').trim()
	}

	function handlePhoneInput(event: Event) {
		const input = (event.target as HTMLInputElement).value.replace(/\s|\D/g, '')
		phoneNumber.value = input.startsWith(selectedDialCode.value || '')
			? input.slice((selectedDialCode.value || '').length)
			: input
		emit('update:modelValue', phoneNumber.value)
		emit('change', phoneNumber.value)
	}

	function validateInputOnBlur() {
		if (!props.isValidatedOnBlur) return

		hasError.value = false
		const requiredValidation = !props.required || RequiredRule(phoneNumber.value) === true
		const lengthValidation = exactLength(counter.value, true)(phoneNumber.value) === true

		hasError.value = !(requiredValidation && lengthValidation)
		onBlur.value = true
	}

	const validationRules = computed(() => {
		const rules = [exactLength(counter.value, true)]
		if (props.required) {
			rules.unshift(RequiredRule)
		}
		return rules
	})

	const computedValue = computed(() =>
		phoneNumber.value ? applyPhoneMask(phoneNumber.value) : '',
	)

	watch(() => props.modelValue, (newVal) => {
		phoneNumber.value = newVal || ''
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	watch(selectedDialCode, (selectedPhoneCode: any) => {
		if (selectedPhoneCode) {
			counter.value = selectedPhoneCode?.phoneLength || 10
			phoneMask.value = selectedPhoneCode?.mask || '## ## ## ## ##'
		}
	})

	defineExpose({
		computedValue,
		selectedDialCode,
		phoneMask,
		counter,
		hasError,
		phoneNumber,
		mergedDialCodes,
	})

</script>

<template>
	<div class="phone-field-container">
		<CustomSelect
			v-if="props.withCountryCode"
			v-model="selectedDialCode"
			:items="dialCodeOptions"
			text-key="displayText"
			value-key="code"
			:label="locales.indicatifLabel"
			:required="props.countryCodeRequired"
			class="custom-select"
			:outlined="outlinedIndicatif"
		/>
		<CustomTextField
			v-maska="phoneMask"
			:model-value="computedValue"
			:rules="validationRules"
			:required="props.required"
			:counter="counter"
			:counter-value="value => value.replace(/\s/g, '').length"
			:label="locales.label"
			:variant="outlined ? 'outlined' : 'underlined'"
			color="primary"
			class="phoneField"
			@input="handlePhoneInput"
			@blur="validateInputOnBlur"
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
		</CustomTextField>
	</div>
</template>
<style scoped>
.phone-field-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.phoneField {
  width: 100%;
}

.custom-select {
  width: 30%;
}

@media (min-width: 600px) {
  .phone-field-container {
    flex-direction: row;
    align-items: center;
  }

  .custom-select {
    margin-right: 1rem;
    margin-bottom: 0;
    min-width: 144px;
  }

  .phoneField {
    min-width: 350px;
  }
}

:deep(.v-list) {
  position: absolute;
  left: inherit !important;
  margin-top: 58px;
  background-color: white;
  max-height: 300px;
  padding: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12), 0 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow-y: auto;
  z-index: 2;
}
</style>
