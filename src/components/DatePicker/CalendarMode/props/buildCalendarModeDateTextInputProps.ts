import type { Ref } from 'vue'
import type { DatePickerCommonProps } from '../../types'
import { buildSharedDateTextInputProps } from '../../props/buildSharedDateTextInputProps'

export const buildCalendarModeDateTextInputProps = (
	props: DatePickerCommonProps,
	labelWithAsterisk: Ref<string | undefined>,
	errorMessages: Ref<string[]>,
	warningMessages: Ref<string[]>,
	successMessages: Ref<string[]>,
) => ({
	...buildSharedDateTextInputProps(props, labelWithAsterisk, errorMessages, warningMessages, successMessages),
	displayRange: props.displayRange,
	width: props.width,
	period: props.period,
})
