export type CaptchaType = 'image' | 'audio' | 'choice'
export type StateType = 'idle' | 'pending' | 'resolved' | 'rejected'
import type { FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { locales as defaultLocales } from './locales'

export type CaptchaProps = FieldValidationProps & {
	modelValue?: string | undefined
	urlCreate: string
	urlGetImage: string
	urlGetAudio: string
	type?: CaptchaType
	tagTitle?: string
	helpDesk?: string | false
	locale?: string
	locales?: typeof defaultLocales
}
