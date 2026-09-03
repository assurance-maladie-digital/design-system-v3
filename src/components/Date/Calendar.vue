<script setup lang="ts">
	import { localizedDays } from './utils'
	import useInteractions from './useInteractions'
	import useMonthTransition from './useMonthTransition'
	import useCalendar from './useCalendar'
	import { ref } from 'vue'
	import type { FeaturedDaysInWeek } from './useCalendar'

	const props = defineProps<{
		selectedDays?: Date[]
		selectedRange?: [Date, Date]
		ariaLabelledby?: string
		selectRange?: boolean
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

	const { focusedDay, firstDayOfDisplayedMonth, keyboardInteractions, click, startRange } = useInteractions(
		displayedMonth,
		rootElement,
		() => props.selectRange,
		emits,
	)

	const { transitionProps } = useMonthTransition(displayedMonth)

	const dayHovered = ref<FeaturedDaysInWeek | undefined>()

</script>
<template>
	<div
		ref="rootElement"
		class="sy-calendar__wrapper"
	>
		<Transition v-bind="transitionProps">
			<table
				:key="firstDayOfDisplayedMonth"
				class="sy-calendar"
				:aria-labelledby="props.ariaLabelledby"
				:aria-label="props.ariaLabelledby ? undefined : localizedFullMonth"
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
								'sy-calendar__day--start-selection-range': day.rawDate === startRange?.rawDate,
								'sy-calendar__day--hovered': day.ISO8601 === dayHovered?.ISO8601,
							}]"
							:data-date="day.ISO8601"
							:tabindex="focusedDay === day.ISO8601? 0 : -1"
							:aria-current="day.isToday ? 'date' : undefined"
							:aria-selected="day.isSelected ? 'true' : undefined"
							v-bind="keyboardInteractions"
							@click="() => click(day)"
							@keydown.enter="() => click(day)"
							@mouseenter="() => dayHovered = day"
							@mouseleave="() => dayHovered = undefined"
							@focusin="() => dayHovered = day"
							@focusout="() => dayHovered = undefined"
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

// Either boundary of the pending selection: selectors below are symmetric,
// so the preview also works when hovering a day before the start
$boundary: ':is(.sy-calendar__day--start-selection-range, .sy-calendar__day--hovered)';

// Only preview the range while a selection is actually in progress
.sy-calendar:has(.sy-calendar__day--start-selection-range) {
	#{$boundary} > div,
	// days between the boundaries within the same week
	#{$boundary} ~ td:has(~ #{$boundary}) > div,
	// days after the first boundary, when the second is in a later week
	tr:has(~ tr #{$boundary}) #{$boundary} ~ td > div,
	// full weeks between the two boundary weeks
	tr:has(#{$boundary}) ~ tr:has(~ tr #{$boundary}) td > div,
	// days before the second boundary, when the first is in an earlier week
	tr:has(#{$boundary}) ~ tr td:has(~ #{$boundary}) > div {
		background-color: pink;
		color: white;
	}
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
