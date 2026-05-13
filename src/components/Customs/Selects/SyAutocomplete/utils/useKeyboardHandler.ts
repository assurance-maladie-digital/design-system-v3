import { computed, nextTick, onUnmounted, type ComputedRef, type Ref } from 'vue'
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
	hasPrependItem?: ComputedRef<boolean>
}

export function useSyAutocompleteKeyboard(
	props: KeyboardHandlerProps,
	deps: KeyboardHandlerDeps,
) {
	const skipInitialFocus = computed(() => !!deps.hasPrependItem?.value)

	const {
		activeDescendantId: keyboardActiveId,
		lastFocusedIndex,
		setActiveDescendant,
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
		skipInitialFocus,
	})

	// Apply keyboard-focused class to the prepend item in the DOM.
	// The prepend item is always the first .v-list-item in the listbox (rendered before the options).
	// VListItem inherits role="option" from the listbox context, so we cannot use :not([role="option"]).
	// Retries via requestAnimationFrame because VMenu uses rAF internally (requestNewFrame) for overlay rendering —
	// nextTick/setTimeout fire before Vuetify's rAF, so the listbox may not be in the DOM yet.
	const applyPrependFocusDom = (retries = 3) => {
		const container = document.getElementById(deps.uniqueMenuId.value)
		const prependEl = container?.querySelector<HTMLElement>('.v-list-item') ?? null
		if (!prependEl) {
			if (retries > 0) requestAnimationFrame(() => applyPrependFocusDom(retries - 1))
			return
		}
		document.querySelectorAll<HTMLElement>(`#${deps.uniqueMenuId.value} .v-list-item`).forEach((item) => {
			item.classList.remove('keyboard-focused')
			item.setAttribute('tabindex', '-1')
		})
		prependEl.classList.add('keyboard-focused')
		prependEl.setAttribute('tabindex', '0')
		prependEl.scrollIntoView({ block: 'nearest' })
	}

	// Focus the prepend slot item (always the first .v-list-item in the listbox)
	const focusPrepend = () => {
		lastFocusedIndex.value = -1
		keyboardActiveId.value = ''
		applyPrependFocusDom()
	}

	const wrappedHandleDownKey = () => {
		if (!deps.isOpen.value && deps.hasPrependItem?.value) {
			// Ouvrir sans passer par handleDownKey (qui forcerait focus option 0)
			// watch(isOpen) ci-dessus prendra en charge le focus du prepend
			deps.isOpen.value = true
		}
		else if (deps.isOpen.value && deps.hasPrependItem?.value && lastFocusedIndex.value < 0) {
			setActiveDescendant(0)
		}
		else {
			handleDownKey()
		}
	}

	const wrappedHandleUpKey = () => {
		if (deps.isOpen.value && deps.hasPrependItem?.value && lastFocusedIndex.value === 0) {
			focusPrepend()
		}
		else {
			handleUpKey()
		}
	}

	const wrappedHandleEnterKey = () => {
		if (deps.isOpen.value && deps.hasPrependItem?.value && lastFocusedIndex.value < 0) {
			const container = document.getElementById(deps.uniqueMenuId.value)
			container?.querySelector<HTMLElement>('.v-list-item')?.click()
		}
		else {
			handleEnterKey()
		}
	}

	const keydownAdded = new WeakMap<HTMLInputElement, boolean>()
	const registeredInputs: HTMLInputElement[] = []

	const handleKeydown = (e: KeyboardEvent) => {
		const key = e.key
		if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Home', 'End', 'PageUp', 'PageDown'].includes(key)) {
			e.preventDefault()
			const handlers: Record<string, () => void> = {
				ArrowUp: wrappedHandleUpKey,
				ArrowDown: wrappedHandleDownKey,
				Enter: wrappedHandleEnterKey,
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
		focusPrepend,
		keyboardActiveId,
		handleTabKey,
	}
}
