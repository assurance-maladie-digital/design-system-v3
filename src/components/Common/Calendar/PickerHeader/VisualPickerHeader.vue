<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiChevronDown } from '@mdi/js'
	import { computed, inject } from 'vue'
	import { calendarLocalesKey, type PickerView } from '../locales'
	import { dateToString } from '../utils'

	const props = withDefaults(defineProps<{
		modelValue: string | undefined
		view: PickerView
		title: string
		minYear: number
		maxYear: number
		id: string
		/** Overrides the big label (e.g. full date in days view); otherwise derived from modelValue */
		dateLabel?: string
		/** Overrides the pill text; otherwise derived from view and modelValue */
		toggleLabel?: string
		/** Overrides the pill aria-label; otherwise derived from locales and modelValue */
		toggleAriaLabel?: string
		/** 'toggle': a single pill cycling through views. 'buttons': separate month and year selector buttons, always visible */
		variant?: 'toggle' | 'buttons'
	}>(), {
		variant: 'toggle',
	})

	const emits = defineEmits<{
		(e: 'update:view', value: PickerView): void
	}>()

	const localeDate = computed(() => {
		const [month, year] = (props.modelValue || '').split('/').map(Number)
		const isYearValid = year && !isNaN(year)
		const isMonthValid = month && !isNaN(month) && month >= 1 && month <= 12
		if (isMonthValid && isYearValid) {
			return dateToString(new Date(year, month - 1))
		}
		else return dateToString(new Date())
	})

	const formatter = Intl.DateTimeFormat(navigator.language, { month: 'long' })

	const locales = inject(calendarLocalesKey)!

	const btnLabel = computed(() => {
		if (props.view === 'months') {
			return props.modelValue ? parseInt(props.modelValue.split('/')[1] || '', 10) : (new Date().getFullYear())
		}
		else {
			const month = props.modelValue ? parseInt(props.modelValue.split('/')[0] || '', 10) : (new Date().getMonth() + 1)
			return formatter.format(new Date(2000, month - 1))
		}
	})

	const btnAriaLabel = computed(() => {
		const labels = locales.value
		if (props.view === 'months') {
			const selectedYear = props.modelValue ? parseInt(props.modelValue.split('/')[1] || '', 10) : undefined
			if (selectedYear && !isNaN(selectedYear) && selectedYear >= props.minYear && selectedYear <= props.maxYear) {
				return labels.yearBtnLabelSelected(String(selectedYear))
			}
			else {
				return labels.yearBtnLabelUnselected(String(new Date().getFullYear()))
			}
		}
		else {
			const selectedMonth = props.modelValue ? parseInt(props.modelValue.split('/')[0] || '', 10) : undefined
			if (selectedMonth && !isNaN(selectedMonth)) {
				const monthName = formatter.format(new Date(2000, selectedMonth - 1))
				return labels.monthBtnLabelSelected(monthName)
			}
			else {
				const currentMonthName = formatter.format(new Date())
				return labels.monthBtnLabelUnselected(currentMonthName)
			}
		}
	})

	// Next view when the pill is clicked: days → months, months → years, years → months
	const nextView = computed<PickerView>(() => props.view === 'days' ? 'months' : props.view === 'months' ? 'years' : 'months')

	const parsedMonth = computed(() => props.modelValue ? parseInt(props.modelValue.split('/')[0] || '', 10) : undefined)
	const parsedYear = computed(() => props.modelValue ? parseInt(props.modelValue.split('/')[1] || '', 10) : undefined)

	const monthLabel = computed(() => formatter.format(new Date(2000, (parsedMonth.value ?? new Date().getMonth() + 1) - 1)))
	const yearLabel = computed(() => parsedYear.value ?? new Date().getFullYear())

	const monthBtnAriaLabel = computed(() => {
		const month = parsedMonth.value
		if (month && !isNaN(month)) {
			return locales.value.monthBtnLabelSelected(formatter.format(new Date(2000, month - 1)))
		}
		return locales.value.monthBtnLabelUnselected(formatter.format(new Date()))
	})

	const yearBtnAriaLabel = computed(() => {
		const year = parsedYear.value
		if (year && !isNaN(year) && year >= props.minYear && year <= props.maxYear) {
			return locales.value.yearBtnLabelSelected(String(year))
		}
		return locales.value.yearBtnLabelUnselected(String(new Date().getFullYear()))
	})

</script>

<template>
	<div class="visual-picker-header">
		<div
			:id="`${props.id}-title`"
			class="visual-picker-header__title"
		>
			{{ title }}
		</div>
		<div class="visual-picker-header__date">
			{{ props.dateLabel ?? localeDate }}
		</div>
	</div>
	<div
		class="visual-picker-subheader"
	>
		<template v-if="props.variant === 'buttons'">
			<button
				type="button"
				class="visual-picker-month-btn"
				:title="monthBtnAriaLabel"
				:aria-label="monthBtnAriaLabel"
				@click="emits('update:view', 'months')"
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
				@click="emits('update:view', 'years')"
			>
				{{ yearLabel }}
				<SyIcon
					:icon="mdiChevronDown"
					decorative
				/>
			</button>
		</template>
		<button
			v-else
			type="button"
			class="visual-picker-year-btn"
			:title="props.toggleAriaLabel ?? btnAriaLabel"
			:aria-label="props.toggleAriaLabel ?? btnAriaLabel"
			@click="emits('update:view', nextView)"
		>
			{{ props.toggleLabel ?? btnLabel }}
			<SyIcon
				:icon="mdiChevronDown"
				decorative
			/>
		</button>
	</div>
</template>

<style scoped lang="scss">
.visual-picker-header {
	padding-block: 16px;
	background-color: rgb(var(--v-theme-primary, '12, 65, 154'));
	color: rgb(var(--v-theme-on-primary));
}

.visual-picker-header__title {
	padding-inline: 24px 12px;
	padding-bottom: 16px;
	font-size: var(--v-typography-caption-font-size, 0.875rem);
	font-weight: 400;
	letter-spacing: 0.125rem;
	line-height: 150%;
}

.visual-picker-header__date {
	font-size: var(--v-typography-h3-font-size, 1.5rem);
	font-weight: var(--v-typography-h3-font-weight, 700);
	line-height: var(--v-typography-h3-line-height, 130%);
	letter-spacing: var(--v-typography-h3-letter-spacing, 0%);
	text-transform: capitalize;
	margin-left: 20px;
}

.visual-picker-subheader {
	height: 56px;
	padding: 4px;
	display: flex;
	justify-content: center;
	gap: 8px;
}

.visual-picker-month-btn,
.visual-picker-year-btn {
	display: flex;
	gap: 4px;
	margin: auto;
	padding: 0.2rem 0.5rem;
	border-radius: 99px;
	font-size: var(--v-typography-body1-font-size, 1.125rem);
	font-weight: bold;
	cursor: pointer;

	&:focus-visible {
		/* stylelint-disable-next-line custom-property-pattern */
		outline: 2px solid rgb(var(--v-theme-primary, 12, 65, 154));
	}
}
</style>
