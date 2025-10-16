/* eslint-disable @typescript-eslint/no-explicit-any */

export type Value = string | number | Date | File | any[] | null | undefined
export type ValidationResult = string | boolean

// "any" car impossible de connaître à l'avance tous les types des valeurs
export type ValidationRule<T = Value> = (value: T, params?: any) => ValidationResult

export interface ValidationRules {
	[key: string]: ValidationRule
}

export type GenericFnOpt<T> = (arg?: T) => string
export type GenericFn<T> = (arg: T) => string

export interface ErrorMessages<T = string> {
	[key: string]: GenericFn<T> | GenericFnOpt<T> | any
}

export interface IFileUploadRuleParams {
	fileList: File[]
	fileTypeAccepted: string[]
	maxFileNumber: number
}
