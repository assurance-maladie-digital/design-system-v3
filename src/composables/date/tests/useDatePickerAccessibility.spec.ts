import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDatePickerAccessibility } from '../useDatePickerAccessibility'
import type { ComponentPublicInstance, Ref } from 'vue'

describe('useDatePickerAccessibility', () => {
	let { updateAccessibility, handleKeyDown } = useDatePickerAccessibility()

	beforeEach(() => {
		// Réinitialiser la fonction pour chaque test
		const { updateAccessibility: newUpdateAccessibility, handleKeyDown: newHandleKeyDown } = useDatePickerAccessibility()
		updateAccessibility = newUpdateAccessibility
		handleKeyDown = newHandleKeyDown

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
		const datePickerRef: Ref<ComponentPublicInstance | null> = ref(null)

		// Appeler la fonction updateAccessibility
		await updateAccessibility(datePickerRef)

		// Récupérer les boutons
		const buttons = document.querySelectorAll('.v-date-picker-header button')

		// Vérifier que les attributs aria-label sont correctement définis
		expect(buttons[0].getAttribute('aria-label')).toBe('Mois précédent')
		expect(buttons[1].getAttribute('aria-label')).toBe(null) // Pas d'icône, donc pas d'attribu
		expect(buttons[2].getAttribute('aria-label')).toBe('Mois suivant')
	})

	it('handles missing elements gracefully', async () => {
		const datePickerRef: Ref<ComponentPublicInstance | null> = ref(null)

		// Supprimer les éléments du DOM
		document.body.innerHTML = ''

		// La fonction ne devrait pas générer d'erreur même si les éléments n'existent pas
		await expect(updateAccessibility(datePickerRef)).resolves.not.toThrow()
	})

	it('handles different icons correctly', async () => {
		const datePickerRef: Ref<ComponentPublicInstance | null> = ref(null)

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
		await updateAccessibility(datePickerRef)

		// Récupérer les boutons
		const buttons = document.querySelectorAll('.v-date-picker-header button')

		// Vérifier que les attributs aria-label sont correctement définis
		expect(buttons[0].getAttribute('aria-label')).toBe(null) // Pas de chevron-lef
		expect(buttons[1].getAttribute('aria-label')).toBe(null) // Pas d'icône
		expect(buttons[2].getAttribute('aria-label')).toBe(null) // Pas de chevron-righ
	})

	it('adds sr-only instructions to the DatePicker', async () => {
		const datePickerRef: Ref<ComponentPublicInstance | null> = ref(null)

		// Appeler updateAccessibility
		await updateAccessibility(datePickerRef)

		// Vérifier que les instructions pour les lecteurs d'écran ont été ajoutées
		const srOnlyEl = document.querySelector('.sr-only-instructions')

		expect(srOnlyEl).not.toBeNull()
		expect(srOnlyEl?.textContent).toBe('Utilisez tab pour naviguer entre les dates et Entrée ou Espace pour sélectionner une date')
	})

	describe('handleKeyDown', () => {
		it('simulates a click event when Enter key is pressed', () => {
			// Créer une fonction d'espionnage autonome plutôt que d'espionner une méthode existante
			const clickHandlerSpy = vi.fn()

			// Créer un élément bouton avec un gestionnaire de clic espion
			const button = document.createElement('button')
			button.addEventListener('click', clickHandlerSpy)
			document.body.appendChild(button)
			button.focus()

			// Créer un événement clavier pour la touche Entrée
			const enterEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true,
				cancelable: true,
			})

			// Espionner la méthode preventDefault de l'événement
			const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault')

			// Appeler la fonction handleKeyDown avec l'événement
			handleKeyDown(enterEvent)

			// Vérifier que preventDefault a été appelé
			expect(preventDefaultSpy).toHaveBeenCalled()

			// Vérifier que le gestionnaire de clic a été déclenché suite à l'événement simulé
			expect(clickHandlerSpy).toHaveBeenCalled()
		})

		it('does nothing when a key other than Enter is pressed', () => {
			// Créer une fonction d'espionnage autonome
			const clickHandlerSpy = vi.fn()

			// Créer un élément bouton avec un gestionnaire de clic espion
			const button = document.createElement('button')
			button.addEventListener('click', clickHandlerSpy)
			document.body.appendChild(button)
			button.focus()

			// Créer un événement clavier pour une touche autre qu'Entrée (par ex: Espace)
			const spaceEvent = new KeyboardEvent('keydown', {
				key: 'Space',
				bubbles: true,
				cancelable: true,
			})

			// Espionner la méthode preventDefault de l'événement
			const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault')

			// Appeler la fonction handleKeyDown avec l'événement
			handleKeyDown(spaceEvent)

			// Vérifier que preventDefault n'a pas été appelé
			expect(preventDefaultSpy).not.toHaveBeenCalled()

			// Vérifier qu'aucun événement de clic n'a été déclenché
			expect(clickHandlerSpy).not.toHaveBeenCalled()
		})

		it('handles the case when no element is focused', () => {
			// S'assurer qu'aucun élément n'est focalisé
			document.body.focus()

			// Créer un événement clavier pour la touche Entrée
			const enterEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true,
				cancelable: true,
			})

			// Vérifier que la fonction ne génère pas d'erreur
			expect(() => handleKeyDown(enterEvent)).not.toThrow()
		})
	})
})
