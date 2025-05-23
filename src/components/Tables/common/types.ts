export type SortOptions = {
	key: string
	order: 'desc' | 'asc'
}

export interface DataOptions {
	page: number
	itemsPerPage: number
	sortBy: SortOptions[]
	groupBy?: SortOptions[]
	multiSort?: boolean
	mustSort?: boolean
}

export type DataTableHeaders = {
	title?: string
	value?: string
	key?: string
}

// Component-specific props interfaces
export interface SyTableProps {
	items: Array<Record<string, unknown>>
	headers: DataTableHeaders
	options: DataOptions
	suffix?: string
}

export interface SyServerTableProps {
	items: Array<Record<string, unknown>>
	serverItemsLength: number
	headers: DataTableHeaders
	options: DataOptions
	suffix?: string
	loading?: boolean
}
