import type { Ref } from 'vue'
import type { DatePickerCommonProps } from '../../types'
import { DATE_PICKER_MESSAGES } from '../../constants/messages'

export const useSyTextFieldProps = (
	props: DatePickerCommonProps,
	labelWithAsterisk: Ref<string | undefined>,
	errorMessages: Ref<string[]>,
	warningMessages: Ref<string[]>,
	successMessages: Ref<string[]>,
	isOnSuccess: Ref<boolean>,
) => ({
	'aria-label': labelWithAsterisk.value || props.placeholder || DATE_PICKER_MESSAGES.LABEL_DEFAULT,
	'aria-labelledby': undefined,
	'append-icon': props.displayIcon && props.displayAppendIcon ? 'calendar' : undefined,
	'error-messages': errorMessages.value,
	'warning-messages': warningMessages.value,
	'success-messages': successMessages.value,
	'has-success': isOnSuccess.value,
	'disabled': props.disabled,
	'disable-click-button': props.textFieldActivator,
	'readonly': true,
	'label': labelWithAsterisk.value,
	'placeholder': props.placeholder,
	'no-icon': props.noIcon,
	'prepend-icon': props.displayIcon && !props.displayAppendIcon ? 'calendar' : undefined,
	'variant-style': props.isOutlined ? 'outlined' : 'underlined',
	'show-success-messages': props.showSuccessMessages,
	'bg-color': props.bgColor,
	'density': props.density,
	'hide-details': props.hideDetails,
	'display-asterisk': props.displayAsterisk,
	'is-clearable': !props.readonly,
	'auto-clamp': props.autoClamp,
	'title': props.title || props.placeholder,
	'hint': props.hint,
	'persistent-hint': props.persistentHint,
})
