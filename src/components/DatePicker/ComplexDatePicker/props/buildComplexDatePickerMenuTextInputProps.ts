import type { Ref } from 'vue'
import type { DatePickerCommonProps } from '../../types'
import { buildSharedDateTextInputProps } from '../../props/buildSharedDateTextInputProps'
import type { DatePickerFieldAppearance } from '../../composables/useDatePickerFieldAppearance'

export const buildComplexDatePickerMenuTextInputProps = (
	props: DatePickerCommonProps,
	labelWithAsterisk: Ref<string | undefined>,
	errorMessages: Ref<string[]>,
	warningMessages: Ref<string[]>,
	successMessages: Ref<string[]>,
	appearance: DatePickerFieldAppearance,
) => ({
	...buildSharedDateTextInputProps(props, labelWithAsterisk, errorMessages, warningMessages, successMessages, appearance),
	'display-range': props.displayRange,
	'density': appearance.density,
	// Le champ sert d'activateur du calendrier : on avertit via aria-describedby
	// (sauf quand le champ est désactivé ou en lecture seule, car rien ne s'ouvre alors).
	'calendar-activator': !(props.disabled || props.readonly),
	// Icône calendrier = bouton focusable au clavier (comme en CalendarMode), pas une
	// icône décorative. Elle ouvre le calendrier au clic/Enter/Espace et reçoit le ring DS.
	'disable-click-button': false,
	'validate-on-model-change': false,
})
