export type ItemType = {
	[key: string]: unknown
}

export type SelectPrimitive = string | number | boolean

export type SelectValue = Record<string, unknown> | SelectPrimitive | null | undefined

export type SelectArray = Array<Record<string, unknown> | SelectPrimitive>
