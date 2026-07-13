import type { Ref } from 'vue'
import type { DateTextInputProps } from '../../types'

export const useSyTextFieldProps = (
	props: DateTextInputProps,
	errorMessages: Ref<string[]>,
	warningMessages: Ref<string[]>,
	successMessages: Ref<string[]>,
	isOnSuccess: Ref<boolean>,
	ariaLabel: string,
) => ({
	'append-icon': props.displayIcon && props.displayAppendIcon ? 'calendar' : undefined,
	'disabled': props.disabled,
	'disable-click-button': props.disableClickButton,
	'error-messages': errorMessages.value,
	'label': props.label,
	'placeholder': props.placeholder,
	'no-icon': props.noIcon,
	'prepend-icon': props.displayIcon && props.displayPrependIcon && !props.displayAppendIcon ? 'calendar' : undefined,
	'readonly': props.readonly,
	'variant-style': props.isOutlined ? 'outlined' : 'underlined',
	'warning-messages': warningMessages.value,
	'success-messages': successMessages.value,
	'has-success': isOnSuccess.value,
	'show-success-messages': props.showSuccessMessages,
	'bg-color': props.bgColor,
	'is-clearable': !props.readonly,
	'aria-label': ariaLabel,
	'is-validate-on-blur': props.isValidateOnBlur,
	'density': props.density,
	'title': props.title,
	'hint': props.hint,
	'persistent-hint': props.persistentHint,
})
