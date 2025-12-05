<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */
	import type { InputPostalAddressAutoCompleteList, InputPostalAddressField, InputPostalAddressGroup } from './types'
	import { computed, onMounted, type PropType, ref, watch } from 'vue'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import AmeliproPostalAddressCityRow from './AmeliproPostalAddressCityRow/AmeliproPostalAddressCityRow.vue'
	import type { InputPostalAddressAutoCompleteItem } from './AmeliproPostalAddressCityRow/types'
	import type { ValidateOnType } from '../types'
	import type { ValidationRule } from '@/utils/rules/types'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { isRequired } from '@/utils/rules/isRequired'

	const props = defineProps({
		addressRules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		required: {
			type: Boolean,
			default: false,
		},
		autoCompleteList: {
			type: Array as PropType<InputPostalAddressAutoCompleteList[]>,
			default: () => [],
		},
		cityRules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		groupLabel: {
			type: String,
			default: 'Adresse postale',
		},
		modelValue: {
			type: Object as PropType<InputPostalAddressGroup>,
			default: () => ({
				additionalInfo: undefined,
				address: undefined,
				city: undefined,
				postalCode: undefined,
			}),
		},
		noAdditionalInfo: {
			type: Boolean,
			default: false,
		},
		postalCodeRules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
		validateOn: {
			default: undefined,
			type: String as PropType<ValidateOnType>,
			validator(value: string): boolean {
				return ['lazy', 'blur', 'input', 'submit', 'blur lazy', 'input lazy', 'submit lazy', 'lazy blur', 'lazy input', 'lazy submit'].includes(value.toLowerCase())
			},
		},
	})
	type eventType = 'blur' | 'change' | 'update:error'
	const emit = defineEmits(['blur', 'change', 'update:model-value', 'update:error'])

	// v-model
	const internalValue = computed({
		get: (): InputPostalAddressGroup => props.modelValue,
		set: (newValue: InputPostalAddressGroup) => {
			emit('update:model-value', JSON.parse(JSON.stringify(newValue)))
		},
	})

	const internalAddressValue = computed({
		get: (): string => internalValue.value.address || '',
		set: (address: string) => {
			internalValue.value = { ...internalValue.value, address }
		},
	})

	const internalCityValue = computed({
		get: (): string | InputPostalAddressAutoCompleteItem => internalValue.value.city || '',
		set: (city: string | InputPostalAddressAutoCompleteItem) => {
			internalValue.value = { ...internalValue.value, city }
		},
	})

	const internalAdditionalInfoValue = computed({
		get: (): string => internalValue.value.additionalInfo || '',
		set: (additionalInfo: string) => {
			internalValue.value = { ...internalValue.value, additionalInfo }
		},
	})

	const internalPostalCodeValue = computed({
		get: (): string | InputPostalAddressAutoCompleteItem => internalValue.value.postalCode || '',
		set: (postalCode: string | InputPostalAddressAutoCompleteItem) => {
			internalValue.value = { ...internalValue.value, postalCode }
		},
	})

	const inputAddressField = ref<InputPostalAddressField>({
		errorMessages: [],
		isValid: true,
	})
	const addressFocused = ref(false)
	const additionalInfoFocused = ref(false)
	const displayAddressError = computed(() => (inputAddressField.value?.isValid !== null && !inputAddressField.value?.isValid) && (inputAddressField.value?.errorMessages && inputAddressField.value?.errorMessages.length > 0))

	const inputRules = computed<ValidationRule[]>(() => {
		const rules = [
			...props.addressRules,
		]

		if (props.required) {
			rules.push(isRequired)
		}

		return rules
	})

	const emitEvent = (eventName: eventType): void => {
		emit(eventName, internalValue.value)
	}

	watch(() => inputAddressField.value.errorMessages, () => {
		if (addressFocused.value) {
			addressFocused.value = false
		}

		if (additionalInfoFocused.value) {
			additionalInfoFocused.value = false
		}
	})

	const inputAddressBorderStyle = computed<string>(() => {
		let borderColor = convertToHex('ap-grey-darken-1')

		if (addressFocused.value) {
			borderColor = convertToHex('ap-blue-darken-1')
		}

		if (displayAddressError.value) {
			borderColor = convertToHex('ap-red')
		}

		if (props.disabled) {
			borderColor = convertToHex('ap-grey-lighten-2')
		}

		return borderColor
	})

	const inputAdditionalInfoBorderStyle = computed<string>(() => {
		let borderColor = convertToHex('ap-grey-darken-1')

		if (additionalInfoFocused.value) {
			borderColor = convertToHex('ap-blue-darken-1')
		}

		if (props.disabled) {
			borderColor = convertToHex('ap-grey-lighten-2')
		}

		return borderColor
	})

	onMounted(() => {
		// remove the native label of VTextField because we have our own one
		document.querySelectorAll(`label[for="${props.uniqueId}-address"]`)[1]?.remove()
		document.querySelectorAll(`label[for="${props.uniqueId}-additional-info"]`)[1]?.remove()
	})
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		:aria-labelledby="uniqueId"
		class="amelipro-postal-address"
		role="group"
	>
		<p
			:id="uniqueId"
			class="mb-0 font-weight-bold"
		>
			{{ groupLabel }}

			<span v-if="required">
				<span aria-hidden="true">
					&nbsp;*
				</span>

				<span class="d-sr-only">
					&nbsp;Champs obligatoires
				</span>
			</span>
		</p>

		<!-- first line group -->
		<div class="address-field mt-0 address-field__address">
			<label
				:id="`${uniqueId}-address-label`"
				class="text-body-1"
				:for="`${uniqueId}-address`"
			>
				N° et nom de la voie

				<span v-if="required">
					<span aria-hidden="true">
						*
					</span>

					<span class="d-sr-only">
						&nbsp;Champ obligatoire
					</span>
				</span>
			</label>

			<VTextField
				:id="`${uniqueId}-address`"
				ref="inputAddressField"
				v-model="internalAddressValue"
				:aria-describedby="displayAddressError ? `${uniqueId}-address-error` : undefined"
				:aria-invalid="displayAddressError ? true : undefined"
				:required="required"
				autocomplete="address-line1"
				:bg-color="disabled ? 'ap-grey-lighten-2' : 'ap-white'"
				class="pt-0"
				color="ap-blue-darken-1"
				density="compact"
				:disabled="disabled"
				hide-details
				:readonly="readonly"
				:rules="inputRules"
				:validate-on="validateOn"
				variant="outlined"
				@blur="emitEvent('blur')"
				@change="emitEvent('change')"
				@focus="addressFocused = true"
				@update:error="emitEvent('update:error')"
			/>
		</div>

		<AmeliproMessage
			v-if="displayAddressError"
			class="mb-0"
			no-icon
			text
			type="error"
			:unique-id="`${uniqueId}-address-error`"
		>
			<p class="mb-0">
				{{ inputAddressField.errorMessages[0] }}
			</p>
		</AmeliproMessage>

		<!-- second line group -->
		<AmeliproPostalAddressCityRow
			ref="cityRow"
			v-model:city="internalCityValue"
			v-model:postal-code="internalPostalCodeValue"
			:required="required"
			:auto-complete-list="autoCompleteList"
			:city-rules="cityRules"
			:disabled="disabled"
			:postal-code-rules="postalCodeRules"
			:readonly="readonly"
			:unique-id="uniqueId"
			:validate-on="validateOn"
		/>

		<!-- third line group -->
		<div
			v-if="!noAdditionalInfo"
			class="address-field mt-2 address-field__additional-info"
		>
			<label
				:id="`${uniqueId}-additional-info-label`"
				class="text-body-1"
				:for="`${uniqueId}-additional-info`"
			>
				Complément d'adresse
			</label>

			<VTextField
				:id="`${uniqueId}-additional-info`"
				v-model="internalAdditionalInfoValue"
				autocomplete="address-line2"
				:bg-color="disabled ? 'ap-grey-lighten-2' : 'ap-white'"
				class="pt-0"
				color="ap-blue-darken-1"
				density="compact"
				:disabled="disabled"
				hide-details
				:readonly="readonly"
				:validate-on="validateOn"
				variant="outlined"
				@blur="emitEvent('blur')"
				@change="emitEvent('change')"
				@focus="additionalInfoFocused = true"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.address-field {
	min-width: 200px;
	width: 100%;

	label {
		margin-bottom: 4px;
		font-weight: apTokens.$label-font-weight;
	}
}

.address-field__address {
	& :deep(.v-field__outline) {
		border-color: v-bind(inputAddressBorderStyle);
	}
}

.address-field__additional-info {
	& :deep(.v-field__outline) {
		border-color: v-bind(inputAdditionalInfoBorderStyle);
	}
}

.address-field__address,
.address-field__additional-info {
	& :deep(.v-field__outline) {
		--v-field-border-opacity: 1 !important;
	}

	& :deep(.v-field.v-field--variant-outlined.v-field--focused .v-field__outline) {
		--v-field-border-width: 1px !important;
	}
}

.v-input {
	& :deep(.v-field__input) {
		padding-left: 12px;
		padding-right: 12px;
	}

	& :deep(.v-field--disabled) {
		opacity: 1 !important;
	}
}
</style>
