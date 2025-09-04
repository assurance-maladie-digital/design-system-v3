import type { RouteLocationRaw } from 'vue-router'

export interface TabItem {
	label: string
	value: string | number
	content?: string
	disabled?: boolean
	/** URL pour navigation directe */
	href?: string
	/** Cible pour vue-router */
	to?: RouteLocationRaw
}
