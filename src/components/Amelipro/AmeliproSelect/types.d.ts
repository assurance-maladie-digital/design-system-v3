export interface SelectItem {
	title: string | number
	value: string | number
	disabled?: boolean
}

export interface InputSelect {
	errorMessages: string[]
	isValid: boolean
}
