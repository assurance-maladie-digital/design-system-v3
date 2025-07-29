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

	constructor(callback: Function, options?: any) {
		this.callback = callback
		if (options) {
			this.root = options.root || null
			this.rootMargin = options.rootMargin || '0px'
			this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0]
		}
	}

	observe(): void {}
	unobserve(): void {}
	disconnect(): void {}
	takeRecords(): any[] { return [] }
}

/**
 * Installer le mock d'IntersectionObserver dans l'environnement
 *
 * Nous installons notre mock sur les objets window et global pour assurer
 * une disponibilité maximale, car certains modules peuvent accéder à l'API
 * via l'une ou l'autre référence. Cela résout les différences entre
 * environnements local et CI.
 */
Object.defineProperty(window, 'IntersectionObserver', {
	value: IntersectionObserverMock,
	writable: true,
})

// Définir pour l'objet global également (important pour CI)
if (typeof global !== 'undefined') {
	global.IntersectionObserver = IntersectionObserverMock
}

/**
 * Mock pour window.matchMedia
 *
 * Ce mock est crucial pour les tests de composants Vuetify qui utilisent
 * des media queries pour le responsive design. Notre implémentation est
 * "réactive" et répond correctement aux requêtes de media query
 * en fonction de la largeur simulée de la fenêtre.
 */
Object.defineProperty(window, 'matchMedia', {
	value: (query: string) => {
		// Extraction de la valeur min-width depuis la media query
		const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/)
		const minWidth = minWidthMatch ? parseInt(minWidthMatch[1], 10) : 0

		/**
		 * Fonction pour obtenir la largeur actuelle de la fenêtre simulée
		 *
		 * Cette fonction essaie plusieurs méthodes pour récupérer la largeur actuelle
		 * en fonction de l'environnement de test (HappyDOM, JSDOM, etc.)
		 * et retombe sur une valeur par défaut si aucune méthode ne fonctionne.
		 */
		const getCurrentWidth = () => {
			// Tentative de récupération par différentes méthodes
			let width = 1024 // Largeur par défaut si aucune méthode ne fonctionne

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

		/**
		 * Création d'un MediaQueryList réactif
		 *
		 * Ce mock implémente un getter dynamique pour la propriété 'matches'
		 * qui recalcule le résultat à chaque accès, simulant ainsi un
		 * comportement réactif aux changements de taille de fenêtre.
		 */
		const mediaQueryList = {
			// Calcule le résultat de la media query à chaque accès à 'matches'
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

/**
 * Polyfills additionnels pour les bibliothèques et plugins
 *
 * Ces mocks sont nécessaires pour certaines bibliothèques spécifiques
 * utilisées dans le projet, comme maska pour les masques d'entrée.
 */

// Mock de HTMLInputElement pour la bibliothèque maska
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

/**
 * Mock des API CSS
 *
 * Ces mocks sont nécessaires pour les composants Vuetify qui utilisent
 * des fonctionnalités CSS avancées comme CSS.supports ou getComputedStyle.
 */
Object.defineProperty(global, 'CSS', {
	value: {
		// Mock simple retournant toujours false pour CSS.supports
		supports: () => false,
	},
})

Object.defineProperty(window, 'getComputedStyle', {
	value: () => ({
		// Mock simple retournant une chaîne vide pour toute propriété CSS
		getPropertyValue: () => '',
	}),
})

/**
 * Configurations spécifiques pour l'environnement CI (GitHub Actions)
 *
 * Ces configurations assurent une exécution cohérente des tests dans
 * l'environnement d'intégration continue, qui peut avoir des différences
 * subtiles par rapport à l'environnement de développement local.
 */
if (process.env.CI) {
	// Définition du fuseau horaire pour des comportements date/heure cohérents
	process.env.TZ = 'Europe/Paris'

	/**
	 * Mock de l'API Performance pour les environnements CI
	 *
	 * Certains runners CI peuvent ne pas fournir l'API Performance complète
	 * que Vuetify utilise pour des mesures de performance.
	 */
	Object.defineProperty(global, 'performance', {
		value: {
			now: () => Date.now(),
			mark: () => {},
			measure: () => {},
		},
		writable: true,
	})

	/**
	 * Modification de setTimeout pour améliorer l'isolation des tests en CI
	 *
	 * Ajoute un délai minimal entre les exécutions asynchrones pour éviter
	 * les conditions de course qui peuvent se produire dans les environnements CI
	 * où les ressources peuvent être limitées.
	 */
	const originalSetTimeout = global.setTimeout
	global.setTimeout = ((fn: Function, delay: number = 0, ...args: any[]) => {
		// Délai minimal de 1ms pour améliorer l'isolation des tests
		return originalSetTimeout(fn, Math.max(delay, 1), ...args)
	}) as typeof setTimeout
}

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
