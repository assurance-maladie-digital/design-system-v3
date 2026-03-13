import { type Ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface UseDatePickerFocusTrapOptions {
	isDatePickerVisible: Ref<boolean>
	datePickerRef: Ref<ComponentPublicInstance | null>
	onClose?: () => void
	restoreFocus?: () => void
}

const focusableSelectors = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'

export function useDatePickerFocusTrap(options: UseDatePickerFocusTrapOptions) {
	const { isDatePickerVisible, datePickerRef, onClose, restoreFocus } = options

	const handleMenuKeydown = (event: KeyboardEvent) => {
		if (!isDatePickerVisible.value) return
		if (event.key === 'Escape' || event.key === 'Esc') {
			isDatePickerVisible.value = false
			onClose?.()
			restoreFocus?.()
			return
		}
		if (event.key !== 'Tab') return

		const root = (datePickerRef.value as ComponentPublicInstance | null)?.$el as HTMLElement | undefined
		if (!root) return

		// Empêcher la fermeture du menu avec Tab et garder le focus à l'intérieur
		event.preventDefault()
		event.stopPropagation()

		const target = event.target as HTMLElement | null
		const todayButton = root.querySelector<HTMLElement>('.date-picker__today-button')
		const isFromDayCell = Boolean(target?.closest('[data-v-date]'))
		const focusables = Array.from(root.querySelectorAll<HTMLElement>(focusableSelectors)).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
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
		focusables[nextIndex]?.focus({ preventScroll: true })
	}

	return { handleMenuKeydown }
}
