<script setup lang="ts">
	import useInteractions from './useInteractions'
	import useMonthTransition from './useMonthTransition'
	import useCalendar from './useCalendar'
	import useSelectedRange from './useSelectedRange'
	import { useLocales } from '@/composables/useLocales'
	import { locales as defaultLocales } from './locales'
	import { ref, useId } from 'vue'

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

	const rootElement = ref<HTMLElement>()

	const locales = useLocales(defaultLocales, () => props.locales)
	const locale = (): string => typeof navigator === 'undefined'
		? locales.value.fallbackLocale
		: navigator.language ?? locales.value.fallbackLocale

	const {
		focusedDay,
		firstDayOfDisplayedMonth,
		keyboardInteractions,
		click,
		previewRange,
		previewedRange,
	} = useInteractions(
		displayedMonth,
		rootElement,
		() => props.selectRange,
		emits,
	)

	const {
		committedRange,
		rangeAnnouncement,
		getAriaLabelForRange,
	} = useSelectedRange(
		() => props.selectRange,
		() => props.selectedRange,
		locales,
		locale,
	)

	const { displayedWeeks, localizedDays, localizedFullMonth } = useCalendar(
		displayedMonth,
		() => props.selectedDays,
		committedRange,
		previewedRange,
		locale,
	)

	const { transitionProps } = useMonthTransition(displayedMonth)

	const instructionsId = `sy-calendar-instructions-${useId()}`

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
			{{ locales.calendarInstructions }}
		</div>
		<Transition v-bind="transitionProps">
			<div
				:key="firstDayOfDisplayedMonth"
				class="sy-calendar__table-wrapper"
			>
				<table
					class="sy-calendar"
					:aria-labelledby="props.ariaLabelledby"
					:aria-label="props.ariaLabelledby ? undefined : localizedFullMonth"
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
									'sy-calendar__day--start-range': day.isRangeStart,
									'sy-calendar__day--end-range': day.isRangeEnd,
									'sy-calendar__day--in-range': day.isInRange,
									'sy-calendar__day--weekend': day.isWeekend,
									'sy-calendar__day--preview': day.isPreviewed,
									'sy-calendar__day--preview-start': day.isPreviewStart,
									'sy-calendar__day--preview-end': day.isPreviewEnd,
								}]"
								:data-date="day.ISO8601"
								:tabindex="focusedDay === day.ISO8601 || day.isRangeStart || day.isRangeEnd ? 0 : -1"
								:aria-current="day.isToday ? 'date' : undefined"
								:aria-selected="day.isSelected || day.isRangeStart || day.isRangeEnd ? true : undefined"
								:aria-label="getAriaLabelForRange(day)"
								role="gridcell"
								v-bind="keyboardInteractions"
								@click="() => click(day.rawDate)"
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
			</div>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.sy-calendar {
	width: 100%;
	border: 0;
	border-collapse: collapse;
	border-spacing: 0;
}

.sy-calendar__table-wrapper {
	padding: 0 12px 8px;
}

.sy-calendar__weekdays th {
	padding-block: 8px 4px;
	color: rgb(var(--v-theme-primary-variant, 7, 39, 92));
	font-size: var(--v-typography-caption-font-size, 0.875rem);
	font-weight: 400;
	color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.sy-calendar__day {
	position: relative;
	cursor: pointer;
	padding: 3px 0;
}

.sy-calendar__day-content {
	display: grid;
	place-items: center;
	width: 32px;
	height: 32px;
	margin: 1px auto;
	padding: 0;
	border-radius: 999px;
	text-align: center;
	color: rgb(var(--v-theme-primary, 12, 65, 154));
	font-weight: bold;
	font-size: 0.875rem;
	transition:
		background-color 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;
}

.sy-calendar__day:hover > .sy-calendar__day-content {
	background-color: rgba(var(--v-theme-primary, 12, 65, 154), 0.12);
	color: rgb(var(--v-theme-primary, 12, 65, 154));
}

.sy-calendar__day:focus-visible {
	outline: none;
}

.sy-calendar__day:focus-visible > .sy-calendar__day-content {
	box-shadow:
		inset 0 0 0 2px rgb(var(--v-theme-surface, 255, 255, 255)),
		0 0 0 2px rgb(var(--v-theme-primary, 12, 65, 154));
	outline: none;
}

.sy-calendar__day--weekend > .sy-calendar__day-content {

	background-color: rgb(var(--v-theme-grey-lighten80, 221, 222, 222));
}

.sy-calendar__day--today > .sy-calendar__day-content {
	background-color: rgb(var(--v-theme-surface-light, 245, 247, 250));
	border-color: rgb(var(--v-theme-primary, 12, 65, 154));
	font-weight: bold;
}

.sy-calendar__day--selected > .sy-calendar__day-content {
	background-color: rgb(var(--v-theme-primary, 12, 65, 154));
	border-color: rgb(var(--v-theme-primary, 12, 65, 154));
	font-weight: bold;
	color: white;
}

.sy-calendar__day--other-month > .sy-calendar__day-content {
	color: rgb(var(--v-theme-grey-base));
}

.sy-calendar__day--in-range > .sy-calendar__day-content {
	background-color: rgb(var(--v-theme-interactive-hover, 227, 234, 252));
	color: rgb(var(--v-theme-primary, 12, 65, 154));
	border-radius: 0;
}

.sy-calendar__day--start-range > .sy-calendar__day-content {
	border-top-left-radius: 999px;
	border-bottom-left-radius: 999px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	background-color: rgb(var(--v-theme-primary, 12, 65, 154));
	color: white;
}

.sy-calendar__day--end-range > .sy-calendar__day-content {
	border-top-right-radius: 999px;
	border-bottom-right-radius: 999px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	background-color: rgb(var(--v-theme-primary, 12, 65, 154));
	color: white;
}

.sy-calendar__day--start-range > .sy-calendar__day-content,
.sy-calendar__day--end-range > .sy-calendar__day-content {
	font-weight: bold;
}

// Pending range selection preview
.sy-calendar__day--preview > .sy-calendar__day-content {
	background-color: rgb(var(--v-theme-interactive-hover, 227, 234, 252));
	border-color: rgb(var(--v-theme-primary, 12, 65, 154));
	color: rgb(var(--v-theme-primary, 12, 65, 154));
}

.sy-calendar__day--preview-start > .sy-calendar__day-content {
	border-top-left-radius: 999px;
	border-bottom-left-radius: 999px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}

.sy-calendar__day--preview-end > .sy-calendar__day-content {
	border-top-right-radius: 999px;
	border-bottom-right-radius: 999px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

// Month slide transition: the leaving grid is taken out of the flow
// so both grids slide side by side, the wrapper hiding the overflow
.sy-calendar__wrapper {
	overflow: hidden;
	position: relative;
	width: 100%;
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
