import { ComponentPublicInstance } from 'vue'

declare module '@vue/test-utils' {
	interface VueWrapper {
		vm: ComponentPublicInstance & {
			dialCode: {
				code: string
				country: string
				abbreviation: string
				phoneLength: number
				mask: string
			} | null
			errors: string[]
			hasError: boolean
			phoneMask: string
			validateOnSubmit: () => Promise<boolean>
		}
	}
}
