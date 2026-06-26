import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Utility function to enhance table accessibility
 */
export function useTableAccessibility({
	tableId,
}: {
	tableId: string
}) {
	// Référence pour stocker et nettoyer les timeouts
	const accessibilityTimeouts = ref<ReturnType<typeof setTimeout>[]>([])

	function cleanupFieldAttributes(element: HTMLElement) {
		element.removeAttribute('aria-label')
		element.removeAttribute('aria-controls')
	}

	function setupAccessibility() {
		onMounted(() => {
			const captionElement = document.querySelector(`#${tableId} caption`)
			if (captionElement && captionElement.textContent?.trim() === '') {
				captionElement.setAttribute('aria-label', 'Table caption')
			}

			const inputs = document.querySelectorAll(`#${tableId} input`)
			inputs.forEach((input) => {
				(input as HTMLElement).removeAttribute('aria-describedby')
			})

			const fields = document.querySelectorAll(`#${tableId} .v-field`)
			fields.forEach((field) => {
				const element = field as HTMLElement

				cleanupFieldAttributes(element)

				const timeoutId = setTimeout(() => {
					cleanupFieldAttributes(element)
				}, 500)
				accessibilityTimeouts.value.push(timeoutId)
			})

			const th = document.querySelectorAll(`#${tableId} th`)
			for (const el of th) {
				el.setAttribute('scope', 'col')
			}
		})

		// Nettoyer tous les timeouts lors du démontage du composant
		onUnmounted(() => {
			accessibilityTimeouts.value.forEach((timeoutId) => {
				clearTimeout(timeoutId)
			})
			accessibilityTimeouts.value = []
		})
	}

	return {
		setupAccessibility,
	}
}
