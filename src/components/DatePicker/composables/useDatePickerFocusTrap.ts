import { type Ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface UseDatePickerFocusTrapOptions {
	isDatePickerVisible: Ref<boolean>
	datePickerRef: Ref<ComponentPublicInstance | null>
	onClose?: () => void
	restoreFocus?: () => void
}

const getFocusableElements = (root: HTMLElement): HTMLElement[] => {
	const allFocusable = Array.from(root.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]'))
	return allFocusable.filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden') && el.tabIndex !== -1)
}

export function useDatePickerFocusTrap(options: UseDatePickerFocusTrapOptions) {
	const { isDatePickerVisible, datePickerRef, onClose, restoreFocus } = options

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
		const isFromDayCell = Boolean(target?.closest('[data-v-date]') || target?.closest('.v-date-picker-month__day'))
		const focusables = getFocusableElements(root)
		const firstFocusable = focusables[0]
		if (!firstFocusable) {
			// Aucun focusable : rester dans le menu via le bouton Aujourd'hui si présent
			todayButton?.focus({ preventScroll: true })
			return
		}

		const active = document.activeElement as HTMLElement | null
		if (!event.shiftKey && isFromDayCell && todayButton) {
			todayButton.focus({ preventScroll: true })
			return
		}

		if (!event.shiftKey && active === focusables.at(-1)) {
			firstFocusable.focus({ preventScroll: true })
			return
		}

		if (event.shiftKey && active === focusables[0]) {
			focusables.at(-1)?.focus({ preventScroll: true })
			return
		}

		// Comportement par défaut : laisser Tab circuler mais au sein du menu
		const baseActive = active ?? firstFocusable
		const currentIndex = focusables.indexOf(baseActive)
		const safeIndex = currentIndex === -1 ? 0 : currentIndex
		const nextIndex = event.shiftKey ? (safeIndex - 1 + focusables.length) % focusables.length : (safeIndex + 1) % focusables.length
		const nextFocusable = focusables[nextIndex]
		nextFocusable?.focus({ preventScroll: true })
	}

	return { handleMenuKeydown }
}
