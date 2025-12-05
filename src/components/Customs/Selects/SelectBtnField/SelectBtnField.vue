<script lang="ts" setup>
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiCheck } from '@mdi/js'
	import { computed, onMounted, ref, watch } from 'vue'
	import { useTheme } from 'vuetify'
	import type { SelectBtnItem, SelectBtnValue } from './types'

	const props = withDefaults(defineProps<{
		modelValue?: SelectBtnValue
		items?: SelectBtnItem[]
		label?: string
		ariaLabelledby?: string | undefined
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
		ariaLabelledby: undefined,
		multiple: false,
		inline: false,
		hint: undefined,
		error: false,
		errorMessages: undefined,
		readonly: false,
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: SelectBtnValue): void
		(e: 'update:error', value: boolean): void
		(e: 'update:error-messages', value: string[] | undefined): void
	}>()

	const internalValue = ref<SelectBtnValue>(null)
	const darktheme = ref<boolean>(false)
	const listRef = ref<HTMLElement | null>(null)
	const optionsRef = ref<Array<HTMLElement>>([])

	onMounted(() => {
		const theme = useTheme().current
		if (theme && theme.value) {
			darktheme.value = theme.value.dark
		}
	})

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

			// if the item is unique, select only it
			if (item.unique && typedValue.includes(item.value) === false) {
				return [item.value]
			}

			// If the item is not already selected, add it to the array
			if (!typedValue.includes(item.value)) {
				// remove unique items from the old value
				const oldItems = typedValue.filter(
					(oldItem) => {
						const completeItem = filteredItems.value.find(
							filteredItem => filteredItem.value === oldItem,
						)
						return completeItem && !completeItem.unique
					},
				)

				return [...oldItems, item.value]
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
		if (props.readonly) {
			return
		}

		internalValue.value = getNewValue(item)
		emits('update:error', false)
		emits('update:error-messages', undefined)
		emits('update:modelValue', internalValue.value)
	}

	const focusedIndex = ref<number>(-1)

	/*
	 * Get the current index of the active item
	 * The active item depends on whether the select is multiple or not
	 * If multiple, the active item is the focused item
	 * If not multiple, the active item is the selected item
	*/
	function getCurrentIndex(): number {
		if (props.multiple) {
			const current = document.activeElement as HTMLElement
			return optionsRef.value.findIndex(item => item === current)
		}
		else {
			return optionsRef.value.findIndex(item => item.getAttribute('aria-selected') === 'true')
		}
	}

	function focusPrevious(): void {
		const index = getCurrentIndex()
		if (index > 0) {
			focusedIndex.value = index - 1
			optionsRef.value[index - 1].focus()
		}
		else {
			focusedIndex.value = optionsRef.value.length - 1
			optionsRef.value[optionsRef.value.length - 1].focus()
		}

		// auto select the focused item if not multiple
		const item = filteredItems.value[index > 0 ? index - 1 : optionsRef.value.length - 1]
		if (!props.multiple && !isSelected(item.value)) {
			toggleItem(item)
		}
	}

	function focusNext(): void {
		const index = getCurrentIndex()
		if (index < optionsRef.value.length - 1) {
			focusedIndex.value = index + 1
			optionsRef.value[index + 1].focus()
		}
		else {
			focusedIndex.value = 0
			optionsRef.value[0].focus()
		}

		// auto select the focused item if not multiple
		const item = filteredItems.value[index < optionsRef.value.length - 1 ? index + 1 : 0]
		if (!props.multiple && !isSelected(item.value)) {
			toggleItem(item)
		}
	}

	function focusFirst(): void {
		focusedIndex.value = 0
		optionsRef.value[0].focus()
	}

	function focusLast(): void {
		focusedIndex.value = optionsRef.value.length - 1
		optionsRef.value[optionsRef.value.length - 1].focus()
	}

	function handleBlur(): void {
		if ((!listRef.value?.contains(document.activeElement) || !(listRef.value === document.activeElement))) {
			focusedIndex.value = -1
		}
	}

	function handleInitFocus(e: FocusEvent): void {
		// Don't auto-select if focus was caused by mouse interaction
		if (isMouseInteraction.value) {
			const element = e.target as HTMLElement
			const index = optionsRef.value.findIndex(item => item === element)
			focusedIndex.value = index
			return
		}

		const element = e.target as HTMLElement
		const index = optionsRef.value.findIndex(item => item === element)
		focusedIndex.value = index
		const item = filteredItems.value[index]
		// Only auto-select on keyboard focus (Tab or arrow keys)
		if (!props.multiple && !internalValue.value) {
			toggleItem(item)
		}
	}

	const isMouseInteraction = ref(false)

	function handleMouseDown(): void {
		isMouseInteraction.value = true
	}

	function handleMouseUp(): void {
		isMouseInteraction.value = false
	}
