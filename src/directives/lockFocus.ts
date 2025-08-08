import type { Directive } from 'vue'

/**
 * Vue directive that locks keyboard focus within the bound element.
 *
 * ! Be careful to always allow the user to escape the focus trap as this directive does not handle that.
 *
 * @example
 * ```vue
 * <template>
 *   <div v-lock-focus>
 *     <!-- Focus will be trapped within this element -->
 *   </div>
 * </template>
 * ```
 */
const vLockFocus: Directive<HTMLElement> = {
	mounted(el) {
		el.addEventListener('keydown', handleFocus)
	},

	unmounted(el) {
		el.removeEventListener('keydown', handleFocus)
	},
}

function handleFocus(event: KeyboardEvent) {
	if (event.key !== 'Tab') return
	const target = event.currentTarget as HTMLElement

	const focusableElements = target.querySelectorAll(
		'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]',
	)

	const firstElement = focusableElements[0] as HTMLElement
	const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

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
