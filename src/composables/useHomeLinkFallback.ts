import { computed, getCurrentInstance } from 'vue'
import type { ComputedRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface HomeLink {
	'to'?: RouteLocationRaw
	'href'?: string
	'ariaLabel'?: string
	'aria-label'?: string
}

export interface UseHomeLinkFallbackReturn {
	/** Type de conteneur à rendre : 'router-link', 'a' ou 'div' */
	containerComponent: ComputedRef<'router-link' | 'a' | 'div'>
	/** `href` résolu pour un `<a>` (repli quand vue-router n'est pas disponible, ou `href` direct) */
	homeHref: ComputedRef<string | undefined>
}

/**
 * Détermine le conteneur du lien d'accueil (`router-link`, `<a>` ou `<div>`)
 * et résout le `href` de repli quand `to` est fourni sans vue-router.
 *
 * Sans vue-router, on retombe sur un vrai `<a href>` : un `<div>` serait cliquable
 * visuellement (cursor: pointer) mais ni focusable ni activable au clavier (RGAA 7.3).
 *
 * On résout les formes sérialisables de `RouteLocationRaw` (string et `{ path }`) ;
 * pour une route nommée, seul le router sait construire l'URL, on retombe donc
 * sur `href` puis sur la racine du site.
 *
 * Note : `query` et `hash` des routes objets ne sont pas sérialisés dans le fallback
 * car seul `path` peut être utilisé comme `href` sans router.
 */
export function useHomeLinkFallback(homeLink: () => HomeLink | undefined): UseHomeLinkFallbackReturn {
	const instance = getCurrentInstance()

	const containerComponent = computed<'router-link' | 'a' | 'div'>(() => {
		const link = homeLink()

		if (link?.to) {
			const componentsRegistered = instance?.appContext?.components
			const hasRouterLink = componentsRegistered && 'RouterLink' in componentsRegistered
			if (hasRouterLink) {
				return 'router-link'
			}
			return 'a'
		}
		if (link?.href) {
			return 'a'
		}
		return 'div'
	})

	const homeHref = computed<string | undefined>(() => {
		const link = homeLink()

		if (!link?.to) {
			return link?.href
		}

		const to = link.to

		if (typeof to === 'string') {
			return to
		}

		if (to && typeof to === 'object' && 'path' in to && typeof to.path === 'string') {
			return to.path
		}

		return link.href ?? '/'
	})

	return { containerComponent, homeHref }
}
