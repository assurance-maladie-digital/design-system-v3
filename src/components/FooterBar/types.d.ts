import type { RouteLocationRaw } from 'vue-router'

export interface LinkItem {
	hidden?: unknown
	text: string
	to?: RouteLocationRaw
	href?: string
	ariaLabel?: string
	openInNewTab?: boolean
	theme?: string
}
