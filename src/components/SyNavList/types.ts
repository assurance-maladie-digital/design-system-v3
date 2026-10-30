import type { RouteLocationRaw } from 'vue-router'
import type { IconValue } from 'vuetify/lib/composables/icons.mjs'
import type { locales } from './locales'

/** Action rapide d'une entrée (bouton icône). */
export interface SyNavListAction {
	id: string
	icon: IconValue
	/** Intitulé de l'action (« Modifier ») ; le nom accessible y ajoute celui de l'entrée via `locales.actionLabel`. */
	label: string
}

/** Entrée de la liste de navigation. */
export interface SyNavListItem {
	id: string
	label: string
	/** Icône décorative affichée avant le libellé. */
	icon?: IconValue
	/** Lien externe ; prioritaire sur `to`. */
	href?: string
	/** Route interne (`RouterLink`) : pose `aria-current="page"` sur la page active. */
	to?: RouteLocationRaw
	/** Jusqu'à 4 actions, affichées au survol et au focus de l'entrée. */
	actions?: SyNavListAction[]
	/** Sous-niveau, ouvert par le chevron de l'entrée. */
	children?: SyNavListItem[]
}

export type SyNavListLocales = typeof locales
