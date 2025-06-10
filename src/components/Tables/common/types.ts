export type SortOptions = {
	key: string
	order: 'desc' | 'asc'
}

export type FilterType = 'text' | 'number' | 'date' | 'period' | 'select' | 'custom'

export interface FilterOption {
	key: string
	value: string | number | Date | Array<string | number | Date> | { from: string | null, to: string | null } | Record<string, unknown> | null | undefined
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
	filterOptions?: Array<{ text: string, value: unknown }>
	hideMessages?: boolean
	dateFormat?: string
}

// Type to handle both Vuetify internal headers and our custom headers
export type TableColumnHeader = {
	title?: string
	value?: unknown
	key?: string | null
	filterable?: boolean
	filterType?: FilterType
	filterOptions?: Array<{ text: string, value: unknown }>
	hideMessages?: boolean
	dateFormat?: string
	sort?: unknown
	filter?: unknown
	width?: string | number
	align?: string
	children?: unknown[]
	[key: string]: unknown // Allow for any additional properties from Vuetify
}

// Component-specific props interfaces
export interface SyTableProps {
	items?: Record<string, unknown>[]
	suffix: string
	itemsPerPage?: number
	caption?: string
	showFilters?: boolean
	headers?: DataTableHeaders[]
	filterInputConfig?: Record<string, unknown>
	density?: 'default' | 'comfortable' | 'compact'
	striped?: boolean
}

export interface SyServerTableProps {
	serverItemsLength: number
	items?: Record<string, unknown>[]
	suffix: string
	itemsPerPage?: number
	caption?: string
	showFilters?: boolean
	headers?: DataTableHeaders[]
	filterInputConfig?: Record<string, unknown>
	density?: 'default' | 'comfortable' | 'compact'
	striped?: boolean
}
