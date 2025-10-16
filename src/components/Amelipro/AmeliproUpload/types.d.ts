/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorBucket {
	fileName?: File['name']
	errors: string[]
}

export type Registrable = {
	register: (field: any) => void
	unregister: (field: any) => void
}
