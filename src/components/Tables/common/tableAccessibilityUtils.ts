export function setupAccessibility(table: HTMLElement) {
	const captionElement = table.querySelector(`caption`)
	if (captionElement && captionElement.textContent?.trim() === '') {
		captionElement.setAttribute('aria-label', 'Table caption')
	}

	const inputs = document.querySelectorAll(`input`)
	inputs.forEach((input) => {
		(input as HTMLElement).removeAttribute('aria-describedby')
	})

	const fields = document.querySelectorAll(`.v-field`)
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

	const fieldLabels = document.querySelectorAll(`.v-field`)
	fieldLabels.forEach((fieldLabel) => {
		(fieldLabel as HTMLElement).setAttribute('aria-label', 'items per page')
	})

	const fieldTitles = document.querySelectorAll(`.v-field`)
	fieldTitles.forEach((fieldTitle) => {
		(fieldTitle as HTMLElement).setAttribute('title', 'items per page')
	})

	const th = document.querySelectorAll(`th`)
	for (let i = 0; i < th.length; i++) {
		th[i].setAttribute('scope', 'col')
	}
}
