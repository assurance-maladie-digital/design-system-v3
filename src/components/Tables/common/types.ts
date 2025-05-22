export type SortOption = {
	key: string
	order: 'desc' | 'asc'
}

export type GroupOption = {
	key: string
	order: 'desc' | 'asc'
}

export interface DataOptions {
	page: number
	itemsPerPage: number
	sortBy: SortOption[]
	groupBy?: GroupOption[]
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
	items: unknown[]
	headers: DataTableHeaders
	options: DataOptions
}

export interface SyServerTableProps {
	serverItemsLength: number
	headers: DataTableHeaders
	options: DataOptions
}
