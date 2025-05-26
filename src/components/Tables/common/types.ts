export type SortOptions = {
	key: string
	order: 'desc' | 'asc'
}

export type FilterType = 'text' | 'number' | 'date' | 'period' | 'select'

export interface FilterOption {
	key: string
	value: string | number | Date | Array <string | number | Date>
	type: FilterType
}

export interface DataOptions {
	page: number
	itemsPerPage: number
	sortBy: SortOptions[]
	groupBy?: SortOptions[]
	multiSort?: boolean
	mustSort?: boolean
	filters?: FilterOption[]
}

export type DataTableHeaders = {
	title?: string
	value?: string
	key?: string
	filterable?: boolean
	filterType?: FilterType
	filterOptions?: Array<{ text: string, value: null }>
}

// Component-specific props interfaces
export interface SyTableProps {
	suffix?: string
	itemsPerPage?: number
	caption?: string
	showFilters?: boolean
}

export interface SyServerTableProps {
	serverItemsLength: number
	suffix?: string
	itemsPerPage?: number
	caption: string
	showFilters: boolean
}
