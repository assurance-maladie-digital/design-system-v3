import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import deepmerge from 'deepmerge'

interface Props<T extends 'sync' | 'async'> {
	vuetifyOptions?: T
}

export default function useCustomizableOptions<T extends 'sync' | 'async'>(
	defaultOptions: T,
	props: Props<T>,
): ComputedRef<T> {
	return computed(() => {
		if (props.vuetifyOptions) {
			return deepmerge(defaultOptions, props.vuetifyOptions) as T
		}
		return defaultOptions
	})
}
