import type { RouteLocationRaw } from 'vue-router'
import type { IconValue } from 'vuetify/lib/composables/icons.mjs'
import type { locales } from './locales'

/** Action rapide d'une entrée (bouton icône). */
export interface SyNavListAction {
	/** Identifiant unique parmi les actions de l'entrée. */
	id: string
	icon: IconValue
	/** Intitulé de l'action (« Modifier ») ; le nom accessible y ajoute celui de l'entrée via `locales.actionLabel`. */
	label: string
}

/** Entrée de la liste de navigation. */
export interface SyNavListItem {
	/**
	 * Identifiant unique dans son niveau (deux sous-niveaux différents peuvent réutiliser le même).
	 * Il sert de clé de rendu et à relier le chevron à son sous-niveau (`aria-controls`) ; deux entrées
	 * d'un même niveau avec le même `id` partageraient leur état ouvert et leur sous-niveau.
	 */
	id: string
	label: string
	/** Icône décorative affichée avant le libellé. */
	icon?: IconValue
	/** Lien externe ; prioritaire sur `to`. */
	href?: string
	/** Route interne (`RouterLink`) : pose `aria-current="page"` sur la page active. */
	to?: RouteLocationRaw
	/** Page en cours, pour un lien `href` (un `RouterLink` le détecte seul) : pose `aria-current="page"`. */
	active?: boolean
	/** Entrée indisponible : ni lien, ni actions, ni ouverture du sous-niveau ; annoncée comme lien indisponible. */
	disabled?: boolean
	/** Jusqu'à 4 actions, affichées au survol et au focus de l'entrée. */
	actions?: SyNavListAction[]
	/** Sous-niveau, ouvert par le chevron de l'entrée. */
	children?: SyNavListItem[]
}

export type SyNavListLocales = typeof locales

/** Affichage des actions : au survol et au focus de l'entrée (maquette PA), ou en permanence. */
export type SyNavListActionsVisibility = 'hover' | 'always'
