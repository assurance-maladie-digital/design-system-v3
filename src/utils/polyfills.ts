/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Browser API polyfills for SSR/Node.js environments
 * These polyfills ensure compatibility with libraries that expect browser APIs
 * to be available globally, such as Vuetify components and maska library.
 */

/**
 * Mock IntersectionObserver for SSR/Node.js environments
 */
function polyfillIntersectionObserver(): void {
	if (typeof global !== 'undefined' && typeof global.IntersectionObserver === 'undefined') {
		class MockIntersectionObserver {
			readonly root: Element | null = null
			readonly rootMargin: string = '0px'
			readonly thresholds: ReadonlyArray<number> = [0]

			/* eslint-disable @typescript-eslint/no-unused-vars */
			constructor(
				callback: IntersectionObserverCallback,
				options?: IntersectionObserverInit,
			) {
				// Store callback for potential future use
				this.callback = callback
				this.options = options
			}

			private callback: IntersectionObserverCallback
			private options?: IntersectionObserverInit

			observe(target: Element): void {
				// Mock implementation - do nothing in SSR
			}

			unobserve(target: Element): void {
				// Mock implementation - do nothing in SSR
			}

			disconnect(): void {
				// Mock implementation - do nothing in SSR
			}

			takeRecords(): IntersectionObserverEntry[] {
				return []
			}
		}

		// Apply to global scope
		;(global as any).IntersectionObserver = MockIntersectionObserver

		// Apply to window if it exists
		if (typeof window !== 'undefined') {
			;(window as any).IntersectionObserver = MockIntersectionObserver
		}
	}
}

/**
 * Mock ResizeObserver for SSR/Node.js environments
 */
function polyfillResizeObserver(): void {
	if (typeof global !== 'undefined' && typeof global.ResizeObserver === 'undefined') {
		class MockResizeObserver {
			/* eslint-disable @typescript-eslint/no-unused-vars */
			constructor(callback: ResizeObserverCallback) {
				this.callback = callback
			}

			private callback: ResizeObserverCallback

			observe(target: Element, options?: ResizeObserverOptions): void {
				// Mock implementation - do nothing in SSR
			}

			unobserve(target: Element): void {
				// Mock implementation - do nothing in SSR
			}

			disconnect(): void {
				// Mock implementation - do nothing in SSR
			}
		}

		// Apply to global scope
		;(global as any).ResizeObserver = MockResizeObserver

		// Apply to window if it exists
		if (typeof window !== 'undefined') {
			;(window as any).ResizeObserver = MockResizeObserver
		}
	}
}

/**
 * Mock HTMLInputElement for maska library compatibility in SSR
 */
function polyfillHTMLInputElement(): void {
	if (typeof global !== 'undefined' && typeof global.HTMLInputElement === 'undefined') {
		class MockHTMLInputElement {
			value: string = ''
			selectionStart: number | null = null
			selectionEnd: number | null = null
			selectionDirection: 'forward' | 'backward' | 'none' | null = null

			/* eslint-disable @typescript-eslint/no-unused-vars */
			addEventListener(type: string, listener: EventListener): void {
				// Mock implementation
			}

			removeEventListener(type: string, listener: EventListener): void {
				// Mock implementation
			}

			setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void {
				this.selectionStart = start
				this.selectionEnd = end
				this.selectionDirection = direction || 'none'
			}

			querySelector(selector: string): Element | null {
				return null
			}

			focus(): void {
				// Mock implementation
			}

			blur(): void {
				// Mock implementation
			}
		}

		// Apply to global scope
		;(global as any).HTMLInputElement = MockHTMLInputElement
	}
}

/**
 * Mock other browser APIs that might be needed
 */
function polyfillOtherAPIs(): void {
	if (typeof global !== 'undefined') {
		// Mock matchMedia
		if (typeof global.matchMedia === 'undefined') {
			;(global as any).matchMedia = (query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			})
		}

		// Mock visualViewport
		if (typeof global.visualViewport === 'undefined') {
			;(global as any).visualViewport = {
				width: 1024,
				height: 768,
				offsetLeft: 0,
				offsetTop: 0,
				pageLeft: 0,
				pageTop: 0,
				scale: 1,
				addEventListener: () => {},
				removeEventListener: () => {},
				onresize: null,
				onscroll: null,
				dispatchEvent: () => false,
			}
		}

		// Mock CSS.supports
		if (typeof global.CSS === 'undefined') {
			;(global as any).CSS = {
				supports: () => false,
			}
		}

		// Mock getComputedStyle
		if (typeof global.getComputedStyle === 'undefined') {
			;(global as any).getComputedStyle = () => ({
				getPropertyValue: () => '',
			})
		}

		// Mock performance API
		if (typeof global.performance === 'undefined') {
			;(global as any).performance = {
				now: () => Date.now(),
			}
		}
	}
}

/**
 * Initialize all polyfills for SSR/Node.js environments
 * This should be called early in the application lifecycle
 */
export function initializePolyfills(): void {
	// Only apply polyfills in SSR/Node.js environments
	if (typeof window === 'undefined') {
		polyfillIntersectionObserver()
		polyfillResizeObserver()
		polyfillHTMLInputElement()
		polyfillOtherAPIs()
	}
}

// Export individual polyfill functions for manual use if needed
export {
	polyfillIntersectionObserver,
	polyfillResizeObserver,
	polyfillHTMLInputElement,
	polyfillOtherAPIs,
}
