<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */
	import type { AutoCompleteItem, InputAutoCompleteField } from './types'
	import type { IndexedObject, ValidateOnType } from '../types'
	import { computed, onMounted, type PropType, ref } from 'vue'
	import { mdiMenuDown, mdiMenuUp } from '@mdi/js'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
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
		items: {
			type: Array as PropType<AutoCompleteItem[]>,
			default: () => [],
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
			type: [String, Object] as PropType<string | object>,
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

	const emit = defineEmits(['change', 'blur', 'esc', 'focus', 'update:menu', 'update:model-value'])

	const inputAutoCompleteField = ref<InputAutoCompleteField>()

	// v-model
	const inputValue = computed({
		get: (): string | object | undefined => props.modelValue,
		set: (newValue: string | object | undefined) => {
			emit('update:model-value', newValue)
		},
	})

	const iconUp = ref(mdiMenuUp)
	const iconDown = ref(mdiMenuDown)
	const isMenuActive = computed(() => inputAutoCompleteField.value?.menu)
	const config = { attributes: true, childList: false }
	const focused = ref(false)
	const displayError = computed(() => (inputAutoCompleteField.value?.isValid !== null && !inputAutoCompleteField.value?.isValid) && (inputAutoCompleteField.value?.errorMessages && inputAutoCompleteField.value?.errorMessages.length > 0))

	const inputRules = computed<ValidationRule[]>(() => {
		const rules = [
			...props.rules,
		]

		if (props.required) {
			rules.push(isRequired)
		}

		return rules
	})

	const globalClasses = computed<string>(() => {
		let classes = ''

		if (props.horizontal) {
			classes += 'flex-md-row'
		}

		return props.classes ? `${classes} ${props.classes}` : classes
	})

	const globalFieldStyles = computed<IndexedObject>(() => {
		const globalStyles: IndexedObject = {}
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

	// Requis par AmeliproPostalAddressCityRow, pour mimer VTextField :
	// - errorMessages
	// - isValid
	const isValid = computed((): boolean => Boolean(inputAutoCompleteField.value && (inputAutoCompleteField.value?.isValid === null || inputAutoCompleteField.value.isValid)))
	const errorMessages = computed(() => inputAutoCompleteField.value?.errorMessages)
	defineExpose({ isValid, errorMessages })

	const setAriaExpanded = (): void => {
		const textFieldWrapper = document.getElementById(`${props.uniqueId}-wrapper`)
		textFieldWrapper?.removeAttribute('aria-expanded')
		textFieldWrapper?.removeAttribute('aria-owns')
		textFieldWrapper?.removeAttribute('aria-haspopup')
		textFieldWrapper?.removeAttribute('role')
	}

	const observer = new MutationObserver(setAriaExpanded)

	const setAttributes = (): void => {
		// Champ texte à l'intérieur du composant VAutocomplete
		const textField = document.getElementById(props.uniqueId)
		// Balise autour du champ texte
		const textFieldWrapper = textField?.parentElement?.parentElement?.parentElement
		textFieldWrapper?.setAttribute('id', `${props.uniqueId}-wrapper`)
		const btnIcon = document.getElementById(`${props.uniqueId}-btn`)
		const btnIconToRemove = document.getElementById(`${props.uniqueId}-wrapper`)?.querySelector('.v-autocomplete__menu-icon')

		textField?.setAttribute('aria-controls', `${props.uniqueId}-list`)
		btnIcon?.setAttribute('aria-controls', `${props.uniqueId}-list`)
		btnIconToRemove?.remove()

		if (textFieldWrapper !== null && textFieldWrapper !== undefined) {
			observer.observe(textFieldWrapper, config)
		}
	}

	onMounted(() => {
		setAttributes()
		// remove the native label of VAutoComplete because we have our own one
		document.querySelectorAll(`label[for="${props.uniqueId}"]`)[1]?.remove()
	})

	const emitChangeEvent = (): void => {
		emit('change', inputValue.value)
	}

	const emitFocusEvent = (): void => {
		focused.value = true
		emit('focus', inputValue.value)
	}

	const emitBlurEvent = (): void => {
		focused.value = false
		emit('blur', inputValue.value)
	}

	const emitEscEvent = (): void => {
		const emittedValue = inputAutoCompleteField.value && inputAutoCompleteField.value.menu ? inputValue.value : ''
		emit('esc', emittedValue)
	}

	const emitUpdateMenuEvent = (): void => {
		emit('update:menu', inputValue.value)
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
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="d-flex flex-column amelipro-autocomplete"
		:class="globalClasses"
		:style="globalFieldStyles"
	>
		<div
			class="d-inline-flex align-baseline mb-1 amelipro-autocomplete__label-wrapper"
			:class="horizontal ? 'mt-md-2 mr-md-2' : undefined"
		>
			<label
				:id="`${uniqueId}-label`"
				class="amelipro-autocomplete__label"
				:class="horizontal ? 'mr-md-2' : undefined"
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

		<VAutocomplete
			:id="uniqueId"
			ref="inputAutoCompleteField"
			v-model="inputValue"
			:aria-describedby="displayError ? `${uniqueId}-error` : undefined"
			:aria-expanded="isMenuActive ? 'true' : 'false'"
			:aria-invalid="displayError ? true : undefined"
			:required="required"
			autocomplete="list"
			:bg-color="disabled ? 'ap-grey-lighten-2' : 'ap-white'"
			class="pt-0 amelipro-text-field"
			color="ap-blue-darken-1"
			density="compact"
			:disabled="disabled"
			eager
			:hide-details="hideErrorMessage"
			:items="items"
			:menu-props="{id: `${uniqueId}-list`}"
			:placeholder="placeholder"
			:readonly="readonly"
			role="combobox"
			:rules="inputRules"
			:style="inputStyles"
			:validate-on="validateOn"
			variant="outlined"
			v-bind="$attrs"
			@blur="emitBlurEvent"
			@change="emitChangeEvent"
			@focus="emitFocusEvent"
			@keydown.esc="emitEscEvent"
			@update:menu="emitUpdateMenuEvent"
		>
			<template #append-inner>
				<AmeliproIconBtn
					:aria-expanded="isMenuActive ? 'true' : 'false'"
					:btn-label="`${label} ouvrir la liste`"
					icon-color="ap-blue-darken-1"
					icon-hover-color="ap-blue-darken-2"
					tabindex="-1"
					:unique-id="`${uniqueId}-btn`"
				>
					<template #icon>
						{{ isMenuActive ? iconUp : iconDown }}
					</template>
				</AmeliproIconBtn>
			</template>

			<template
				v-if="!hideErrorMessage"
				#message="{ message }"
			>
				<AmeliproMessage
					no-icon
					text
					type="error"
					:unique-id="`${uniqueId}-error`"
				>
					<p class="mb-0">
						{{ message }}
					</p>
				</AmeliproMessage>
			</template>
		</VAutocomplete>
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

	.amelipro-autocomplete__label {
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
