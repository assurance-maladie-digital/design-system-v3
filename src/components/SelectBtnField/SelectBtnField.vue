<script lang="ts" setup>
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { mdiCheck } from '@mdi/js'
	import { ref, computed, watch } from 'vue'
	import { useTheme } from 'vuetify'
	import { config } from './config'
	import type { SelectBtnItem, SelectBtnValue } from './types'

	const props = withDefaults(defineProps<CustomizableOptions & {
		modelValue?: SelectBtnValue
		items?: SelectBtnItem[]
		label?: string
		multiple?: boolean
		inline?: boolean
		hint?: string
		error?: boolean
		errorMessages?: string[]
		readonly?: boolean

	}>(), {
		modelValue: null,
		items: () => [],
		label: undefined,
		multiple: false,
		inline: false,
		hint: undefined,
		error: false,
		errorMessages: undefined,
		readonly: false,
	})
	const options = useCustomizableOptions(config, props)

	const emits = defineEmits(['update:modelValue', 'update:error', 'update:error-messages'])
	const checkIcon = ref(mdiCheck)
	const internalValue = ref<SelectBtnValue>(null)
	const darktheme = ref<boolean>(useTheme().current.value.dark)

	watch(() => props.modelValue, (value) => {
		if (value === null && props.multiple) {
			internalValue.value = []
			return
		}
		internalValue.value = value
	}, {
		immediate: true,
		deep: true,
	})
	const filteredItems = computed(() => props.items.filter((item) => {
		return item.value !== null && item.value !== undefined
	}))

	function isSelected(value: number | string): boolean {
		if (props.multiple) {
			return (
				Array.isArray(internalValue.value)
				&& internalValue.value.includes(value)
			)
		}
		return internalValue.value === value
	}

	function getIconStyles(item: SelectBtnItem): Record<string, string> {
		return {
			visibility: isSelected(item.value) ? 'visible' : 'hidden',
		}
	}

	function getNewValue(item: SelectBtnItem): SelectBtnValue {
		if (props.multiple) {
			const typedValue = internalValue.value as Array<string | number>

			// If the item is unique, remove all other items from the array
			const hasUniqueItemSelected = filteredItems.value.some(
				filteredItem =>
					filteredItem.unique
					&& typedValue.includes(filteredItem.value),
			)

			if (item.unique || hasUniqueItemSelected) {
				return [item.value]
			}

			// If the item is not already selected, add it to the array
			if (!typedValue.includes(item.value)) {
				return [...typedValue, item.value]
			}

			// If the item is already selected, remove it from the array
			return typedValue.filter(value => value !== item.value)
		}

		// If the item is already selected, deselect it
		if (internalValue.value === item.value) {
			return null
		}

		// Select the item
		return item.value
	}

	function toggleItem(item: SelectBtnItem): void {
		internalValue.value = getNewValue(item)
		emits('update:error', false)
		emits('update:error-messages', undefined)
		emits('update:modelValue', internalValue.value)
	}

</script>

<template>
	<div
		:class="{ 'form-input': !inline }"
		class="select-btn-field"
	>
		<VBtnToggle
			v-bind="options.btnToggle"
			tag="ul"
			:model-value="internalValue"
			:multiple="multiple"
			:aria-label="label"
			:class="{ 'd-flex flex-column': !inline }"
			class="select-btn-field-toggle d-flex flex-wrap text-primary"
		>
			<li
				v-for="(item, index) in filteredItems"
				:key="`${index} + ${item.value}`"
				class="select-list-item"
			>
				<VBtn
					v-bind="options.btn"
					:aria-expanded="true"
					:value="item.value"
					:disabled="readonly"
					:variant="isSelected(item.value) ? 'flat' : 'outlined'"
					:elevation="0"
					:color="error ? 'error' : 'primary'"
					:class="{
						'text-error': error && !isSelected(item.value),
						'justify-start': !isSelected(item.value),
						'justify-space-between': isSelected(item.value),
					}"
					:label="isSelected(item.value) ? 'Sélectionné' : ''"
					@click="toggleItem(item)"
				>
					<span class="text-body-1">
						{{ item.text }}
					</span>

					<VIcon
						v-bind="options.icon"
						:style="getIconStyles(item)"
						role="img"
						:aria-hidden="!isSelected(item.value)"
						aria-label="Sélectionné"
					>
						{{ checkIcon }}
					</VIcon>
				</VBtn>
			</li>
		</VBtnToggle>

		<template v-if="errorMessages">
			<p
				v-for="(errorMessage, index) in errorMessages"
				:key="index"
				:class="darktheme ? 'theme--dark' : 'theme--light'"
				class="v-messages text-error px-3 mt-2 mb-0 opacity-100"
			>
				{{ errorMessage }}
			</p>
		</template>

		<p
			v-else-if="hint"
			:class="darktheme ? 'theme--dark' : 'theme--light'"
			class="v-messages px-3 mt-2 mb-0 opacity-100"
		>
			{{ hint }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

:deep(.v-btn-group) {
	height: auto !important;

	.v-btn__content {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.v-btn:not(:first-child) {
		border-inline-start: inherit;
	}
}

.select-btn-field-toggle {
	background: none !important;
	padding-left: 0 !important;

	.v-btn {
		background: #fff;
		border-width: 1px !important;
		min-width: 48px !important;
		text-wrap: auto;
		text-align: left;
		padding-top: 0 !important;
		padding-bottom: 0 !important;

		&.v-btn--active::before {
			opacity: 0 !important;
		}

		:deep(.v-btn__content) {
			flex-shrink: 1 !important;
			padding: 5px 0 !important;
		}
	}

	.v-icon {
		height: 1.5rem;
		width: 1.5rem;
	}

	&.flex-column {
		.v-btn {
			border-radius: 4px !important;
			border-width: 1px !important;
		}

		.select-list-item + .select-list-item .v-btn {
			margin-top: 8px;
		}
	}

	.select-list-item {
		all: unset;
		display: contents;
	}

	&.theme--dark {
		.v-btn {
			background: #1e1e1e;
		}
	}

	&:not(.v-btn-toggle--group) .v-btn.v-btn {
		border-color: tokens.$primary-base !important;

		&.text-error {
			border-color: tokens.$colors-text-error !important;
		}
	}

	// Disable the fade effect when the button is disabled
	:deep(.v-btn--disabled) {
		opacity: 1;
	}

	:deep(.v-btn--disabled.v-btn--variant-flat .v-btn__overlay) {
		opacity: 0;
	}

	:deep(.bg-primary) {
		--v-theme-overlay-multiplier: 1;
	}
}
</style>
