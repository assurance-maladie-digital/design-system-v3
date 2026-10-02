import type { Directive } from 'vue'

/**
 * Vue directive that locks keyboard focus within the bound element.
 *
 * ! Be careful to always allow the user to escape the focus trap as this directive does not handle that.
 *
 * @example
 * ```vue
 * <template>
 *   <div v-lock-focus="true">
 *     <!-- Focus will be trapped within this element -->
 *   </div>
 * </template>
 * ```
 */
const vLockFocus: Directive<HTMLElement> = {
	mounted(el, binding) {
		if (binding.value === false) return
		el.addEventListener('keydown', handleFocus)
	},

	unmounted(el) {
		el.removeEventListener('keydown', handleFocus)
	},

	updated(el, binding) {
		if (binding.value === false) {
			el.removeEventListener('keydown', handleFocus)
		}
		else {
			el.addEventListener('keydown', handleFocus)
		}
	},
}

function isElementVisible(el: HTMLElement): boolean {
	// checkVisibility() natif : détecte display:none / visibility:hidden sur l'élément et ses ancêtres
	if (typeof el.checkVisibility === 'function') {
		return el.checkVisibility()
	}
	// Fallback DOM : masquage par v-show (style inline), [hidden] ou aria-hidden
	return !el.closest('[hidden], [style*="display: none"], [style*="display:none"], [aria-hidden="true"]')
}

function handleFocus(event: KeyboardEvent) {
	if (event.key !== 'Tab') return
	const target = event.currentTarget as HTMLElement

	const focusableElements = Array.from(
		target.querySelectorAll<HTMLElement>(
			'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]',
		),
	).filter(isElementVisible)

	const firstElement = focusableElements[0]
	const lastElement = focusableElements[focusableElements.length - 1]

	if (!firstElement || !lastElement) return

	if (event.shiftKey && document.activeElement === firstElement) {
		event.preventDefault()
		lastElement.focus()
	}
	else if (!event.shiftKey && document.activeElement === lastElement) {
		event.preventDefault()
		firstElement.focus()
	}
}

export default vLockFocus
