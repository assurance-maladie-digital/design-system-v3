<script setup lang="ts">
	import { computed, onUpdated, type PropType, ref } from 'vue'
	import type { AmeliproCustomSelectorItem } from './types'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import type { IndexedObject } from '../types'

	const props = defineProps({
		required: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		groupLabel: {
			type: String,
			required: true,
		},
		itemsPerLine: {
			type: Number,
			default: 1,
		},
		labelDescription: {
			type: String,
			default: undefined,
		},
		labelMarginBottom: {
			type: String,
			default: undefined,
		},
		modelValue: {
			type: Array as PropType<AmeliproCustomSelectorItem[]>,
			default: () => [],
		},
		multipleRequired: {
			type: Boolean,
			default: false,
		},
		multipleRequiredErrorMessage: {
			type: String,
			default: 'Vous devez cocher au moins deux options',
		},
		requiredErrorMessage: {
			type: String,
			default: 'Sélection obligatoire',
		},
		unique: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['update:model-value', 'change:selected'])

	const currentValue = computed<AmeliproCustomSelectorItem[]>({
		get: () => props.modelValue,
		set: (newValue: AmeliproCustomSelectorItem[]) => {
			emit('update:model-value', newValue)
		},
	})

	const isAlreadyCheckedOnce = ref(false)

	const selectedValue = computed<string | null>(() => {
		const checkedItem = currentValue.value.filter(e => e.isChecked)
		return checkedItem.length === 1 ? checkedItem[0].value : null
	})

	const emitChangeEvent = (item: AmeliproCustomSelectorItem): void => {
		currentValue.value = currentValue.value.map((currentItem: AmeliproCustomSelectorItem) => {
			if (currentItem.value === item.value) {
				currentItem.isChecked = true
			}
			else {
				currentItem.isChecked = false
			}
			return currentItem
		})
		emit('change:selected', selectedValue.value, props.uniqueId)
	}

	const updateItems = (item: AmeliproCustomSelectorItem, isChecked: boolean) => {
		if (!props.disabled && !item.disabled) {
			isAlreadyCheckedOnce.value = true
			currentValue.value = currentValue.value.map((currentItem: AmeliproCustomSelectorItem) => {
				if (currentItem === item) {
					currentItem.isChecked = isChecked
				}
				return currentItem
			})
			const selectedItems = currentValue.value.filter(e => e.isChecked === true)
			emit('change:selected', selectedItems)
		}
	}

	const isSingleRequiredErrorMessage = computed(() => props.required === true && (currentValue.value.filter(item => item.isChecked).length < 1))
	const isMultipleRequiredErrorMessage = computed(() => props.multipleRequired === true && !props.unique && (currentValue.value.filter(item => item.isChecked).length < 2))
	const error = computed<string>(() => {
		if (isAlreadyCheckedOnce.value === true) {
			if (isSingleRequiredErrorMessage.value) {
				return props.requiredErrorMessage
			}
			else if (!props.unique && isMultipleRequiredErrorMessage.value) {
				return props.multipleRequiredErrorMessage
			}
		}
		return ''
	})
	const checkErrorCondition = computed<boolean>(() => {
		if (isAlreadyCheckedOnce.value === true) {
			if (isSingleRequiredErrorMessage.value) {
				return true
			}
			else if (!props.unique && isMultipleRequiredErrorMessage.value) {
				return true
			}
		}
		return false
	})

	const labelMarginBottomValue = computed<IndexedObject | undefined>(() => (props.labelMarginBottom ? { marginBottom: props.labelMarginBottom } : { marginBottom: '4px' }))

	onUpdated(() => {
		isAlreadyCheckedOnce.value = true
	})
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		:aria-describedby="checkErrorCondition && unique ? `${uniqueId}-error` : undefined"
		:aria-labelledby="unique ? uniqueId : undefined"
		class="amelipro-custom-selector"
		:role="unique ? 'radiogroup' : undefined"
	>
		<div
			class="d-flex align-center amelipro-custom-selector__label-wrapper"
			:style="labelMarginBottomValue"
		>
			<p
				:id="uniqueId"
				:aria-describedby="labelDescription"
				class="text-ap-grey-darken-1 amelipro-custom-selector__label"
			>
				{{ groupLabel }}

				<span
					v-if="required || multipleRequired"
					aria-hidden="true"
					class="d-inline-flex"
				>
					&nbsp;*
				</span>

				<span
					v-if="required || multipleRequired"
					class="d-sr-only"
				>
					&nbsp;Champ obligatoire
				</span>
			</p>

			<slot name="labelInfo" />
		</div>

		<div
			v-if="unique"
			class="d-flex flex-wrap justify-start amelipro-custom-selector__group"
		>
			<div
				v-for="(item, index) in currentValue"
				:key="index"
				class="d-block item-spacing amelipro-custom-selector__item"
				:class="{
					'item-per-line-2': itemsPerLine === 2,
					'item-per-line-3': itemsPerLine === 3,
				}"
			>
				<label
					:id="`${uniqueId}-label-${index}`"
					class="d-block"
					:for="`${uniqueId}-input-${index}`"
				>
					<input
						:id="`${uniqueId}-input-${index}`"
						:aria-checked="item.isChecked"
						:checked="item.isChecked"
						:disabled="item.disabled || disabled"
						:name="`${uniqueId}-name`"
						type="radio"
						:value="item.value"
						@input="emitChangeEvent(item)"
					>

					<span
						:id="`${uniqueId}-label-text-${index}`"
						class="select-item text-ap-grey-darken-1 text-body-1 d-block"
					>
						{{ item.label }}
					</span>
				</label>
			</div>
		</div>

		<div
			v-else
			:aria-describedby="checkErrorCondition ? `${uniqueId}-error` : undefined"
			:aria-disabled="disabled ? true : undefined"
			:aria-invalid="checkErrorCondition ? true : undefined"
			:aria-labelledby="uniqueId"
			:required="required || multipleRequired ? true : undefined"
			class="amelipro-custom-selector__group"
			role="group"
		>
			<ul class="d-flex flex-wrap justify-start list-style-none w-100">
				<li
					v-for="(item, index) in currentValue"
					:key="index"
					class="d-block item-spacing amelipro-custom-selector__item"
					:class="{
						'item-per-line-2': itemsPerLine === 2,
						'item-per-line-3': itemsPerLine === 3,
					}"
				>
					<div
						:id="`${uniqueId}-input-${index}`"
						:aria-checked="item.isChecked"
						:aria-disabled="disabled || item.disabled ? true : undefined"
						class="d-block checkbox-input"
						role="checkbox"
						:tabindex="disabled || item.disabled ? '-1' : '0'"
						@click="updateItems(item, !item.isChecked)"
						@keydown.space="updateItems(item, !item.isChecked)"
					>
						<span
							:id="`${uniqueId}-label-text-${index}`"
							class="select-item text-ap-grey-darken-1 text-body-1 d-block"
						>
							{{ item.label }}
						</span>
					</div>
				</li>
			</ul>
		</div>

		<AmeliproMessage
			v-if="checkErrorCondition"
			no-icon
			text
			type="error"
			:unique-id="`${uniqueId}-error`"
		>
			<p class="mb-0">
				{{ error }}
			</p>
		</AmeliproMessage>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-custom-selector__label {
	font-size: apTokens.$font-size-sm;
	font-weight: apTokens.$ap-font-weight-bold;
}

