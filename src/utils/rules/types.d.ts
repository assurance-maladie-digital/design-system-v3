export type Value = string | File | File[] | null
export type ValidationResult = string | boolean
// "any" car impossible de connaître à l'avance tous les types des valeurs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidationRule<T = Value> = (value: T, params?: any) => ValidationResult

export interface ValidationRules {
	[key: string]: ValidationRule
}

export type GenericFnOpt<T> = (arg?: T) => string
export type GenericFn<T> = (arg: T) => string

export interface ErrorMessages<T = string> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	[key: string]: GenericFn<T> | GenericFnOpt<T> | any
}

export interface IFileUploadRuleParams {
	fileList: File[]
	fileTypeAccepted: string[]
	maxFileNumber: number
}
