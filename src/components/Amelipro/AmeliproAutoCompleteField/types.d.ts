export interface InputAutoCompleteField {
	displayError: boolean
	errorMessages: string[]
	isValid: boolean
	menu: boolean
}

export interface AutoCompleteItem {
	disabled?: boolean
	title: string
	value: string | object
}
