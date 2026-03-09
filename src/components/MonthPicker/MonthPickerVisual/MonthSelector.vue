<script setup lang="ts">
	import { onMounted, useTemplateRef, inject } from 'vue'
	import { useMonthGrid } from './useMonthGrid'
	import { localesKey, type locales as defaultLocales } from '../locales'

	const props = defineProps<{
		modelValue: number | undefined
	}>()

	const emits = defineEmits<{
		(event: 'update:modelValue', value: number): void
	}>()

	function getMonthName(monthIndex: number): string {
		return Intl.DateTimeFormat(navigator.language, { month: 'long' }).format(
			new Date(0, monthIndex - 1),
		)
	}

	function getMonthShortName(monthIndex: number): string {
		return Intl.DateTimeFormat(navigator.language, { month: 'short' }).format(
			new Date(0, monthIndex - 1),
		)
	}

	const monthSelector = useTemplateRef<HTMLElement>('monthSelector')

	const initialFocusedMonth = (props.modelValue && props.modelValue >= 1 && props.modelValue <= 12)
		? props.modelValue
		: new Date().getMonth() + 1

	const {
		activeMonth,
		selectNextMonth,
		selectPreviousMonth,
		selectNextRow,
		selectPreviousRow,
	} = useMonthGrid(
		monthSelector,
		initialFocusedMonth,
	)

	onMounted(() => {
		const selectedMonthElement = monthSelector.value!.querySelector<HTMLElement>(`.month-${initialFocusedMonth}`)
		selectedMonthElement!.focus()

		// When the menu opens, the transition can cause the focus to be lost, so we ensure it is set after the transition begins.
		setTimeout(() => {
			selectedMonthElement!.focus()
		}, 0)
	})

	const locales = inject<typeof defaultLocales>(localesKey)!

</script>

<template>
	<div
		ref="monthSelector"
		class="month-selector"
		role="group"
		:aria-label="locales.monthSelectorLabel"
	>
		<button
			v-for="monthIndex in 12"
			:key="monthIndex"
			:tabindex="monthIndex === activeMonth ? 0 : -1"
			class="month-selector__month"
			:class="[`month-${monthIndex}`, {
				'month-selector__month--active': monthIndex === activeMonth,
				'month-selector__month--selected': monthIndex === props.modelValue,
			}]"
			:aria-label="getMonthName(monthIndex)"
			:aria-pressed="monthIndex === props.modelValue"
			@click="() => emits('update:modelValue', monthIndex)"
			@keydown.left.prevent="selectPreviousMonth"
			@keydown.right.prevent="selectNextMonth"
			@keydown.up.prevent="selectPreviousRow"
			@keydown.down.prevent="selectNextRow"
			@keydown.enter.stop
			@keydown.space.stop
		>
			{{ getMonthShortName(monthIndex) }}
		</button>
	</div>
</template>

<style lang="scss" scoped>
.month-selector {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	padding: 16px 16px 12px;
}

.month-selector__month {
	padding: 8px;
	margin: 4px;
	border: 2px solid #fff;
	cursor: pointer;
	text-align: center;
	min-width: 33px;
	border-radius: 99px;
	font-weight: bold;

	&:hover {
		background-color: #d0d0d0;
	}
}

.month-selector__month--selected {
	background-color: rgb(var(--v-theme-primary, 12, 65, 154));
	color: white;

	&:hover {
		background-color: rgb(var(--v-theme-primary-darken-1, 31, 85, 146));
	}
}

.month-selector__month--active:focus {
	outline: 2px solid rgb(var(--v-theme-primary, 12, 65, 154));
}
</style>
