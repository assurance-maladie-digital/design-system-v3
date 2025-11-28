<script setup lang="ts">
	import { computed, type PropType } from 'vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { AmeliproIllustratedRadioGroupItem } from './types'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import { locales } from './locales'

	const props = defineProps({
		required: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		error: {
			type: Boolean,
			default: false,
		},
		groupLabel: {
			type: String,
			required: true,
		},
		iconSize: {
			type: String,
			default: '40px',
		},
		modelValue: {
			type: Array as PropType<AmeliproIllustratedRadioGroupItem[]>,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['update:model-value', 'change:selected'])

	const currentValue = computed<AmeliproIllustratedRadioGroupItem[]>({
		get: () => props.modelValue,
		set: (newValue: AmeliproIllustratedRadioGroupItem[]) => {
			emit('update:model-value', newValue)
		},
	})

	const selectedValue = computed<string | null>(() => {
		const checkedItem = currentValue.value.filter(e => e.isChecked)
		return checkedItem.length === 1 ? checkedItem[0].value : null
	})

	const emitChangeEvent = (item: AmeliproIllustratedRadioGroupItem) => {
		currentValue.value = currentValue.value.map((currentItem: AmeliproIllustratedRadioGroupItem) => {
			if (currentItem.value === item.value) {
				currentItem.isChecked = true
			}
			else {
				currentItem.isChecked = false
			}
			return currentItem
		})
		emit('change:selected', item.value)
	}

	const checkErrorCondition = computed<boolean>(() => props.required && selectedValue.value === null && props.error)
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="amelipro-illustrated-radio-group"
	>
		<div>
			<div
				:id="`${uniqueId}-label-group`"
				class="d-flex align-center mr-2 amelipro-illustrated-radio-group__label-wrapper"
			>
				<p
					:id="uniqueId"
					class="d-inline-flex mb-0 amelipro-illustrated-radio-group__label"
				>
					{{ groupLabel }}

					<span
						v-if="required"
						aria-hidden="true"
						class="d-inline-flex"
					>
						&nbsp;*
					</span>
					<span
						v-if="required"
						class="d-sr-only"
					>
						&nbsp;Champ obligatoire
					</span>
				</p>

				<slot name="labelInfo" />
			</div>

			<div
				:aria-labelledby="uniqueId"
				:required="required"
				class="mt-2 amelipro-illustrated-radio-group__group"
				role="radiogroup"
			>
				<ul
					:id="`${uniqueId}-list`"
					class="d-flex flex-wrap list-style-none amelipro-illustrated-radio-group__list"
				>
					<li
						v-for="(item, index) in currentValue"
						:id="`${uniqueId}-item-${index}`"
						:key="index"
						class="amelipro-illustrated-radio-group__item"
					>
						<label
							:id="`${uniqueId}-label-${index}`"
							:for="`${uniqueId}-input-${index}`"
							class="mr-2 mb-2 d-inline-flex flex-row align-center amelipro-illustrated-radio-group__item__label"
						>
							<input
								:id="`${uniqueId}-input-${index}`"
								:aria-checked="item.isChecked"
								:aria-describedby="checkErrorCondition ? `${uniqueId}-error` : undefined"
								:checked="item.isChecked"
								:disabled="item.disabled || disabled"
								:name="`${uniqueId}-name`"
								:required="required"
								type="radio"
								:value="item.value"
								@input="emitChangeEvent(item)"
							>

							<span
								class="d-flex flex-column align-center amelipro-illustrated-radio-group__item__label__content"
							>
								<span
									class="d-flex flex-column align-center pa-4 icon-radio__wrapper"
									:class="item.isChecked ? 'bg-ap-blue-darken-1' : 'bg-ap-blue-lighten-3'"
								>
									<AmeliproIcon
										:icon="item.icon"
										icon-bg-color="transparent"
										:icon-color="item.isChecked ? 'ap-white' : item.iconDefaultColor"
										:size="iconSize"
										:unique-id="`${uniqueId}-icon-${index}`"
									/>

									<span
										:id="`${uniqueId}-label-text-${index}`"
										class="mt-4 amelipro-illustrated-radio-group__item-label-text"
										:class="item.isChecked ? 'text-ap-white' : 'text-ap-blue-darken-1'"
									>
										{{ item.label }}
									</span>
								</span>
							</span>
						</label>
					</li>
				</ul>
			</div>
		</div>

		<AmeliproMessage
			v-if="checkErrorCondition"
			no-icon
			text
			type="error"
			:unique-id="`${uniqueId}-error`"
		>
			<p class="mb-0">
				{{ locales.errorMessage }}
			</p>
		</AmeliproMessage>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.icon-radio__wrapper {
	border-radius: 10px;
}

.amelipro-illustrated-radio-group__label {
	font-size: apTokens.$font-size-xs;
	font-weight: apTokens.$label-font-weight;
}

input {
	position: absolute;
	width: 0;
	height: 0;
	opacity: 0;

	&:focus {
		& + span {
			outline: 1px dotted apTokens.$ap-grey-darken1;
		}
	}

	& + span {
		position: relative;
		padding-bottom: 2.125rem;
		cursor: pointer;

		&::before {
			position: absolute;
			bottom: 3px;
			left: calc(50% - 0.8125rem);
			width: 1.625rem;
			height: 1.625rem;
			border-radius: 50%;
			border: 3px solid apTokens.$ap-blue-darken1;
			background-color: transparent;
			content: '';
		}
	}

	&:checked {
		& + span {
			&::after {
				position: absolute;
				bottom: 0.578rem;
				left: calc(50% - 0.4rem);
				width: 0.825rem;
				height: 0.825rem;
				border-radius: 50%;
				background-color: apTokens.$ap-blue-darken1;
				content: '';
			}
		}
	}

	&:disabled {
		& + span {
			cursor: default;

			&::before {
				opacity: 0.3;
			}
		}
	}
}

.amelipro-illustrated-radio-group__item-label-text {
	font-weight: apTokens.$label-font-weight;
}
</style>
