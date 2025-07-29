import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Increase max listeners to prevent memory leak warnings during tests
// Set higher limit for CI environments where more concurrent processes may run
const maxListeners = process.env.CI ? 30 : 20
process.setMaxListeners(maxListeners)

// ES2022 Array methods polyfill for Node.js 18.x compatibility
// These methods are used by Vuetify 3.9.x but not available in Node.js 18.x
if (!(Array.prototype as any).toReversed) {
	(Array.prototype as any).toReversed = function (this: any[]) {
		return [...this].reverse()
	}
}

if (!(Array.prototype as any).toSorted) {
	(Array.prototype as any).toSorted = function (this: any[], compareFn?: (a: any, b: any) => number) {
		return [...this].sort(compareFn)
	}
}

if (!(Array.prototype as any).toSpliced) {
	(Array.prototype as any).toSpliced = function (this: any[], start: number, deleteCount?: number, ...items: any[]) {
		const copy = [...this]
		copy.splice(start, deleteCount || 0, ...items)
		return copy
	}
}

if (!(Array.prototype as any).with) {
	(Array.prototype as any).with = function (this: any[], index: number, value: any) {
		const copy = [...this]
		copy[index] = value
		return copy
	}
}

// Browser API polyfills to prevent test failures
// Apply these polyfills in test environment (Vitest sets NODE_ENV or we're in a test context)
if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.VITEST || typeof global.describe !== 'undefined')) {
	Object.defineProperty(window, 'visualViewport', {
		value: {
			width: 1024,
			height: 768,
			scale: 1,
			offsetLeft: 0,
			offsetTop: 0,
			addEventListener: () => {},
			removeEventListener: () => {},
		},
		writable: true,
	})

	// Only add ResizeObserver if it doesn't exist
	if (typeof window.ResizeObserver === 'undefined') {
		Object.defineProperty(window, 'ResizeObserver', {
			value: class MockResizeObserver {
				observe() {}
				unobserve() {}
				disconnect() {}
			},
			writable: true,
		})
	}

	// Only add IntersectionObserver if it doesn't exist
	if (typeof window.IntersectionObserver === 'undefined') {
		Object.defineProperty(window, 'IntersectionObserver', {
			value: class MockIntersectionObserver {
				constructor() {}
				observe() {}
				unobserve() {}
				disconnect() {}
			},
			writable: true,
		})
	}

	// Also add to global scope for Node.js environment
	if (typeof global !== 'undefined' && typeof global.IntersectionObserver === 'undefined') {
		(global as any).IntersectionObserver = class MockIntersectionObserver {
			constructor() {}
			observe() {}
			unobserve() {}
			disconnect() {}
		}
	}

	Object.defineProperty(window, 'matchMedia', {
		value: (query: string) => {
			// Extract min-width value from media query
			const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/)
			const minWidth = minWidthMatch ? parseInt(minWidthMatch[1], 10) : 0

			// Get current window width from HappyDOM
			const getCurrentWidth = () => {
				// Try multiple ways to get the current width
				let width = 1024 // Default fallback

				if ((window as any).happyDOM?.getInnerWidth) {
					width = (window as any).happyDOM.getInnerWidth()
				}
				else if ((window as any).happyDOM?.innerWidth !== undefined) {
					width = (window as any).happyDOM.innerWidth
				}
				else if (window.innerWidth) {
					width = window.innerWidth
				}

				return width
			}

			// Create a reactive media query list that updates when accessed
			const mediaQueryList = {
				get matches() {
					const currentWidth = getCurrentWidth()
					return currentWidth >= minWidth
				},
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			}

			return mediaQueryList
		},
		writable: true,
	})
}

// Additional polyfills that might be needed
// HTMLInputElement polyfill for maska library - only in test environment
if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.VITEST || typeof global.describe !== 'undefined') && typeof global.HTMLInputElement === 'undefined') {
	(global as any).HTMLInputElement = class MockHTMLInputElement {
		type = 'text'
		value = ''
		querySelectorAll() { return [] }
		querySelector() { return null }
		addEventListener() {}
		removeEventListener() {}
		setAttribute() {}
		getAttribute() { return null }
		removeAttribute() {}
	}
}

// Only add CSS and getComputedStyle polyfills in test environment
if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.VITEST || typeof global.describe !== 'undefined')) {
	if (typeof global.CSS === 'undefined') {
		Object.defineProperty(global, 'CSS', {
			value: {
				supports: () => false,
			},
		})
	}

	if (typeof window.getComputedStyle === 'undefined') {
		Object.defineProperty(window, 'getComputedStyle', {
			value: () => ({
				getPropertyValue: () => '',
			}),
		})
	}
}

// CI-specific configurations for better stability
if (process.env.CI) {
	// Set timezone for consistent date/time behavior in CI
	process.env.TZ = 'UTC'

	// Mock performance API for CI stability
	if (typeof global.performance === 'undefined') {
		Object.defineProperty(global, 'performance', {
			value: {
				now: () => Date.now(),
				mark: () => {},
				measure: () => {},
			},
			writable: true,
		})
	}

	// Improve test isolation in CI by ensuring proper cleanup
	// Add a small delay between tests to prevent race conditions
	const originalSetTimeout = global.setTimeout
	global.setTimeout = ((fn: Function, delay: number = 0, ...args: any[]) => {
		// Add minimum 1ms delay in CI to improve test isolation
		return originalSetTimeout(fn, Math.max(delay, 1), ...args)
	}) as typeof setTimeout
}

export const vuetify = createVuetify({
	components,
	directives,
})
