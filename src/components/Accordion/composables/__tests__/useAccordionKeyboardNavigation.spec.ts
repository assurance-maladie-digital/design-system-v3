import { describe, it, expect, vi, beforeEach } from 'vitest'
import useAccordionKeyboardNavigation from '../useAccordionKeyboardNavigation'
import { ref } from 'vue'
import type { AccordionItem } from '../useAccordionKeyboardNavigation'

describe('useAccordionKeyboardNavigation', () => {
	// Données de test
	const mockItems: AccordionItem[] = [
		{ id: 'item1', title: 'Item 1', content: 'Content 1' },
		{ id: 'item2', title: 'Item 2', content: 'Content 2' },
		{ id: 'item3', title: 'Item 3', content: 'Content 3', disabled: true },
		{ id: 'item4', title: 'Item 4', content: 'Content 4' },
	]

	// Mock pour setFocus
	const mockSetFocus = vi.fn()

	// Réinitialiser les mocks avant chaque test
	beforeEach(() => {
		mockSetFocus.mockReset()
	})

	describe('handleKeyNavigation', () => {
		describe('ArrowDown key', () => {
			it('focuses the next non-disabled item', () => {
				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					mockItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation à partir du premier élément
				handleKeyNavigation(event, 'item1', 0)

				// Doit sauter l'élément désactivé (item3) et aller à item4
				expect(event.preventDefault).toHaveBeenCalled()
				expect(mockSetFocus).toHaveBeenCalledWith('item2')
			})

			it('wraps around to the first item when at the end', () => {
				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					mockItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation à partir du dernier élément
				handleKeyNavigation(event, 'item4', 3)

				expect(event.preventDefault).toHaveBeenCalled()
				expect(mockSetFocus).toHaveBeenCalledWith('item1')
			})
		})

		describe('ArrowUp key', () => {
			it('focuses the previous non-disabled item', () => {
				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					mockItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation à partir du dernier élément
				handleKeyNavigation(event, 'item4', 3)

				// Doit sauter l'élément désactivé (item3) et aller à item2
				expect(event.preventDefault).toHaveBeenCalled()
				expect(mockSetFocus).toHaveBeenCalledWith('item2')
			})

			it('wraps around to the last item when at the beginning', () => {
				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					mockItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation à partir du premier élément
				handleKeyNavigation(event, 'item1', 0)

				expect(event.preventDefault).toHaveBeenCalled()
				expect(mockSetFocus).toHaveBeenCalledWith('item4')
			})
		})

		describe('Home key', () => {
			it('focuses the first non-disabled item', () => {
				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					mockItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'Home' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation à partir d'un élément quelconque
				handleKeyNavigation(event, 'item4', 3)

				expect(event.preventDefault).toHaveBeenCalled()
				expect(mockSetFocus).toHaveBeenCalledWith('item1')
			})
		})

		describe('End key', () => {
			it('focuses the last non-disabled item', () => {
				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					mockItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'End' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation à partir d'un élément quelconque
				handleKeyNavigation(event, 'item1', 0)

				expect(event.preventDefault).toHaveBeenCalled()
				expect(mockSetFocus).toHaveBeenCalledWith('item4')
			})
		})

		describe('with reactive items', () => {
			it('handles reactive items correctly', () => {
				const reactiveItems = ref([...mockItems])

				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					reactiveItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation à partir du premier élément
				handleKeyNavigation(event, 'item1', 0)

				expect(mockSetFocus).toHaveBeenCalledWith('item2')

				// Modifier les éléments réactifs
				reactiveItems.value = [
					{ id: 'item1', title: 'Item 1', content: 'Content 1' },
					{ id: 'newItem', title: 'New Item', content: 'New Content' },
				]

				// Réinitialiser le mock
				mockSetFocus.mockReset()

				// Simuler à nouveau la navigation
				handleKeyNavigation(event, 'item1', 0)

				// Doit utiliser la nouvelle liste d'éléments
				expect(mockSetFocus).toHaveBeenCalledWith('newItem')
			})
		})

		describe('with all disabled items', () => {
			it('essaie de naviguer même avec des éléments désactivés', () => {
				// Note: L'implémentation actuelle ne vérifie pas si tous les éléments sont désactivés
				// et essaie quand même de naviguer vers le prochain élément disponible
				const allDisabledItems: AccordionItem[] = [
					{ id: 'item1', title: 'Item 1', content: 'Content 1', disabled: true },
					{ id: 'item2', title: 'Item 2', content: 'Content 2', disabled: true },
				]

				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					allDisabledItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation
				handleKeyNavigation(event, 'item1', 0)

				// L'implémentation actuelle essaie quand même de naviguer
				expect(mockSetFocus).toHaveBeenCalled()
				expect(event.preventDefault).toHaveBeenCalled()
			})
		})

		describe('with other keys', () => {
			it('does nothing for unhandled keys', () => {
				const { handleKeyNavigation } = useAccordionKeyboardNavigation(
					mockItems,
					mockSetFocus,
				)

				const event = new KeyboardEvent('keydown', { key: 'Tab' })
				vi.spyOn(event, 'preventDefault')

				// Simuler la navigation avec une touche non gérée
				handleKeyNavigation(event, 'item1', 0)

				// Ne doit pas empêcher le comportement par défaut ni changer le focus
				expect(event.preventDefault).not.toHaveBeenCalled()
				expect(mockSetFocus).not.toHaveBeenCalled()
			})
		})
	})
})
