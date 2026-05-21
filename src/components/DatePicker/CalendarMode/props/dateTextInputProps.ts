import type { Ref } from 'vue'
import type { DatePickerCommonProps } from '../../types'
import { useDateTextInputBaseProps } from '../../props/dateTextInputBaseProps'

export const useDateTextInputProps = (
	props: DatePickerCommonProps,
	labelWithAsterisk: Ref<string | undefined>,
	errorMessages: Ref<string[]>,
) => ({
	...useDateTextInputBaseProps(props, labelWithAsterisk, errorMessages),
	displayRange: props.displayRange,
	width: props.width,
	period: props.period,
})
