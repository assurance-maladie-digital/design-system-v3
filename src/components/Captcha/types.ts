import type { FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { DeepPartial } from '@/utils/locales/mergeLocales'
import type { locales as defaultLocales } from './locales'

export type CaptchaType = 'image' | 'audio' | 'choice'
export type StateType = 'idle' | 'pending' | 'resolved' | 'rejected'

export type CaptchaProps = FieldValidationProps & {
	modelValue?: string | undefined
	urlCreate: string
	urlGetImage: string
	urlGetAudio: string
	type?: CaptchaType
	tagTitle?: string
	helpDesk?: string | false
	isClearable?: boolean
	locale?: string
	locales?: DeepPartial<typeof defaultLocales>
}
