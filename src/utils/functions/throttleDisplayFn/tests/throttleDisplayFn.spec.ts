import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import throttleDisplayFn from '../throttleDisplayFn'

describe('throttleDisplayFn', () => {
	let mockPerformanceNow: ReturnType<typeof vi.fn>
	let mockRequestAnimationFrame: ReturnType<typeof vi.fn>

	beforeEach(() => {
		vi.useFakeTimers()
		
		// Mock performance.now to return a controllable time
		mockPerformanceNow = vi.fn(() => 0)
		vi.stubGlobal('performance', { now: mockPerformanceNow })
		
		// Mock window.requestAnimationFrame to execute immediately
		mockRequestAnimationFrame = vi.fn((fn: () => void) => {
			fn()
			return 1
		})
		Object.defineProperty(window, 'requestAnimationFrame', {
			value: mockRequestAnimationFrame,
			writable: true
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.clearAllTimers()
		vi.useRealTimers()
	})

	it('should call the function immediately if delay has passed', () => {
		const mockFn = vi.fn()
		const delay = 100
		const throttledFn = throttleDisplayFn(mockFn, delay)

		// First call should execute immediately (lastCalled starts at 0)
		mockPerformanceNow.mockReturnValue(delay + 1) // Ensure delay condition is met
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)

		// Simulate more time passing beyond the delay
		mockPerformanceNow.mockReturnValue(delay * 2 + 1)
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(2)
	})

	it('should call the function after the delay if called multiple times within the delay', () => {
		const mockFn = vi.fn()
		const delay = 100
		const throttledFn = throttleDisplayFn(mockFn, delay)

		// First call should execute immediately (lastCalled starts at 0)
		mockPerformanceNow.mockReturnValue(delay + 1) // Ensure delay condition is met
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)

		// Subsequent calls within delay should be throttled
		mockPerformanceNow.mockReturnValue(delay + 50) // Still within delay from last call
		throttledFn()
		throttledFn()

		// Should still only have been called once
		expect(mockFn).toHaveBeenCalledTimes(1)

		// Advance timers to trigger the setTimeout
		vi.advanceTimersByTime(delay)

		// Now the setTimeout should have executed the function
		expect(mockFn).toHaveBeenCalledTimes(2)
	})
})
