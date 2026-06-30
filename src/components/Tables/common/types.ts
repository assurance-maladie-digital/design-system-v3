export type SortOptions = {
	key: string
	order: 'desc' | 'asc'
}

export type FilterType = 'text' | 'number' | 'date' | 'period' | 'select' | 'autocomplete' | 'custom'
type FilterValue =
	| string
	| number
	| Date
	| Array<string | number | Date | Record<string, unknown>>
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

/**
 * Une ligne de tableau : un enregistrement indexable par clé de colonne.
 * Type de base pour toutes les manipulations de lignes (sélection, édition,
 * filtrage). Sert de contrainte aux signatures génériques sur la ligne.
 */
export type Item = Record<string, unknown>

/**
 * Liste de lignes de tableau. Générique sur le type de ligne afin de pouvoir
 * préserver un type concret de bout en bout ; `Item` par défaut.
 */
export type Items<TItem extends Item = Item> = TItem[]

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
	editable?: boolean
	hideMessages?: boolean
	dateFormat?: string
	align?: 'start' | 'end' | 'center'
	order?: number
	hidden?: boolean
	width?: string | number
	maxWidth?: string | number
	minWidth?: string | number
	headerProps?: Record<string, unknown>
	cellProps?: Record<string, unknown>
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
	headerProps?: unknown
	cellProps?: unknown
	[key: string]: unknown // Allow for any additional properties from Vuetify
}

// Component-specific props interfaces
export type SyTableProps = {
	items?: Items
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
	stickySelect?: boolean
	showExpand?: boolean
	selectionKey?: string
	multiSort?: boolean
	mustSort?: boolean
	itemsPerPageOptions?: number[]
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
	pinnedColumns?: Array<string | { key: string, side?: 'left' | 'right' }>
	pinnedColumnKey?: string
	clickableRow?: boolean
	pageInput?: boolean
	hideDefaultFooter?: boolean
	/** Active l'édition inline des lignes (cf. flag `editable` par colonne) */
	editable?: boolean
	/** Affiche la barre d'actions groupées avec un bouton de suppression en masse (nécessite `showSelect`) */
	showDeleteSelected?: boolean
	/** Affiche le bouton d'édition groupée dans la barre d'actions (nécessite `showSelect`) */
	showEditSelected?: boolean
	/** Personnalise le libellé de décompte de la barre d'actions groupées (reçoit le nombre de lignes) */
	bulkSelectedLabel?: (count: number) => string
	/** Personnalise le titre de la boîte d'édition groupée (reçoit le nombre de lignes) */
	bulkEditTitle?: (count: number) => string
	/** Personnalise le libellé de position en édition séquentielle (ligne courante / total) */
	bulkEditPositionLabel?: (current: number, total: number) => string
}

export type SyServerTableProps = {
	serverItemsLength: number
	items?: Items
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
	stickySelect?: boolean
	showExpand?: boolean
	selectionKey?: string
	multiSort?: boolean
	mustSort?: boolean
	itemsPerPageOptions?: number[]
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
	pinnedColumns?: Array<string | { key: string, side?: 'left' | 'right' }>
	pinnedColumnKey?: string
	clickableRow?: boolean
	pageInput?: boolean
	hideDefaultFooter?: boolean
	/** Active l'édition inline des lignes (cf. flag `editable` par colonne) */
	editable?: boolean
	/** Affiche la barre d'actions groupées avec un bouton de suppression en masse (nécessite `showSelect`) */
	showDeleteSelected?: boolean
	/** Affiche le bouton d'édition groupée dans la barre d'actions (nécessite `showSelect`) */
	showEditSelected?: boolean
	/** Personnalise le libellé de décompte de la barre d'actions groupées (reçoit le nombre de lignes) */
	bulkSelectedLabel?: (count: number) => string
	/** Personnalise le titre de la boîte d'édition groupée (reçoit le nombre de lignes) */
	bulkEditTitle?: (count: number) => string
	/** Personnalise le libellé de position en édition séquentielle (ligne courante / total) */
	bulkEditPositionLabel?: (current: number, total: number) => string
}
