<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */
	import type { IndexedObject, ValidateOnType } from '../types'
	import type { InputSelect, SelectItem } from './types'
	import { computed, onMounted, onUnmounted, type PropType, ref } from 'vue'
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
		clearable: {
			type: Boolean,
			default: false,
		},
		disabled: {
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
			type: Boolean,
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
			type: Array as PropType<string[] | SelectItem[]>,
			required: true,
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
			type: [Object, Number, String] as PropType<SelectItem | number | string>,
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
			default: 'input',
			type: String as PropType<ValidateOnType>,
			validator(value: string): boolean {
				return ['lazy', 'blur', 'input', 'submit', 'blur lazy', 'input lazy', 'submit lazy', 'lazy blur', 'lazy input', 'lazy submit'].includes(value.toLowerCase())
			},
		},
	})

	// VSelect ref
	const inputSelect = ref<InputSelect>()

	const emit = defineEmits(['update:model-value'])
	// v-model
	const inputValue = computed({
		get: () => props.modelValue,
		set: (value: object | number | string | undefined) => {
			emit('update:model-value', value)
		},
	})

	const focused = ref(false)
	const errorId = computed<string>(() => `${props.uniqueId}-error`)
	const messagesToDisplay = computed(() => (displayError.value ? inputSelect.value?.errorMessages : undefined))
	const displayError = computed(() => (inputSelect.value?.isValid !== null && !inputSelect.value?.isValid) && (inputSelect.value?.errorMessages && inputSelect.value?.errorMessages.length > 0))
	const selectRules = computed<ValidationRule[]>(() => {
		// const { rules } = props; => provoque des mutations indésirables de props.rules
		const rules = [
			...props.rules,
		]
		if (props.required) {
			rules.push(isRequired)
		}
		return rules
	})

	// Fallback : nécessaire pour le bon fonctionnement d'autres composants
	defineExpose({ messagesToDisplay })

	const selectClasses = computed<string>(() => {
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
		const styles: IndexedObject = { marginBottom: '12px' }
		if (props.globalMaxWidth) {
			styles.maxWidth = props.globalMaxWidth
		}
		if (props.globalMinWidth) {
			styles.minWidth = props.globalMinWidth
		}
		if (props.globalWidth) {
			styles.width = props.globalWidth
		}
		return styles
	})

	const inputStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = {}
		if (props.inputMaxWidth) {
			styles.maxWidth = props.inputMaxWidth
		}
		if (props.inputMinWidth) {
			styles.minWidth = props.inputMinWidth
		}
		return styles
	})

	const labelStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = {}
		if (props.labelMaxWidth) {
			styles.maxWidth = props.labelMaxWidth
		}
		if (props.labelMinWidth) {
			styles.minWidth = props.labelMinWidth
		}
		return styles
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

	const fixAccessibility = () => {
		document.querySelector(`#${props.uniqueId}`)?.removeAttribute('aria-label')
		document.querySelector(`#${props.uniqueId}`)?.removeAttribute('title')
	}

	// the observer is used to remove wrong vuetify accessibility attributes each time they appears (when you open or close option list)
	const inputEl = ref<HTMLElement | null>(null)
	const observer = ref<MutationObserver | null>(null)
	onMounted(() => {
		// remove the native label of VSelect because we have our own one
		document.querySelectorAll(`label[for="${props.uniqueId}"]`)[1]?.remove()

		fixAccessibility()
		inputEl.value = document.querySelector(`#${props.uniqueId}`)
		observer.value = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes') {
					fixAccessibility()
				}
			})
		})

		if (inputEl.value) {
			observer.value.observe(inputEl.value, { attributes: true })
		}
	})

	onUnmounted(() => {
		if (observer.value) {
			observer.value.disconnect()
		}
	})
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		:class="classes"
		:style="globalFieldStyles"
	>
		<div
			class="w-100 amelipro-select__wrapper"
			:class="selectClasses"
		>
			<div
				class="d-inline-flex align-baseline mb-1"
				:class="labelClasses"
			>
				<label
					:id="`${uniqueId}-label`"
					class="mr-2 amelipro-select__label"
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

			<VSelect
				:id="uniqueId"
				ref="inputSelect"
				v-model="inputValue"
				:aria-describedby="displayError ? errorId : undefined"
				:aria-invalid="displayError ? true : undefined"
				:required="required"
				:bg-color="disabled ? 'ap-grey-lighten-2' : 'ap-white'"
				class="pt-0 amelipro-select"
				:clearable="clearable"
				color="ap-blue-darken-1"
				density="compact"
				:disabled="disabled"
				:error="displayError"
				:hide-details="hideErrorMessage || fullWidthErrorMsg"
				:item-props="true"
				:items="items"
				:placeholder="placeholder"
				:readonly="readonly"
				:rules="selectRules"
				:style="inputStyles"
				:validate-on="validateOn"
				variant="outlined"
				v-bind="$attrs"
				@blur="focused = false"
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
			</VSelect>
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

.v-select {
	& :deep(.v-select__selection--comma) {
		line-height: 1.5rem;
	}

	& :deep(.v-field__outline) {
		border-color: v-bind(inputBorderStyle);

		--v-field-border-opacity: 1 !important;
	}

	& :deep(.v-field__input > input) {
		align-self: unset;
	}

	& :deep(.v-field.v-field--variant-outlined.v-field--focused .v-field__outline) {
		--v-field-border-width: 1px !important;
	}
}

:deep(.v-input__slot) {
	min-height: apTokens.$input-min-height !important;
	border-radius: apTokens.$input-radius;

	fieldset {
		border: 0;
	}
}

.amelipro-select__label {
	font-size: apTokens.$font-size-xs;
	font-weight: apTokens.$label-font-weight;
}

.v-list {
	& :deep(.v-list-item) .v-list-item__title {
		line-height: 1.5rem;
	}
}
</style>
