import { computed, onMounted, ref, type Ref } from 'vue'
import type { DataOptions, SortOption, GroupOption } from './types'
import { LocalStorageUtility } from '@/utils/localStorageUtility'

/**
 * Creates and returns common table functionality
 */
export function useTableUtils({
	tableId,
	prefix,
	suffix,
	itemsPerPage,
	caption,
	serverItemsLength,
	componentAttributes,
	options,
}: {
	tableId: string
	prefix: string
	suffix?: string
	itemsPerPage?: number
	caption: string
	serverItemsLength?: number
	componentAttributes: Record<string, unknown>
	options: Ref<Partial<DataOptions>>
}) {
	const localStorageUtility = new LocalStorageUtility()
	const localOptions = ref({})

	const storageKey = computed(() => {
		return suffix ? `${prefix}-${suffix}` : prefix
	})

	const headers = computed(() => {
		if (!Array.isArray(componentAttributes['headers'])) {
			return undefined
		}
		return componentAttributes['headers'].map(header => ({
			...header,
			title: header.title ?? header.text,
		}))
	})

	const optionsFacade = computed(() => {
		return {
			page: options.value.page || componentAttributes['page'],
			itemsPerPage: options.value.itemsPerPage || itemsPerPage,
			sortBy: options.value.sortBy,
			groupBy: options.value.groupBy,
			multiSort: options.value.multiSort,
			mustSort: options.value.mustSort,
		}
	})

	const propsFacade = computed(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { 'onUpdate:options': _, ...attrs } = componentAttributes

		const props = {
			...attrs,
			headers: headers.value,
			...localOptions.value,
			...(serverItemsLength !== undefined ? { itemsLength: serverItemsLength } : {}),
		}

		// Add itemsLength only for server tables
		if (serverItemsLength !== undefined) {
			props.itemsLength = serverItemsLength
		}

		return props
	})

	function updateOptions(tableOptions: SortOption[] | GroupOption[]): void {
		options.value = {
			...options.value,
			...tableOptions,
		}
	}

	function setupAccessibility() {
		onMounted(() => {
			const table = document.querySelector(`#${tableId} table`)
			const captionElement = document.createElement('caption')
			captionElement.innerHTML = caption
			if (caption === 'caption') {
				captionElement.classList.add('d-sr-only')
			}
			else {
				captionElement.classList.add('text-subtitle-1')
			}
			table?.prepend(captionElement)

			const inputs = document.querySelectorAll(`#${tableId} input`)
			inputs.forEach((input) => {
				(input as HTMLElement).removeAttribute('aria-describedby')
			})

			const fields = document.querySelectorAll(`#${tableId} .v-field`)
			fields.forEach((field) => {
				(field as HTMLElement).setAttribute('tabindex', '0')
			})

			const fieldLabels = document.querySelectorAll(`#${tableId} .v-field`)
			fieldLabels.forEach((fieldLabel) => {
				(fieldLabel as HTMLElement).setAttribute('aria-label', 'items per page')
			})

			const fieldTitles = document.querySelectorAll(`#${tableId} .v-field`)
			fieldTitles.forEach((fieldTitle) => {
				(fieldTitle as HTMLElement).setAttribute('title', 'items per page')
			})

			const th = document.querySelectorAll(`#${tableId} th`)
			for (let i = 0; i < th.length; i++) {
				th[i].setAttribute('scope', 'col')
			}
		})
	}

	// Setup local storage synchronization
	function setupLocalStorage() {
		// Watch for options changes and update local storage
		const watchOptions = () => {
			const storageData = {
				...(optionsFacade.value as Record<string, unknown>),
				itemsLength: serverItemsLength,
			}

			// Add itemsLength only for server tables
			if (serverItemsLength !== undefined) {
				storageData.itemsLength = serverItemsLength
			}

			localStorageUtility.setItem(storageKey.value, storageData)
			localOptions.value = optionsFacade.value
		}

		// Initialize local options from storage or defaults
		localOptions.value = localStorageUtility.getItem(storageKey.value) ?? optionsFacade.value

		return { watchOptions }
	}

	return {
		localOptions,
		storageKey,
		headers,
		optionsFacade,
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
	}
}
