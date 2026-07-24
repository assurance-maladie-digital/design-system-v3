import type { FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { VTextarea } from 'vuetify/components'
import { locales as defaultLocales } from './locales'
import type { DeepPartial } from '@/utils/locales/mergeLocales'

export type SyTextAreaOwnProps = {
	uniqueId?: string
	counter?: boolean | number | string
	modelValue?: string
	trim?: boolean
	replaceTabs?: number
	required?: boolean
	maxLines?: number
	autoWrap?: number
	normalize?: boolean
	validateOn?: VTextarea['validateOn']
	variant?: VTextarea['variant']
	color?: string
	label: string
	bgColor?: string
	clearable?: boolean
	helpText?: string
	hideDetails?: boolean
	displayAsterisk?: boolean
	locales?: DeepPartial<typeof defaultLocales>
} & FieldValidationProps

export type SyTextAreaVuetifyProps = VTextarea['$props']
export type SyTextAreaPublicProps = Omit<SyTextAreaVuetifyProps, keyof SyTextAreaOwnProps> & SyTextAreaOwnProps
