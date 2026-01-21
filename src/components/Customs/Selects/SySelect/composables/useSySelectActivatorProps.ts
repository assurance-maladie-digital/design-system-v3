import type { Ref } from 'vue'
import type { VTextField } from 'vuetify/components'

export interface UseSySelectActivatorPropsOptions {
	textInput: Ref<InstanceType<typeof VTextField> | null>
}

export function useSySelectActivatorProps(options: UseSySelectActivatorPropsOptions) {
	const initializeActivatorProps = (activatorProps: Record<string, unknown>) => {
		const asRecord = activatorProps as Record<string, unknown>
		return {
			...asRecord,
			onKeydown: undefined,
			onClick: undefined,
			ref: (el: unknown) => {
				options.textInput.value = el as InstanceType<typeof VTextField>
				const refFn = (activatorProps as { ref?: (el: unknown) => void }).ref
				refFn?.(el)
			},
		}
	}

	return { initializeActivatorProps }
}
