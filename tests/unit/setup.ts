/**
 * Important: IntersectionObserver polyfill must be applied BEFORE any imports
 * to prevent "ReferenceError: IntersectionObserver is not defined" during module loading
 * and persist through test teardown
 */

// Define the polyfill class first
class IntersectionObserverPolyfill {
	readonly root: Element | Document | null = null
	readonly rootMargin: string = '0px'
	readonly thresholds: ReadonlyArray<number> = [0]
	private callback: Function
	private isDisconnected = false

	constructor(callback: Function, options?: any) {
		try {
			this.callback = callback || (() => {})
			if (options) {
				this.root = options.root || null
				this.rootMargin = options.rootMargin || '0px'
				this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0]
			}
		} catch (error) {
			this.callback = () => {}
		}
	}

	observe(): void {
		try {
			if (this.isDisconnected) return
		} catch (error) {
			// Silent
		}
	}

	unobserve(): void {
		try {
			// Silent
		} catch (error) {
			// Silent
		}
	}

	disconnect(): void {
		try {
			this.isDisconnected = true
		} catch (error) {
			// Silent
		}
	}

	takeRecords(): any[] {
		try {
			return []
		} catch (error) {
			return []
		}
	}
}

// Function to apply the polyfill robustly
const applyIntersectionObserverPolyfill = () => {
	try {
		// Apply to global scope (Node.js)
		if (typeof global !== 'undefined') {
			Object.defineProperty(global, 'IntersectionObserver', {
				value: IntersectionObserverPolyfill,
				writable: true,
				configurable: true,
				enumerable: false
			})
		}
		
		// Apply to window scope (browser/jsdom)
		if (typeof window !== 'undefined') {
			Object.defineProperty(window, 'IntersectionObserver', {
				value: IntersectionObserverPolyfill,
				writable: true,
				configurable: true,
				enumerable: false
			})
		}
		
		// Apply to globalThis scope (universal)
		if (typeof globalThis !== 'undefined') {
			Object.defineProperty(globalThis, 'IntersectionObserver', {
				value: IntersectionObserverPolyfill,
				writable: true,
				configurable: true,
				enumerable: false
			})
		}
	} catch (error) {
		console.warn('Failed to apply IntersectionObserver polyfill:', error)
	}
}

// Apply polyfill immediately
applyIntersectionObserverPolyfill()

// Reapply polyfill periodically to handle test teardown/reset
const polyfillInterval = setInterval(() => {
	try {
		// Check if IntersectionObserver is missing from any scope and reapply
		if (
			(typeof global !== 'undefined' && !global.IntersectionObserver) ||
			(typeof window !== 'undefined' && !window.IntersectionObserver) ||
			(typeof globalThis !== 'undefined' && !globalThis.IntersectionObserver)
		) {
			applyIntersectionObserverPolyfill()
		}
	} catch (error) {
		// Silent - don't let polyfill checking break tests
	}
}, 100) // Check every 100ms

// Clean up interval after tests (but keep polyfill)
if (typeof global !== 'undefined' && global.process?.env?.NODE_ENV === 'test') {
	setTimeout(() => {
		try {
			clearInterval(polyfillInterval)
		} catch (error) {
			// Silent
		}
	}, 30000) // Clean up after 30 seconds
}

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

Object.defineProperty(window, 'ResizeObserver', {
	value: class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	},
	writable: true,
})

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

// HTMLInputElement polyfill for maska library
// Apply in test environment only
if (process.env.NODE_ENV === 'test' && typeof global.HTMLInputElement === 'undefined') {
	(global as any).HTMLInputElement = class MockHTMLInputElement {
		type = 'text'
		value = ''
		selectionStart = 0
		selectionEnd = 0
		readOnly = false
		disabled = false
		placeholder = ''
		maxLength = -1
		minLength = 0
		pattern = ''
		title = ''
		name = ''
		id = ''
		className = ''
		style = {}
		dataset = {}

		querySelectorAll() { return [] }
		querySelector() { return null }
		addEventListener() {}
		removeEventListener() {}
		setAttribute() {}
		getAttribute() { return null }
		removeAttribute() {}
		hasAttribute() { return false }
		getBoundingClientRect() { return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 } }
		focus() {}
		blur() {}
		click() {}
		select() {}
		setSelectionRange() {}
		setRangeText() {}
		checkValidity() { return true }
		reportValidity() { return true }
		setCustomValidity() {}
		cloneNode() { return new MockHTMLInputElement() }
		appendChild() { return null }
		removeChild() { return null }
		insertBefore() { return null }
		replaceChild() { return null }
		contains() { return false }
		matches() { return false }
		closest() { return null }
		dispatchEvent() { return true }
	}
}

// Also apply to window scope if it exists
if (process.env.NODE_ENV === 'test' && typeof window !== 'undefined' && typeof window.HTMLInputElement === 'undefined') {
	(window as any).HTMLInputElement = (global as any).HTMLInputElement
}

Object.defineProperty(global, 'CSS', {
	value: {
		supports: () => false,
	},
})

Object.defineProperty(window, 'getComputedStyle', {
	value: () => ({
		getPropertyValue: () => '',
	}),
})

// Document polyfill for Vuetify components
if (typeof global.document === 'undefined') {
	// Use the existing window.document from happy-dom if available
	if (typeof window !== 'undefined' && window.document) {
		(global as any).document = window.document
	} else {
		// Fallback minimal document mock
		(global as any).document = {
			createElement: () => ({
				addEventListener: () => {},
				removeEventListener: () => {},
				setAttribute: () => {},
				getAttribute: () => null,
				removeAttribute: () => {},
				className: '',
				style: {},
				tagName: 'DIV',
				parentNode: null,
				children: [],
				appendChild: () => {},
				removeChild: () => {},
			}),
			querySelector: () => null,
			querySelectorAll: () => [],
			getElementById: () => null,
			addEventListener: () => {},
			removeEventListener: () => {},
			body: {
				addEventListener: () => {},
				removeEventListener: () => {},
				appendChild: () => {},
				removeChild: () => {},
				style: {},
			},
			documentElement: {
				style: {},
				addEventListener: () => {},
				removeEventListener: () => {},
			},
		}
	}
}

// CI-specific configurations for better stability
if (process.env.CI) {
	// Set timezone for consistent date/time behavior in CI
	process.env.TZ = 'Europe/Paris'

	// Add additional polyfills that might be missing in CI environments
	Object.defineProperty(global, 'performance', {
		value: {
			now: () => Date.now(),
			mark: () => {},
			measure: () => {},
		},
		writable: true,
	})

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
