<script setup lang="ts">
	import { localizedDays } from './utils'
	import useInteractions from './useInteractions'
	import useMonthTransition from './useMonthTransition'
	import useCalendar from './useCalendar'
	import { useLocales } from '@/composables/useLocales'
	import { locales as defaultLocales } from './locales'
	import { ref, computed, useId } from 'vue'
	import type { FeaturedDaysInWeek } from './useCalendar'

	const props = defineProps<{
		selectedDays?: Date[]
		selectedRange?: [Date, Date]
		ariaLabelledby?: string
		selectRange?: boolean
		locales?: typeof defaultLocales
	}>()

	const emits = defineEmits<{
		'click:day': [value: Date]
		'update:selectedRange': [value: [Date, Date]]
	}>()

	const displayedMonth = defineModel<Date | undefined>('displayedMonth')

	const { displayedWeeks, localizedFullMonth } = useCalendar(
		displayedMonth,
		() => props.selectedDays,
		() => props.selectedRange,
	)

	const rootElement = ref<HTMLElement>()

	const locales = useLocales(defaultLocales, () => props.locales)

	const { focusedDay, firstDayOfDisplayedMonth, keyboardInteractions, click, isPreviewed, previewRange } = useInteractions(
		displayedMonth,
		rootElement,
		() => props.selectRange,
		emits,
	)

	const { transitionProps } = useMonthTransition(displayedMonth)

	const rangeAnnouncement = computed(() => {
		if (!props.selectedRange) return ''
		const [start, end] = props.selectedRange
		return locales.value.rangeSelected(start.toLocaleDateString('fr-FR'), end.toLocaleDateString('fr-FR'))
	})

	const getAriaLabelForRange = (day: FeaturedDaysInWeek) => {
		if (!props.selectRange) return undefined
		const dayIndex = day.rawDate.getDay()
		const dayInfo = localizedDays[dayIndex]!
		const dayWithName = {
			...day,
			dayName: dayInfo.long,
		}
		if (day.isStartRange) return locales.value.rangeStartLabel(dayWithName)
		if (day.isEndRange) return locales.value.rangeEndLabel(dayWithName)
		if (day.isInRange) return locales.value.rangeIncludedLabel(dayWithName)
		return undefined
	}

	const getCalendarAriaLabel = () => {
		if (props.ariaLabelledby) return undefined
		return `${locales.value.calendarAriaLabel}, ${localizedFullMonth.value}`
	}

	const instructionsId = `sy-calendar-instructions-${useId()}`

	const calendarInstructions = computed(() => {
		const rangeInstructions = props.selectRange
			? `${locales.value.useSpaceToSelect}, ${locales.value.useShiftArrowsToExtendRange}`
			: locales.value.useSpaceToSelect
		return `${locales.value.useArrowsToNavigate}, ${rangeInstructions}.`
	})

	const getDayTabIndex = (day: FeaturedDaysInWeek) => {
		if (focusedDay.value === day.ISO8601) return 0
		if (props.selectRange && (day.isStartRange || day.isEndRange)) return 0
		return -1
	}

	const getAriaSelected = (day: FeaturedDaysInWeek): boolean | undefined => {
		if (day.isSelected) return true
		if (props.selectRange && (day.isStartRange || day.isEndRange)) return true
		return undefined
	}

