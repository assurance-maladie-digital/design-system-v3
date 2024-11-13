export interface HeaderToolbar {
	title?: string
	href?: string
	to?: string
	ariaLabel?: string
	text: string
}

export interface LinkItem {
	hidden?: unknown
	text: string
	to?: string
	href?: string
	ariaLabel?: string
	title?: string
	openInNewTab?: boolean
}
