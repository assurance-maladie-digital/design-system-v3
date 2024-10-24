import { RawLocation } from 'vue-router'

export interface LinkItem {
	hidden?: unknown
	text: string
	to?: RawLocation
	href?: string
	ariaLabel?: string
	openInNewTab?: boolean
}
