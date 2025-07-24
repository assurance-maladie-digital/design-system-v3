import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Polyfill browser APIs that are missing in test environment
// This fixes "visualViewport is not defined" and similar errors
if (!global.visualViewport) {
	global.visualViewport = {
		width: 1024,
		height: 768,
		scale: 1,
		offsetLeft: 0,
		offsetTop: 0,
		pageLeft: 0,
		pageTop: 0,
		onresize: null,
		onscroll: null,
		adEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => true,
	} as unknown as VisualViewport
}

// Polyfill ResizeObserver if not available
if (!global.ResizeObserver) {
	global.ResizeObserver = class ResizeObserver {
		constructor(callback: ResizeObserverCallback) {}
		observe(target: Element) {}
		unobserve(target: Element) {}
		disconnect() {}
	}
}

// Polyfill IntersectionObserver if not available
if (!global.IntersectionObserver) {
	global.IntersectionObserver = class IntersectionObserver {
		constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
		observe(target: Element) {}
		unobserve(target: Element) {}
		disconnect() {}
		takeRecords(): IntersectionObserverEntry[] { return [] }
		get root() { return null }
		get rootMargin() { return '0px' }
		get thresholds() { return [0] }
	} as any
}

export const vuetify = createVuetify({
	components,
	directives,
})
