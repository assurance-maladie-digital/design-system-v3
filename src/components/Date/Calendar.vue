<script setup lang="ts">
	import { localizedDays } from './utils'

	import useCalendar from './useCalendar'

	const props = defineProps<{
		selectedDays?: Date[]
		selectedRange?: [Date | undefined, Date | undefined]
		displayedMonth?: Date
		ariaLabelledby?: string
	}>()

	const { displayedWeeks, localizedFullMonth } = useCalendar(
		() => props.displayedMonth,
		() => props.selectedDays,
		() => props.selectedRange,
	)
</script>
<template>
	<table
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
		<tbody>
			<tr
				v-for="(week, weekIndex) in displayedWeeks"
				:key="weekIndex"
				class="sy-calendar__week"
			>
				<td
					v-for="date in week"
					:key="date.ISO8601"
					class="sy-calendar__day"
					:class="`day-${date.ISO8601}`"
					:data-date="date.ISO8601"
				>
					<slot
						:name="`day-${date.ISO8601}`"
						v-bind="date"
					>
						<div
							:class="{
								'sy-calendar__day-content': true,
								'sy-calendar__day-content--today': date.isToday,
								'sy-calendar__day-content--selected': date.isSelected,
								'sy-calendar__day-content--other-month': date.isPreviousMonth || date.isNextMonth,
								'sy-calendar__day-content--start-range': date.isStartRange,
								'sy-calendar__day-content--end-range': date.isEndRange,
								'sy-calendar__day-content--in-range': date.isInRange,
								'sy-calendar__day-content--weekend': date.isWeekend,
							}"
							:aria-current="date.isToday ? 'date' : undefined"
							:aria-selected="date.isSelected"
						>
							{{ date.day }}
						</div>
					</slot>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style lang="scss" scoped>

// TODO : temporary style

.sy-calendar__day > div {
	padding: 0.2rem 0.5rem;
}

.sy-calendar__day-content {
	color: rgb(var(--v-theme-blue-darken40));
}

.sy-calendar__day-content--weekend {
	color: rgb(var(--v-theme-blue-lighten20));
}

.sy-calendar__day-content--today {
	background-color: rgb(var(--v-theme-surface-light));
	border-radius: 50%;
	font-weight: bold;
}

.sy-calendar__day-content--selected {
	background-color: rgb(var(--v-theme-primary));
	border-radius: 50%;
	font-weight: bold;
	color: white
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
.sy-calendar__day-content.sy-calendar__day-content--end-range,
.sy-calendar__day-content--in-range {
	background-color: rgb(var(--v-theme-primary));
	color: white;
}

</style>
