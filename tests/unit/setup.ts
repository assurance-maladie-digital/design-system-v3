import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Polyfills for browser APIs in test environment
if (typeof window !== 'undefined') {
	// Mock visualViewport API
	if (!window.visualViewport) {
		Object.defineProperty(window, 'visualViewport', {
			value: {
				width: window.innerWidth || 1024,
				height: window.innerHeight || 768,
				offsetLeft: 0,
				offsetTop: 0,
				pageLeft: 0,
				pageTop: 0,
				scale: 1,
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			},
			writable: true,
			configurable: true,
		})
	}

	// Mock ResizeObserver if not available
	if (!window.ResizeObserver) {
		window.ResizeObserver = class ResizeObserver {
			constructor(callback: ResizeObserverCallback) {
				// Mock implementation
			}
			observe() {}
			unobserve() {}
			disconnect() {}
		} as any
	}

	// Mock IntersectionObserver if not available
	if (!window.IntersectionObserver) {
		window.IntersectionObserver = class MockIntersectionObserver {
			root: Element | null = null
			rootMargin: string = '0px'
			thresholds: ReadonlyArray<number> = [0]

			constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
				// Mock implementation
			}
			observe() {}
			unobserve() {}
			disconnect() {}
			takeRecords(): IntersectionObserverEntry[] {
				return []
			}
		} as any
	}

	// Mock matchMedia if not available
	if (!window.matchMedia) {
		window.matchMedia = (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		})
	}
}

export const vuetify = createVuetify({
	components,
	directives,
})
