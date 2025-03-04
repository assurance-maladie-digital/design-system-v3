export type ChipState = 'success' | 'warning' | 'error' | 'info' | undefined

export interface ChipItem {
	text: string
	value: unknown
	state?: ChipState
}
