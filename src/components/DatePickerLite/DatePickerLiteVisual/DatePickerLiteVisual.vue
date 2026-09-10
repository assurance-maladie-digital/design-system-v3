<script setup lang="ts">
	import { mdiClose } from '@mdi/js'
	import { computed, inject, ref, useId, watch, type ComponentPublicInstance, type ComputedRef } from 'vue'
	import MonthSelector from '@/components/Common/Calendar/MonthSelector/MonthSelector.vue'
	import YearSelector from '@/components/Common/Calendar/YearSelector/YearSelector.vue'
	import DatePickerLiteHeader from '@/components/DatePickerLite/DatePickerLiteHeader.vue'
	import VisualPickerFooter from '@/components/Common/Calendar/PickerFooter/VisualPickerFooter.vue'
	import Calendar from '@/components/Common/Calendar/Calendar/Calendar.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { calendarLocalesKey, type PickerView } from '@/components/Common/Calendar/locales'
	import { locales as defaultLocales } from '../locales'
	import type { DatePickerLiteVisualProps } from './DatePickerLiteVisualProps'

	const props = defineProps<{
		/** used to position the menu */
		textInput: ComponentPublicInstance | HTMLElement | null
		/** used to reset the focus on closed */
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
			props.toggleBtn?.focus()
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

	const id = useId()
</script>

<template>
	<VMenu
		v-model="open"
		:target="(textInput as ComponentPublicInstance | HTMLElement)"
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
			:class="{
				'date-picker-lite-menu--readonly': props.readonly,
			}"
		>
			<div class="date-picker-lite-menu__content">
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
			<div class="date-picker-lite-menu__close-action">
				<button
					ref="closeButton"
					type="button"
					class="date-picker-lite-menu__close-btn"
					:data-close-picker="true"
					:aria-label="locales.closeBtnAriaLabel"
					:title="locales.closeBtnAriaLabel"
					@click="open = false"
				>
					<SyIcon
						:icon="mdiClose"
						size="x-small"
						decorative
					/>
					{{ locales.closeBtnLabel }}
				</button>
			</div>
		</div>
	</VMenu>
</template>

<style scoped lang="scss">
$close-action-join-radius: 4px;
$close-action-padding-block: 6px;

.date-picker-lite-menu {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	overflow: visible;

	&__content {
		overflow-y: auto;
		background-color: white;
		border-radius: var(--radius-md) !important;
		box-shadow:
			0 1px 5px 0 #0000001f,
			0 2px 2px 0 #00000024,
			0 3px 1px -2px #0003;
	}

	&__close-action {
		position: relative;
		align-self: flex-end;
		display: flex;
		padding: calc($close-action-padding-block / 2) 12px $close-action-padding-block;
		border-radius: 0 0 var(--radius-md) var(--radius-md);
		background-color: white;
		box-shadow:
			0 1px 5px 0 #0000001f,
			0 2px 2px 0 #00000024,
			0 3px 1px -2px #0003;
		clip-path: inset(0 -8px -8px -8px);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s ease;

		&::before {
			position: absolute;
			top: 0;
			left: -$close-action-join-radius;
			width: $close-action-join-radius;
			height: $close-action-join-radius;
			background:
				radial-gradient(
					circle at bottom left,
					transparent calc($close-action-join-radius - 0.5px),
					white calc($close-action-join-radius + 0.5px)
				);
			content: '';
		}
	}

	&:has(.date-picker-lite-menu__close-btn:focus-visible),
	&--close-button-visible {
		.date-picker-lite-menu__content {
			border-bottom-right-radius: 0 !important;
		}

		.date-picker-lite-menu__close-action {
			opacity: 1;
			pointer-events: auto;
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.date-picker-lite-menu__close-action {
		transition: none;
	}
}

.date-picker-lite-menu__close-btn {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 4px 10px;
	border: 0;
	border-radius: 999px;
	background-color: white;
	color: rgb(var(--v-theme-primary, 12, 65, 154));
	font-weight: 600;
	cursor: pointer;
	text-align: center;

	&:focus-visible {
		outline: none;
		box-shadow:
			inset 0 0 0 2px rgb(var(--v-theme-surface, 255, 255, 255)),
			0 0 0 2px rgb(var(--v-theme-primary, 12, 65, 154));
	}
}

</style>
