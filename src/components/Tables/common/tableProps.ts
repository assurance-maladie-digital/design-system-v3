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
	// Les options restaurées du localStorage complètent celles passées par le
	// projet, elles ne les remplacent pas : sinon toute clé absente du stockage
	// (`itemsPerPage` en tête) était silencieusement perdue pour le tableau
	// Vuetify interne, qui retombait alors sur son défaut de 10 lignes.
	const initialOptions: Partial<DataOptions> = {
		...(options.value || {}),
		...(storedOptions || {}),
	}

	const localOptions = ref<Partial<DataOptions>>(initialOptions)

	// `options` alimente le pied de tableau et `localOptions` le tableau Vuetify :
	// les deux doivent partir de la même valeur, le watcher ci-dessous n'étant pas
	// `immediate`.
	if (Object.keys(initialOptions).length > 0) {
		options.value = { ...initialOptions }
	}

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
