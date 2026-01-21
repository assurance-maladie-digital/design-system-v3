import type { Ref } from 'vue'
import type { VTextField } from 'vuetify/components'

export type SyAutocompleteActivatorProps = Record<string, unknown> & {
	onClick?: unknown
	ref?: (el: unknown) => void
}

export interface UseSyAutocompleteActivatorPropsOptions {
	textInput: Ref<InstanceType<typeof VTextField> | null>
}

export function useSyAutocompleteActivatorProps(options: UseSyAutocompleteActivatorPropsOptions) {
	const initializeActivatorProps = (activatorProps: SyAutocompleteActivatorProps) => {
		return {
			...activatorProps,
			onClick: undefined,
			ref: (el: unknown) => {
				options.textInput.value = el as InstanceType<typeof VTextField>
				activatorProps.ref?.(el)
			},
		}
	}

	return { initializeActivatorProps }
}
