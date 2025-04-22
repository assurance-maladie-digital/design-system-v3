import type { SelectItem } from '../AmeliproSelect/types'

export interface AmeliproTab {
	disabled: boolean
	label: string
	notification?: number
}

export interface AmeliproTabsSelect {
	modelValue: SelectItem
}
