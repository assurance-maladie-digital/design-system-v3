import type { RouteLocationRaw } from 'vue-router'

export interface Service {
	icon?: string
	imgSrc?: string
	label: string
	to?: RouteLocationRaw
	href?: string
	click?: CallableFunction
}
