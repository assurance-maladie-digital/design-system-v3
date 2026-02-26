<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue'
	import { useYearGrid } from './useYearGrid'

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
		props.modelValue,
	)

	onMounted(() => {
		const selectedYearElement = yearSelector.value!.querySelector<HTMLElement>(`.year-${props.modelValue}`)
		if (selectedYearElement) {
			selectedYearElement.focus()
			return
		}
		const currentYear = new Date().getFullYear()
		if (currentYear >= props.min && currentYear <= props.max) {
			yearSelector.value!.querySelector<HTMLElement>(`.year-${currentYear}`)!.focus()
			return
		}
		yearSelector.value!.querySelector<HTMLElement>(`.year-${props.min}`)!.focus()
	})

</script>

<template>
	<div
		ref="yearSelector"
		class="year-selector"
		role="grid"
		@keydown.left.prevent="selectPreviousYear"
		@keydown.right.prevent="selectNextYear"
		@keydown.up.prevent="selectPreviousRow"
		@keydown.down.prevent="selectNextRow"
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
			@keydown.enter.stop
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
	padding: 16px 16px 12px;
}

.year-selector__year {
	padding: 8px;
	margin: 4px;
	border: 2px solid #fff;
	cursor: pointer;
	text-align: center;
	min-width: 33px;
	border-radius: 99px;
	font-weight: bold;

	&:hover {
		/* stylelint-disable-next-line custom-property-pattern */
		background-color: rgb(var(--v-theme-interactiveHover, 227, 234, 252));
	}
}

.year-selector__year--selected {
	background-color: rgb(var(--v-theme-primary, 12, 65, 154));
	color: white;

	&:hover {
		background-color: rgb(var(--v-theme-primary-darken-1, 31, 85, 146));
	}
}

.year-selector__year--active:focus {
	outline: 2px solid rgb(var(--v-theme-primary, 12, 65, 154));
}
</style>
