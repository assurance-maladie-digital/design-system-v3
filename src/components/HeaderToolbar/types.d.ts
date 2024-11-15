import type { RouteLocationRaw } from 'vue-router'

export interface MenuItem {
	title: string
	href?: string
	to?: RouteLocationRaw
	ariaLabel?: string
	openInNewTab?: boolean
}

export interface SelectItem {
	text: string
	value: string
	hidden?: unknown
	to?: RouteLocationRaw
	href?: string
	ariaLabel?: string
	title?: string
	openInNewTab?: boolean
}
