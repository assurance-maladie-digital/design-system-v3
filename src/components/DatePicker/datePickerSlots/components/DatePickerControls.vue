<script setup lang="ts">
	import { computed } from 'vue'
	import { VBtn, VIcon, VSpacer } from 'vuetify/components'
	import { mdiChevronDown, mdiChevronLeft, mdiChevronRight } from '@mdi/js'
	import { expandMonthAccessibleName } from '@/composables/date/useDatePickerAccessibility'
	import { locales } from '../../locales'

	interface DatePickerControlsSlotProps {
		viewMode: 'month' | 'months' | 'year'
		monthYearText: string
		monthText: string
		yearText: string
		disabled: string[]
		openMonths: () => void
		openYears: () => void
		prevMonth: () => void
		nextMonth: () => void
		prevYear: () => void
		nextYear: () => void
	}

	const props = defineProps<{
		slotProps: DatePickerControlsSlotProps
		displayedMonth: number | null
		displayedYear: number | null
	}>()

	const monthLabel = computed(() => {
		if (props.displayedMonth !== null && props.displayedMonth >= 0 && props.displayedMonth < 12) {
			return locales.monthNamesShort[props.displayedMonth]
		}
		return props.slotProps.monthText || ''
	})

	const fullMonthName = computed(() => {
		if (props.displayedMonth !== null && props.displayedMonth >= 0 && props.displayedMonth < 12) {
			return locales.monthNames[props.displayedMonth]
		}
		return ''
	})

	const yearLabel = computed(() => {
		if (props.displayedYear !== null) {
			return String(props.displayedYear)
		}
		return props.slotProps.yearText || ''
	})

	const monthAriaLabel = computed(() => {
		const full = fullMonthName.value || expandMonthAccessibleName(monthLabel.value)
		return `${locales.selectMonth(full)} (${full} / ${monthLabel.value} ${locales.selectedByDefault})`
	})

	const yearAriaLabel = computed(() => {
		return `${locales.selectYear(yearLabel.value)}`
	})

	const isMonthDisabled = computed(() => props.slotProps.disabled.includes('text'))
	const isYearDisabled = computed(() => props.slotProps.disabled.includes('mode'))
	const isPrevMonthDisabled = computed(() => props.slotProps.disabled.includes('prev-month'))
	const isNextMonthDisabled = computed(() => props.slotProps.disabled.includes('next-month'))
</script>

<template>
	<div class="v-date-picker-controls v-date-picker-controls--variant-modal sy-date-picker-controls">
		<div class="sy-date-picker-controls__month-year">
			<VBtn
				class="sy-date-picker-controls__month-btn"
				variant="text"
				density="comfortable"
				:disabled="isMonthDisabled"
				:aria-label="monthAriaLabel"
				:title="monthAriaLabel"
				:ripple="false"
				@click="slotProps.openMonths()"
			>
				{{ monthLabel }}
				<VIcon
					:icon="mdiChevronDown"
					size="18"
					class="ms-1"
					aria-hidden="true"
				/>
			</VBtn>
			<VBtn
				class="sy-date-picker-controls__year-btn"
				variant="text"
				density="comfortable"
				:disabled="isYearDisabled"
				:aria-label="yearAriaLabel"
				:title="yearAriaLabel"
				:ripple="false"
				@click="slotProps.openYears()"
			>
				{{ yearLabel }}
				<VIcon
					:icon="mdiChevronDown"
					size="18"
					class="ms-1"
					aria-hidden="true"
				/>
			</VBtn>
		</div>
		<VSpacer />
		<div class="v-date-picker-controls__month">
			<VBtn
				data-testid="prev-month"
				:icon="mdiChevronLeft"
				:disabled="isPrevMonthDisabled"
				:aria-label="locales.previousMonth"
				density="comfortable"
				variant="text"
				@click="slotProps.prevMonth()"
			/>
			<VBtn
				data-testid="next-month"
				:icon="mdiChevronRight"
				:disabled="isNextMonthDisabled"
				:aria-label="locales.nextMonth"
				density="comfortable"
				variant="text"
				@click="slotProps.nextMonth()"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.sy-date-picker-controls {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.sy-date-picker-controls__month-year {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.sy-date-picker-controls__month-btn,
	.sy-date-picker-controls__year-btn {
		color: rgb(var(--v-theme-primary));
		text-transform: none;
		font-weight: 500;

		:deep(.v-btn__content) {
			color: rgb(var(--v-theme-primary));
			font-size: var(--v-fontSize-corpsDeTexte);
		}
	}
</style>
