import type { Ref } from 'vue'
import type { DatePickerCommonProps } from '../../types'
import { buildSharedDateTextInputProps } from '../../props/buildSharedDateTextInputProps'

export const buildComplexDatePickerMenuTextInputProps = (
	props: DatePickerCommonProps,
	labelWithAsterisk: Ref<string | undefined>,
	errorMessages: Ref<string[]>,
	warningMessages: Ref<string[]>,
	successMessages: Ref<string[]>,
) => ({
	...buildSharedDateTextInputProps(props, labelWithAsterisk, errorMessages, warningMessages, successMessages),
	'display-range': props.displayRange,
	'density': props.density,
	// Icône calendrier = bouton focusable au clavier (comme en CalendarMode), pas une
	// icône décorative. Elle ouvre le calendrier au clic/Enter/Espace et reçoit le ring DS.
	'disable-click-button': false,
})
