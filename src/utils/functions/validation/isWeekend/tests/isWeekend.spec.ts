import { isWeekend } from '../'
import { describe, it, expect } from 'vitest'

import dayjs from 'dayjs'
import 'dayjs/locale/fr'

describe('isWeekend', () => {
	it('returns true if the day is in a weekend', () => {
		const date = '2019-10-26' // Saturday

		expect(isWeekend(date)).toBe(true)
	})

	it('returns false if the day is not in a weekend', () => {
		const date = '2019-10-21' // Monday

		expect(isWeekend(date)).toBe(false)
	})

	it('returns the correct result when the dayjs locale is not english', () => {
		dayjs.locale('fr')

		expect(isWeekend('2019-10-26')).toBe(true) // samedi
		expect(isWeekend('2019-10-27')).toBe(true) // dimanche
		expect(isWeekend('2019-10-21')).toBe(false) // lundi
	})
})
