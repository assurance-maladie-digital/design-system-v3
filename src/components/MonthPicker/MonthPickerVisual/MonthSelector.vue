<script setup lang="ts">
	import { onMounted, onUnmounted, useTemplateRef, inject } from 'vue'
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

	let focusTimeout: ReturnType<typeof setTimeout> | undefined

	onMounted(() => {
		const selectedMonthElement = monthSelector.value!.querySelector<HTMLElement>(`.month-${initialFocusedMonth}`)
		selectedMonthElement!.focus()

		// When the menu opens, the transition can cause the focus to be lost, so we ensure it is set after the transition begins.
		focusTimeout = setTimeout(() => {
			selectedMonthElement!.focus()
		}, 0)
	})

	onUnmounted(() => {
		clearTimeout(focusTimeout)
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
	height: 288px;
	width: 100%;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: center;
	grid-gap: 0 24px;
	padding-inline: 32px;
}

.month-selector__month {
	height: 40px;
	padding-inline: 16px;
	border: 2px solid #fff;
	cursor: pointer;
	text-align: center;
	min-width: 33px;
	font-size: var(--v-typography-body2-font-size, 1rem);
	border-radius: 99px;
	font-weight: bold;

	&:hover {
		/* stylelint-disable-next-line custom-property-pattern */
		background-color: rgb(var(--v-theme-interactiveHover, 227, 234, 252));
	}
}

.month-selector__month--selected {
	/* stylelint-disable-next-line custom-property-pattern */
  background-color: rgb(var(--v-theme-colorPrimary, 12, 65, 154));
	color: white;

	&:hover {
		/* stylelint-disable-next-line custom-property-pattern */
    background-color: rgb(var(--v-theme-colorPrimaryVariant, 7, 39, 92));
	}
}

.month-selector__month--active:focus {
	/* stylelint-disable-next-line custom-property-pattern */
  outline: 2px solid rgb(var(--v-theme-colorPrimary, 12, 65, 154));
}
</style>
