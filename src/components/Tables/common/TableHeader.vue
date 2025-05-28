<script setup lang="ts">
	import { computed, nextTick, onMounted, ref } from 'vue'
	import type { VDataTable, VDataTableServer } from 'vuetify/components'

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

	type TableData = {
		columns: TableColumn[]
		sortBy: unknown
		someSelected: boolean
		allSelected: boolean
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getSortIcon: (column: any) => string | any
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		toggleSort: (column: any) => void
	}

	const props = withDefaults(defineProps<{
		column: TableColumn
		headerParams: TableData
		table: VDataTable | VDataTableServer | null | undefined
		resizableColumns?: boolean
	}>(), {
		resizableColumns: false,
	})

	const header = computed(() => {
		return props.headerParams.columns.find(header => header.key === props.column.key)
	})

	const isLastColumn = computed(() => {
		const columnIndex = props.headerParams.columns.findIndex(header => header.key === props.column.key)
		return columnIndex === props.headerParams.columns.length - 1
	})

	const wrapper = ref<HTMLElement | null>(null)

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
		}

		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mouseup', onMouseUp)
	}

	// Get table width for aria-valuemax attributes in resizers
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
		const currentWidth = wrapper.value!.offsetWidth + 24 + 1 / 2 * 16

		if (wrapper.value) {
			const newWidth = Math.max(50, currentWidth + increment)
			header.value!.width = newWidth
		}
	}
</script>

<template>
	<div
		ref="wrapper"
		class="v-data-table-header__content d-flex align-center h-100"
	>
		<VIcon
			v-if="header!.sortable"
			class="v-data-table-header__sort-icon"
			:class="`mr-2 ${column.sortBy ? 'text-primary' : ''}`"
			:icon="headerParams.getSortIcon(column)"
			:title="`Trier par ${column.title}`"
			aria-label="Trier par colonne"
			@click="headerParams.toggleSort(column)"
		/>
		<div class="col-title">
			{{ column.title }}
		</div>
		<div
			v-if="resizableColumns && !isLastColumn"
			class="resizer"
			role="slider"
			tabindex="0"
			title="Redimensionner la colonne"
			aria-label="Redimensionner la colonne"
			aria-orientation="horizontal"
			:aria-valuenow="(column.width as number)"
			aria-valuemin="0"
			:aria-valuemax="tableWidth"
			@mousedown="startResize"
			@keydown.left="resizeKeyboardColumn(-10)"
			@keydown.right="resizeKeyboardColumn(10)"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.col-title {
		flex: 1;
	}

	.resizer {
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
