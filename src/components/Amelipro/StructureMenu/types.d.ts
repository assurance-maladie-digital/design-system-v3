import type { IStructureTabs, StructureTab } from './StructureTabs/types'

export interface IStructureMenuValue extends IStructureTabs {
	dialog: boolean
}

export interface StructureMenuInfosForHeader {
	maxStructuresLoadedDefault?: number
	structuresTabs: StructureTab[]
	uniqueId: string
	userAdeli: string
	userName: string
	userProfession: string
	userRpps: string
	defaultSelected?: IStructureTabs
	cancel?: CallableFunction
	change?: CallableFunction
	input?: CallableFunction
	validate?: CallableFunction
}

export interface StructureMenuInfos {
	maxStructuresLoadedDefault?: number
	structuresTabs: StructureTab[]
	uniqueId: string
	userAdeli: string
	userName: string
	userProfession: string
	userRpps: string
	value: IStructureMenuValue
	cancel?: CallableFunction
	change?: CallableFunction
	input?: CallableFunction
	validate?: CallableFunction
}
