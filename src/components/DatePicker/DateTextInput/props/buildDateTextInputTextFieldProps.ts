import type { Ref } from 'vue'
import type { DateTextInputProps } from '../../types'

export const buildDateTextInputTextFieldProps = (
	props: DateTextInputProps,
	errorMessages: Ref<string[]>,
	warningMessages: Ref<string[]>,
	successMessages: Ref<string[]>,
	isOnError: Ref<boolean>,
	isOnWarning: Ref<boolean>,
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
	'required': props.required,
	'variant-style': props.isOutlined ? 'outlined' : 'underlined',
	'warning-messages': warningMessages.value,
	'success-messages': successMessages.value,
	'has-error': isOnError.value,
	'has-warning': isOnWarning.value,
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
	// En mode Vuetify, les `rules` sont portées par le champ texte, comme l'activateur du
	// mode calendrier : il s'enregistre dans le VForm, qui les évalue au submit même si
	// le champ n'a jamais été touché.
	'use-vuetify-validation': props.useVuetifyValidation,
	'rules': props.useVuetifyValidation ? props.rules : undefined,
})
