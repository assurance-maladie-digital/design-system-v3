<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiChevronDown } from '@mdi/js'
	import { computed, inject, type ComputedRef } from 'vue'
	import { locales as defaultLocales, localesKey } from '../locales'
	import { dateToString } from './utils'

	const props = defineProps<{
		modelValue: string | undefined
		view: 'months' | 'years'
		title: string
		minYear: number
		maxYear: number
	}>()

	const emits = defineEmits<{
		(e: 'update:view', value: 'months' | 'years'): void
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

	const locales = inject<ComputedRef<typeof defaultLocales>>(localesKey)!

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
			if (selectedYear && !isNaN(selectedYear)) {
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

</script>

<template>
	<div class="visual-picker-header">
		<div class="visual-picker-header__title">
			{{ title }}
		</div>
		<div class="visual-picker-header__date">
			{{ localeDate }}
		</div>
	</div>
	<div
		class="visual-picker-subheader"
	>
		<button
			type="button"
			class="visual-picker-year-btn"
			:title="btnAriaLabel"
			:aria-label="btnAriaLabel"
			@click="emits('update:view', props.view === 'months' ? 'years' : 'months')"
		>
			{{ btnLabel }}
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
	color: #fff;
}

.visual-picker-header__title {
	padding-inline: 24px 12px;
	padding-bottom: 16px;
	text-transform: uppercase;
	font-size: 0.75rem;
	font-weight: 400;
	letter-spacing: 0.1667em;
}

.visual-picker-header__date {
	font-size: var(--v-typography-h3-font-size);
	font-weight: var(--v-typography-h3-font-weight);
	line-height: var(--v-typography-h3-line-height);
	letter-spacing: var(--v-typography-h3-letter-spacing);
	text-transform: capitalize;
	margin-left: 20px;
}

.visual-picker-subheader {
	padding-top: 16px;
}

.visual-picker-year-btn {
	display: flex;
	gap: 4px;
	margin: auto;
	font-size: 1rem;
	font-weight: bold;
	color: rgb(var(--v-theme-primary, 12, 65, 154));
	cursor: pointer;
}
</style>
