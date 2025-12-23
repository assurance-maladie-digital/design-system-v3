<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */
	import { computed, onMounted, type PropType, ref } from 'vue'
	import type { IndexedObject, ValidateOnType } from '../types'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import type { InputTextField } from './types'
	import type { ValidationRule } from '@/utils/rules/types'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { maxNumberRule } from '@/utils/amelipro/rules/maxNumber/index'
	import { minNumberRule } from '@/utils/amelipro/rules/minNumber/index'
	import { notAfterDate } from '@/utils/amelipro/rules/notAfterDate'
	import { notBeforeDate } from '@/utils/amelipro/rules/notBeforeDate'
	import { isRequired } from '@/utils/rules/isRequired'

	const props = defineProps({
		required: {
			type: Boolean,
			default: false,
		},
		classes: {
			type: String,
			default: undefined,
		},
		clearable: {
			type: Boolean,
			default: false,
		},
		counter: {
			type: [Boolean, Number, String] as PropType<boolean | number>,
			default: undefined,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		disabledDateForSafari: {
			type: Boolean,
			default: false,
		},
		fullWidthErrorMsg: {
			type: Boolean,
			default: false,
		},
		globalMaxWidth: {
			type: String,
			default: undefined,
		},
		globalMinWidth: {
			type: String,
			default: undefined,
		},
		globalWidth: {
			type: String,
			default: undefined,
		},
		hideErrorMessage: {
			type: [String, Boolean] as PropType<boolean | 'auto'>,
			default: false,
		},
		horizontal: {
			type: Boolean,
			default: false,
		},
		inputMaxWidth: {
			type: String,
			default: undefined,
		},
		inputMinWidth: {
			type: String,
			default: undefined,
		},
		label: {
			type: String,
			required: true,
		},
		labelMaxWidth: {
			type: String,
			default: undefined,
		},
		labelMinWidth: {
			type: String,
			default: undefined,
		},
		maxDate: {
			type: String,
			default: undefined,
		},
		maxNumber: {
			type: String,
			default: undefined,
		},
		minDate: {
			type: String,
			default: undefined,
		},
		minNumber: {
			type: String,
			default: undefined,
		},
		modelValue: {
			type: [String, Number] as PropType<string | number>,
			default: undefined,
		},
		placeholder: {
			type: String,
			default: undefined,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		rules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		type: {
			type: String,
			default: 'text',
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

	const inputTextField = ref<InputTextField>({ errorMessages: [], isValid: true })
	const messagesToDisplay = computed(() => inputTextField.value.errorMessages)
	defineExpose({ messagesToDisplay })

	const inputValue = computed({
		get: (): string | number | undefined => props.modelValue,
		set: (newValue: string | number | undefined): void => {
			emit('update:model-value', newValue, props.uniqueId)
		},
	})

	const browserType = window?.navigator?.userAgent ?? ''
	const isBrowserSafari = (/^((?!chrome|android).)*safari/i).test(browserType)
	const computedType = computed<string>(() => (isBrowserSafari && props.disabledDateForSafari && props.type === 'date' ? 'text' : props.type))
	const focused = ref(false)
	const errorId = computed<string>(() => `${props.uniqueId}-error`)
	const displayError = computed(() => (inputTextField.value?.isValid !== null && !inputTextField.value?.isValid) && (inputTextField.value?.errorMessages && inputTextField.value?.errorMessages.length > 0))
	const inputRules = computed<ValidationRule[]>(() => {
		const rules = [
			...props.rules,
		]

		if (props.required) {
			rules.push(isRequired)
		}

		if (computedType.value === 'date' || computedType.value === 'text') {
			if (props.maxDate) {
				rules.push(notAfterDate(props.maxDate, computedType.value) as ValidationRule)
			}
			if (props.minDate) {
				rules.push(notBeforeDate(props.minDate, computedType.value) as ValidationRule)
			}
		}

		if (props.type === 'number') {
			if (props.maxNumber) {
				rules.push(maxNumberRule(props.maxNumber) as ValidationRule)
			}
			if (props.minNumber) {
				rules.push(minNumberRule(props.minNumber) as ValidationRule)
			}
		}
		return rules
	})

	const emit = defineEmits(['change', 'update:model-value'])
	const emitChangeEvent = (): void => {
		emit('change', inputValue.value, props.uniqueId)
	}

	const fieldClasses = computed<string>(() => {
		const classes = ['d-flex', 'flex-column']
		if (props.horizontal) {
			classes.push('flex-md-row')
		}
		return classes.join(' ')
	})

	const labelClasses = computed<string>(() => {
		let classes = ''
		if (props.horizontal) {
			classes = 'mt-md-2 mr-md-2'
		}
		return classes
	})

	const globalFieldStyles = computed<IndexedObject>(() => {
		const globalStyles: IndexedObject = { marginBottom: '12px' }
		if (props.globalMaxWidth) {
			globalStyles.maxWidth = props.globalMaxWidth
		}
		if (props.globalMinWidth) {
			globalStyles.minWidth = props.globalMinWidth
		}
		if (props.globalWidth) {
			globalStyles.width = props.globalWidth
		}
		return globalStyles
	})

	const inputStyles = computed<IndexedObject>(() => {
		const inputStyle: IndexedObject = {}
		if (props.inputMaxWidth) {
			inputStyle.maxWidth = props.inputMaxWidth
		}
		if (props.inputMinWidth) {
			inputStyle.minWidth = props.inputMinWidth
		}
		if (props.disabled) {
			inputStyle.backgroundColor = 'transparent'
		}
		return inputStyle
	})

	const labelStyles = computed<IndexedObject>(() => {
		const labelStyle: IndexedObject = {}
		if (props.labelMaxWidth) {
			labelStyle.maxWidth = props.labelMaxWidth
		}
		if (props.labelMinWidth) {
			labelStyle.minWidth = props.labelMinWidth
		}
		return labelStyle
	})

	const inputBorderStyle = computed<string>(() => {
		let borderColor = convertToHex('ap-grey-darken-1')
		if (focused.value) {
			borderColor = convertToHex('ap-blue-darken-1')
		}
		if (displayError.value) {
			borderColor = convertToHex('ap-red')
		}
		if (props.disabled) {
			borderColor = convertToHex('ap-grey-lighten-2')
		}
		return borderColor
	})

	onMounted(() => {
		// remove the native label of VTextField because we have our own one
		document.querySelectorAll(`label[for="${props.uniqueId}"]`)[1]?.remove()
	})
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		:class="classes"
		:style="globalFieldStyles"
	>
		<div
			class="w-100 amelipro-text-field__wrapper"
			:class="fieldClasses"
		>
			<div
				class="d-inline-flex align-baseline mb-1"
				:class="labelClasses"
			>
				<label
					:id="`${uniqueId}-label`"
					class="mr-2 amelipro-text-field__label"
					:for="uniqueId"
					:style="labelStyles"
				>
					{{ label }}

					<span v-if="required">
						<span aria-hidden="true">
							&nbsp;*
						</span>

						<span class="d-sr-only">
							&nbsp;Champ obligatoire
						</span>
					</span>
				</label>

				<slot
					class="mb-1"
					name="labelInfo"
				/>
			</div>

			<VTextField
				:id="uniqueId"
				ref="inputTextField"
				v-model="inputValue"
				:aria-describedby="displayError ? errorId : undefined"
				:aria-invalid="displayError ? true : undefined"
				:required="required"
				:bg-color="disabled ? 'ap-grey-lighten-2' : 'ap-white'"
				class="pt-0 amelipro-text-field"
				:clearable="clearable"
				color="ap-blue-darken-1"
				:counter="counter"
				density="compact"
				:disabled="disabled"
				:hide-details="hideErrorMessage || fullWidthErrorMsg"
				:max="maxDate || maxNumber"
				:min="minDate || minNumber"
				:placeholder="placeholder"
				:readonly="readonly"
				:rules="inputRules"
				:style="inputStyles"
				:type="computedType"
				:validate-on="validateOn"
				variant="outlined"
				@blur="focused = false"
				@change="emitChangeEvent"
				@focus="focused = true"
			>
				<template
					v-if="$slots.append"
					#append
				>
					<slot name="append" />
				</template>

				<template #message="{ message }">
					<AmeliproMessage
						no-icon
						text
						type="error"
						:unique-id="errorId"
					>
						<p class="mb-0">
							{{ message }}
						</p>
					</AmeliproMessage>
				</template>
			</VTextField>
		</div>

		<AmeliproMessage
			v-if="fullWidthErrorMsg && messagesToDisplay && messagesToDisplay.length > 0"
			no-icon
			text
			type="error"
			:unique-id="errorId"
		>
			<p class="mb-0">
				{{ messagesToDisplay[0] }}
			</p>
		</AmeliproMessage>
	</div>
</template>

<style lang="scss" scoped>
	@use '@/assets/amelipro/apTokens';

	.amelipro-text-field {
		& :deep(.v-field__outline) {
			border-color: v-bind(inputBorderStyle);

			--v-field-border-opacity: 1 !important;
		}

		& :deep(.v-field.v-field--variant-outlined.v-field--focused .v-field__outline) {
			--v-field-border-width: 1px !important;
		}
	}

	.amelipro-text-field__label {
		font-size: apTokens.$font-size-xs;
		font-weight: apTokens.$label-font-weight;
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
