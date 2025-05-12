import type { RouteLocationRaw } from 'vue-router'

export interface AmeliproMailTileType {
	commentValue?: boolean
	mailObject: string
	messageInfoFirstLine: string
	messageInfoSecondLine: string
	messageInfoThirdLine?: string
	date: string
	hour: string
	href?: string
	to?: RouteLocationRaw
	readValue?: boolean
}
