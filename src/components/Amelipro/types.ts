export type IndexedObject<T = string> = Record<string, T>

export type ValidateOnType = 'lazy' | ('input' | 'blur' | 'submit') | 'input lazy' | 'blur lazy' | 'submit lazy' | 'lazy input' | 'lazy blur' | 'lazy submit' | undefined
