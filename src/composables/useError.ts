export interface TUseError {
	propError: (msg: string) => void
}
export const useError = (): TUseError => {
	const propError = (msg: string): void => {
		throw new Error(msg)
	}
	return { propError }
}
