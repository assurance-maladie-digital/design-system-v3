import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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

Object.defineProperty(window, 'IntersectionObserver', {
	value: class IntersectionObserver {
		constructor() {}
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
			} else if ((window as any).happyDOM?.innerWidth !== undefined) {
				width = (window as any).happyDOM.innerWidth
			} else if (window.innerWidth) {
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

export const vuetify = createVuetify({
	components,
	directives,
})
