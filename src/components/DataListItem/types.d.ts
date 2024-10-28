import { useCustomizableOptions } from '@/composables/customizable'
import { IndexedObject } from '@/types'

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
