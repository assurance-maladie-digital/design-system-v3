import { computed, ref, watch, type Ref } from 'vue'
import type { DataOptions } from './types'

export function useTableProps({
	componentAttributes,
	serverItemsLength,
	options,
	storedOptions,
}: {
	componentAttributes: Record<string, unknown>
	serverItemsLength?: number
	options: Ref<Partial<DataOptions>>
	storedOptions?: Partial<DataOptions>
}): {
		propsFacade: Ref<Record<string, unknown>>
		updateOptions: (tableOptions: Partial<DataOptions>) => void
	} {
	const localOptions = ref<Partial<DataOptions>>(storedOptions || options.value || {})

	const propsFacade = computed(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { 'onUpdate:options': _, ...attrs } = componentAttributes

		const props = {
			...attrs,
			...localOptions.value,
			...(serverItemsLength !== undefined ? { itemsLength: serverItemsLength } : {}),
		}

		return props
	})

	// When the table options are updated, merge them into localOptions
	function updateOptions(tableOptions: Partial<DataOptions>): void {
		options.value = {
			...options.value,
			...tableOptions,
		}
	}

	// Watch for external changes to options and update localOptions accordingly
	watch(options, (newOptions) => {
		localOptions.value = {
			...localOptions.value,
			...newOptions,
		}
	})

	return {
		propsFacade,
		updateOptions,
	}
}
