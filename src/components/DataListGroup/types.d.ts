import type { DataList } from '../DataList/types'

export interface DataListActionEvent {
	dataListIndex: number
	itemIndex: number
}

export interface DataListGroupItem {
	title?: string
	items: DataList
	headingLoading?: boolean
	itemsNumberLoading?: number
}

export type DataListGroupItems = DataListGroupItem[]