</script>

<template>
	<div
		class="select-btn-field"
	>
		<ul
			ref="listRef"
			class="select-btn-field__options"
			:class="{
				'select-btn-field__options--inline': props.inline,
				'select-btn-field__options--column': !props.inline,
				'select-btn-field__options--error': error,
				'select-btn-field__options--readonly': readonly,
			}"
			:aria-label="props.label"
			:aria-labelledby="props.ariaLabelledby ?? undefined"
			role="listbox"
			:aria-orientation="props.inline ? 'horizontal' : 'vertical'"
			:aria-multiselectable="props.multiple ? 'true' : 'false'"
			:aria-invalid="error ? 'true' : 'false'"
			:aria-readonly="readonly ? 'true' : 'false'"
			:tabindex="focusedIndex === -1 ? '0' : '-1'"
			@focusout="handleBlur"
			@keydown.left.prevent="focusPrevious"
			@keydown.right.prevent="focusNext"
			@keydown.up.prevent="focusPrevious"
			@keydown.down.prevent="focusNext"
			@keydown.home.prevent="focusFirst"
			@keydown.end.prevent="focusLast"
		>
			<li
				v-for="(item, index) in filteredItems"
				:key="`select-btn-field-item-${index}`"
				ref="optionsRef"
				v-ripple="!props.readonly"
				class="select-btn-field__item"
				:class="{
					'select-btn-field__item--selected': isSelected(item.value),
				}"
				role="option"
				:tabindex="index === focusedIndex ? '0' : '-1'"
				:aria-selected="!props.multiple ? (isSelected(item.value) ? 'true' : 'false') : undefined"
				:aria-checked="props.multiple ? (isSelected(item.value) ? 'true' : 'false') : undefined"
				@keydown.space.prevent="toggleItem(item)"
				@mousedown="handleMouseDown"
				@mouseup="handleMouseUp"
				@click="toggleItem(item)"
				@focus="handleInitFocus"
			>
				<div class="select-btn-field__item-content">
					<span class="text-body-1">
						{{ item.text }}
					</span>

					<SyIcon
						:icon="mdiCheck"
						:decorative="true"
						:style="getIconStyles(item)"
					/>
				</div>
			</li>
		</ul>
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

.select-btn-field__options {
	display: flex;
	list-style-type: none;
	padding: 0;
	margin: 0;
	gap: tokens.$gap-2;
}

.select-btn-field__options--inline {
	flex-flow: row wrap;
}

.select-btn-field__options--column {
	flex-direction: column;
}

.select-btn-field__item {
	padding: 8px 16px;
	color: rgb(var(--v-theme-primary));
	border: 1px solid rgb(var(--v-theme-primary));
	min-height: 56px;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
	transition: background-color 0.2s, color 0.2s;
	background-color: #fff;

	&--selected {
		color: #fff;
		background-color: rgb(var(--v-theme-primary));
	}

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;
	}

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: background-color 0.2s;
	}

	&:hover::before {
		/* stylelint-disable-next-line custom-property-pattern */
		background-color: rgba(var(--v-theme-overlayOnLight), 0.2);
	}

	&--selected:hover::before {
		/* stylelint-disable-next-line custom-property-pattern */
		background-color: rgba(var(--v-theme-overlayOnDark), 0.2);
	}
}

.select-btn-field__item-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px 0;
	gap: 4px;
}

.select-btn-field__options--error .select-btn-field__item {
	color: tokens.$colors-text-error;
	border-color: tokens.$colors-border-error;
}
</style>
