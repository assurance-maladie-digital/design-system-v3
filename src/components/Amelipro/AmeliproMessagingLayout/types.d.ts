import type { RouteLocationRaw } from 'vue-router'

export interface MessagingMenuTypes {
	label: string
	icon: string
	unreadNumber?: number
	href?: string
	to?: RouteLocationRaw
	active?: boolean
}
