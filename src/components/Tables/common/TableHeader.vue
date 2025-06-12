<script setup lang="ts">
	import { computed, nextTick, onMounted, ref, inject, watch, type Ref } from 'vue'
	import type { VDataTable, VDataTableServer } from 'vuetify/components'
	import { locales } from './locales'

	// Define a type for our column structure
	type TableColumn = {
		key: string | null
		title?: string
		value: unknown
		sortable: boolean
		rowspan?: number
		colspan?: number
		width?: number | string
		sortBy?: string
	}

	// Define a type for the header parameters
	interface TableData {
		columns: TableColumn[]
		sortBy?: unknown
		someSelected?: boolean
		allSelected?: boolean
		getSortIcon: (column: unknown) => string | undefined
		toggleSort: (column: unknown) => void
	}

	const props = withDefaults(defineProps<{
		column: TableColumn
		headerParams: TableData
		table: VDataTable | VDataTableServer | null | undefined
		resizableColumns?: boolean
		storageKey?: string
	}>(), {
		resizableColumns: false,
		storageKey: undefined,
	})

	const header = computed(() => {
		return props.headerParams.columns.find(header => header.key === props.column.key)
	})

	const isLastColumn = computed(() => {
		const columnIndex = props.headerParams.columns.findIndex(header => header.key === props.column.key)
		return columnIndex === props.headerParams.columns.length - 1
	})

	const wrapper = ref<HTMLElement | null>(null)

	const initialWidth = ref<number | null>(null)

	// Inject stored column widths if available
	const storedColumnWidths = inject<Ref<Record<string, number | string>>>('columnWidths', ref({}))

	onMounted(() => {
		nextTick(() => {
			if (wrapper.value) {
				initialWidth.value = wrapper.value.offsetWidth

				// Apply stored width if available for this column
				if (header.value?.key && storedColumnWidths?.value?.[header.value.key]) {
					header.value.width = storedColumnWidths.value[header.value.key]
				}
			}
		})
	})

	// Re-apply column width on header changes (ex when table re-renders due to pagination)
	watch(
		() => props.column,
		() => {
			nextTick(() => {
				if (header.value?.key && storedColumnWidths?.value?.[header.value.key]) {
					header.value.width = storedColumnWidths.value[header.value.key]
				}
			})
		},
		{ immediate: true },
	)

	// Watch for changes to column widths and apply them
	watch(
		() => storedColumnWidths?.value,
		(newWidths) => {
			if (newWidths && header.value?.key && newWidths[header.value.key]) {
				header.value.width = newWidths[header.value.key]
			}
		},
		{ deep: true },
	)

	const updateColumnWidth = inject<(key: string, width: number | string) => void>('updateColumnWidth', () => {})

	function resetColumnWidth() {
		if (header.value && initialWidth.value) {
			header.value.width = initialWidth.value

			// Save the reset width to localStorage if column key exists
			if (header.value.key) {
				updateColumnWidth(header.value.key, initialWidth.value)
			}
		}
	}

	function startResize(event: MouseEvent) {
		const startX = event.clientX
		const startWidth = wrapper.value!.offsetWidth + 24 + 1 / 2 * 16

		function onMouseMove(e: MouseEvent) {
			const newWidth = Math.max(50, startWidth + (e.clientX - startX))
			if (wrapper.value) {
				header.value!.width = newWidth
			}
		}

		function onMouseUp() {
			document.removeEventListener('mousemove', onMouseMove)
			document.removeEventListener('mouseup', onMouseUp)

			// Save column width to localStorage if column key exists
			if (header.value?.key) {
				updateColumnWidth(header.value.key, header.value.width || initialWidth.value || 0)
			}
		}

		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mouseup', onMouseUp)
	}

	const tableWidth = ref(0)
	onMounted(async () => {
		await nextTick()
		if (props.table) {
			tableWidth.value = props.table.$el.offsetWidth
		}
	})
	window.addEventListener('resize', () => {
		if (props.table) {
			tableWidth.value = props.table.$el.offsetWidth
		}
	})

	function resizeKeyboardColumn(increment: number) {
		const currentWidth = wrapper.value?.offsetWidth || 0
		if (wrapper.value) {
			const newWidth = Math.max(50, currentWidth + increment)
			header.value!.width = newWidth

			// Save column width to localStorage if column key exists
			if (header.value?.key) {
				updateColumnWidth(header.value.key, newWidth)
			}
		}
	}
</script>

<template>
	<div
		ref="wrapper"
		class="v-data-table-header__content d-flex align-center h-100"
	>
		<div class="col-title">
			{{ column.title }}
		</div>
		<VIcon
			v-if="header!.sortable"
			class="v-data-table-header__sort-icon"
			:class="`mr-2 ${column.sortBy ? 'text-primary' : ''}`"
			:icon="headerParams.getSortIcon(column)"
			:title="locales.columnOrder(column.title!)"
			:aria-label="locales.columnOrder(column.title!)"
			@click="headerParams.toggleSort(column)"
		/>
		<button
			v-if="props.resizableColumns && !isLastColumn"
			type="button"
			class="resizer"
			tabindex="0"
			role="separator"
			:aria-valuenow="(column.width as number)"
			:aria-valuemin="0"
			:aria-valuemax="tableWidth"
			:aria-label="locales.ResizableColumn"
			@mousedown="startResize"
			@dblclick="resetColumnWidth"
			@keydown.right.prevent="resizeKeyboardColumn(10)"
			@keydown.left.prevent="resizeKeyboardColumn(-10)"
		/>
	</div>
</template>

<style lang="scss" scoped>
.resizer {
	margin-left: auto;
	flex: 0 0 auto;
	cursor: col-resize;
	background-color: #f0f0f0;
	position: relative;
	width: 1rem;
	height: 100%;
	left: calc(24px - 1rem / 2);

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 0.1rem;
		height: 100%;
		background:
			repeating-linear-gradient(
				transparent,
				#a7a7a7 0,
				#a7a7a7 5px,
				transparent 5px,
				transparent 7px
			);
	}
}
</style>
