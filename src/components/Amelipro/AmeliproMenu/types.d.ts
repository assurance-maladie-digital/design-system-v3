import type { RouteLocationRaw } from 'vue-router'

export interface AmeliproMenuItem {
	actif?: boolean
	children?: AmeliproMenuItem[]
	href?: string
	id: string
	name: string
	to?: RouteLocationRaw
}
