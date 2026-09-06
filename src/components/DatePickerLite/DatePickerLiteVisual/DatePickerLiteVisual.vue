<script setup lang="ts">
	import { computed, inject, nextTick, onUnmounted, ref, useId, useTemplateRef, watch, type ComponentPublicInstance, type ComputedRef } from 'vue'
	import MonthSelector from '@/components/Common/Calendar/MonthSelector/MonthSelector.vue'
	import YearSelector from '@/components/Common/Calendar/YearSelector/YearSelector.vue'
	import VisualPickerHeader from '@/components/Common/Calendar/PickerHeader/VisualPickerHeader.vue'
	import VisualPickerFooter from '@/components/Common/Calendar/PickerFooter/VisualPickerFooter.vue'
	import Calendar from '@/components/Common/Calendar/Calendar/Calendar.vue'
	import { calendarLocalesKey, type PickerView } from '@/components/Common/Calendar/locales'
	import { locales as defaultLocales } from '../locales'
	import type { DatePickerLiteVisualProps } from './DatePickerLiteVisualProps'

	const props = defineProps<{
		textInput: ComponentPublicInstance | null
		toggleBtn: HTMLElement | null
		modelValue: Date | undefined
		readonly: boolean
		disabled: boolean
	} & DatePickerLiteVisualProps>()

	const emits = defineEmits<{
		(e: 'update:modelValue', value: Date | undefined): void
		(e: 'update:open', value: boolean): void
	}>()

	// The DatePickerLite root provides its full locales through the shared key
	const locales = inject<ComputedRef<typeof defaultLocales>>(calendarLocalesKey)!

	const view = ref<PickerView>(props.initialView)
	const open = ref(false)
	const displayedMonth = ref<Date | undefined>(undefined)
	const menu = useTemplateRef<HTMLElement>('menu')

	let focusTimeout: ReturnType<typeof setTimeout> | undefined

	watch(
		() => props.modelValue,
		(newValue) => {
			displayedMonth.value = newValue ? new Date(newValue) : new Date()
		},
		{ immediate: true },
	)

	watch(open, (newValue) => {
		if (newValue) {
			view.value = props.initialView
			displayedMonth.value = props.modelValue ? new Date(props.modelValue) : new Date()
			focusInitialDay()
		}
		else {
			props.toggleBtn!.focus()
		}
		emits('update:open', newValue)
	})

	// Unlike the selectors, the Calendar does not self-focus on mount:
	// focus the selected day, or the single tabbable cell of the grid.
	function focusInitialDay() {
		if (props.initialView !== 'days') return
		nextTick(() => {
			const selectedDay = menu.value?.querySelector<HTMLElement>('.sy-calendar__day--selected')
			const tabbableDay = selectedDay ?? menu.value?.querySelector<HTMLElement>('[data-date][tabindex="0"]')
			tabbableDay?.focus()
			// When the menu opens, the transition can cause the focus to be lost,
			// so we ensure it is set after the transition begins (same as the selectors).
			focusTimeout = setTimeout(() => {
				tabbableDay?.focus()
			}, 0)
		})
	}

	const selectedDays = computed(() => props.modelValue ? [props.modelValue] : [])

	const headerTitle = computed(() => {
		if (view.value === 'days') return locales.value.headerSelectDay
		if (view.value === 'months') return locales.value.headerSelectMonth
		return locales.value.headerSelectYear
	})

	// The header consumes a "MM/YYYY" string for its labels and aria logic.
	// It intentionally follows the selected value, not calendar navigation.
	const headerModelValue = computed(() => {
		if (!props.modelValue) return undefined
		return `${String(props.modelValue.getMonth() + 1).padStart(2, '0')}/${props.modelValue.getFullYear()}`
	})

	// In days view, show the full selected date. When no date is selected,
	// VisualPickerHeader falls back to its model-value based default.
	const daysDateLabel = computed(() => {
		const selected = props.modelValue
		return selected
			? new Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(selected)
			: undefined
	})

	function setYear(year: number) {
		const current = displayedMonth.value ?? new Date()
		displayedMonth.value = new Date(year, current.getMonth(), 1)
		view.value = 'months'
	}

	function setMonth(month: number) {
		const current = displayedMonth.value ?? new Date()
		displayedMonth.value = new Date(current.getFullYear(), month - 1, 1)
		view.value = 'days'
	}

	function setDay(value: Date) {
		if (!props.readonly && !props.disabled) {
			emits('update:modelValue', value)
		}
		open.value = false
	}

	// The shared footer emits `string | Date`; DatePickerLite always passes a Date-returning format
	function setDayFromFooter(value: string | Date) {
		if (value instanceof Date) {
			setDay(value)
		}
	}

	function toTodayDate(date: Date): Date {
		return date
	}

	onUnmounted(() => {
		clearTimeout(focusTimeout)
	})

	const id = useId()

</script>
<template>
	<VMenu
		v-model="open"
		:target="(textInput as ComponentPublicInstance)"
		:activator="(toggleBtn as HTMLElement)"
		:close-on-content-click="false"
		:max-width="328"
		:min-width="328"
		:min-height="455"
		disable-initial-focus
		:retain-focus="false"
		:disabled="props.disabled"
		transition="fade-transition"
		:activator-props="{
			'aria-haspopup': 'dialog',
			'disabled': props.disabled ? 'true' : undefined,
		}"
		role="dialog"
		:aria-labelledby="`${id}-title`"
	>
		<div
			ref="menu"
			class="date-picker-lite-menu"
			:class="{ 'date-picker-lite-menu--readonly': props.readonly }"
		>
			<VisualPickerHeader
				:id
				v-model:view="view"
				variant="buttons"
				:title="headerTitle"
				:model-value="headerModelValue"
				:date-label="daysDateLabel"
				:min-year
				:max-year
			/>
			<YearSelector
				v-if="view === 'years'"
				:model-value="displayedMonth?.getFullYear()"
				:min="minYear"
				:max="maxYear"
				:order="yearsOrder"
				@update:model-value="setYear"
			/>
			<MonthSelector
				v-else-if="view === 'months'"
				:model-value="((displayedMonth ?? new Date()).getMonth() + 1)"
				@update:model-value="setMonth"
			/>
			<Calendar
				v-else
				v-model:displayed-month="displayedMonth"
				:selected-days="selectedDays"
				@click:day="setDay"
			/>
			<VisualPickerFooter
				:label="locales.todayBtnLabel"
				:aria-label="locales.todayBtnAriaLabel"
				:format="toTodayDate"
				@update:model-value="setDayFromFooter"
			/>
		</div>
	</VMenu>
</template>
<style scoped lang="scss">
.date-picker-lite-menu {
	overflow-y: auto;
	background-color: white;
	border-radius: var(--radius-md) !important;
	box-shadow:
		0 1px 5px 0 #0000001f,
		0 2px 2px 0 #00000024,
		0 3px 1px -2px #0003;
}
</style>
