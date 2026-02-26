import { computed } from 'vue'

export type TextFieldProps = {
	label: string
	density?: 'default' | 'comfortable' | 'compact'
	helpText?: string
	placeholder?: string
}

export const defaultTextFieldProps = {
	density: 'default',
} as const satisfies Partial<TextFieldProps>

export function useTextField(props: TextFieldProps) {
	return computed(() => ({
		label: props.label,
		density: props.density,
		helpText: props.helpText,
		placeholder: props.placeholder,
	}))
}
