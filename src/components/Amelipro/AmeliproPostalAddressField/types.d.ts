import type { InputPostalAddressAutoCompleteItem } from '../AmeliproPostalAddressCityRow/types'

export interface InputPostalAddressField {
	errorMessages: string[]
	isValid: boolean
}

export interface InputPostalAddressGroup {
	address: string | undefined
	postalCode: string | InputPostalAddressAutoCompleteItem | undefined
	city: string | InputPostalAddressAutoCompleteItem | undefined
	additionalInfo?: string | undefined
}

export interface InputPostalAddressAutoCompleteList {
	postalCode: string
	city: string
}