</script>
<template>
	<div
		ref="rootElement"
		class="sy-calendar__wrapper"
	>
		<div
			aria-live="polite"
			aria-atomic="true"
			class="d-sr-only"
		>
			{{ rangeAnnouncement }}
		</div>
		<div
			:id="instructionsId"
			class="d-sr-only"
		>
			{{ calendarInstructions }}
		</div>
		<Transition v-bind="transitionProps">
			<table
				:key="firstDayOfDisplayedMonth"
				class="sy-calendar"
				:aria-labelledby="props.ariaLabelledby"
				:aria-label="getCalendarAriaLabel()"
				:aria-describedby="instructionsId"
				role="grid"
			>
				<thead>
					<tr class="sy-calendar__weekdays">
						<th
							v-for="day in localizedDays"
							:key="day.long"
							scope="col"
						>
							<div aria-hidden="true">
								{{ day.short }}
							</div>
							<div class="d-sr-only">
								{{ day.long }}
							</div>
						</th>
					</tr>
				</thead>
				<tbody :data-month="firstDayOfDisplayedMonth.slice(0, 7)">
					<tr
						v-for="(week, weekIndex) in displayedWeeks"
						:key="weekIndex"
						class="sy-calendar__week"
					>
						<td
							v-for="day in week"
							:key="day.ISO8601"
							class="sy-calendar__day"
							:class="[`day-${day.ISO8601}`, {
								'sy-calendar__day--today': day.isToday,
								'sy-calendar__day--selected': day.isSelected,
								'sy-calendar__day--other-month': day.isPreviousMonth || day.isNextMonth,
								'sy-calendar__day--start-range': day.isStartRange,
								'sy-calendar__day--end-range': day.isEndRange,
								'sy-calendar__day--in-range': day.isInRange,
								'sy-calendar__day--weekend': day.isWeekend,
								'sy-calendar__day--preview': isPreviewed(day.ISO8601),
							}]"
							:data-date="day.ISO8601"
							:tabindex="getDayTabIndex(day)"
							:aria-current="day.isToday ? 'date' : undefined"
							:aria-selected="getAriaSelected(day)"
							:aria-label="getAriaLabelForRange(day)"
							role="gridcell"
							v-bind="keyboardInteractions"
							@click="() => click(day.rawDate)"
							@keydown.enter="() => click(day.rawDate)"
							@mouseenter="() => previewRange(day.rawDate)"
							@mouseleave="() => previewRange(null)"
							@focusin="() => previewRange(day.rawDate)"
							@focusout="() => previewRange(null)"
						>
							<slot
								:name="`day-${day.ISO8601}`"
								v-bind="day"
							>
								<div class="sy-calendar__day-content">
									{{ day.day }}
								</div>
							</slot>
						</td>
					</tr>
				</tbody>
			</table>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
// TODO : temporary style

.sy-calendar {
	border: 0;
	border-collapse: collapse;
}

.sy-calendar__day-content {
	margin-block: 1px;
	padding: 0.2rem 0.5rem;
	text-align: center;
	color: rgb(var(--v-theme-blue-darken40));
}

.sy-calendar__day--weekend > div {
	color: rgb(var(--v-theme-blue-lighten20));
}

.sy-calendar__day--today > div {
	background-color: rgb(var(--v-theme-surface-light));
	border-radius: 99px;
	font-weight: bold;
}

.sy-calendar__day--selected > div {
	background-color: rgb(var(--v-theme-primary));
	border-radius: 99px;
	font-weight: bold;
	color: white;
}

.sy-calendar__day--other-month > div {
	opacity: 0.6;
}

.sy-calendar__day--start-range > div {
	border-top-left-radius: 50%;
	border-bottom-left-radius: 50%;
}

.sy-calendar__day--end-range > div {
	border-top-right-radius: 50%;
	border-bottom-right-radius: 50%;
}

.sy-calendar__day--start-range > div,
.sy-calendar__day--end-range > div {
	background-color: rgb(var(--v-theme-primary));
	color: white;
}

// Pending range selection preview
.sy-calendar__day--preview > div {
	background-color: pink;
	color: white;
}

.sy-calendar__day--in-range > div {
	background-color: rgb(var(--v-theme-blue-lighten20));
	color: white;
}

.sy-calendar__day {
	position: relative;
	cursor: pointer;
}

.sy-calendar__day::after {
	content: '';
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	transition: background-color 0.3s linear;
}

.sy-calendar__day:hover::after {
	background-color: rgba(var(--v-theme-primary), 0.1);
	border-radius: 50%;
}

// Month slide transition: the leaving grid is taken out of the flow
// so both grids slide side by side, the wrapper hiding the overflow
.sy-calendar__wrapper {
	overflow: hidden;
	position: relative;
	width: min-content;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
	transition: transform 0.3s linear;
}

.slide-next-leave-active,
.slide-prev-leave-active {
	inset: 0;
	position: absolute;
}

.slide-next-leave-to,
.slide-prev-enter-from {
	transform: translateX(-100%);
}

.slide-next-enter-from,
.slide-prev-leave-to {
	transform: translateX(100%);
}

</style>
