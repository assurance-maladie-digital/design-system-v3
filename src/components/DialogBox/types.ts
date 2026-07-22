import type { CustomizableOptions } from '@/composables/useCustomizableOptions'
import type { VDialog } from 'vuetify/components'

export type DialogBoxOwnProps = {
	title?: string
	width?: VDialog['$props']['width']
	cancelBtnText?: string
	confirmBtnText?: string
	hideActions?: boolean
	persistent?: boolean
	autofocusValidateBtn?: boolean
	draggable?: boolean
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
	scrollable?: boolean
} & CustomizableOptions

export type DialogBoxVuetifyProps = VDialog['$props']
export type DialogBoxPublicProps = Omit<DialogBoxVuetifyProps, keyof DialogBoxOwnProps> & DialogBoxOwnProps
