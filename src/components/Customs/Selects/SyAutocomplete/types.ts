export type ItemType = {
	[key: string]: unknown
}

export type SelectValue = Record<string, unknown> | string | number | boolean | null | undefined

export type SelectArray = Array<Record<string, unknown> | string | number | boolean>
