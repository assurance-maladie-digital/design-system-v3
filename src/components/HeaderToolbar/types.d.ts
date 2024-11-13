import { RawLocation } from 'vue-router'

export interface HeaderToolbar {
	title?: string
	href?: string
	to?: RawLocation
	ariaLabel?: string
	text: string
}

export interface LinkItem {
	hidden?: unknown
	text: string
	to?: RawLocation
	href?: string
	ariaLabel?: string
	title?: string
	openInNewTab?: boolean
}
