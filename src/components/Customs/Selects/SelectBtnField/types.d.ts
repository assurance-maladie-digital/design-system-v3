export type SelectBtnValue
	= | string
		| number
		| boolean
		| Array<string | number | boolean | null | undefined>
		| null

export interface SelectBtnItem {
	text: string
	value: string | number | boolean
	unique?: boolean
}
