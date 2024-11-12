export interface TopNavHeader {
	title?: string
	href: string
	ariaLabel?: string
	text: string
}

import { RawLocation } from 'vue-router'

export interface LinkItem {
	hidden?: unknown
	text: string
	to?: RawLocation
	href?: string
	ariaLabel?: string
	title?: string
	openInNewTab?: boolean
}
