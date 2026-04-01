import { computed, nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { DataTableHeaders, TableColumnHeader } from './types'

interface UsePinnedColumnsOptions {
	displayHeaders: Ref<DataTableHeaders[] | undefined>
	reactiveColumnWidths: Ref<Record<string, number | string>>
	pinnedColumns: Ref<Array<string | { key: string, side?: 'left' | 'right' }> | undefined>
	pinnedColumnKey: Ref<string | undefined>
	stickySelect: Ref<boolean>
	showSelect: Ref<boolean>
	showSelectSingle: Ref<boolean>
	tableRef: Ref<{ $el?: Element } | undefined>
}

export function usePinnedColumns({
	displayHeaders,
	reactiveColumnWidths,
	pinnedColumns,
	pinnedColumnKey,
	stickySelect,
	showSelect,
	showSelectSingle,
	tableRef,
}: UsePinnedColumnsOptions) {
	const tableWrapperEl = ref<HTMLElement | null>(null)
	const showPinnedLeftShadow = ref(false)
	const showPinnedRightShadow = ref(false)

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
		const raw = pinnedColumns.value ?? (pinnedColumnKey.value ? [pinnedColumnKey.value] : [])
		return raw.map((c) => {
			if (typeof c === 'string') return { key: c, side: 'left' as const }
			return { key: c.key, side: c.side ?? 'left' as const }
		})
	})

	const pinnedLeftKeys = computed(() =>
		normalizedPinnedColumns.value.filter(c => c.side !== 'right').map(c => c.key),
	)

	const pinnedRightKeys = computed(() =>
		normalizedPinnedColumns.value.filter(c => c.side === 'right').map(c => c.key),
	)

	const stickySelectActive = computed(() => Boolean(stickySelect.value) && (showSelect.value || showSelectSingle.value))
	const hasPinnedSelectLeft = computed(() => pinnedLeftKeys.value.includes('data-table-select') || stickySelectActive.value)

	const getColumnWidthPx = (headersList: TableColumnHeader[], key: string): number => {
		if (key === 'data-table-select' || key === 'data-table-expand' || key === 'data-table-group') return 48
		const storedWidth = reactiveColumnWidths.value[key]
		if (storedWidth != null) return parseWidthPx(storedWidth)
		const h = headersList.find(x => (x.key ?? x.value) === key)
		return parseWidthPx(h?.width ?? h?.minWidth ?? h?.maxWidth)
	}

	const pinnedMeta = computed(() => {
		const headersList = displayHeaders.value
		if (!headersList) return { left: {} as Record<string, number>, right: {} as Record<string, number>, totalLeft: 0, totalRight: 0 }

		const left: Record<string, number> = {}
		let accLeft = 0
		if (hasPinnedSelectLeft.value) {
			left['data-table-select'] = 0
			accLeft = getColumnWidthPx(headersList as TableColumnHeader[], 'data-table-select')
		}
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

	const updatePinnedShadows = () => {
		const el = tableWrapperEl.value
		if (!el) return
		const max = el.scrollWidth - el.clientWidth
		showPinnedLeftShadow.value = pinnedMeta.value.totalLeft > 0 && el.scrollLeft > 0
		showPinnedRightShadow.value = pinnedMeta.value.totalRight > 0 && max > 0 && el.scrollLeft < max - 1
	}

	const pinnedEdgeVars = computed<Record<string, string>>(() => {
		const { totalLeft, totalRight } = pinnedMeta.value
		return {
			...(totalLeft > 0 ? { '--sy-pinned-left-edge': `${totalLeft}px` } : {}),
			...(totalRight > 0 ? { '--sy-pinned-right-edge': `${totalRight}px` } : {}),
		}
	})

	// Only cellProps are needed here — headerProps are applied inline in the #headers slot template
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

			const cellProps = (h.cellProps ?? {}) as Record<string, unknown>
			const cellStyle = (cellProps.style ?? {}) as Record<string, string | number>

			const stickyCellStyle: Record<string, string | number> = {
				position: 'sticky',
				zIndex: 3,
				background: 'rgb(var(--v-theme-surface))',
			}

			const sideClass = left !== undefined ? 'sy-table__pinned--left' : 'sy-table__pinned--right'
			if (left !== undefined) {
				stickyCellStyle.left = `${left}px`
			}
			else if (right !== undefined) {
				stickyCellStyle.right = `${right}px`
			}

			return {
				...h,
				cellProps: {
					...cellProps,
					class: ['sy-table__pinned', sideClass, 'v-data-table-column--fixed', cellProps.class].filter(Boolean),
					style: { ...cellStyle, ...stickyCellStyle },
				},
			}
		})
	})

	onMounted(() => {
		nextTick(() => {
			tableWrapperEl.value = (tableRef.value?.$el as HTMLElement | undefined)?.querySelector('.v-table__wrapper') ?? null
			updatePinnedShadows()
			tableWrapperEl.value?.addEventListener('scroll', updatePinnedShadows, { passive: true })
			window.addEventListener('resize', updatePinnedShadows)
		})
	})

	onUnmounted(() => {
		tableWrapperEl.value?.removeEventListener('scroll', updatePinnedShadows)
		window.removeEventListener('resize', updatePinnedShadows)
	})

	return {
		showPinnedLeftShadow,
		showPinnedRightShadow,
		hasPinnedSelectLeft,
		pinnedMeta,
		pinnedEdgeVars,
		displayHeadersWithPinned,
	}
}
