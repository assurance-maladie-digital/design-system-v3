export type SortOptions = {
	key: string
	order: 'desc' | 'asc'
}

export type FilterType = 'text' | 'number' | 'date' | 'period' | 'select' | 'custom'
type FilterValue =
	| string
	| number
	| Date
	| Array<string | number | Date>
	| { from: string | null, to: string | null }
	| Record<string, unknown>
	| null
	| undefined
export type TableDensityType = 'default' | 'comfortable' | 'compact'

export interface FilterOption {
	key: string
	value: FilterValue
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
	text?: string
	value?: string
	key?: string
	filterable?: boolean
	filterType?: FilterType
	filterOptions?: Array<{ text: string, value: unknown }>
	multiple?: boolean
	chips?: boolean
	sortable?: boolean
	hideMessages?: boolean
	dateFormat?: string
	align?: 'start' | 'end' | 'center'
	order?: number
	hidden?: boolean
	width?: string | number
	maxWidth?: string | number
	minWidth?: string | number
	headerProps?: Record<string, unknown>
}

// Type to handle both Vuetify internal headers and our custom headers
export type TableColumnHeader = {
	title?: string
	value?: unknown
	key?: string | null
	filterable?: boolean
	filterType?: FilterType
	filterOptions?: Array<{ text: string, value: unknown }>
	multiple?: boolean
	chips?: boolean
	hideMessages?: boolean
	dateFormat?: string
	sort?: unknown
	filter?: unknown
	width?: string | number
	align?: string
	children?: unknown[]
	maxWidth?: string | number
	minWidth?: string | number
	headerProps?: Record<string, unknown>
	[key: string]: unknown // Allow for any additional properties from Vuetify
}

// Component-specific props interfaces
export type SyTableProps = {
	items?: Record<string, unknown>[]
	suffix: string
	saveState?: boolean
	caption?: string
	showFilters?: boolean
	filterInputConfig?: Record<string, unknown>
	density?: TableDensityType
	striped?: boolean
	resizableColumns?: boolean
	enableColumnControls?: boolean
	headers?: DataTableHeaders[]
	showSelect?: boolean
	showSelectSingle?: boolean
	showExpand?: boolean
	selectionKey?: string
	multiSort?: boolean
	mustSort?: boolean
	itemsPerPageOptions?: number[]
}

export type SyServerTableProps = {
	serverItemsLength: number
	items?: Record<string, unknown>[]
	suffix: string
	saveState?: boolean
	caption?: string
	showFilters?: boolean
	resizableColumns?: boolean
	filterInputConfig?: Record<string, unknown>
	density?: TableDensityType
	striped?: boolean
	enableColumnControls?: boolean
	headers?: DataTableHeaders[]
	showSelect?: boolean
	showSelectSingle?: boolean
	showExpand?: boolean
	selectionKey?: string
	multiSort?: boolean
	mustSort?: boolean
	itemsPerPageOptions?: number[]
}
