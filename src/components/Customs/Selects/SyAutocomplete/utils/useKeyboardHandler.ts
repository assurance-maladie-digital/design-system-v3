import { nextTick, onUnmounted, type Ref, type ComputedRef } from 'vue'
import { useSySelectKeyboard } from '@/components/Customs/Selects/SySelect/composables/useSySelectKeyboard'
import type { ItemType, SelectValue, SelectArray } from '../types'

interface KeyboardHandlerProps {
	multiple: boolean
	chips: boolean
}

interface KeyboardHandlerDeps {
	search: Ref<string>
	selected: Ref<SelectValue | SelectArray>
	isOpen: Ref<boolean>
	selectItem: (item: ItemType | string | number | null | undefined) => void
	getItemText: (item: unknown) => unknown
	filteredItems: ComputedRef<ItemType[]>
	uniqueMenuId: Ref<string>
	focusListItem: boolean
}

export function useSyAutocompleteKeyboard(
	props: KeyboardHandlerProps,
	deps: KeyboardHandlerDeps,
) {
	const {
		activeDescendantId: keyboardActiveId,
		handleEnterKey,
		handleDownKey,
		handleUpKey,
		handleEscapeKey,
		handleHomeKey,
		handleEndKey,
		handlePageUpKey,
		handlePageDownKey,
		handleTabKey,
	} = useSySelectKeyboard({
		isOpen: deps.isOpen,
		formattedItems: deps.filteredItems,
		toggleMenu: () => { deps.isOpen.value = !deps.isOpen.value },
		selectItem: deps.selectItem,
		getItemText: deps.getItemText,
		optionIdPrefix: `${deps.uniqueMenuId.value}-option`,
		focusListItem: deps.focusListItem,
	})

	const keydownAdded = new WeakMap<HTMLInputElement, boolean>()
	const registeredInputs: HTMLInputElement[] = []

	const handleKeydown = (e: KeyboardEvent) => {
		const key = e.key
		if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Home', 'End', 'PageUp', 'PageDown'].includes(key)) {
			e.preventDefault()
			const handlers: Record<string, () => void> = {
				ArrowUp: handleUpKey,
				ArrowDown: handleDownKey,
				Enter: handleEnterKey,
				Escape: handleEscapeKey,
				Home: handleHomeKey,
				End: handleEndKey,
				PageUp: handlePageUpKey,
				PageDown: handlePageDownKey,
			}
			handlers[key]?.()
		}
		else if (key === 'Backspace' || key === 'Delete') {
			if (deps.search.value === '' && props.multiple && props.chips && Array.isArray(deps.selected.value) && deps.selected.value.length > 0) {
				e.preventDefault()
				const lastItem = deps.selected.value[deps.selected.value.length - 1]
				deps.selectItem(lastItem)
			}
		}
	}

	const focusInput = (textFieldRef: Ref<{ $el?: HTMLElement, $refs?: { input?: HTMLInputElement } } | null>, noFocus = false) => {
		nextTick(() => {
			const tf = textFieldRef.value
			const el = tf?.$el as HTMLElement | null
			const inputFromRefs = (tf?.$refs?.input ?? null) as HTMLInputElement | null
			const byId = document.getElementById(`${deps.uniqueMenuId.value}-input`) as HTMLInputElement | null
			const inputEl: HTMLInputElement | null = inputFromRefs ?? byId ?? (el?.querySelector('input') as HTMLInputElement | null)
			if (inputEl) {
				if (!noFocus) {
					inputEl.focus()
					if (props.multiple && !props.chips) {
						// Position cursor at the end for multiple selection
						const len = inputEl.value?.length ?? 0
						inputEl.setSelectionRange(len, len)
					}
					else {
						const len = inputEl.value?.length ?? 0
						inputEl.setSelectionRange(len, len)
					}
				}
				if (!keydownAdded.get(inputEl)) {
					inputEl.addEventListener('keydown', handleKeydown)
					keydownAdded.set(inputEl, true)
					registeredInputs.push(inputEl)
				}
			}
		})
	}

	onUnmounted(() => {
		registeredInputs.forEach(el => el.removeEventListener('keydown', handleKeydown))
		registeredInputs.length = 0
	})

	return {
		handleKeydown,
		focusInput,
		keyboardActiveId,
		handleTabKey,
	}
}
