import { ref, nextTick } from 'vue'

/**
 * Composable pour personnaliser les boutons du mois et de l'année dans les composants DatePicker
 * @param isPickerVisibleGetter - Fonction qui retourne l'état de visibilité du DatePicker
 */
export function useMonthButtonCustomization(isPickerVisibleGetter: () => boolean) {
	const monthButtonText = ref('')
	const yearText = ref('')

	/**
	 * Récupère et modifie les boutons du mois et de l'année avec une icône SVG chevron-down
	 */
	const customizeMonthButton = () => {
		if (isPickerVisibleGetter()) {
			nextTick(() => {
				// Personnalisation du bouton du mois
				const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')
				if (monthBtn) {
					// Récupérer le texte original et le nettoyer
					monthButtonText.value = monthBtn.textContent?.trim() || ''

					// Extraire le mois et l'année
					const parts = monthButtonText.value.split(' ')
					const monthText = parts[0]
					yearText.value = parts.length > 1 ? parts[1] : ''

					// Créer un bouton stylisé comme un VBtn avec une icône Material Design
					const buttonHTML = `
						<button class="v-btn v-btn--density-comfortable v-btn--variant-text v-theme--light v-btn--size-default" style="color: var(--v-theme-primary); margin-left: -12px;">
							<span class="v-btn__overlay"></span>
							<span class="v-btn__underlay"></span>
							<div class="v-btn__content" data-no-activator="" style="color: var(--v-theme-primary);">
								<span style="color: var(--v-theme-primary);">${monthText.charAt(0).toUpperCase() + monthText.slice(1)}</span> 
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="ms-1" style="fill: var(--v-theme-primary);"><title>chevron-down</title><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
							</div>
						</button>
					`

					// Remplacer le contenu du bouton original
					monthBtn.innerHTML = buttonHTML

					// Personnalisation du bouton d'année si l'année est disponible
					if (yearText.value) {
						const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')
						if (yearBtn) {
							// Créer un bouton stylisé pour l'année
							const yearButtonHTML = `
								<button class="v-btn v-btn--density-comfortable v-btn--variant-text v-theme--light v-btn--size-default" style="color: var(--v-theme-primary);">
									<span class="v-btn__overlay"></span>
									<span class="v-btn__underlay"></span>
									<div class="v-btn__content" data-no-activator="" style="color: var(--v-theme-primary);">
										<span style="color: var(--v-theme-primary);">${yearText.value}</span> 
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="ms-1" style="fill: var(--v-theme-primary);"><title>chevron-down</title><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
									</div>
								</button>
							`

							// Remplacer le contenu du bouton d'année
							yearBtn.innerHTML = yearButtonHTML
						}
					}
				}
			})
		}
	}

	/**
	 * Configure un observateur pour détecter les changements dans le DOM
	 * et personnaliser les boutons du mois et de l'année automatiquement avec une icône SVG chevron-down
	 */
	const setupMonthButtonObserver = () => {
		nextTick(() => {
			const targetNode = document.querySelector('.v-date-picker-controls')
			if (targetNode) {
				const observer = new MutationObserver(() => {
					customizeMonthButton()
				})
				observer.observe(targetNode, { childList: true, subtree: true })
			}
		})
	}

	return {
		monthButtonText,
		customizeMonthButton,
		setupMonthButtonObserver,
	}
}
