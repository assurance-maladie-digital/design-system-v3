import type { RouteLocationRaw } from 'vue-router'

/**
 * Type pour les props de navigation
 * Permet de spécifier soit href (lien externe), soit to (route interne), soit ni l'un ni l'autre
 */
export type NavigationProps =
	| { href: string, to?: never }
	| { to: RouteLocationRaw, href?: never }
	| { href?: never, to?: never }
