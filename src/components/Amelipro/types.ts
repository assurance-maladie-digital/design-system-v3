export interface IndexedObject<T = string> {
	[key: string]: T
}

export type ValidateOnType = 'lazy' | ('input' | 'blur' | 'submit') | 'input lazy' | 'blur lazy' | 'submit lazy' | 'lazy input' | 'lazy blur' | 'lazy submit' | undefined
