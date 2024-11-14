export interface MenuItem {
	title: string
	href?: string
	to?: string
	ariaLabel?: string
}

export interface SelectItem {
	text: string
	hidden?: unknown
	to?: string
	href?: string
	ariaLabel?: string
	title?: string
	openInNewTab?: boolean
}
