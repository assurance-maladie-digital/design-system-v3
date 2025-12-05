<script setup lang="ts">
	import { computed, onUpdated, type PropType, ref, useSlots } from 'vue'
	import type { AmeliproCheckboxGroupItem } from './types'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'

	const props = defineProps({
		required: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		fullHorizontal: {
			type: Boolean,
			default: false,
		},
		groupLabel: {
			type: String,
			required: true,
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
			type: Array as PropType<AmeliproCheckboxGroupItem[]>,
			required: true,
		},
		multipleRequired: {
			type: Boolean,
			default: false,
		},
		multipleRequiredErrorMessage: {
			type: String,
			default: 'Vous devez cocher au moins deux options',
		},
		pills: {
			type: Boolean,
			default: false,
		},
		requiredErrorMessage: {
			type: String,
			default: 'Sélection obligatoire',
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['update:model-value', 'change:selected'])
	const isAlreadyCheckedOnce = ref(false)
	const slots = useSlots()

	const currentValue = computed<AmeliproCheckboxGroupItem[]>({
		get: () => props.modelValue,
		set: (newValue: AmeliproCheckboxGroupItem[]) => {
			emit('update:model-value', newValue)
		},
	})

	const updateItems = (item: AmeliproCheckboxGroupItem, isChecked: boolean) => {
		if (!props.disabled && !item.disabled) {
			isAlreadyCheckedOnce.value = true
			currentValue.value = currentValue.value.map((currentItem: AmeliproCheckboxGroupItem) => {
				if (currentItem === item) {
					currentItem.isChecked = isChecked
				}
				return currentItem
			})
			const selectedItems = currentValue.value.filter(e => e.isChecked === true)
			emit('change:selected', selectedItems)
		}
	}

	const slotSubItem = (index: number): boolean => {
		if (props.horizontal || props.fullHorizontal) {
			return false
		}
		return Boolean(slots[`subItem-${index}`] || slots.subItem)
	}

	const ariaExpandedValue = (item: AmeliproCheckboxGroupItem, index: number): 'true' | 'false' | undefined => {
		if (slotSubItem(index)) {
			return item.isChecked ? 'true' : 'false'
		}
		return undefined
	}

	const isSingleRequiredErrorMessage = () => props.required === true && currentValue.value.filter(item => item.isChecked).length < 1
	const isMultipleRequiredErrorMessage = () => props.multipleRequired === true && currentValue.value.filter(item => item.isChecked).length < 2

	const error = computed<string>(() => {
		if (isAlreadyCheckedOnce.value === true) {
			if (isSingleRequiredErrorMessage()) {
				return props.requiredErrorMessage
			}
			else if (isMultipleRequiredErrorMessage()) {
				return props.multipleRequiredErrorMessage
			}
		}
		return ''
	})

	const checkErrorCondition = computed<boolean>(() => (
		isAlreadyCheckedOnce.value === true
		&& (isSingleRequiredErrorMessage() || isMultipleRequiredErrorMessage())
	))

	onUpdated(() => {
		isAlreadyCheckedOnce.value = true
	})
</script>

<template>
	<div :id="`${uniqueId}-container`">
		<div
			class="amelipro-checkbox-group d-flex flex-column"
			:class="{
				'flex-md-row align-md-start': horizontalLabel || fullHorizontal,
				'pills': pills,
				'classic': !pills,
			}"
		>
			<div class="d-flex align-center mr-2 amelipro-checkbox-group__label-wrapper">
				<p
					:id="uniqueId"
					class="d-inline-flex amelipro-checkbox-group__label"
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
				:aria-describedby="checkErrorCondition ? `${uniqueId}-error` : undefined"
				:aria-disabled="disabled ? true : undefined"
				:aria-invalid="checkErrorCondition ? true : undefined"
				:aria-labelledby="uniqueId"
				:required="required"
				class="amelipro-checkbox-group__wrapper"
				:class="{
					'mt-1 mt-md-0': fullHorizontal && !pills,
					'mt-2': pills
				}"
				role="group"
			>
				<ul
					:id="`${uniqueId}-list`"
					class="d-flex flex-wrap list-style-none amelipro-checkbox-group__list"
					:class="{
						'flex-column': !pills,
						'flex-md-row align-md-center': !horizontalLabel && (horizontal || fullHorizontal),
					}"
				>
					<li
						v-for="(item, index) in currentValue"
						:id="`${uniqueId}-item-${index}`"
						:key="index"
						class="amelipro-checkbox-group__item"
						:class="{
							'mb-2': pills,
							'mb-4': !pills,
						}"
					>
						<div class="d-flex align-center amelipro-checkbox-group__item__wrapper">
							<div
								:id="`${uniqueId}-input-${index}`"
								:aria-checked="item.isChecked"
								:aria-controls="slotSubItem(index) ? `${uniqueId}-subitem-${index}` : undefined"
								:aria-describedby="item.description"
								:aria-disabled="item.disabled || disabled ? true : undefined"
								:aria-expanded="ariaExpandedValue(item, index)"
								class="mr-2 d-inline-flex flex-row align-center text-body-1 amelipro-checkbox-group__item-input"
								:class="{
									'mr-0 mr-md-2': horizontal || fullHorizontal
								}"
								role="checkbox"
								:tabindex="disabled || item.disabled ? '-1' : '0'"
								@click="updateItems(item, !item.isChecked)"
								@keydown.space="updateItems(item, !item.isChecked)"
							>
								<span
									:id="`${uniqueId}-label-text-${index}`"
									class="checkbox-label"
									:class="{
										'text-ap-grey': !pills && (item.disabled || disabled),
										'text-ap-blue-darken-1': pills && !checkErrorCondition && !item.disabled && !disabled,
										'text-ap-red amelipro-checkbox-group__item-label-span-error': checkErrorCondition && !item.disabled && !disabled,
										'text-ap-grey-darken-1': (!pills && !checkErrorCondition && !item.disabled && !disabled) || (pills && (item.disabled || disabled)),
									}"
								>
									{{ item.label }}
								</span>
							</div>

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
				{{ error }}
			</p>
		</AmeliproMessage>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-checkbox-group__item-input {
	& .checkbox-label {
		position: relative;
		cursor: pointer;
	}

	&[aria-disabled='true'] {
		& .checkbox-label {
			cursor: default;
		}
	}
}