.amelipro-custom-selector__item {
	width: 100%;

	&.item-per-line-2 {
		@media #{apTokens.$media-up-sm} {
			width: calc(50% - 8px);
			margin-left: 8px;

			&:nth-child(2n+1) {
				margin-left: 0;
			}
		}
	}

	&.item-per-line-3 {
		@media #{apTokens.$media-up-sm} {
			width: calc((100% / 3) - (16px / 3));
			margin-left: 8px;

			&:nth-child(3n+1) {
				margin-left: 0;
			}
		}
	}
}

.item-spacing {
	&:not(:last-child) {
		margin-bottom: 8px;
	}
}

input {
	position: absolute;
	width: 0;
	height: 0;
	opacity: 0;
}

.select-item {
	input + &,
	.checkbox-input & {
		position: relative;
		padding: 0.75rem 3rem 0.75rem 1rem;
		border-radius: 5px;
		border: 1px solid apTokens.$ap-grey;
		background-color: apTokens.$ap-white;
		cursor: pointer;
	}

	input:checked + &,
	.checkbox-input[aria-checked='true'] & {
		background-color: apTokens.$ap-blue-lighten3;

		&::after {
			position: absolute;
			top: 1rem;
			right: 1rem;
			width: 1rem;
			height: 0.5rem;
			border-bottom: 2px solid apTokens.$ap-blue-darken1;
			border-left: 2px solid apTokens.$ap-blue-darken1;
			transform: rotate(-50deg);
			content: '';
		}
	}

	input:disabled + &,
	.checkbox-input[aria-disabled='true'] & {
		background-color: apTokens.$ap-grey-lighten2;
		cursor: default;

		&::after {
			border-bottom-color: apTokens.$ap-grey-darken1;
			border-left-color: apTokens.$ap-grey-darken1;
		}
	}
}
</style>
