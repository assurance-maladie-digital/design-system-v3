import type { RouteLocationRaw } from 'vue-router'

export interface NavigationItem {
	label: string
	href?: string
	to?: RouteLocationRaw
	disabled?: boolean
}
