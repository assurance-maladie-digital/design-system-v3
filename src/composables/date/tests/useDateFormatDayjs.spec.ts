import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { formatDate } from '../useDateFormatDayjs'

dayjs.extend(utc)
dayjs.extend(timezone)

describe('useDateFormatDayjs timezone regression', () => {
	it('formatDate formats date-only values in UTC to avoid timezone drift on negative timezones', () => {
		// 00:00 UTC on 15 Jan 2023
		const utcMidnight = new Date(Date.UTC(2023, 0, 15, 0, 0, 0))

		// In a negative timezone (e.g. America/New_York), this instant is still the previous calendar day locally
		const nyLocal = dayjs(utcMidnight).tz('America/New_York').format('DD/MM/YYYY')
		expect(nyLocal).toBe('14/01/2023')

		// Our formatDate must remain stable and represent the intended date-only value
		expect(formatDate(utcMidnight, 'DD/MM/YYYY')).toBe('15/01/2023')
	})
})
