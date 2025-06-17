export type StateTileTypes = Record<string, {
	bgColor: string
	borderColor: string
	downloadable: boolean
	textColor?: string
	icon?: {
		iconName: string
		iconColor: string
		iconBgColor: string
	}
}>
