<script setup lang="ts">
	import { computed, inject, onUnmounted, ref, useId, watch, type ComponentPublicInstance, type ComputedRef } from 'vue'
	import MonthSelector from '@/components/Common/Calendar/MonthSelector/MonthSelector.vue'
	import YearSelector from '@/components/Common/Calendar/YearSelector/YearSelector.vue'
	import DatePickerLiteHeader from '@/components/DatePickerLite/DatePickerLiteHeader.vue'
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
		}
		else {
			props.toggleBtn!.focus()
		}
		emits('update:open', newValue)
	})

	const selectedDays = computed(() => props.modelValue ? [props.modelValue] : [])

	const headerModelValue = computed<Date | undefined>(() => {
		if (!props.modelValue) return undefined
		return new Date(props.modelValue)
	})

	function previousMonth() {
		const current = displayedMonth.value ?? props.modelValue ?? new Date()
		displayedMonth.value = new Date(current.getFullYear(), current.getMonth() - 1, 1)
	}

	function nextMonth() {
		const current = displayedMonth.value ?? props.modelValue ?? new Date()
		displayedMonth.value = new Date(current.getFullYear(), current.getMonth() + 1, 1)
	}

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
		retain-focus
		:max-width="328"
		:min-width="328"
		:min-height="455"
		disable-initial-focus
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
			<DatePickerLiteHeader
				v-model:view="view"
				:model-value="headerModelValue"
				:displayed-month="displayedMonth ?? (props.modelValue ? new Date(props.modelValue) : new Date())"
				:min-year
				:max-year
				@previous-month="previousMonth"
				@next-month="nextMonth"
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
