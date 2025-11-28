<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */
	import { computed, onMounted, type PropType, ref } from 'vue'
	import AmeliproAutoCompleteField from '../../AmeliproAutoCompleteField/AmeliproAutoCompleteField.vue'
	import AmeliproMessage from '../../AmeliproMessage/AmeliproMessage.vue'
	import type { AutoCompleteItem } from '../../AmeliproAutoCompleteField/types'
	import type { InputPostalAddressAutoCompleteItem } from './types'
	import type { InputPostalAddressField } from '../types'
	import type { ValidateOnType } from '../../types'
	import type { ValidationRule } from '@/utils/rules/types'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { isRequired } from '@/utils/rules/isRequired'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		required: {
			type: Boolean,
			default: false,
		},
		autoCompleteList: {
			type: Array as PropType<InputPostalAddressAutoCompleteItem[]>,
			default: () => [],
		},
		city: {
			type: [String, Object] as PropType<string | InputPostalAddressAutoCompleteItem>,
			default: undefined,
		},
		cityRules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		postalCode: {
			type: [String, Object] as PropType<string | InputPostalAddressAutoCompleteItem>,
			default: undefined,
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

	const { mdAndUp } = useDisplay()

	// v-model
	const cityValue = computed({
		get: (): string | InputPostalAddressAutoCompleteItem => props.city || '',
		set: (newValue: string | InputPostalAddressAutoCompleteItem): void => {
			emit('update:city', newValue)
			setInternalValue('postalCode', newValue, false)
		},
	})

	const postalCodeValue = computed({
		get: (): string | InputPostalAddressAutoCompleteItem => props.postalCode || '',
		set: (newValue: string | InputPostalAddressAutoCompleteItem): void => {
			emit('update:postalCode', newValue)
			setInternalValue('city', newValue, false)
		},
	})

	const compareFields = (oldValue: string | InputPostalAddressAutoCompleteItem, newValue: string | InputPostalAddressAutoCompleteItem) => {
		if (typeof oldValue === 'string' && typeof newValue === 'string') {
			return oldValue === newValue
		}
		else if (typeof oldValue === 'object' && typeof newValue === 'object') {
			return oldValue.city === newValue.city && oldValue.postalCode === newValue.postalCode
		}
		return false
	}

	const setInternalValue = (autocomplete?: string, newValue?: string | InputPostalAddressAutoCompleteItem, handleBoth = true): void => {
		if (props.autoCompleteList.length > 0) {
			if (autocomplete === 'city' && !compareFields(cityValue.value, newValue || postalCodeValue.value)) {
				if (handleBoth) {
					cityValue.value = newValue || postalCodeValue.value
				}
				else {
					emit('update:city', newValue || postalCodeValue.value)
				}
			}

			if (autocomplete === 'postalCode' && !compareFields(postalCodeValue.value, newValue || cityValue.value)) {
				if (handleBoth) {
					postalCodeValue.value = newValue || cityValue.value
				}
				else {
					emit('update:postalCode', newValue || cityValue.value)
				}
			}
		}

		if (postalCodeFocused.value) {
			postalCodeFocused.value = false
		}

		if (cityFocused.value) {
			cityFocused.value = false
		}
	}

	type eventType = 'blur' | 'change' | 'update:error'
	const emit = defineEmits(['blur', 'change', 'update:city', 'update:postalCode', 'update:error'])
	const emitEvent = (eventName: eventType, autocomplete?: string): void => {
		if (typeof event === 'object') {
			setInternalValue(autocomplete)
		}
		emit(eventName, { city: cityValue.value, postalCode: postalCodeValue.value })
	}

	const inputRules = (ruleKey: 'cityRules' | 'postalCodeRules'): ValidationRule[] => {
		const rules = [
			...props[ruleKey],
		]

		if (props.required) {
			rules.push(isRequired)
		}

		return rules
	}

	/**
	 * <ref>inputPostalCodeField est tantôt :
	 * - un VTextField (si autoCompleteList est vide)
	 * - un AmeliproAutoCompleteField (si autoCompleteList n'est pas vide)
	 *
	 */
	const inputPostalCodeField = ref<InputPostalAddressField>({
		errorMessages: [],
		isValid: true,
	})

	const postalCodeAutoCompleteList = (list: InputPostalAddressAutoCompleteItem[]): AutoCompleteItem[] => {
		const autoCompleteItemList: AutoCompleteItem[] = []
		list.forEach((element) => {
			autoCompleteItemList.push({
				disabled: element.disabled,
				title: `${element.postalCode}`,
				value: element,
			})
		})
		return autoCompleteItemList
	}
	const postalCodeFocused = ref(false)
	const displayPostalCodeError = computed(() => (inputPostalCodeField.value?.isValid !== null && !inputPostalCodeField.value?.isValid) && (inputPostalCodeField.value?.errorMessages && inputPostalCodeField.value?.errorMessages.length > 0))

	/**
	 * <ref>inputCityField est tantôt :
	 * - un VTextField (si autoCompleteList est vide)
	 * - un AmeliproAutoCompleteField (si autoCompleteList n'est pas vide)
	 *
	 */
	const inputCityField = ref<InputPostalAddressField>({
		errorMessages: [],
		isValid: true,
	})
	const cityAutoCompleteList = (list: InputPostalAddressAutoCompleteItem[]): AutoCompleteItem[] => {
		const autoCompleteItemList: AutoCompleteItem[] = []
		list.forEach((element) => {
			autoCompleteItemList.push({
				disabled: element.disabled,
				title: `${element.city} (${element.postalCode})`,
				value: element,
			})
		})
		return autoCompleteItemList
	}
	const cityFocused = ref(false)
	const displayCityError = computed(() => (inputCityField.value?.isValid !== null && !inputCityField.value?.isValid) && (inputCityField.value?.errorMessages && inputCityField.value?.errorMessages.length > 0))

	const inputCityBorderStyle = computed<string>(() => {
		let borderColor = convertToHex('ap-grey-darken-1')

		if (cityFocused.value) {
			borderColor = convertToHex('ap-blue-darken-1')
		}

		if (displayCityError.value) {
			borderColor = convertToHex('ap-red')
		}

		if (props.disabled) {
			borderColor = convertToHex('ap-grey-lighten-2')
		}

		return borderColor
	})

	const inputPostalCodeBorderStyle = computed<string>(() => {
		let borderColor = convertToHex('ap-grey-darken-1')

		if (postalCodeFocused.value) {
			borderColor = convertToHex('ap-blue-darken-1')
		}

		if (displayPostalCodeError.value) {
			borderColor = convertToHex('ap-red')
		}

		if (props.disabled) {
			borderColor = convertToHex('ap-grey-lighten-2')
		}

		return borderColor
	})

	onMounted(() => {
		// remove the native label of VTextField because we have our own one
		document.querySelectorAll(`label[for="${props.uniqueId}-city"]`)[1]?.remove()
		document.querySelectorAll(`label[for="${props.uniqueId}-postal-code"]`)[1]?.remove()
	})
</script>

<template>
	<div
		:id="`${uniqueId}-city-row-container`"
		class="mt-2 amelipro-postal-address__city-row"
	>
		<div class="d-flex flex-column flex-md-row align-md-center">
			<div
				v-if="autoCompleteList.length > 0"
				class="mr-sm-3 postal-code-field"
			>
				<AmeliproAutoCompleteField
					ref="inputPostalCodeField"
					v-model="postalCodeValue"
					:aria-describedby="displayPostalCodeError ? `${uniqueId}-postal-code-error` : undefined"
					:aria-invalid="displayPostalCodeError ? true : undefined"
					:required="required"
					autocomplete="address-level2"
					:disabled="disabled"
					hide-error-message
					:items="postalCodeAutoCompleteList(autoCompleteList)"
					label="Code Postal"
					:readonly="readonly"
					:rules="inputRules('postalCodeRules')"
					:unique-id="`${uniqueId}-postal-code`"
					:validate-on="validateOn"
					@blur="emitEvent('blur', 'city')"
					@change="emitEvent('change', 'city')"
					@focus="postalCodeFocused = true"
					@update:error="emitEvent('update:error', 'city')"
				/>
			</div>
			<div
				v-else
				class="mr-sm-3 postal-code-field"
			>
				<label
					:id="`${uniqueId}-postal-code-label`"
					class="text-body-1"
					:for="`${uniqueId}-postal-code`"
				>
					Code postal&nbsp;:&nbsp;
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
					:id="`${uniqueId}-postal-code`"
					ref="inputPostalCodeField"
					v-model="postalCodeValue"
					:aria-describedby="displayPostalCodeError ? `${uniqueId}-postal-code-error` : undefined"
					:aria-invalid="displayPostalCodeError ? true : undefined"
					:required="required"
					autocomplete="postal-code"
					:bg-color="disabled ? 'ap-grey-lighten-2' : 'ap-white'"
					class="pt-0"
					color="ap-blue-darken-1"
					density="compact"
					:disabled="disabled"
					hide-details
					:readonly="readonly"
					:rules="inputRules('postalCodeRules')"
					:validate-on="validateOn"
					variant="outlined"
					@blur="emitEvent('blur')"
					@change="emitEvent('change')"
					@focus="postalCodeFocused = true"
					@update:error="emitEvent('update:error')"
				/>
			</div>
			<AmeliproMessage
				v-if="displayPostalCodeError && !mdAndUp"
				class="mb-0"
				no-icon
				text
				type="error"
				:unique-id="`${uniqueId}-postal-code-error`"
			>
				<p class="mb-0">
					{{ inputPostalCodeField.errorMessages[0] }}
				</p>
			</AmeliproMessage>
			<div
				v-if="autoCompleteList.length > 0"
				class="city-field"
			>
				<AmeliproAutoCompleteField
					ref="inputCityField"
					v-model="cityValue"
					:aria-describedby="displayCityError ? `${uniqueId}-city-error` : undefined"
					:aria-invalid="displayCityError ? true : undefined"
					:required="required"
					autocomplete="address-level2"
					:disabled="disabled"
					hide-error-message
					:items="cityAutoCompleteList(autoCompleteList)"
					label="Commune"
					:readonly="readonly"
					:rules="inputRules('cityRules')"
					:unique-id="`${uniqueId}-city`"
					:validate-on="validateOn"
					@blur="emitEvent('blur', 'postalCode')"
					@change="emitEvent('change', 'postalCode')"
					@focus="cityFocused = true"
					@update:error="emitEvent('update:error', 'postalCode')"
				/>
			</div>

			<div
				v-else
				class="city-field"
			>
				<label
					:id="`${uniqueId}-city-label`"
					class="text-body-1"
					:for="`${uniqueId}-city`"
				>
					Commune&nbsp;:&nbsp;
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
					:id="`${uniqueId}-city`"
					ref="inputCityField"
					v-model="cityValue"
					:aria-describedby="displayCityError ? `${uniqueId}-city-error` : undefined"
					:aria-invalid="displayCityError ? true : undefined"
					:required="required"
					autocomplete="address-level2"
					:bg-color="disabled ? 'ap-grey-lighten-2' : 'ap-white'"
					class="pt-0"
					color="ap-blue-darken-1"
					density="compact"
					:disabled="disabled"
					hide-details
					:readonly="readonly"
					:rules="inputRules('cityRules')"
					:validate-on="validateOn"
					variant="outlined"
					@blur="emitEvent('blur')"
					@change="emitEvent('change')"
					@focus="cityFocused = true"
					@update:error="emitEvent('update:error')"
				/>
			</div>
		</div>
		<AmeliproMessage
			v-if="displayPostalCodeError && mdAndUp"
			class="mb-0"
			no-icon
			text
			type="error"
			:unique-id="`${uniqueId}-postal-code-error`"
		>
			<p class="mb-0">
				{{ inputPostalCodeField.errorMessages[0] }}
			</p>
		</AmeliproMessage>
		<AmeliproMessage
			v-if="displayCityError"
			class="mb-0"
			no-icon
			text
			type="error"
			:unique-id="`${uniqueId}-city-error`"
		>
			<p class="mb-0">
				{{ inputCityField.errorMessages[0] }}
			</p>
		</AmeliproMessage>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.postal-code-field {
	min-width: 120px;
	width: 120px;

	& :deep(.v-field__outline) {
		border-color: v-bind(inputPostalCodeBorderStyle);
	}
}

.city-field {
	min-width: 200px;
	width: 100%;

	& :deep(.v-field__outline) {
		border-color: v-bind(inputCityBorderStyle);
	}
}

.city-field,
.postal-code-field {
	& :deep(.v-field__outline) {
		--v-field-border-opacity: 1 !important;
	}

	& :deep(.v-field.v-field--variant-outlined.v-field--focused .v-field__outline) {
		--v-field-border-width: 1px !important;
	}

	label {
		margin-bottom: 4px;
		font-weight: apTokens.$label-font-weight;
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
