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
		const merged: Partial<DataOptions> = {
			...options.value,
			...tableOptions,
		}

		// Shallow equality check to prevent redundant reassignments (which would emit twice)
		const prev = options.value || {}
		let changed = false
		const keys = new Set([
			...Object.keys(prev as Record<string, unknown>),
			...Object.keys(merged as Record<string, unknown>),
		])
		for (const key of keys) {
			if ((prev as Record<string, unknown>)[key] !== (merged as Record<string, unknown>)[key]) {
				changed = true
				break
			}
		}

		if (changed) {
			options.value = merged
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
