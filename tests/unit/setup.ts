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

/**
 * Création de l'instance Vuetify pour les tests
 *
 * Cette instance sera utilisée dans les tests pour monter les composants
 * avec le plugin Vuetify correctement configuré.
 */
export const vuetify = createVuetify({
	components,
	directives,
})
