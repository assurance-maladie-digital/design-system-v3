<script setup lang="ts">
	import { computed, inject, nextTick, onUnmounted, ref, useId, useTemplateRef, watch, type ComponentPublicInstance, type ComputedRef } from 'vue'
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

	const getFocusableElements = (root: HTMLElement): HTMLElement[] => Array.from(
		root.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]'),
	).filter((element) => {
		return !element.hasAttribute('disabled')
			&& element.getAttribute('aria-hidden') !== 'true'
			&& element.tabIndex !== -1
	})

	const handleMenuKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Tab' || !menu.value) return

		const focusables = getFocusableElements(menu.value)
		if (focusables.length === 0) return

		const activeElement = document.activeElement as HTMLElement | null
		const firstFocusable = focusables[0]
		const lastFocusable = focusables.at(-1)

		if (!activeElement || !menu.value.contains(activeElement)) {
			event.preventDefault()
			firstFocusable.focus({ preventScroll: true })
			return
		}

		const currentIndex = focusables.indexOf(activeElement)

		if (event.shiftKey) {
			if (currentIndex <= 0) {
				event.preventDefault()
				lastFocusable?.focus({ preventScroll: true })
			}
			return
		}

		if (currentIndex === focusables.length - 1) {
			event.preventDefault()
			firstFocusable.focus({ preventScroll: true })
		}
	}

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
			@keydown="handleMenuKeydown"
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
