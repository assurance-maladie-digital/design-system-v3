import { useValidatable } from '@/composables/validation/useValidatable'

export interface DatePickerFormRegistrationOptions {
	validateOnSubmit: () => Promise<boolean> | boolean
	clearValidation?: () => void
	reset?: () => void
}

/**
 * Single seam for SyForm registration while DatePicker validation is still
 * split from the future unified validation bridge.
 */
export const useDatePickerFormRegistration = (
	options: DatePickerFormRegistrationOptions,
): void => {
	useValidatable(
		options.validateOnSubmit,
		options.clearValidation,
		options.reset,
	)
}
