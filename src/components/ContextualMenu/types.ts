export interface MenuItem {
	text: string
	hash: string
	level?: number
}

export interface DeepMenuItem {
	text?: string
	hash?: string
	level?: number
	children?: DeepMenuItem[]
	parent?: DeepMenuItem
}
