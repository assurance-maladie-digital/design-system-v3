<script setup lang="ts">
	import { VBtn } from 'vuetify/components'
	import { isHolidayDay } from '@/composables/date/useHolidayDay'
	import { locales } from '../../locales'

	interface DatePickerDayItem {
		date: Date
		isAdjacent: boolean
		isHidden: boolean
		isSelected: boolean
		isWeekEnd: boolean
		isWeekStart: boolean
		isToday: boolean
		isDisabled: boolean
		isoDate: string
		localized: string
	}

	interface DatePickerDayProps {
		slotProps: {
			props: { onClick: () => void }
			item: DatePickerDayItem
			i: number
		}
		displayHolidayDays: boolean
	}

	const props = defineProps<DatePickerDayProps>()

	const isHoliday = (date: Date): boolean => {
		if (!props.displayHolidayDays) return false
		return isHolidayDay(date, 'DD/MM/YYYY')
	}
</script>

<template>
	<VBtn
		v-bind="slotProps.props"
		:class="{ 'holiday-day': isHoliday(slotProps.item.date) }"
		:aria-label="isHoliday(slotProps.item.date)
			? `${slotProps.item.localized} — ${locales.publicHoliday}`
			: undefined"
	>
		{{ slotProps.item.localized }}
	</VBtn>
</template>
