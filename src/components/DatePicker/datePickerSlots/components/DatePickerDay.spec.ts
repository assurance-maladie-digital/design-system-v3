import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DatePickerDay from './DatePickerDay.vue'

const createSlotProps = (date: Date) => ({
	props: {
		onClick: () => {},
	},
	item: {
		date,
		isAdjacent: false,
		isHidden: false,
		isSelected: false,
		isWeekEnd: false,
		isWeekStart: false,
		isToday: false,
		isDisabled: false,
		isoDate: date.toISOString(),
		localized: String(date.getDate()),
	},
	i: 0,
})

describe('DatePickerDay', () => {
	it('marks saturday and sunday as weekend days, but not monday', () => {
		const saturday = mount(DatePickerDay, {
			props: {
				slotProps: createSlotProps(new Date(2005, 11, 3)),
				displayHolidayDays: false,
			},
		})

		const sunday = mount(DatePickerDay, {
			props: {
				slotProps: createSlotProps(new Date(2005, 11, 4)),
				displayHolidayDays: false,
			},
		})

		const monday = mount(DatePickerDay, {
			props: {
				slotProps: createSlotProps(new Date(2005, 11, 5)),
				displayHolidayDays: false,
			},
		})

		expect(saturday.find('.v-btn').classes()).toContain('weekend-day')
		expect(sunday.find('.v-btn').classes()).toContain('weekend-day')
		expect(monday.find('.v-btn').classes()).not.toContain('weekend-day')

		saturday.unmount()
		sunday.unmount()
		monday.unmount()
	})
})
