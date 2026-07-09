import { type Ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import dayjs from 'dayjs'

interface UseDatePickerFocusTrapOptions {
	isDatePickerVisible: Ref<boolean>
	datePickerRef: Ref<ComponentPublicInstance | null>
	onClose?: () => void
	restoreFocus?: () => void
	// Renvoie la date sur laquelle placer le focus (date sélectionnée ou aujourd'hui)
	getInitialFocusDate?: () => Date
}

const getFocusableElements = (root: HTMLElement): HTMLElement[] => {
	const allFocusable = Array.from(root.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]'))
	return allFocusable.filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true' && el.tabIndex !== -1)
}

export function useDatePickerFocusTrap(options: UseDatePickerFocusTrapOptions) {
	const { isDatePickerVisible, datePickerRef, onClose, restoreFocus, getInitialFocusDate } = options

	const focusDayButton = (root: HTMLElement): boolean => {
		const targetDate = getInitialFocusDate ? getInitialFocusDate() : new Date()
		const iso = dayjs(targetDate).format('YYYY-MM-DD')
		const dayBtn = root.querySelector<HTMLElement>(`[data-v-date="${iso}"] button`)
		if (dayBtn) {
			dayBtn.focus({ preventScroll: true })
			return true
		}
		return false
	}

	const handleMenuKeydown = (event: KeyboardEvent) => {
		if (!isDatePickerVisible.value) return

		// Ne gérer que Escape et Tab, laisser toutes les autres touches passer
		if (event.key === 'Escape' || event.key === 'Esc') {
			isDatePickerVisible.value = false
			onClose?.()
			restoreFocus?.()
			event.preventDefault()
			event.stopPropagation()
			return
		}

		// Pour Tab, on gère mais on laisse les autres touches (flèches, etc.) passer complètement
		if (event.key !== 'Tab') {
			// Laisser toutes les autres touches passer sans aucune intervention
			return
		}

		if (event.ctrlKey || event.altKey || event.metaKey) return // Laisser les combinaisons système

		const root = (datePickerRef.value as ComponentPublicInstance | null)?.$el as HTMLElement | undefined
		if (!root) return

		// Empêcher la fermeture du menu avec Tab et garder le focus à l'intérieur
		event.preventDefault()
		event.stopPropagation()

		const target = event.target as HTMLElement | null
		const todayButton = root.querySelector<HTMLElement>('.date-picker__today-button')
		const focusables = getFocusableElements(root)
		const firstFocusable = focusables[0]
		const lastFocusable = focusables.at(-1)
		if (!firstFocusable) return

		const active = document.activeElement as HTMLElement | null

		const isFromGrid = Boolean(
			target?.closest('.v-date-picker-months')
			|| target?.closest('.v-date-picker-years')
			|| target?.closest('.v-date-picker-month'),
		)

		const isFromTodayButton = Boolean(target?.closest('.date-picker__today-button'))

		// Tab depuis la grille → bouton Aujourd'hui (empêche Tab de passer de jour en jour)
		if (!event.shiftKey && isFromGrid && todayButton) {
			todayButton.focus({ preventScroll: true })
			return
		}

		// Shift+Tab depuis la grille → dernier focusable avant la grille en DOM (empêche Shift+Tab de passer de jour en jour)
		if (event.shiftKey && isFromGrid && active) {
			const gridContainer = active.closest('.v-date-picker-month, .v-date-picker-months, .v-date-picker-years')
			const precedingOutsideGrid = focusables.filter((el) => {
				const isInsideGrid = gridContainer ? gridContainer.contains(el) : false
				return !isInsideGrid && (active.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)
			})
			console.log('[FocusTrap] Shift+Tab from grid', {
				isFromGrid,
				activeTag: active.tagName,
				activeClass: active.className?.slice(0, 80),
				precedingCount: precedingOutsideGrid.length,
				preceding: precedingOutsideGrid.map(el => ({ tag: el.tagName, class: el.className?.slice(0, 60) })),
				chosen: precedingOutsideGrid.at(-1)?.className?.slice(0, 60),
			})
			precedingOutsideGrid.at(-1)?.focus({ preventScroll: true })
			return
		}

		// Shift+Tab depuis le bouton Aujourd'hui → jour sélectionné dans la grille (inverse du Tab depuis grille)
		if (event.shiftKey && isFromTodayButton) {
			if (focusDayButton(root)) return
		}

		const currentIndex = active ? focusables.indexOf(active) : -1

		if (currentIndex === -1 && active) {
			// L'élément actif n'est pas dans la liste des focusables (ex: bouton de jour avec tabindex=-1)
			// On trouve le focusable le plus proche en ordre DOM
			const preceding = focusables.filter(el => active.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)
			const following = focusables.filter(el => active.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)

			if (event.shiftKey) {
				const prev = preceding.at(-1) ?? lastFocusable
				prev?.focus({ preventScroll: true })
			}
			else {
				const next = following[0] ?? firstFocusable
				next.focus({ preventScroll: true })
			}
			return
		}

		const safeIndex = currentIndex === -1 ? 0 : currentIndex
		const nextIndex = event.shiftKey
			? (safeIndex - 1 + focusables.length) % focusables.length
			: (safeIndex + 1) % focusables.length
		const nextFocusable = focusables[nextIndex]

		if (nextFocusable && nextFocusable.closest('.v-date-picker-month, .v-date-picker-months, .v-date-picker-years')) {
			if (focusDayButton(root)) return
		}

		nextFocusable?.focus({ preventScroll: true })
	}

	return { handleMenuKeydown }
}
