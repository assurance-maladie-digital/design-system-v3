import type { VDataTableServer } from 'vuetify/components'

export type SortOptions = {
	key: string
	order: 'desc' | 'asc'
}

export type FilterType = 'text' | 'number' | 'date' | 'period' | 'select' | 'custom'

export type TableDensityType = 'default' | 'comfortable' | 'compact'

export interface FilterOption {
	key: string
	value: string | number | Date | Array<string | number | Date> | { from: string | null, to: string | null } | Record<string, unknown> | null | undefined
	type: FilterType
}

export type SyHeader = NonNullable<VDataTableServer['$props']['headers']>[number] & {
	hidden?: boolean
	filterable?: boolean
	order?: number
}

export type SyHeaders = SyHeader[]

export interface DataOptions {
	page: number
	itemsPerPage: number
	sortBy: SortOptions[]
	groupBy?: SortOptions[]
	multiSort?: boolean
	mustSort?: boolean
	filters?: FilterOption[]
}

// Component-specific props interfaces
export interface SyTableProps {
	items?: Record<string, unknown>[]
	suffix: string
	itemsPerPage?: number
	caption?: string
	showFilters?: boolean
	headers?: SyHeaders[]
	filterInputConfig?: Record<string, unknown>
	density?: TableDensityType
	striped?: boolean
	resizableColumns?: boolean
}

export type SyServerTableBaseProps = {
	serverItemsLength: number
	items?: Record<string, unknown>[]
	suffix: string
	itemsPerPage?: number
	hide?: boolean
	caption?: string
	showFilters?: boolean
	resizableColumns?: boolean
	filterInputConfig?: Record<string, unknown>
	density?: TableDensityType
	striped?: boolean
}

export type SyServerTableProps =
	| (SyServerTableBaseProps & {
		enableColumnControls?: false
		headers?: SyHeaders
	})
	| (SyServerTableBaseProps & {
		enableColumnControls: true
		headers: SyHeaders
	})
