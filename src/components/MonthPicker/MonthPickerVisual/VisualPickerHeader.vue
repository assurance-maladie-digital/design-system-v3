<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiChevronDown } from '@mdi/js'
	import { computed, inject } from 'vue'
	import { locales as defaultLocales, localesKey } from '../locales'

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
		if (!props.modelValue) return new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
		const [month, year] = props.modelValue.split('/').map(Number)
		let displayYear: string
		let displayMonth: string
		if (year && !isNaN(year) && year >= props.minYear && year <= props.maxYear) {
			displayYear = String(year)
		}
		else {
			displayYear = (new Date().getFullYear()).toString()
		}
		if (month && !isNaN(month) && month >= 1 && month <= 12) {
			displayMonth = new Date(0, month - 1).toLocaleString('default', { month: 'long' })
		}
		else {
			displayMonth = new Date().toLocaleString('default', { month: 'long' })
		}
		return `${displayMonth} ${displayYear}`
	})

	const selectedYear = computed(() => {
		if (!props.modelValue) return (new Date().getFullYear())
		return Number(props.modelValue.split('/')[1])
	})

	const locales = inject<typeof defaultLocales>(localesKey)!

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
			:aria-label="locales.yearBtnLabel((new Date()).getFullYear())"
			@click="emits('update:view', props.view === 'months' ? 'years' : 'months')"
		>
			{{ selectedYear }}
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
