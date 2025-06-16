import { onMounted } from 'vue'

/**
 * Utility function to enhance table accessibility
 */
export function useTableAccessibility({
	tableId,
}: {
	tableId: string
}) {
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
				element.setAttribute('tabindex', '0')

				// Remove immediately if it exists
				if (element.hasAttribute('aria-controls')) {
					element.removeAttribute('aria-controls')
				}

				// Check again after a delay
				setTimeout(() => {
					if (element.hasAttribute('aria-controls')) {
						element.removeAttribute('aria-controls')
					}
				}, 500)
			})

			const fieldLabels = document.querySelectorAll(`#${tableId} .v-field`)
			fieldLabels.forEach((fieldLabel) => {
				(fieldLabel as HTMLElement).setAttribute('aria-label', 'items per page')
			})

			const fieldTitles = document.querySelectorAll(`#${tableId} .v-field`)
			fieldTitles.forEach((fieldTitle) => {
				(fieldTitle as HTMLElement).setAttribute('title', 'items per page')
			})

			const th = document.querySelectorAll(`#${tableId} th`)
			for (let i = 0; i < th.length; i++) {
				th[i].setAttribute('scope', 'col')
			}
		})
	}

	return {
		setupAccessibility,
	}
}
