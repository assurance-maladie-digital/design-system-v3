<script setup lang="ts">
	import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
	import { useYearGrid } from './useYearGrid'
	import { localesKey, type locales as defaultLocales } from '../locales'

	const props = defineProps<{
		min: number
		max: number
		order: 'asc' | 'desc'
		modelValue?: number
	}>()

	const yearSelector = ref<HTMLElement | null>(null)

	const emits = defineEmits<{
		(event: 'update:modelValue', value: number): void
	}>()

	function getFocusedYear() {
		if (props.modelValue && props.modelValue >= props.min && props.modelValue <= props.max) {
			return props.modelValue
		}
		const currentYear = new Date().getFullYear()
		if (currentYear >= props.min && currentYear <= props.max) {
			return currentYear
		}
		else {
			return props.order === 'asc' ? props.min : props.max
		}
	}

	const {
		activeYear,
		selectNextYear,
		selectPreviousYear,
		selectNextRow,
		selectPreviousRow,
	} = useYearGrid(
		yearSelector,
		computed(() => props.min),
		computed(() => props.max),
		getFocusedYear(),
	)

	let focusTimeout: ReturnType<typeof setTimeout> | undefined

	onMounted(() => {
		const selectedYearElement = yearSelector.value!.querySelector<HTMLElement>(`.year-${getFocusedYear()}`)
		selectedYearElement!.focus()

		// When the menu opens, the transition can cause the focus to be lost, so we ensure it is set after the transition begins.
		focusTimeout = setTimeout(() => {
			selectedYearElement!.focus()
		}, 0)
	})

	watch(() => props.order, () => {
		const selectedYearElement = yearSelector.value!.querySelector<HTMLElement>(`.year-${getFocusedYear()}`)
		selectedYearElement!.focus()
	})

	onUnmounted(() => {
		clearTimeout(focusTimeout)
	})

	const locales = inject<typeof defaultLocales>(localesKey)!

</script>

<template>
	<div
		ref="yearSelector"
		class="year-selector"
		role="group"
		:aria-label="locales.yearSelectorLabel"
	>
		<button
			v-for="year of Array.from({ length: props.max - props.min + 1 }, (_, i) => props.order === 'asc' ? props.min + i : props.max - i)"
			:key="year"
			:tabindex="year === activeYear ? 0 : -1"
			class="year-selector__year"
			:class="[`year-${year}`, {
				'year-selector__year--active': year === activeYear,
				'year-selector__year--selected': year === props.modelValue,
			}]"
			:aria-pressed="year === props.modelValue"
			@click="() => emits('update:modelValue', year)"
			@keydown.left.prevent="props.order === 'asc' ? selectPreviousYear() : selectNextYear()"
			@keydown.right.prevent="props.order === 'asc' ? selectNextYear() : selectPreviousYear()"
			@keydown.up.prevent="props.order === 'asc' ? selectPreviousRow() : selectNextRow()"
			@keydown.down.prevent="props.order === 'asc' ? selectNextRow() : selectPreviousRow()"
			@keydown.enter.stop
			@keydown.space.stop
		>
			{{ year }}
		</button>
	</div>
</template>

<style lang="scss" scoped>
.year-selector {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	max-height: 288px;
	grid-gap: 0 24px;
	padding-inline: 32px;
	overflow: auto;
}

.year-selector__year {
	height: 40px;
	margin-block: 2px;
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

.year-selector__year--selected {
	/* stylelint-disable-next-line custom-property-pattern */
	background-color: rgb(var(--v-theme-accentPrimary, 12, 65, 154));
	color: white;

	&:hover {
		/* stylelint-disable-next-line custom-property-pattern */
		background-color: rgb(var(--v-theme-primaryVariant, 7, 39, 92));
	}
}

.year-selector__year--active:focus {
	/* stylelint-disable-next-line custom-property-pattern */
	outline: 2px solid rgb(var(--v-theme-accentPrimary, 12, 65, 154));
}
</style>
