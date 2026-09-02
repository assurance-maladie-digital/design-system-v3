<script setup lang="ts">
	import { localizedDays } from './utils'
	import useKeyboardInteractions from './useInteractions'
	import useMonthTransition from './useMonthTransition'
	import useCalendar from './useCalendar'
	import { ref } from 'vue'
	import type { FeaturedDaysInWeek } from './useCalendar'

	const props = defineProps<{
		selectedDays?: Date[]
		selectedRange?: [Date | undefined, Date | undefined]
		ariaLabelledby?: string
	}>()

	const emits = defineEmits<{
		'click:day': [value: Date]
	}>()

	const displayedMonth = defineModel<Date | undefined>('displayedMonth')

	const { displayedWeeks, localizedFullMonth } = useCalendar(
		displayedMonth,
		() => props.selectedDays,
		() => props.selectedRange,
	)

	const rootElement = ref<HTMLElement>()

	// handle select
	function select(day: FeaturedDaysInWeek) {
		focusDay(day.rawDate)
		emits('click:day', day.rawDate)
	}

	const { focusedDay, focusDay, firstDayOfDisplayedMonth, nextDay, previousDay, nextWeek, previousWeek } = useKeyboardInteractions(
		displayedMonth,
		rootElement,
	)

	const { transitionProps } = useMonthTransition(displayedMonth)

</script>
<template>
	<div
		ref="rootElement"
		class="sy-calendar__wrapper"
	>
		<Transition v-bind="transitionProps">
			<!-- eslint-disable-next-line vue/require-toggle-inside-transition -- keyed swap on month change -->
			<table
				:key="firstDayOfDisplayedMonth"
				class="sy-calendar"
				:aria-labelledby="props.ariaLabelledby"
				:aria-label="props.ariaLabelledby ? undefined : localizedFullMonth"
			>
				<thead>
					<tr class="sy-calendar__weekdays">
						<th
							v-for="day in localizedDays"
							:key="day.long"
							:abbr="day.long"
							scope="col"
						>
							{{ day.short }}
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
							:class="`day-${day.ISO8601}`"
							:data-date="day.ISO8601"
							:tabindex="focusedDay === day.ISO8601? 0 : -1"
							@keydown.arrow-right.prevent="nextDay"
							@keydown.arrow-left.prevent="previousDay"
							@keydown.arrow-down.prevent="nextWeek"
							@keydown.arrow-up.prevent="previousWeek"
							@click="select(day)"
							@space="select(day)"
						>
							<slot
								:name="`day-${day.ISO8601}`"
								v-bind="day"
							>
								<div
									:class="{
										'sy-calendar__day-content': true,
										'sy-calendar__day-content--today': day.isToday,
										'sy-calendar__day-content--selected': day.isSelected,
										'sy-calendar__day-content--other-month': day.isPreviousMonth || day.isNextMonth,
										'sy-calendar__day-content--start-range': day.isStartRange,
										'sy-calendar__day-content--end-range': day.isEndRange,
										'sy-calendar__day-content--in-range': day.isInRange,
										'sy-calendar__day-content--weekend': day.isWeekend,
									}"
									:aria-current="day.isToday ? 'date' : undefined"
									:aria-selected="day.isSelected"
								>
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

.sy-calendar__day-content--weekend {
	color: rgb(var(--v-theme-blue-lighten20));
}

.sy-calendar__day-content--today {
	background-color: rgb(var(--v-theme-surface-light));
	border-radius: 99px;
	font-weight: bold;
}

.sy-calendar__day-content--selected {
	background-color: rgb(var(--v-theme-primary));
	border-radius: 99px;
	font-weight: bold;
	color: white;
}

.sy-calendar__day-content--other-month {
	opacity: 0.6;
}

.sy-calendar__day-content--start-range {
	border-top-left-radius: 50%;
	border-bottom-left-radius: 50%;
}

.sy-calendar__day-content--end-range {
	border-top-right-radius: 50%;
	border-bottom-right-radius: 50%;
}

.sy-calendar__day-content.sy-calendar__day-content--start-range,
.sy-calendar__day-content.sy-calendar__day-content--end-range {
	background-color: rgb(var(--v-theme-primary));
	color: white;
}

.sy-calendar__day-content--in-range {
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
