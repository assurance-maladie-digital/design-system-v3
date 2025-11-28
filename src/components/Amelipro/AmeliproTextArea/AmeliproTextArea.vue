<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */
	import { computed, onMounted, type PropType, ref } from 'vue'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import type { IndexedObject, ValidateOnType } from '../types'
	import type { InputTextArea } from './types'
	import type { ValidationRule } from '@/utils/rules/types'
	import { convertToHex } from '@/utils/functions/convertToHex'
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
		counter: {
			type: Number,
			default: 255,
		},
		disabled: {
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
		modelValue: {
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

	const emit = defineEmits(['change', 'update:model-value'])

	const inputTextArea = ref<InputTextArea>({ isValid: true, errorMessages: [] })
	const displayError = computed(() => (inputTextArea.value?.isValid !== null && !inputTextArea.value?.isValid) && (inputTextArea.value?.errorMessages && inputTextArea.value?.errorMessages.length > 0))
	const focused = ref(false)

	const inputValue = computed({
		get: (): string | undefined => props.modelValue,
		set: (newValue: string | undefined): void => {
			emit('update:model-value', newValue)
		},
	})

	onMounted(() => {
		props.rules.forEach(emitChangeEvent)
	})

	const inputRules = computed<ValidationRule[]>(() => {
		const rules = [
			...props.rules,
		]

		if (props.required) {
			rules.push(isRequired)
		}

		return rules
	})

	const errorId = computed<string>(() => `${props.uniqueId}-error`)

	const fieldClasses = computed<string>(() => {
		let classes = 'd-flex flex-column'

		if (props.horizontal) {
			classes += ' flex-md-row'
		}

		if (props.classes) {
			classes += ` ${props.classes}`
		}

		return classes
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

	const emitChangeEvent = (): void => {
		emit('change', inputValue.value)
	}

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
		// remove the native label of VTextArea because we have our own one
		document.querySelectorAll(`label[for="${props.uniqueId}"]`)[1]?.remove()
	})
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="amelipro-textarea"
		:class="fieldClasses"
		:style="globalFieldStyles"
	>
		<div
			class="d-inline-flex align-baseline mb-1"
			:class="labelClasses"
		>
			<label
				:id="`${uniqueId}-label`"
				class="mr-2 amelipro-textarea__label"
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

		<VTextarea
			:id="uniqueId"
			ref="inputTextArea"
			v-model="inputValue"
			:aria-describedby="displayError ? undefined : errorId"
			:aria-invalid="displayError ? true : undefined"
			:required="required"
			auto-grow
			:bg-color="disabled ? 'ap-grey-lighten-2' : 'ap-white'"
			class="amelipro-textarea-input"
			color="ap-blue-darken-1"
			:counter="counter"
			:disabled="disabled"
			:readonly="readonly"
			:rules="inputRules"
			:style="inputStyles"
			:validate-on="validateOn"
			variant="outlined"
			v-bind="$attrs"
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
		</VTextarea>
	</div>
</template>

<style lang="scss" scoped>
	@use '@/assets/amelipro/apTokens';

	.amelipro-textarea-input {
		& :deep(.v-field__outline) {
			border-color: v-bind(inputBorderStyle);

			--v-field-border-opacity: 1 !important;
		}

		& :deep(.v-field.v-field--variant-outlined.v-field--focused .v-field__outline) {
			--v-field-border-width: 1px !important;
		}
	}

	.amelipro-textarea__label {
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
