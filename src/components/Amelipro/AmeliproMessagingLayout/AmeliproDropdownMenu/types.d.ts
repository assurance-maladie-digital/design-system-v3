import type { RouteLocationRaw } from 'vue-router'

export interface DropdownItem {
	label: string
	href?: string
	to?: RouteLocationRaw
	active?: boolean
}
