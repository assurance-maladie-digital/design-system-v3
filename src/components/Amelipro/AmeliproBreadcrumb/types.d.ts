import type { RouteLocationRaw } from 'vue-router'

export interface AmeliproBreadcrumbItem {
	id: string
	title: string
	href?: string
	to?: RouteLocationRaw
}
