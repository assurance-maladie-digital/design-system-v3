/**
 * Returns a throttled version of the provided function that will only be called once every `delay` milliseconds.
 */
export default function throttleDisplayFn<
	F extends (...args: unknown[]) => void,
>(fn: F, delay: number) {
	let timeout: number | null = null
	let lastCalled = 0

	return function (...args: Parameters<F>) {
		if (timeout !== null) {
			window.clearTimeout(timeout)
		}

		if (performance.now() - lastCalled >= delay) {
			window.requestAnimationFrame(() => fn(...args))
			lastCalled = performance.now()
		}
		else {
			timeout = window.setTimeout(() => {
				fn(...args)
				lastCalled = performance.now()
			}, delay)
		}
	}
}
