export interface IndexedObject<T = string> {
	[key: string]: T
}

export type ValidateOnType = 'lazy' | ('input' | 'blur' | 'submit') | 'input lazy' | 'blur lazy' | 'submit lazy' | 'lazy input' | 'lazy blur' | 'lazy submit' | undefined

export interface IDataListItem {
	id: number
	[key: string]: string | number | undefined
	accordionTitle?: string
}

export type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'smAndDown' | 'smAndUp' | 'mdAndDown' | 'mdAndUp' | 'lgAndDown' | 'lgAndUp' | 'xlAndDown'
