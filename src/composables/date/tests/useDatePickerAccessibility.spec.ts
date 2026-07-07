import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDatePickerAccessibility } from '../useDatePickerAccessibility'
import { mount } from '@vue/test-utils'
// Créer un composant vide pour servir de contexte à l'exécution des hooks
import { defineComponent, ref, nextTick } from 'vue'
import { useMonthButtonCustomization } from '../../../components/DatePicker/composables/useMonthButtonCustomization'

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
				<div class="v-date-picker-controls">
					<div class="v-date-picker-controls__month">
						<button class="v-btn v-btn--icon" data-testid="prev-month">
							<span class="v-btn__content">
								<i class="v-icon mdi mdi-chevron-left"></i>
							</span>
						</button>
						<button class="v-date-picker-controls__month-btn v-btn">
							Janvier 2023
						</button>
						<button class="v-btn v-btn--icon" data-testid="next-month">
							<span class="v-btn__content">
								<i class="v-icon mdi mdi-chevron-right"></i>
							</span>
						</button>
					</div>
					<button class="v-date-picker-controls__mode-btn v-btn">
						2023
					</button>
				</div>
			</div>
		`
	})

	it('does not override month/year control labels set by useMonthButtonCustomization', async () => {
		const { customizeMonthButton } = useMonthButtonCustomization(
			() => true,
			ref('janvier'),
			ref('2023'),
		)

		await customizeMonthButton()
		await updateAccessibility()

		// Récupérer les boutons
		const prevButton = document.querySelector('[data-testid="prev-month"]')
		const nextButton = document.querySelector('[data-testid="next-month"]')
		const monthButton = document.querySelector('.v-date-picker-controls__month-btn')
		const yearButton = document.querySelector('.v-date-picker-controls__mode-btn')

		// Vérifier que les flèches de navigation sont toujours étiquetées
		expect(prevButton?.getAttribute('aria-label')).toBe('Mois précédent')
		expect(nextButton?.getAttribute('aria-label')).toBe('Mois suivant')

		// Vérifier que les labels riches des boutons mois/année ne sont pas écrasés
		expect(monthButton?.getAttribute('aria-label')).toContain('Sélectionner un mois')
		expect(monthButton?.getAttribute('aria-label')).toContain('janvier')
		expect(yearButton?.getAttribute('aria-label')).toContain('2023')
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
					<div class="v-date-picker-month__days">
						<div class="v-date-picker-month__day v-date-picker-month__weekday">Lun</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">Mar</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">Mer</div>
						<div class="v-date-picker-month__day v-date-picker-month__day--selected" data-v-date="1"><button class="v-btn--active">1</button></div>
						<div class="v-date-picker-month__day" data-v-date="2"><button>2</button></div>
						<div class="v-date-picker-month__day" data-v-date="3"><button>3</button></div>
					</div>
				</div>
			</div>
		`

		await updateAccessibility()

		const monthEl = document.querySelector('.v-date-picker-month') as HTMLElement
		expect(monthEl.getAttribute('role')).toBe('grid')
		expect(monthEl.getAttribute('aria-colcount')).toBeNull()
		expect(monthEl.getAttribute('aria-rowcount')).toBeNull()

		const daysContainer = document.querySelector('.v-date-picker-month__days') as HTMLElement

		const headerRow = daysContainer.querySelector('.v-date-picker-month__weekdays') as HTMLElement
		expect(headerRow?.getAttribute('role')).toBe('row')
		expect(headerRow?.style.display).toBe('contents')

		const headerCells = Array.from(headerRow?.querySelectorAll('.v-date-picker-month__weekday') ?? [])
		headerCells.forEach((cell) => {
			expect(cell.getAttribute('role')).toBe('columnheader')
			expect(cell.getAttribute('aria-colindex')).toBeNull()
		})

		const dataRows = Array.from(daysContainer.querySelectorAll('.v-date-picker-month__week')) as HTMLElement[]
		expect(dataRows).toHaveLength(1)
		expect(dataRows[0]?.getAttribute('role')).toBe('row')
		expect(dataRows[0]?.style.display).toBe('contents')

		const dayCells = Array.from(dataRows[0]?.querySelectorAll('.v-date-picker-month__day[data-v-date]') ?? [])
		expect(dayCells[0]?.getAttribute('role')).toBe('gridcell')
		expect(dayCells[0]?.getAttribute('aria-selected')).toBe('true')
		expect(dayCells[1]?.getAttribute('aria-selected')).toBe('false')

		const dayButtons = Array.from(dayCells[0]?.querySelectorAll('button') ?? [])
		expect(dayButtons[0]?.getAttribute('role')).toBeNull()
	})

	it('wraps flat div structure into ARIA rows with display: contents', async () => {
		document.body.innerHTML = `
			<div class="v-date-picker">
				<div class="v-date-picker-month">
					<div class="v-date-picker-month__days">
						<div class="v-date-picker-month__day v-date-picker-month__weekday">L</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">M</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">M</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">J</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">V</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">S</div>
						<div class="v-date-picker-month__day v-date-picker-month__weekday">D</div>
						<div class="v-date-picker-month__day" data-v-date="1"><button>1</button></div>
						<div class="v-date-picker-month__day" data-v-date="2"><button>2</button></div>
						<div class="v-date-picker-month__day" data-v-date="3"><button>3</button></div>
						<div class="v-date-picker-month__day" data-v-date="4"><button>4</button></div>
						<div class="v-date-picker-month__day" data-v-date="5"><button>5</button></div>
						<div class="v-date-picker-month__day" data-v-date="6"><button>6</button></div>
						<div class="v-date-picker-month__day" data-v-date="7"><button>7</button></div>
					</div>
				</div>
			</div>
		`

		await updateAccessibility()

		const daysContainer = document.querySelector('.v-date-picker-month__days') as HTMLElement

		const headerRow = daysContainer.querySelector('.v-date-picker-month__weekdays') as HTMLElement
		expect(headerRow?.getAttribute('role')).toBe('row')
		expect(headerRow?.style.display).toBe('contents')
		const headerCells = Array.from(headerRow?.querySelectorAll('.v-date-picker-month__weekday') ?? [])
		expect(headerCells).toHaveLength(7)
		expect(headerCells[0]?.getAttribute('role')).toBe('columnheader')

		const dataRows = Array.from(daysContainer.querySelectorAll('.v-date-picker-month__week')) as HTMLElement[]
		expect(dataRows).toHaveLength(1)
		expect(dataRows[0]?.getAttribute('role')).toBe('row')
		expect(dataRows[0]?.style.display).toBe('contents')
		const dayCells = Array.from(dataRows[0]?.querySelectorAll('.v-date-picker-month__day[data-v-date]') ?? [])
		expect(dayCells).toHaveLength(7)
		expect(dayCells[0]?.getAttribute('role')).toBe('gridcell')
	})

	it('preserves customized month button label with different navigation icons', async () => {
		// Modifier les icônes
		document.body.innerHTML = `
			<div class="v-date-picker">
				<div class="v-date-picker-controls">
					<div class="v-date-picker-controls__month">
						<button class="v-btn v-btn--icon" data-testid="prev-month">
							<span class="v-btn__content">
								<i class="v-icon mdi mdi-arrow-left"></i>
							</span>
						</button>
						<button class="v-date-picker-controls__month-btn v-btn">
							Janvier 2023
						</button>
						<button class="v-btn v-btn--icon" data-testid="next-month">
							<span class="v-btn__content">
								<i class="v-icon mdi mdi-arrow-right"></i>
							</span>
						</button>
					</div>
				</div>
			</div>
		`

		const { customizeMonthButton } = useMonthButtonCustomization(
			() => true,
			ref('janvier'),
			ref('2023'),
		)

		await customizeMonthButton()
		await updateAccessibility()

		// Récupérer les boutons
		const prevButton = document.querySelector('[data-testid="prev-month"]')
		const nextButton = document.querySelector('[data-testid="next-month"]')
		const monthButton = document.querySelector('.v-date-picker-controls__month-btn')

		// Vérifier que les flèches de navigation sont toujours étiquetées
		expect(prevButton?.getAttribute('aria-label')).toBe('Mois précédent')
		expect(nextButton?.getAttribute('aria-label')).toBe('Mois suivant')

		// Vérifier que le label personnalisé du mois n'est pas écrasé
		expect(monthButton?.getAttribute('aria-label')).toContain('janvier')
	})

	it('ne crée pas de bloc sr-only instructions (comportement actuel)', async () => {
		await updateAccessibility()
		const srOnlyEl = document.querySelector('.sr-only-instructions')
		expect(srOnlyEl).toBeNull()
	})

	describe('handleKeyDown', () => {
		it('does not intercept Enter on native interactive elements', () => {
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

			// Vérifier que preventDefault n'a pas été appelé sur un vrai bouton
			expect(preventDefaultSpy).not.toHaveBeenCalled()

			// Vérifier que le gestionnaire de clic n'a pas été déclenché par le composable
			expect(clickHandlerSpy).not.toHaveBeenCalled()
		})

		it('simulates a click event when Enter key is pressed on a gridcell', () => {
			const clickHandlerSpy = vi.fn()

			const cell = document.createElement('div')
			cell.setAttribute('role', 'gridcell')
			const button = document.createElement('button')
			button.addEventListener('click', clickHandlerSpy)
			cell.appendChild(button)
			document.body.appendChild(cell)

			const enterEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true,
				cancelable: true,
			})
			Object.defineProperty(enterEvent, 'target', { value: cell, enumerable: true })
			const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault')

			handleKeyDown(enterEvent)

			expect(preventDefaultSpy).toHaveBeenCalled()
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

	describe('RGAA 12.6 - aria-label reprend le texte visible', () => {
		it('vérifie que l\'aria-label du bouton du mois contient le texte visible', async () => {
			document.body.innerHTML = `
				<div class="v-date-picker-controls">
					<button class="v-date-picker-controls__month-btn">janv.</button>
					<button class="v-date-picker-controls__mode-btn">2025</button>
				</div>
			`

			const { customizeMonthButton } = useMonthButtonCustomization(
				() => true,
				ref('janvier'),
				ref('2025'),
			)

			await customizeMonthButton()
			await nextTick()

			const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
			const ariaLabel = monthBtn.getAttribute('aria-label')
			const visibleText = monthBtn.textContent

			// Vérifier que l'aria-label contient le texte visible (janv.)
			expect(ariaLabel).toContain('janv.')
			expect(visibleText).toContain('janv.')
		})

		it('vérifie que l\'aria-label du bouton de l\'année contient le texte visible', async () => {
			document.body.innerHTML = `
				<div class="v-date-picker-controls">
					<button class="v-date-picker-controls__month-btn">janv.</button>
					<button class="v-date-picker-controls__mode-btn">2025</button>
				</div>
			`

			const { customizeMonthButton } = useMonthButtonCustomization(
				() => true,
				ref('janvier'),
				ref('2025'),
			)

			await customizeMonthButton()
			await nextTick()

			const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!
			const ariaLabel = yearBtn.getAttribute('aria-label')
			const visibleText = yearBtn.textContent

			// Vérifier que l'aria-label contient le texte visible (2025)
			expect(ariaLabel).toContain('2025')
			expect(visibleText).toContain('2025')
		})

		it('vérifie que l\'aria-label du bouton du mois contient le mois sélectionné par défaut', async () => {
			document.body.innerHTML = `
				<div class="v-date-picker-controls">
					<button class="v-date-picker-controls__month-btn">déc.</button>
					<button class="v-date-picker-controls__mode-btn">2030</button>
				</div>
			`

			const { customizeMonthButton } = useMonthButtonCustomization(
				() => true,
				ref('décembre'),
				ref('2030'),
			)

			await customizeMonthButton()
			await nextTick()

			const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
			const ariaLabel = monthBtn.getAttribute('aria-label')

			// Vérifier que l'aria-label contient "décembre sélectionné par défaut"
			expect(ariaLabel).toContain('décembre sélectionné par défaut')
		})

		it('vérifie que l\'aria-label du bouton de l\'année contient l\'année sélectionnée par défaut', async () => {
			document.body.innerHTML = `
				<div class="v-date-picker-controls">
					<button class="v-date-picker-controls__month-btn">janv.</button>
					<button class="v-date-picker-controls__mode-btn">2030</button>
				</div>
			`

			const { customizeMonthButton } = useMonthButtonCustomization(
				() => true,
				ref('janvier'),
				ref('2030'),
			)

			await customizeMonthButton()
			await nextTick()

			const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!
			const ariaLabel = yearBtn.getAttribute('aria-label')

			// Vérifier que l'aria-label contient "2030 sélectionné par défaut"
			expect(ariaLabel).toContain('2030 sélectionné par défaut')
		})
	})
})
