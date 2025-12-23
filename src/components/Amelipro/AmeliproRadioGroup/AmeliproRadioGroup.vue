<script setup lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */
	import { computed, type PropType, useSlots } from 'vue'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import type { AmeliproRadioGroupItem } from './types'

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
		fullHorizontal: {
			type: Boolean,
			default: false,
		},
		groupLabel: {
			type: String,
			default: '',
		},
		hiddenLabel: {
			type: Boolean,
			default: false,
		},
		horizontal: {
			type: Boolean,
			default: false,
		},
		horizontalLabel: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Array as PropType<AmeliproRadioGroupItem[]>,
			required: true,
		},
		pills: {
			type: Boolean,
			default: false,
		},
		requiredErrorMessage: {
			type: String,
			default: 'Ce champ est obligatoire',
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['update:model-value', 'change:selected'])

	const currentValue = computed<AmeliproRadioGroupItem[]>({
		get: () => props.modelValue,
		set: (newValue: AmeliproRadioGroupItem[]) => {
			emit('update:model-value', newValue)
		},
	})

	const selectedValue = computed<string | null>(() => {
		const checkedItem = currentValue.value.filter(e => e.isChecked)
		return checkedItem.length === 1 ? checkedItem[0].value : null
	})

	const emitChangeEvent = (item: AmeliproRadioGroupItem) => {
		currentValue.value = currentValue.value.map((currentItem: AmeliproRadioGroupItem) => {
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

	const slots = useSlots()
	const slotSubItem = (index: number): boolean => {
		if (props.horizontal || props.fullHorizontal) {
			return false
		}
		return Boolean(slots[`subItem-${index}`] || slots.subItem)
	}

	const checkErrorCondition = computed(() => Boolean(props.required && selectedValue.value === null && props.error))

	const ariaExpandedValue = (item: AmeliproRadioGroupItem, index: number): 'true' | 'false' | undefined => {
		if (slotSubItem(index)) {
			return selectedValue.value === item.value ? 'true' : 'false'
		}
		return undefined
	}
</script>

<template>
	<div
		:id="`${uniqueId}-container`"
		class="amelipro-radio-group"
		:class="{
			'pills': pills,
			'classic': !pills,
		}"
	>
		<div
			class="d-flex flex-column radio-group"
			:class="{
				'flex-md-row': horizontalLabel || fullHorizontal,
				'align-md-center': !horizontalLabel && fullHorizontal,
				'align-md-start': horizontalLabel && !fullHorizontal,
			}"
		>
			<div class="d-flex align-center mr-2 radio-group__label-wrapper">
				<p
					:id="uniqueId"
					class="radio-group__label d-inline-flex"
					:class="{
						'mb-1': !fullHorizontal && !pills,
						'mb-0': fullHorizontal || pills,
						'mb-md-4': fullHorizontal,
						'margin-label': horizontalLabel || fullHorizontal,
						'd-sr-only': hiddenLabel,
					}"
				>
					<slot name="groupLabel">
						{{ groupLabel }}
					</slot>

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
				class="radio-group__wrapper"
				:class="{
					'mt-1 mt-md-0': fullHorizontal && !pills,
					'mt-2': pills
				}"
				role="radiogroup"
			>
				<ul
					:id="`${uniqueId}-list`"
					class="d-flex flex-wrap list-style-none radio-group__list"
					:class="{
						'flex-column': !pills,
						'flex-md-row align-md-center': !horizontalLabel && (horizontal || fullHorizontal),
					}"
				>
					<li
						v-for="(item, index) in currentValue"
						:id="`${uniqueId}-item-${index}`"
						:key="index"
						class="radio-group__item"
						:class="{
							'mb-2': pills,
							'mb-4': !pills,
						}"
					>
						<div class="d-flex align-center mr-2 amelipro-radio-group__label-wrapper">
							<label
								:id="`${uniqueId}-label-${index}`"
								class="d-inline-flex flex-row align-center mr-0 text-body-1 radio-group__item__label"
								:class="{
									'mr-md-2': !pills && (horizontal || fullHorizontal),
								}"
							>
								<input
									:id="`${uniqueId}-input-${index}`"
									:aria-checked="item.isChecked"
									:aria-controls="slotSubItem(index) ? `${uniqueId}-subitem-${index}` : undefined"
									:aria-describedby="checkErrorCondition ? `${uniqueId}-error` : undefined"
									:aria-expanded="ariaExpandedValue(item, index)"
									:checked="item.isChecked"
									:disabled="item.disabled || disabled"
									:name="`${uniqueId}-name`"
									:required="required"
									type="radio"
									:value="item.value"
									@input="emitChangeEvent(item)"
								>

								<span
									:id="`${uniqueId}-label-text-${index}`"
									:class="{
										'text-ap-grey': !pills && disabled,
										'text-ap-blue-darken-1': pills && !checkErrorCondition && !disabled,
										'text-ap-red radio-group__item-label-span-error': checkErrorCondition && !disabled,
										'text-ap-grey-darken-1': (!pills && !checkErrorCondition && !disabled) || (pills && disabled),
									}"
								>
									{{ item.label }}
								</span>
							</label>

							<slot :name="`append-${index}`">
								<slot
									name="append"
									v-bind="item"
								/>
							</slot>
						</div>

						<div
							v-if="slotSubItem(index) && item.isChecked"
							:id="`${uniqueId}-subitem-${index}`"
						>
							<slot :name="`subItem-${index}`">
								<slot
									name="subItem"
									v-bind="item"
								/>
							</slot>
						</div>
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
				{{ requiredErrorMessage }}
			</p>
		</AmeliproMessage>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.margin-label {
	@media #{apTokens.$media-up-md} {
		margin-top: 3px;
	}
}

