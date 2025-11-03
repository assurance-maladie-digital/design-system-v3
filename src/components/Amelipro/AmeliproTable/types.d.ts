export interface AmeliproTableCell {
	columnClasses: string | undefined
	columnAlign: string
	value: string | number | undefined
}

export interface AmeliproTableHeader {
	name: string
	title: string
	align: string
	headerClasses?: string
	cellsClasses?: string
	minWidth: string
	width: string
	maxWidth: string
	descriptionId?: string
	sort?: IHeaderSort
}

export interface ISortBtn {
	label: string
	disabled: boolean
}

export interface IHeaderSort {
	ascendant?: IsortBtn
	descendant?: IsortBtn
}

export interface AmeliproCurrentPage {
	activePage: number
}

export interface AmeliproPaginationSelect {
	inputValue: number
}

export interface AmeliproSortSelect {
	inputValue: string | number
}

export interface AmeliproTableSortBtnEvent {
	name: string
	sort: 'ASC' | 'DESC'
}
