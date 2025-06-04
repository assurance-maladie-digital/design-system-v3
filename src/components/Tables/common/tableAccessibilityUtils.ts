import { onMounted } from 'vue'

/**
 * Utility function to enhance table accessibility
 */
export function useTableAccessibility({
	tableId,
	caption,
}: {
	tableId: string
	caption: string
}) {
	function setupAccessibility() {
		onMounted(() => {
			const table = document.querySelector(`#${tableId} table`)
			const captionElement = document.createElement('caption')
			captionElement.innerHTML = caption
			if (caption === '') {
				captionElement.classList.add('d-sr-only')
				captionElement.setAttribute('aria-label', 'Table caption')
			}
			else {
				captionElement.classList.add('text-subtitle-1')
			}
			table?.prepend(captionElement)

			const inputs = document.querySelectorAll(`#${tableId} input`)
			inputs.forEach((input) => {
				(input as HTMLElement).removeAttribute('aria-describedby')
			})

			const fields = document.querySelectorAll(`#${tableId} .v-field`)
			fields.forEach((field) => {
				(field as HTMLElement).setAttribute('tabindex', '0')
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