input {
	position: absolute;
	width: 0;
	height: 0;
	opacity: 0;

	& + span {
		position: relative;
		cursor: pointer;
	}

	&:focus {
		& + span {
			outline: 1px dotted apTokens.$ap-grey-darken1;
		}
	}

	&:disabled {
		& + span {
			cursor: default;
		}
	}
}

.amelipro-radio-group.classic input {
	& + span {
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		padding-left: 2rem;

		&::before {
			position: absolute;
			top: 0.075rem;
			left: 0;
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
				top: 0.45rem;
				left: 0.4rem;
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
			&::before {
				opacity: 0.3;
			}
		}
	}
}

.amelipro-radio-group.pills {
	& label {
		&:not(:last-child) {
			@media #{apTokens.$media-up-sm} {
				margin-right: 16px;
			}
		}
	}

	& input {
		& + span {
			font-size: apTokens.$font-size-sm;
			font-weight: apTokens.$filter-font-weight;
			padding: apTokens.$filter-padding-y apTokens.$filter-padding-x;
			border-radius: apTokens.$filter-radius;
			border: 1px solid apTokens.$ap-blue-darken1;
			background-color: apTokens.$ap-white;
			color: apTokens.$ap-blue-darken1;

			&.radio-group__item-label-span-error {
				background-color: apTokens.$ap-red-lighten4;
				border-color: apTokens.$ap-red;
			}
		}

		&:checked {
			& + span {
				background-color: apTokens.$ap-blue-lighten3;

				&::after {
					position: absolute;
					top: 1rem;
					left: 0.75rem;
					width: 1rem;
					height: 0.5rem;
					border-bottom: 2px solid apTokens.$ap-blue-darken1;
					border-left: 2px solid apTokens.$ap-blue-darken1;
					transform: rotate(-50deg);
					content: '';
				}
			}
		}

		&:disabled {
			& + span {
				background-color: apTokens.$ap-grey-lighten2;
				border-color: apTokens.$ap-grey;

				&::after {
					border-bottom-color: apTokens.$ap-grey-darken1;
					border-left-color: apTokens.$ap-grey-darken1;
				}
			}
		}
	}
}

.radio-group__label {
	font-weight: apTokens.$label-font-weight;
}
</style>
