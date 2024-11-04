import { useCustomizableOptions } from '@/composables/useCustomizableOptions'

export interface IndexedObject<Type = string> {
	[key: string]: Type
}

export interface DataListItem {
	key: string
	value?: string | number
	action?: string
	chip?: boolean
	icon?: string
	options?: useCustomizableOptions
	class?: string
}

export type DataList = DataListItem[]

export interface DataListIcons {
	[iconName: string]: string
}

export type ItemClass = (string | undefined | IndexedObject<boolean>)[]
