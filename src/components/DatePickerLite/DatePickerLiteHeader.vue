<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiChevronDown, mdiChevronLeft, mdiChevronRight } from '@mdi/js'
	import { computed, inject } from 'vue'
	import { calendarLocalesKey, type PickerView } from '@/components/Common/Calendar/locales'

	const props = withDefaults(defineProps<{
		modelValue?: Date
		/** Month currently displayed by the calendar; always provided by the parent */
		displayedMonth: Date
		view: PickerView
		minYear: number
		maxYear: number
	}>(), {
		modelValue: () => new Date(),
	})

	const emits = defineEmits<{
		(e: 'update:view', value: PickerView): void
		(e: 'previousMonth'): void
		(e: 'nextMonth'): void
	}>()

	const formatter = Intl.DateTimeFormat(navigator.language, { month: 'short' })
	const formatShortMonth = (date: Date): string => {
		const value = formatter.format(date)
		return value.length >= 4 ? value.slice(0, 4) : value.padEnd(4, '.')
	}
	const fullDateFormatter = Intl.DateTimeFormat(navigator.language, {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
	const locales = inject(calendarLocalesKey)!

	const localeDate = computed(() => {
		if (!(props.modelValue instanceof Date) || Number.isNaN(props.modelValue.getTime())) {
			return fullDateFormatter.format(new Date())
		}
		return fullDateFormatter.format(props.modelValue)
	})

	const parsedMonth = computed(() => props.displayedMonth.getMonth() + 1)
	const parsedYear = computed(() => props.displayedMonth.getFullYear())

	const monthLabel = computed(() => formatShortMonth(new Date(2000, parsedMonth.value - 1)))
	const yearLabel = computed(() => parsedYear.value)

	const monthBtnAriaLabel = computed(() => locales.value.monthBtnLabelSelected(monthLabel.value))

	const yearBtnAriaLabel = computed(() => {
		const year = parsedYear.value
		return year >= props.minYear && year <= props.maxYear
			? locales.value.yearBtnLabelSelected(String(year))
			: locales.value.yearBtnLabelUnselected(String(new Date().getFullYear()))
	})

</script>

<template>
	<div class="date-picker-lite-header">
		<div class="date-picker-lite-header__legend">
			{{ locales.headerSelectDay }}
		</div>
		<div
			class="date-picker-lite-header__label visual-picker-header__date"
			:aria-label="localeDate"
		>
			{{ localeDate }}
		</div>
		<div class="date-picker-lite-header__controls">
			<div class="date-picker-lite-header__selector">
				<button
					type="button"
					class="visual-picker-month-btn"
					:title="monthBtnAriaLabel"
					:aria-label="monthBtnAriaLabel"
					:aria-pressed="view === 'months' ? 'true' : 'false'"
					@click="emits('update:view', view === 'months' ? 'days' : 'months')"
				>
					{{ monthLabel }}
					<SyIcon
						:icon="mdiChevronDown"
						decorative
					/>
				</button>
				<button
					type="button"
					class="visual-picker-year-btn"
					:title="yearBtnAriaLabel"
					:aria-label="yearBtnAriaLabel"
					:aria-pressed="view === 'years' ? 'true' : 'false'"
					@click="emits('update:view', view === 'years' ? 'days' : 'years')"
				>
					{{ yearLabel }}
					<SyIcon
						:icon="mdiChevronDown"
						decorative
					/>
				</button>
			</div>
			<div class="date-picker-lite-header__nav-group">
				<button
					type="button"
					class="date-picker-lite-header__nav date-picker-lite-header__nav--prev"
					:disabled="view !== 'days'"
					:aria-label="locales.previousMonthBtnLabel"
					:title="locales.previousMonthBtnLabel"
					@click="view === 'days' && emits('previousMonth')"
				>
					<SyIcon
						:icon="mdiChevronLeft"
						decorative
					/>
				</button>
				<button
					type="button"
					class="date-picker-lite-header__nav date-picker-lite-header__nav--next"
					:disabled="view !== 'days'"
					:aria-label="locales.nextMonthBtnLabel"
					:title="locales.nextMonthBtnLabel"
					@click="view === 'days' && emits('nextMonth')"
				>
					<SyIcon
						:icon="mdiChevronRight"
						decorative
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.date-picker-lite-header {
	background-color: rgb(var(--v-theme-primary, 12, 65, 154));
	color: rgb(var(--v-theme-on-primary, 255, 255, 255));
}

.date-picker-lite-header__legend {
	text-transform: uppercase;
	font-size: 0.75rem;
	padding-inline: 24px 12px;
	padding-top: 16px;
	padding-bottom: 16px;
	font-weight: 400;
	letter-spacing: 0.1667em;
}

.date-picker-lite-header__controls {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	width: 100%;
	height: 56px;
	padding: 4px 12px;
	background-color: rgb(var(--v-theme-surface, 255, 255, 255));
	color: rgb(var(--v-theme-primary, 12, 65, 154));
}

.date-picker-lite-header__selector,
.date-picker-lite-header__nav-group {
	display: flex;
	align-items: center;
	gap: 8px;
}

.date-picker-lite-header__selector {
	justify-content: flex-start;
	flex: 1;
	min-width: 0;
}

.date-picker-lite-header__nav-group {
	margin-left: auto;
}

.date-picker-lite-header__label {
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	padding-left: 20px;
	margin-bottom: 1rem;
	font-size: var(--v-typography-h3-font-size, 1.5rem);
	font-weight: var(--v-typography-h3-font-weight, 700);
	line-height: var(--v-typography-h3-line-height, 130%);
	letter-spacing: var(--v-typography-h3-letter-spacing, 0%);
	text-transform: capitalize;
	cursor: default;
}

.date-picker-lite-header__nav {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 999px;
	color: rgb(var(--v-theme-primary, 12, 65, 154));
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: rgba(var(--v-theme-primary, 12, 65, 154), 0.08);
	}

	&:disabled {
		cursor: default;
		opacity: 0.45;
		background-color: transparent;
	}

	&:focus-visible {
		outline: none;
		box-shadow:
			inset 0 0 0 2px rgb(var(--v-theme-surface, 255, 255, 255)),
			0 0 0 2px rgb(var(--v-theme-primary, 12, 65, 154));
	}
}

.visual-picker-month-btn,
.visual-picker-year-btn {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 8px 12px;
	border: 0;
	border-radius: 999px;
	background: transparent;
	color: rgb(var(--v-theme-primary, 12, 65, 154));
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s ease, opacity 0.2s ease;

	&:hover {
		background-color: rgba(var(--v-theme-primary, 12, 65, 154), 0.08);
	}

	&[aria-pressed='true'] {
		background-color: rgba(var(--v-theme-primary, 12, 65, 154), 0.08);
		border-color: transparent;
	}

	&:focus-visible {
		outline: none;
		box-shadow:
			inset 0 0 0 2px rgb(var(--v-theme-surface, 255, 255, 255)),
			0 0 0 2px rgb(var(--v-theme-primary, 12, 65, 154));
	}
}
</style>
