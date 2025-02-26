export type ChipState = 'success' | 'warning' | 'error' | 'info' | ''

export interface ChipItem {
	text: string
	value: string
	state: ChipState
}