.amelipro-checkbox-group.classic .amelipro-checkbox-group__item-input {
	& .checkbox-label {
		position: relative;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		padding-left: 2rem;
		cursor: pointer;

		&::before {
			position: absolute;
			top: 0.0625rem;
			left: 0;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 0.4rem;
			border: 3px solid apTokens.$ap-blue-darken1;
			background-color: transparent;
			content: '';
		}
	}

	&[aria-checked='true'] {
		& .checkbox-label {
			&::before {
				background-color: apTokens.$ap-blue-darken1;
			}

			&::after {
				position: absolute;
				top: 0.5rem;
				left: 0.3rem;
				width: 0.9rem;
				height: 0.5rem;
				border-radius: 2px;
				border-bottom: 3px solid apTokens.$ap-white;
				border-left: 3px solid apTokens.$ap-white;
				transform: rotate(-50deg);
				content: '';
			}
		}
	}

	&[aria-disabled='true'] {
		& .checkbox-label {
			cursor: default;

			&::before {
				opacity: 0.6;
			}
		}
	}
}

.amelipro-checkbox-group.pills {
	& .amelipro-checkbox-group__item-input {
		& .checkbox-label {
			font-size: apTokens.$font-size-sm;
			font-weight: apTokens.$filter-font-weight;
			padding: apTokens.$filter-padding-y apTokens.$filter-padding-x;
			border-radius: apTokens.$filter-radius;
			border: 1px solid apTokens.$ap-blue-darken1;
			background-color: apTokens.$ap-white;
			color: apTokens.$ap-blue-darken1;

			&.amelipro-checkbox-group__item-label-span-error {
				background-color: apTokens.$ap-red-lighten4;
				border-color: apTokens.$ap-red;
			}
		}

		&[aria-checked='true'] {
			& .checkbox-label {
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

		&[aria-disabled='true'] {
			& .checkbox-label {
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

.amelipro-checkbox-group__label {
	font-weight: apTokens.$label-font-weight;
}

.margin-label {
	@media #{apTokens.$media-up-md} {
		margin-top: 3px;
	}
}
</style>
