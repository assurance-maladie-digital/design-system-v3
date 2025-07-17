import type { Structure } from '../StructureItem/types'

export interface StructureTab {
	label: string
	structures: Structure[]
	listLabel?: string
}

export interface IStructureTabs {
	activeTab: number
	activeValue?: string
}
