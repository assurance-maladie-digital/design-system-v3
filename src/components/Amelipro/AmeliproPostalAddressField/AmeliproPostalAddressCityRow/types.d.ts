import type { AutoCompleteItem } from '../AmeliproAutoCompleteField/types'

export interface InputPostalAddressCityRowGroup {
	postalCode: string | AutoCompleteItem | undefined
	city: string | AutoCompleteItem | undefined
}

export interface InputPostalAddressAutoCompleteItem {
	postalCode: string
	city: string
	disabled?: boolean
}
