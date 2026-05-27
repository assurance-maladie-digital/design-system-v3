import { computed } from 'vue'

export type TextFieldProps = {
	label: string
	density?: 'default' | 'comfortable' | 'compact'
	hint?: string | false
	placeholder?: string
	disabled?: boolean
	readonly?: boolean
	clearable?: boolean
}

export const defaultTextFieldProps = {
	density: 'default',
	disabled: false,
	readonly: false,
	clearable: false,
} as const satisfies Partial<TextFieldProps>

export function useTextField(props: TextFieldProps) {
	return computed(() => ({
		label: props.label,
		density: props.density,
		hint: props.hint || undefined,
		placeholder: props.placeholder,
		disabled: props.disabled ? true : undefined,
		readonly: props.readonly ? true : undefined,
		clearable: props.clearable,
	}))
}
