import {
	describe,
	it,
	expect,
	afterEach,
	vi,
	beforeEach,
} from 'vitest'
import { propValidator } from '../index'

const PROP_NAME = 'test'
const ACCEPTED_VALUES = ['value1', 'value2']

describe('propValidator', () => {
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>

	beforeEach(() => {
		consoleWarnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => {})
	})

	it('returns true and does not warn if the prop is valid', () => {
		const result = propValidator(PROP_NAME, ACCEPTED_VALUES, 'value1')

		expect(result).toBe(true)
		expect(consoleWarnSpy).not.toHaveBeenCalled()
	})

	it('returns false and warns if the prop is not valid', () => {
		const result = propValidator(PROP_NAME, ACCEPTED_VALUES, 'wrongValue')

		expect(result).toBe(false)
		expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Invalid value for the `test` prop'),
		)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})
})
