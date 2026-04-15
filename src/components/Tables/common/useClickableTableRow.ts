import { computed, type ComputedRef, type Ref } from 'vue'

type ClickableTableItem = Record<string, unknown>

type TableRowData = {
	index: number
	item: ClickableTableItem
	internalItem: unknown
}

type TableRowEventHandler<TEvent extends Event> = ((event: TEvent) => void) | Array<(event: TEvent) => void>
type TableRowProps = Record<string, unknown>
export type ClickableTableRowPropsInput = TableRowProps | ((data: TableRowData) => TableRowProps) | undefined

function callEventHandler<TEvent extends Event>(handler: TableRowEventHandler<TEvent> | unknown, event: TEvent): void {
	if (Array.isArray(handler)) {
		handler.forEach((currentHandler) => {
			currentHandler(event)
		})
		return
	}

	if (typeof handler === 'function') {
		handler(event)
	}
}

function resolveRowProps(rowProps: ClickableTableRowPropsInput, data: TableRowData): TableRowProps {
	if (typeof rowProps === 'function') {
		return rowProps(data)
	}

	return rowProps ?? {}
}

function isElementInteractive(element: HTMLElement | null): boolean {
	if (!element) {
		return false
	}

	return Boolean(element.closest('a, button, input, select, textarea, summary, [role="button"], [role="link"], [role="checkbox"], [role="menuitem"], [contenteditable="true"], [data-sy-row-click-ignore]'))
}

function isFromNestedInteractiveElement(event: Event): boolean {
	const target = event.target as HTMLElement | null
	const currentTarget = event.currentTarget as HTMLElement | null

	if (!target || !currentTarget || target === currentTarget) {
		return false
	}

	return isElementInteractive(target)
}

export function useClickableTableRow({
	clickableRow,
	rowProps,
	onRowClick,
}: {
	clickableRow: Ref<boolean>
	rowProps: ComputedRef<ClickableTableRowPropsInput>
	onRowClick: (item: ClickableTableItem) => void
}) {
	const clickableRowProps = computed<ClickableTableRowPropsInput>(() => {
		if (!clickableRow.value) {
			return rowProps.value
		}

		return (data: TableRowData) => {
			const baseRowProps = resolveRowProps(rowProps.value, data)

			return {
				...baseRowProps,
				'class': ['sy-table__clickable-row', baseRowProps.class].filter(Boolean),
				'data-clickable-row': true,
				'tabindex': baseRowProps.tabindex ?? 0,
				'onClick': (event: MouseEvent) => {
					callEventHandler(baseRowProps.onClick as TableRowEventHandler<MouseEvent> | unknown, event)

					if (!event.defaultPrevented && !isFromNestedInteractiveElement(event)) {
						onRowClick(data.item)
					}
				},
				'onKeydown': (event: KeyboardEvent) => {
					callEventHandler(baseRowProps.onKeydown as TableRowEventHandler<KeyboardEvent> | unknown, event)

					if (event.defaultPrevented || isFromNestedInteractiveElement(event)) {
						return
					}

					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault()
						onRowClick(data.item)
					}
				},
			}
		}
	})

	return {
		clickableRowProps,
	}
}
