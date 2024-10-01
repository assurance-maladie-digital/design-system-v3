import { computed, toRaw, type ComputedRef } from 'vue'
import deepmerge from 'deepmerge'

type PropsList = Record<string, unknown>
type ComponentsProps = Record<string, PropsList>
export interface CustomizableOptions {
	vuetifyOptions?: ComponentsProps
}

export default function useCustomizableOptions<T1 extends ComponentsProps, T2 extends ComponentsProps>(
	defaultOptions: T1,
	props: { vuetifyOptions?: T2 },
): ComputedRef<T1 & T2>
export default function useCustomizableOptions<T extends ComponentsProps>(
	defaultOptions: Partial<T>,
	props: { vuetifyOptions?: Partial<T> },
): ComputedRef<T>
export default function useCustomizableOptions(
	defaultOptions: ComponentsProps,
	props: CustomizableOptions,
) {
	return computed(() => deepmerge(defaultOptions, toRaw(props.vuetifyOptions) ?? {}))
}
