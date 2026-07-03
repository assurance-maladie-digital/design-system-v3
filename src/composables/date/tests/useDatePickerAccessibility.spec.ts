import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDatePickerAccessibility } from '../useDatePickerAccessibility'
import { mount } from '@vue/test-utils'
// Créer un composant vide pour servir de contexte à l'exécution des hooks
import { defineComponent } from 'vue'

// Composant vide qui servira de contexte pour les hooks Vue
const TestComponent = defineComponent({
	setup() {
		const { updateAccessibility, handleKeyDown, fixAriaAttributes } = useDatePickerAccessibility()
		return {
			updateAccessibility,
			handleKeyDown,
			fixAriaAttributes,
		}
	},
	template: '<div></div>',
})

describe('useDatePickerAccessibility', () => {
	// Variables pour stocker les méthodes du composable
	let updateAccessibility: ReturnType<typeof useDatePickerAccessibility>['updateAccessibility']
	let handleKeyDown: ReturnType<typeof useDatePickerAccessibility>['handleKeyDown']
	// Wrapper pour le composant de test
	let wrapper: ReturnType<typeof mount<{
		updateAccessibility: ReturnType<typeof useDatePickerAccessibility>['updateAccessibility']
		handleKeyDown: ReturnType<typeof useDatePickerAccessibility>['handleKeyDown']
		fixAriaAttributes: ReturnType<typeof useDatePickerAccessibility>['fixAriaAttributes']
	}>>

	beforeEach(() => {
		// Monter le composant de test pour fournir un contexte aux hooks Vue
		wrapper = mount(TestComponent) as unknown as ReturnType<typeof mount<{
			updateAccessibility: ReturnType<typeof useDatePickerAccessibility>['updateAccessibility']
			handleKeyDown: ReturnType<typeof useDatePickerAccessibility>['handleKeyDown']
			fixAriaAttributes: ReturnType<typeof useDatePickerAccessibility>['fixAriaAttributes']
		}>>
		// Obtenir les fonctions du composable directement depuis le composant monté
		updateAccessibility = wrapper.vm.updateAccessibility!
		handleKeyDown = wrapper.vm.handleKeyDown!

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
		expect(buttons[0]?.getAttribute('aria-label')).toBe('Mois précédent')
		expect(buttons[1]?.getAttribute('aria-label')).toBe(null) // Pas d'icône, donc pas d'attribu
		expect(buttons[2]?.getAttribute('aria-label')).toBe('Mois suivant')
	})

	it('handles missing elements gracefully', async () => {
		// Supprimer les éléments du DOM
		document.body.innerHTML = ''

		// La fonction ne devrait pas générer d'erreur même si les éléments n'existent pas
		await expect(updateAccessibility()).resolves.not.toThrow()
	})

	it('applies grid semantics on .v-date-picker-month', async () => {
		document.body.innerHTML = `
			<div class="v-date-picker">
				<div class="v-date-picker-month">
					<div class="v-date-picker-month__weekdays">
						<div class="v-date-picker-month__weekday">Lun</div>
						<div class="v-date-picker-month__weekday">Mar</div>
						<div class="v-date-picker-month__weekday">Mer</div>
					</div>
					<div class="v-date-picker-month__week">
						<div class="v-date-picker-month__day v-date-picker-month__day--selected"><button>1</button></div>
						<div class="v-date-picker-month__day"><button>2</button></div>
						<div class="v-date-picker-month__day"><button>3</button></div>
					</div>
				</div>
			</div>
		`

		await updateAccessibility()

		const monthEl = document.querySelector('.v-date-picker-month') as HTMLElement
		expect(monthEl.getAttribute('role')).toBe('grid')
		expect(monthEl.getAttribute('aria-colcount')).toBe('3')
		expect(monthEl.getAttribute('aria-rowcount')).toBe('2')

		const headerRow = document.querySelector('.v-date-picker-month__weekdays') as HTMLElement
		expect(headerRow.getAttribute('role')).toBe('row')
		expect(headerRow.getAttribute('aria-rowindex')).toBe('1')

		const headerCells = Array.from(document.querySelectorAll('.v-date-picker-month__weekday'))
		headerCells.forEach((cell, index) => {
			expect(cell.getAttribute('role')).toBe('columnheader')
			expect(cell.getAttribute('aria-colindex')).toBe(String(index + 1))
		})

		const firstWeek = document.querySelector('.v-date-picker-month__week') as HTMLElement
		expect(firstWeek.getAttribute('role')).toBe('row')
		expect(firstWeek.getAttribute('aria-rowindex')).toBe('2')

		const dayButtons = Array.from(firstWeek.querySelectorAll('button'))
		expect(dayButtons[0]?.getAttribute('role')).toBe('gridcell')
		expect(dayButtons[0]?.getAttribute('aria-selected')).toBe('true')
		expect(dayButtons[1]?.getAttribute('aria-selected')).toBe('false')
	})

	it('wraps div structure into thead/tbody table', async () => {
		document.body.innerHTML = `
			<div class="v-date-picker">
				<div class="v-date-picker-month" style="--v-date-picker-days-in-week: 7;">
					<div class="v-date-picker-month__days">
						<div class="v-date-picker-month__day v-date-picker-month__weekday">L</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">M</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">M</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">J</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">V</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">S</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">D</div>
						<div class="v-date-picker-month__day"><button>1</button></div>
						<div class="v-date-picker-month__day"><button>2</button></div>
						<div class="v-date-picker-month__day"><button>3</button></div>
					</div>
				</div>
			</div>
		`

		await updateAccessibility()

		const table = document.querySelector('.v-date-picker-month__days table') as HTMLTableElement
		expect(table).not.toBeNull()
		expect(table.dataset.syStructured).toBe('true')

		const thead = table.querySelector('thead')
		const tbody = table.querySelector('tbody')
		expect(thead).not.toBeNull()
		expect(tbody).not.toBeNull()

		const headerRow = thead?.querySelector('tr')
		expect(headerRow?.classList.contains('v-date-picker-month__weekdays')).toBe(true)
		const headerCells = Array.from(headerRow?.querySelectorAll('th') ?? [])
		expect(headerCells).toHaveLength(7)

		const dataRows = Array.from(tbody?.querySelectorAll('tr') ?? [])
		expect(dataRows.length).toBeGreaterThan(0)
		expect(dataRows[0]?.classList.contains('v-date-picker-month__week')).toBe(true)
		const firstDataRowCells = Array.from(dataRows[0]?.querySelectorAll('td') ?? [])
		expect(firstDataRowCells).toHaveLength(7)
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
		expect(buttons[0]?.getAttribute('aria-label')).toBe(null) // Pas de chevron-lef
		expect(buttons[1]?.getAttribute('aria-label')).toBe(null) // Pas d'icône
		expect(buttons[2]?.getAttribute('aria-label')).toBe(null) // Pas de chevron-righ
	})

	it('ne crée pas de bloc sr-only instructions (comportement actuel)', async () => {
		await updateAccessibility()
		const srOnlyEl = document.querySelector('.sr-only-instructions')
		expect(srOnlyEl).toBeNull()
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
