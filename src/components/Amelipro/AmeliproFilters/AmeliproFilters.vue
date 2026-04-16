<script setup lang="ts">
	import { computed } from 'vue'
	import type { PropType } from 'vue'
	import type { AmeliproFilterItem } from './types'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		groupId: {
			type: String,
			required: true,
		},
		groupLabel: {
			type: String,
			required: true,
		},
		hiddenLabel: {
			type: Boolean,
			default: false,
		},
		unique: {
			type: Boolean,
			default: false,
		},
		value: {
			type: Array as PropType<AmeliproFilterItem[]>,
			default: () => [],
		},
	})

	const { smAndUp } = useDisplay()

	const emit = defineEmits(['input', 'change:selected'])

	const currentValue = computed<AmeliproFilterItem[]>({
		get: () => props.value,
		set: (newValue: AmeliproFilterItem[]) => {
			emit('input', newValue)
		},
	})

	const selectedValue = computed<string | null>(() => {
		const checkedItem = currentValue.value.filter(e => e.isChecked)

		if (checkedItem.length === 1) {
			return checkedItem[0]!.value
		}

		return null
	})

	const emitChangeEvent = (item: AmeliproFilterItem): void => {
		currentValue.value = currentValue.value.map((currentItem: AmeliproFilterItem) => {
			if (currentItem.value === item.value) {
				currentItem.isChecked = true
			}
			else {
				currentItem.isChecked = false
			}
			return currentItem
		})
		emit('change:selected', selectedValue.value, props.groupId)
	}

	const updateItems = (item: AmeliproFilterItem, isChecked: boolean) => {
		currentValue.value = currentValue.value.map((currentItem: AmeliproFilterItem) => {
			if (currentItem === item) {
				currentItem.isChecked = isChecked
			}
			return currentItem
		})
		const selectedItems = currentValue.value.filter(e => e.isChecked === true)
		emit('change:selected', selectedItems)
	}
</script>

<template>
	<div
		class="amelipro-filters"
	>
		<p
			:id="`${groupId}-label`"
			class="mb-1 ap-grey--text text--darken-1 amelipro-filters__label"
			:class="hiddenLabel ? 'd-sr-only' : undefined"
		>
			{{ groupLabel }}
		</p>

		<div
			v-if="unique"
			class="d-flex flex-sm-wrap flex-column flex-sm-row justify-center justify-sm-start align-center amelipro-filters__group"
		>
			<label
				v-for="(item, index) in currentValue"
				:id="`${item.id}-label`"
				:key="index"
				:for="item.id"
				class="mb-2 d-block font-weight-semibold amelipro-filters__item"
				:class="smAndUp ? 'item-spacing' : undefined"
			>
				<input
					:id="item.id"
					:checked="!props.unique && item.isChecked ? true : undefined"
					class="amelipro-filters__filter-input"
					:name="groupId"
					:type="unique ? 'radio' : 'checkbox'"
					:value="item.value"
					@change="emitChangeEvent(item)"
				>

				<span
					:id="`${item.id}-label-text`"
					class="filter d-block amelipro-filters__filter__label"
				>
					{{ item.label }}
				</span>
			</label>
		</div>
		<div
			v-else
			:aria-labelledby="`${groupId}-label`"
			class="d-block amelipro-filters__group"
			role="group"
		>
			<ul class="list-style-none w-100 d-flex flex-sm-wrap flex-column flex-sm-row justify-center justify-sm-start align-center">
				<li
					v-for="(item, index) in currentValue"
					:id="`${item.id}-item`"
					:key="index"
					class="mb-2 d-block font-weight-semibold amelipro-filters__item"
					:class="smAndUp ? 'item-spacing' : undefined"
				>
					<div
						:id="item.id"
						:aria-checked="item.isChecked"
						class="amelipro-filters__filter-input"
						role="checkbox"
						tabindex="0"
						@click="updateItems(item, !item.isChecked)"
						@keydown.space="updateItems(item, !item.isChecked)"
						@keydown.enter.prevent="updateItems(item, !item.isChecked)"
					>
						<span
							:id="`${item.id}-label-text`"
							class="filter d-block amelipro-filters__filter__label"
						>
							{{ item.label }}
						</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/overrides/breakpoints' as bp;

.item-spacing {
	&:not(:last-child) {
		@media #{bp.$up-sm} {
			margin-right: 16px;
		}
	}
}

.amelipro-filters__item {
	width: 135px;
	text-align: center;
}

input {
	position: absolute;
	width: 0;
	height: 0;
	opacity: 0;
}

.filter {
	padding: 0.75rem 2rem;
	font-weight: var(--v-theme-ap-fontWeightBold);

	input + &,
	.amelipro-filters__filter-input & {
		position: relative;
		border-radius: var(--v-theme-ap-btnRadius);
		border: 1px solid rgb(var(--v-theme-primary));
		background-color: #fff;
		color: rgb(var(--v-theme-primary));
		cursor: pointer;
	}

	input:checked + &,
	.amelipro-filters__filter-input[aria-checked='true'] & {
		background-color: rgb(var(--v-theme-ap-blue-lighten-3));

		&::after {
			position: absolute;
			top: 1.1rem;
			left: 1.1rem;
			width: 1rem;
			height: 0.5rem;
			border-bottom: 2px solid rgb(var(--v-theme-primary));
			border-left: 2px solid rgb(var(--v-theme-primary));
			transform: rotate(-50deg);
			content: '';
		}
	}

	input:focus + &,
	.amelipro-filters__filter-input:focus & {
		outline: 1px dotted rgb(var(--v-theme-ap-grey-darken-1));
	}
}

.amelipro-filters__label {
	font-weight: var(--v-theme-ap-fontWeightBold);
}
</style>
