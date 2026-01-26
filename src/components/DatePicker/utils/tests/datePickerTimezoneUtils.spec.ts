import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'

const ORIGINAL_TZ = process.env.TZ

async function loadUtils() {
	vi.resetModules()
	const mod = await import('../datePickerTimezoneUtils')
	return {
		utcMidnightToLocalMidnight: mod.utcMidnightToLocalMidnight,
	}
}

describe('datePickerTimezoneUtils', () => {
	beforeAll(() => {
		process.env.TZ = 'America/New_York'
	})

	afterAll(() => {
		process.env.TZ = ORIGINAL_TZ
	})

	it('utcMidnightToLocalMidnight returns a Date set to local 00:00 for the same day when input is UTC midnight', async () => {
		const { utcMidnightToLocalMidnight } = await loadUtils()

		const utcMidnight = new Date(Date.UTC(2023, 0, 15, 0, 0, 0, 0))
		const localMidnight = utcMidnightToLocalMidnight(utcMidnight)

		// Assert local midnight components
		expect(localMidnight.getFullYear()).toBe(2023)
		expect(localMidnight.getMonth()).toBe(0)
		expect(localMidnight.getDate()).toBe(15)
		expect(localMidnight.getHours()).toBe(0)
		expect(localMidnight.getMinutes()).toBe(0)
		expect(localMidnight.getSeconds()).toBe(0)
		expect(localMidnight.getMilliseconds()).toBe(0)
	})

	it('utcMidnightToLocalMidnight returns the original Date instance when input is not UTC midnight', async () => {
		const { utcMidnightToLocalMidnight } = await loadUtils()

		const notUtcMidnight = new Date(2023, 0, 15, 0, 0, 0, 0)
		const result = utcMidnightToLocalMidnight(notUtcMidnight)

		expect(result).toBe(notUtcMidnight)
	})
})
