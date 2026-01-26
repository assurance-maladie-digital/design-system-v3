import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'

const ORIGINAL_TZ = process.env.TZ

async function loadNormalizeToUtcMidnight() {
	vi.resetModules()
	return (await import('../normalizeToUtcMidnight')).normalizeToUtcMidnight
}

describe('normalizeToUtcMidnight', () => {
	beforeAll(() => {
		process.env.TZ = 'America/New_York'
	})

	afterAll(() => {
		process.env.TZ = ORIGINAL_TZ
	})

	it('returns a Date set to UTC 00:00 for the same calendar day (independent of local timezone)', async () => {
		const normalizeToUtcMidnight = await loadNormalizeToUtcMidnight()

		// Local midnight in New York (UTC offset negative) should still normalize to UTC midnight for that same day
		const localMidnight = new Date(2023, 0, 15, 0, 0, 0, 0)
		const normalized = normalizeToUtcMidnight(localMidnight)

		expect(normalized.getUTCHours()).toBe(0)
		expect(normalized.getUTCMinutes()).toBe(0)
		expect(normalized.getUTCSeconds()).toBe(0)
		expect(normalized.getUTCMilliseconds()).toBe(0)
		expect(normalized.toISOString()).toBe('2023-01-15T00:00:00.000Z')
	})
})
