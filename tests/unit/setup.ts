/**
 * Test Environment Setup File
 *
 * Ce fichier configure l'environnement de test pour les composants Vue/Vuetify.
 * Il contient :
 * - Les polyfills pour APIs du navigateur (IntersectionObserver, ResizeObserver, etc.)
 * - Les polyfills pour méthodes ES2022 non supportées dans Node.js 18
 * - La configuration de l'environnement de test global
 */

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Augmenter le nombre max d'écouteurs d'événements pour éviter les avertissements
// de fuites mémoire pendant les tests, surtout sur CI où plusieurs processus
// peuvent s'exécuter en parallèle
const maxListeners = process.env.CI ? 30 : 20
process.setMaxListeners(maxListeners)

/**
 * Polyfills pour méthodes de tableau ES2022 utilisées par Vuetify 3.9.x
 *
 * Ces méthodes sont nécessaires car Node.js 18.x ne les implémente pas nativement,
 * mais Vuetify 3.9+ les utilise. Ces polyfills permettent d'exécuter les tests
 * sans erreurs de référence aux méthodes manquantes.
 */
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

/**
 * Mocks des APIs de navigateur pour les tests
 *
 * Ces APIs ne sont pas disponibles dans l'environnement Node.js/JSDOM/HappyDOM
 * mais sont utilisées par Vuetify. Nous créons donc des versions minimales
 * pour éviter les erreurs pendant les tests.
 */
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

/**
 * Mock pour l'API IntersectionObserver
 *
 * Ce mock est essentiel car Vuetify utilise IntersectionObserver dans plusieurs
 * composants (notamment VProgressLinear). Sans ce mock, les tests échoueraient
 * avec l'erreur "ReferenceError: IntersectionObserver is not defined".
 *
 * Cette implémentation fournit toutes les propriétés et méthodes nécessaires
 * pour satisfaire à la fois l'interface TypeScript et les besoins d'exécution.
 */
class IntersectionObserverMock {
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
			// Silent fallback to avoid errors
			this.callback = () => {}
		}
	}

	observe(): void {
		try {
			// Mock implementation - does nothing but avoids errors
			if (this.isDisconnected) return
		} catch (error) {
			// Ignore silently
		}
	}

	unobserve(): void {
		try {
			// Mock implementation - does nothing but avoids errors
		} catch (error) {
			// Ignore silently
		}
	}

	disconnect(): void {
		try {
			this.isDisconnected = true
			// Mock implementation - does nothing but avoids errors
		} catch (error) {
			// Ignore silently
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

/**
 * Installer le mock d'IntersectionObserver dans l'environnement
 *
 * Nous installons notre mock sur les objets window et global pour assurer
 * une disponibilité maximale, car certains modules peuvent accéder à l'API
 * via l'une ou l'autre référence. Cela résout les différences entre
 * environnements local et CI.
 */

// Apply the polyfill robustly across all global objects
const applyIntersectionObserverPolyfill = () => {
	try {
		// On window (browser/happy-dom environment)
		if (typeof window !== 'undefined' && !window.IntersectionObserver) {
			Object.defineProperty(window, 'IntersectionObserver', {
				value: IntersectionObserverMock,
				writable: true,
				configurable: false, // Prevents overwriting
			})
		}

		// On global (Node.js environment)
		if (typeof global !== 'undefined' && !global.IntersectionObserver) {
			(global as any).IntersectionObserver = IntersectionObserverMock
		}

		// On globalThis (modern compatibility)
		if (typeof globalThis !== 'undefined' && !globalThis.IntersectionObserver) {
			(globalThis as any).IntersectionObserver = IntersectionObserverMock
		}
	} catch (error) {
		// Silently ignore polyfill errors to avoid unhandled rejections
		console.warn('Failed to apply IntersectionObserver polyfill:', error)
	}
}

// Apply immediately
applyIntersectionObserverPolyfill()

// Reapply after a short delay to ensure that modules loaded
// asynchronously have access to the polyfill
setTimeout(() => {
	try {
		applyIntersectionObserverPolyfill()
	} catch (error) {
		// Ignore silently to avoid unhandled rejections
	}
}, 0)

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

// Additional polyfills that might be needed
// HTMLInputElement polyfill for maska library
if (typeof global.HTMLInputElement === 'undefined') {
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