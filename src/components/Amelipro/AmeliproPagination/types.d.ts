import type { RouteLocationRaw } from 'vue-router'

export interface PaginationTypes {
	key: number
	href?: string
	to?: RouteLocationRaw
}
