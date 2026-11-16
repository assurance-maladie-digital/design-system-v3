import type { Ref } from 'vue'
import type { DatePickerCommonProps } from '../../types'
import { buildSharedDateTextInputProps } from '../../props/buildSharedDateTextInputProps'
import type { DatePickerFieldAppearance } from '../../composables/useDatePickerFieldAppearance'

export const buildComplexDatePickerTextInputProps = (
	props: DatePickerCommonProps,
	labelWithAsterisk: Ref<string | undefined>,
	errorMessages: Ref<string[]>,
	warningMessages: Ref<string[]>,
	successMessages: Ref<string[]>,
	appearance: DatePickerFieldAppearance,
) => ({
	...buildSharedDateTextInputProps(props, labelWithAsterisk, errorMessages, warningMessages, successMessages, appearance),
	'validate-on-model-change': false,
})
