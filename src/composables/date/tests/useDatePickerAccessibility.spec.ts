import { describe, it, expect, beforeEach } from 'vitest'
import { useDatePickerAccessibility } from '../useDatePickerAccessibility'

describe('useDatePickerAccessibility', () => {
	let { updateAccessibility } = useDatePickerAccessibility()

	beforeEach(() => {
		// Réinitialiser la fonction pour chaque tes
		const { updateAccessibility: newUpdateAccessibility } = useDatePickerAccessibility()
		updateAccessibility = newUpdateAccessibility

		// Créer une structure DOM simulée pour les tests
		document.body.innerHTML = `
			<div class="v-date-picker">
				<div class="v-date-picker-header">
					<button class="v-btn v-btn--icon">
						<span class="v-btn__content">
							<i class="v-icon mdi mdi-chevron-left"></i>
						</span>
					</button>
					<button class="v-btn v-btn--icon">
						<span class="v-btn__content">
							<div>Janvier 2023</div>
						</span>
					</button>
					<button class="v-btn v-btn--icon">
						<span class="v-btn__content">
							<i class="v-icon mdi mdi-chevron-right"></i>
						</span>
					</button>
				</div>
			</div>
		`
	})

	it('sets correct aria-label attributes on navigation buttons', async () => {
		// Appeler la fonction updateAccessibility
		await updateAccessibility()

		// Récupérer les boutons
		const buttons = document.querySelectorAll('.v-date-picker-header button')

		// Vérifier que les attributs aria-label sont correctement définis
		expect(buttons[0].getAttribute('aria-label')).toBe('Mois précédent')
		expect(buttons[1].getAttribute('aria-label')).toBe(null) // Pas d'icône, donc pas d'attribu
		expect(buttons[2].getAttribute('aria-label')).toBe('Mois suivant')
	})

	it('handles missing elements gracefully', async () => {
		// Supprimer les éléments du DOM
		document.body.innerHTML = ''

		// La fonction ne devrait pas générer d'erreur même si les éléments n'existent pas
		await expect(updateAccessibility()).resolves.not.toThrow()
	})

	it('handles different icons correctly', async () => {
		// Modifier les icônes
		document.body.innerHTML = `
			<div class="v-date-picker">
				<div class="v-date-picker-header">
					<button class="v-btn v-btn--icon">
						<span class="v-btn__content">
							<i class="v-icon mdi mdi-arrow-left"></i>
						</span>
					</button>
					<button class="v-btn v-btn--icon">
						<span class="v-btn__content">
							<div>Janvier 2023</div>
						</span>
					</button>
					<button class="v-btn v-btn--icon">
						<span class="v-btn__content">
							<i class="v-icon mdi mdi-arrow-right"></i>
						</span>
					</button>
				</div>
			</div>
		`

		// Appeler la fonction updateAccessibility
		await updateAccessibility()

		// Récupérer les boutons
		const buttons = document.querySelectorAll('.v-date-picker-header button')

		// Vérifier que les attributs aria-label sont correctement définis
		expect(buttons[0].getAttribute('aria-label')).toBe(null) // Pas de chevron-lef
		expect(buttons[1].getAttribute('aria-label')).toBe(null) // Pas d'icône
		expect(buttons[2].getAttribute('aria-label')).toBe(null) // Pas de chevron-righ
	})

	it('adds sr-only instructions to the DatePicker', async () => {
		// Appeler updateAccessibility
		await updateAccessibility()

		// Vérifier que les instructions pour les lecteurs d'écran ont été ajoutées
		const srOnlyEl = document.querySelector('.sr-only-instructions')
		expect(srOnlyEl).not.toBeNull()
		expect(srOnlyEl?.textContent).toBe('Utilisez les flèches pour naviguer entre les dates et Entrée pour sélectionner une date')
	})
})
