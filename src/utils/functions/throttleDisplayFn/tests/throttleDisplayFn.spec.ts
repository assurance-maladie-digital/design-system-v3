import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import throttleDisplayFn from '../throttleDisplayFn'

describe('throttleDisplayFn', () => {
	vi.stubGlobal('requestAnimationFrame', (fn: () => void) => fn())

	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.clearAllTimers()
	})

	it('should call the function immediately if delay has passed', () => {
		const mockFn = vi.fn()
		const delay = 100
		const throttledFn = throttleDisplayFn(mockFn, delay)

		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)

		vi.spyOn(performance, 'now').mockReturnValue(performance.now() + delay + 1)
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(2)
	})

	it('should call the function after the delay if called multiple times within the delay', () => {
		const mockFn = vi.fn()
		const delay = 100
		const throttledFn = throttleDisplayFn(mockFn, delay)

		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)

		throttledFn()
		throttledFn()

		expect(mockFn).toHaveBeenCalledTimes(1)

		// Advance timers to trigger the setTimeout
		vi.advanceTimersByTime(delay)

		expect(mockFn).toHaveBeenCalledTimes(2)
	})
})
