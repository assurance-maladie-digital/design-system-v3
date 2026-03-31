<script setup lang="ts">
	import { computed, nextTick, onMounted, onUnmounted, provide, ref, toRef, useAttrs, watch } from 'vue'
	import type { VDataTableServer } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import TableHeader from '../common/TableHeader.vue'
	import SyTablePagination from '../common/SyTablePagination.vue'
	import { locales } from '../common/locales'
	import OrganizeColumns from '../common/organizeColumns/OrganizeColumns.vue'
	import { useTableProps } from '../common/tableProps'
	import type { DataOptions, Items, SyServerTableProps, TableColumnHeader } from '../common/types'
	import { useTableFilter } from '../common/useTableFilter'
	import { usePagination } from '../common/usePagination'
	import { useTableOptions } from '../common/useTableOptions'
	import { useTableHeaders } from '../common/useTableHeaders'
	import { useTableCheckbox } from '../common/useTableCheckbox'
	import { useTableAria } from '../common/useTableAria'
	import { useTableAccessibility } from '../common/tableAccessibilityUtils'
	import useStoredOptions from '../common/useStoredOptions'

	const props = withDefaults(defineProps<SyServerTableProps>(), {
		caption: '',
		saveState: true,
		showFilters: false,
		// Do not default items to [] so we can detect undefined during refetch
		items: undefined,
		serverItemsLength: 0,
		resizableColumns: false,
		filterInputConfig: () => ({}),
		density: 'default',
		striped: false,
		showSelect: false,
		showSelectSingle: false,
		multiSort: false,
		mustSort: false,
		itemsPerPageOptions: undefined,
		headingLevel: 2,
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const model = defineModel<unknown[]>('modelValue', {
		required: false,
		default: () => [],
	})

	const table = ref<VDataTableServer>()

	// Get filter utilities
	const { filterItems } = useTableFilter()

	// Use the table options composable
	const { filters } = useTableOptions({
		options,
	})

	const componentAttributes = useAttrs()

	// Generate a unique ID for this table instance
	const uniqueTableId = ref(`sy-server-table-${Math.random().toString(36).substr(2, 9)}`)

	const { storedOptions, storeOptions } = useStoredOptions({
		key: computed(() => props.suffix ? `server-table-${props.suffix}` : 'server-table'),
		saveState: toRef(props, 'saveState'),
	})

	const {
		propsFacade,
		updateOptions,
	} = useTableProps({
		componentAttributes,
		options,
		storedOptions: storedOptions.options,
	})

	const { setupAccessibility } = useTableAccessibility({
		tableId: uniqueTableId.value,
	})

	// Use the table headers composable
	const { headers, displayHeaders, getEnhancedHeader, getHeaderForColumn } = useTableHeaders({
		headersProp: toRef(props, 'headers'),
		storedHeaders: storedOptions.headers,
		filterInputConfig: props.filterInputConfig,
	})

	const getHeaderForColumnCompat = (column: unknown) => {
		return getHeaderForColumn(column)
	}

	// Use the pagination composable with displayedItemsLength (stable during refetch)
	const itemsLength = computed(() => displayedItemsLength.value)
	const { page, pageCount, itemsPerPageValue, updateItemsPerPage, isUpdatingItemsPerPage } = usePagination({
		options,
		itemsLength,
	})

	const tableWrapperEl = ref<HTMLElement | null>(null)
	const showPinnedLeftShadow = ref(false)
	const showPinnedRightShadow = ref(false)

	const updatePinnedShadows = () => {
		const el = tableWrapperEl.value
		if (!el) return
		const max = el.scrollWidth - el.clientWidth
		const leftActive = pinnedMeta.value.totalLeft > 0
		const rightActive = pinnedMeta.value.totalRight > 0
		showPinnedLeftShadow.value = leftActive && el.scrollLeft > 0
		showPinnedRightShadow.value = rightActive && max > 0 && el.scrollLeft < max - 1
	}

	// Defines a function to handle updating the data table options
	function onUpdateOptions(newOptions: Partial<DataOptions>) {
		if (isUpdatingItemsPerPage.value && typeof newOptions.itemsPerPage !== 'undefined') {
			// Creates a copy of the received options
			const rest = { ...newOptions }
			delete (rest as Record<string, unknown>).itemsPerPage
			// Updates the other options without modifying itemsPerPage
			updateOptions(rest)
			return
		}
		// In all other cases, simply updates the options with the new values
		updateOptions(newOptions)
	}

	// Create a computed property for items to ensure reactivity
	// Bind to displayedItems so it is always an array
	const tableItems = computed<Items>(() => displayedItems.value)

	// Keep last non-undefined items to avoid clearing the table during refetches
	const lastNonUndefinedItems = ref<Items>([])
	const isRefetching = ref(false)
	watch(() => props.items, (newVal) => {
		if (Array.isArray(newVal)) {
			lastNonUndefinedItems.value = newVal
			isRefetching.value = false
		}
		else if (newVal === undefined) {
			// Parent temporarily cleared items
			isRefetching.value = true
		}
	}, { immediate: true })

	const displayedItems = computed<Items>(() => {
		return Array.isArray(props.items) ? props.items : lastNonUndefinedItems.value
	})

	// Keep last non-undefined server items length as well
	const lastNonUndefinedLength = ref<number>(0)
	watch([() => props.items, () => props.serverItemsLength], ([itemsVal, lenVal]) => {
		// Update cached length only when we have a valid items array
		if (Array.isArray(itemsVal) && typeof lenVal === 'number') {
			lastNonUndefinedLength.value = lenVal
			isRefetching.value = false
		}
		else if (!Array.isArray(itemsVal)) {
			isRefetching.value = true
		}
	}, { immediate: true })

	const displayedItemsLength = computed<number>(() => {
		// If current items are an array, use current prop length; otherwise, keep last known length
		return Array.isArray(props.items)
			? (typeof props.serverItemsLength === 'number' ? props.serverItemsLength : lastNonUndefinedLength.value)
			: lastNonUndefinedLength.value
	})

	// Timeout management for cleanup
	const timeouts = ref<ReturnType<typeof setTimeout>[]>([])

	// Function to add accessibility attributes to row checkboxes
	const accessibilityRowCheckboxes = () => {
		nextTick(() => {
			const timeoutId = setTimeout(() => {
				// Check if document is available (for test environment)
				if (typeof document === 'undefined') return

				const tableElement = document.getElementById(uniqueTableId.value)
				if (!tableElement) return

				// Find all row checkboxes
				const rowCheckboxes = tableElement.querySelectorAll('td .v-selection-control input[type="checkbox"]')
				rowCheckboxes.forEach((checkbox, index) => {
					const rowLabel = `${locales.selectRow} ${index + 1}`
					checkbox.setAttribute('aria-label', rowLabel)
					checkbox.setAttribute('title', rowLabel)
				})
			}, 100) // Small delay to ensure DOM is updated

			// Track timeout for cleanup
			timeouts.value.push(timeoutId)
		})
	}

	// Watch for changes that might affect the table and update accessibility
	watch(() => props.items, accessibilityRowCheckboxes, { deep: true })
	watch(() => displayedItemsLength.value, accessibilityRowCheckboxes)
	watch(() => page.value, accessibilityRowCheckboxes)

	// Apply accessibility attributes when component is mounted
	onMounted(() => {
		accessibilityRowCheckboxes()
		setupAria()
		nextTick(() => {
			tableWrapperEl.value = (table.value?.$el as HTMLElement | undefined)?.querySelector('.v-table__wrapper') ?? null
			updatePinnedShadows()
			tableWrapperEl.value?.addEventListener('scroll', updatePinnedShadows, { passive: true })
			window.addEventListener('resize', updatePinnedShadows)
		})
	})

	// Clean up timeouts on unmount to prevent unhandled errors
	onUnmounted(() => {
		timeouts.value.forEach((timeoutId) => {
			clearTimeout(timeoutId)
		})
		timeouts.value = []
		tableWrapperEl.value?.removeEventListener('scroll', updatePinnedShadows)
		window.removeEventListener('resize', updatePinnedShadows)
	})

	const { getItemValue, toggleAllRows } = useTableCheckbox({
		items: tableItems,
		modelValue: model,
		updateModelValue: (value) => {
			if (props.showSelectSingle && Array.isArray(value)) {
				// In single-select mode, always keep at most one selected value
				model.value = value.length > 0 ? [value[0]] : []
			}
			else {
				model.value = value
			}
		},
		selectionKey: toRef(props, 'selectionKey'),
	})

	// Use the ARIA accessibility composable
	const {
		statusRegionId,
		statusMessage,
		setupAria,
	} = useTableAria({
		table,
		items: computed(() => displayedItems.value),
		totalItemsCount: itemsLength,
		options,
		uniqueTableId: uniqueTableId.value,
	})

	defineExpose({ filterItems })

	setupAccessibility()

	// Create a reactive reference to column widths that will be provided to children
	const reactiveColumnWidths = ref(storedOptions.columnWidths || {})

	const parseWidthPx = (val: unknown): number => {
		if (typeof val === 'number' && Number.isFinite(val)) return val
		if (typeof val === 'string') {
			const trimmed = val.trim()
			if (trimmed.endsWith('px')) {
				const n = Number.parseFloat(trimmed.slice(0, -2))
				return Number.isFinite(n) ? n : 0
			}
			const n = Number.parseFloat(trimmed)
			return Number.isFinite(n) ? n : 0
		}
		return 0
	}

	const normalizedPinnedColumns = computed(() => {
		const raw = props.pinnedColumns ?? (props.pinnedColumnKey ? [props.pinnedColumnKey] : [])
		return raw.map((c) => {
			if (typeof c === 'string') return { key: c, side: 'left' as const }
			return { key: c.key, side: c.side ?? 'left' as const }
		})
	})

	const pinnedLeftKeys = computed(() =>
		normalizedPinnedColumns.value
			.filter(c => c.side !== 'right')
			.map(c => c.key),
	)

	const pinnedRightKeys = computed(() =>
		normalizedPinnedColumns.value
			.filter(c => c.side === 'right')
			.map(c => c.key),
	)

	const getColumnWidthPx = (headersList: TableColumnHeader[], key: string): number => {
		if (key === 'data-table-select' || key === 'data-table-expand' || key === 'data-table-group') return 48
		const storedWidth = reactiveColumnWidths.value[key]
		if (storedWidth != null) return parseWidthPx(storedWidth)
		const h = headersList.find(x => (x.key ?? x.value) === key)
		return parseWidthPx(h?.width ?? h?.minWidth ?? h?.maxWidth)
	}

	const pinnedMeta = computed(() => {
		const headersList = displayHeaders.value
		if (!headersList) return { left: {}, right: {}, totalLeft: 0, totalRight: 0 } as { left: Record<string, number>, right: Record<string, number>, totalLeft: number, totalRight: number }

		const left: Record<string, number> = {}
		let accLeft = 0
		for (const h of headersList) {
			const key = (h.key ?? h.value) as string | undefined
			if (!key) continue
			if (pinnedLeftKeys.value.includes(key)) {
				left[key] = accLeft
				accLeft += getColumnWidthPx(headersList as TableColumnHeader[], key)
			}
		}

		const right: Record<string, number> = {}
		let accRight = 0
		for (const h of [...headersList].reverse()) {
			const key = (h.key ?? h.value) as string | undefined
			if (!key) continue
			if (pinnedRightKeys.value.includes(key)) {
				right[key] = accRight
				accRight += getColumnWidthPx(headersList as TableColumnHeader[], key)
			}
		}

		return { left, right, totalLeft: accLeft, totalRight: accRight }
	})

	const pinnedEdgeVars = computed<Record<string, string>>(() => {
		const { totalLeft, totalRight } = pinnedMeta.value
		return {
			...(totalLeft > 0 ? { '--sy-pinned-left-edge': `${totalLeft}px` } : {}),
			...(totalRight > 0 ? { '--sy-pinned-right-edge': `${totalRight}px` } : {}),
		}
	})

	const displayHeadersWithPinned = computed(() => {
		const headersList = displayHeaders.value
		if (!headersList) return headersList

		const leftOffsets = pinnedMeta.value.left
		const rightOffsets = pinnedMeta.value.right

		if (Object.keys(leftOffsets).length === 0 && Object.keys(rightOffsets).length === 0) return headersList

		return headersList.map((h) => {
			const key = (h.key ?? h.value) as string | undefined
			if (!key) return h

			const left = leftOffsets[key]
			const right = rightOffsets[key]
			if (left === undefined && right === undefined) return h

			const headerProps = (h.headerProps ?? {}) as Record<string, unknown>
			const headerStyle = (headerProps.style ?? {}) as Record<string, string | number>

			const cellProps = (h.cellProps ?? {}) as Record<string, unknown>
			const cellStyle = (cellProps.style ?? {}) as Record<string, string | number>

			const stickyStyle: Record<string, string | number> = {
				position: 'sticky',
				zIndex: 4,
				background: 'var(--sy-table-header-bg-pinned)',
			}

			const stickyCellStyle: Record<string, string | number> = {
				position: 'sticky',
				zIndex: 3,
				background: 'rgb(var(--v-theme-surface))',
			}

			const sideClass = left !== undefined ? 'sy-table__pinned--left' : 'sy-table__pinned--right'
			if (left !== undefined) {
				stickyStyle.left = `${left}px`
				stickyCellStyle.left = `${left}px`
			}
			else if (right !== undefined) {
				stickyStyle.right = `${right}px`
				stickyCellStyle.right = `${right}px`
			}

			return {
				...h,
				headerProps: {
					...headerProps,
					class: ['sy-table__pinned', sideClass, headerProps.class].filter(Boolean),
					style: {
						...headerStyle,
						...stickyStyle,
					},
				},
				cellProps: {
					...cellProps,
					class: ['sy-table__pinned', sideClass, cellProps.class].filter(Boolean),
					style: {
						...cellStyle,
						...stickyCellStyle,
					},
				},
			}
		})
	})

	// Provide column widths and update function to child components
	provide('columnWidths', reactiveColumnWidths)
	provide('updateColumnWidth', (key: string, width: number | string) => {
		// Update both the local reactive reference and call the storage utility
		reactiveColumnWidths.value[key] = width
	})

	// Save options, headers, and column widths to local storage whenever they change
	watch(
		[
			() => options.value,
			() => headers.value,
			() => reactiveColumnWidths.value,
		],
		() => {
			if (!props.saveState) return
			storeOptions({
				options: options.value,
				headers: headers.value,
				columnWidths: reactiveColumnWidths.value,
			})
		},
		{ deep: true },
	)
</script>

<template>
	<div
		:id="uniqueTableId"
		:class="[
			'sy-server-table',
			{
				'sy-server-table--striped': props.striped,
				'sy-server-table--pinned-left-shadow': showPinnedLeftShadow,
				'sy-server-table--pinned-right-shadow': showPinnedRightShadow,
			},
		]"
		:style="pinnedEdgeVars"
	>
		<!-- ARIA status region for row count announcements -->
		<div
			:id="statusRegionId"
			role="status"
			aria-live="polite"
			class="d-sr-only"
		>
			{{ statusMessage }}
		</div>
		<VDataTableServer
			ref="table"
			v-bind="propsFacade"
			v-model="model"
			:headers="displayHeadersWithPinned"
			color="primary"
			:items="displayedItems"
			:items-length="displayedItemsLength || 0"
			:density="props.density"
			:show-select="props.showSelect || props.showSelectSingle"
			:select-strategy="props.showSelectSingle ? 'single' : 'page'"
			:item-selectable="(item) => true"
			:item-value="getItemValue"
			:multi-sort="props.multiSort"
			:must-sort="props.mustSort"
			:show-expand="props.showExpand"
			@update:options="onUpdateOptions"
		>
			<template #top>
				<caption
					class="text-subtitle-1 text-center pa-4"
					:class="{ 'd-sr-only': props.caption === '' }"
					:aria-label="props.caption"
				>
					{{ props.caption }}
				</caption>
			</template>
			<template #headers="slotProps">
				<template v-if="slotProps && slotProps.columns">
					<tr class="headers">
						<template
							v-for="column in slotProps.columns"
							:key="column.key!"
						>
							<th
								:class="{ 'checkbox-column': column.key === 'data-table-select' }"
								:style="{
									...(getHeaderForColumnCompat(column)?.maxWidth ? { maxWidth: getHeaderForColumnCompat(column)?.maxWidth as any } : {}),
									...(getHeaderForColumnCompat(column)?.minWidth ? { minWidth: getHeaderForColumnCompat(column)?.minWidth as any } : {}),
									...(getHeaderForColumnCompat(column)?.width ? { width: getHeaderForColumnCompat(column)?.width as any } : {}),
									...(pinnedMeta.left[column.key!] !== undefined
										? { position: 'sticky', left: `${pinnedMeta.left[column.key!] }px`, zIndex: 5, background: 'var(--sy-table-header-bg-pinned)' }
										: {}),
									...(pinnedMeta.right[column.key!] !== undefined
										? { position: 'sticky', right: `${pinnedMeta.right[column.key!] }px`, zIndex: 5, background: 'var(--sy-table-header-bg-pinned)' }
										: {}),
								}"
							>
								<template v-if="column.key === 'data-table-select' && props.showSelect && !props.showSelectSingle">
									<SyCheckbox
										:model-value="slotProps.allSelected"
										:indeterminate="slotProps.someSelected && !slotProps.allSelected"
										color="primary"
										density="compact"
										hide-details
										:is-header="true"
										:aria-label="locales.selectAllRows"
										:title="locales.selectAllRows"
										@click="toggleAllRows"
									>
										<template #label>
											<span class="d-sr-only">{{ locales.selectAllRows }}</span>
										</template>
									</SyCheckbox>
								</template>
								<template v-else>
									<TableHeader
										:table="table"
										:header-params="slotProps"
										:column="column"
										:header-props-raw="getHeaderForColumn(column)?.headerProps as any"
										:resizable-columns="props.resizableColumns"
									>
										<template
											v-for="slotName in Object.keys($slots)"
											#[slotName]="currentSlotProps"
										>
											<slot
												:name="slotName"
												v-bind="currentSlotProps ?? {}"
											/>
										</template>
									</TableHeader>
								</template>
							</th>
						</template>
					</tr>
					<tr
						v-if="props.showFilters"
						class="filters"
					>
						<th v-if="props.showSelect || props.showSelectSingle" />
						<template
							v-for="column in slotProps.columns.filter(c => c.key !== 'data-table-select')"
							:key="column.key!"
						>
							<th
								:style="{
									...(getHeaderForColumnCompat(column)?.maxWidth ? { maxWidth: getHeaderForColumnCompat(column)?.maxWidth as any } : {}),
									...(getHeaderForColumnCompat(column)?.minWidth ? { minWidth: getHeaderForColumnCompat(column)?.minWidth as any } : {}),
									...(getHeaderForColumnCompat(column)?.width ? { width: getHeaderForColumnCompat(column)?.width as any } : {}),
								}"
							>
								<!-- Check if the column is filterable based on the headers prop -->
								<SyTableFilter
									v-if="!props.headers?.find(h => (h.key === column.key || h.value === column.key) && h.filterable === false)"
									:filterable="true"
									:filters="filters"
									:header="getEnhancedHeader(column)"
									:input-config="props.filterInputConfig"
									@update:filters="filters = $event"
								>
									<template #custom-filter="filterSlotProps">
										<slot
											name="filter.custom"
											:header="filterSlotProps.header"
											:value="filterSlotProps.value"
											:update-filter="filterSlotProps.updateFilter"
										/>
									</template>
								</SyTableFilter>
							</th>
						</template>
					</tr>
					<tr
						v-if="props.showFilters && filters.length > 0"
						class="reset"
					>
						<td
							:colspan="slotProps.columns.length"
							class="text-right px-4 py-2"
						>
							<VBtn
								size="small"
								color="primary"
								variant="outlined"
								@click="filters = []"
							>
								{{ locales.resetFilters }}
							</VBtn>
						</td>
					</tr>
				</template>
				<!-- Repli lorsque les colonnes ne sont pas définies -->
				<template v-else>
					<tr class="headers">
						<th
							v-for="header in props.headers || []"
							:key="header.key || header.value || ''"
						>
							<span class="font-weight-bold">{{ header.title }}</span>
						</th>
					</tr>
					<tr
						v-if="props.showFilters"
						class="filters"
					>
						<th
							v-for="header in props.headers || []"
							:key="header.key || header.value || ''"
						>
							<SyTableFilter
								v-if="header.filterable"
								:filters="filters"
								:header="header"
								:input-config="props.filterInputConfig"
								@update:filters="filters = $event"
							>
								<template #custom-filter="customFilterSlotProps">
									<slot
										name="filter.custom"
										:header="customFilterSlotProps.header"
										:value="customFilterSlotProps.value"
										:update-filter="customFilterSlotProps.updateFilter"
									/>
								</template>
							</SyTableFilter>
						</th>
					</tr>
				</template>
			</template>

			<!-- Dynamically forward all slots to maintain flexibility -->
			<template
				v-for="slotName in Object.keys($slots)"
				#[slotName]="slotProps"
			>
				<slot
					:name="slotName"
					v-bind="slotProps ?? {}"
				/>
			</template>

			<template #bottom>
				<div class="d-flex align-center pa-2">
					<OrganizeColumns
						v-if="props.enableColumnControls && headers"
						v-model:headers="headers"
					/>
					<SyTablePagination
						v-if="displayedItems.length > 0 ? displayedItemsLength : 0"
						:page="page"
						:heading-level="props.headingLevel"
						:items-per-page="itemsPerPageValue"
						:page-count="pageCount"
						:items-length="displayedItemsLength"
						:items-per-page-options="props.itemsPerPageOptions"
						@update:page="updateOptions({ page: $event })"
						@update:items-per-page="updateItemsPerPage"
					/>
				</div>
			</template>
		</VDataTableServer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;
@use '@/assets/tokens';

.sy-server-table :deep() {
	@include tablestyles;
}

@mixin striped-rows {
	.v-table tbody tr:nth-child(even) {
		background-color: rgba(tokens.$primary-base, 0.05);
	}
}

.sy-server-table--striped :deep() {
	@include striped-rows;
}

.checkbox-column {
	max-width: fit-content;
}

.sy-server-table :deep(.sy-table__pinned) {
	box-shadow: none;
}

.sy-server-table--pinned-left-shadow :deep(.sy-table__pinned--left) {
	box-shadow: 2px 0 6px -4px rgba(tokens.$grey-base, 0.6);
}

.sy-server-table--pinned-right-shadow :deep(.sy-table__pinned--right) {
	box-shadow: -2px 0 6px -4px rgba(tokens.$grey-base, 0.6);
}

</style>
