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
	sortBy: string[] | string
	sortDesc: boolean[] | boolean
	groupBy?: string[] | string
	groupDesc?: boolean[] | boolean
	multiSort?: boolean
	mustSort?: boolean
}

export interface PaginatedTableProps {
	items: unknown[]
	headers: DataTableHeaders
	options: DataOptions
}

export type DataTableHeaders = {
	title?: string
	value?: string
	key?: string
}
