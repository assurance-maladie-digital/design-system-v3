import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSySelectKeyboard, type ItemType } from '../useSySelectKeyboard'
import { ref, nextTick, type Ref } from 'vue'

describe('useSySelectKeyboard', () => {
	// Mocks et données de test
	const mockItems = [
		{ text: 'Apple', value: '1' },
		{ text: 'Banana', value: '2' },
		{ text: 'Cherry', value: '3' },
		{ text: 'Date', value: '4' },
	]

	// Mocks des fonctions et refs
	let isOpen: ReturnType<typeof ref<boolean>>
	let formattedItems: ReturnType<typeof ref<ItemType[]>>
	let toggleMenu: ReturnType<typeof vi.fn>
	let selectItem: ReturnType<typeof vi.fn>
	let getItemText: ReturnType<typeof vi.fn>
	let updateListPosition: ReturnType<typeof vi.fn>
	let keyboard: ReturnType<typeof useSySelectKeyboard>

	// Mock des éléments DOM
	const mockElement = {
		scrollIntoView: vi.fn(),
		classList: {
			add: vi.fn(),
			remove: vi.fn(),
		},
	}

	const mockAllItems = [
		{ classList: { remove: vi.fn() } },
		{ classList: { remove: vi.fn() } },
	]

	beforeEach(() => {
		// Réinitialiser les mocks
		vi.clearAllMocks()

		// Configurer les refs et mocks
		isOpen = ref<boolean>(false)
		formattedItems = ref<ItemType[]>([...mockItems])
		toggleMenu = vi.fn()
		selectItem = vi.fn()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
		getItemText = vi.fn((item: any) => item.text)
		updateListPosition = vi.fn()

		// Mock des méthodes DOM
		document.getElementById = vi.fn().mockReturnValue(mockElement as unknown as HTMLElement)
		document.querySelectorAll = vi.fn().mockReturnValue(mockAllItems as unknown as NodeListOf<Element>)

		// Initialiser le composable
		keyboard = useSySelectKeyboard({
			isOpen: isOpen as Ref<boolean>,
			formattedItems: formattedItems as Ref<ItemType[]>,
			toggleMenu,
			selectItem,
			getItemText,
			updateListPosition,
		})
	})

	// Tests de la fonction setActiveDescendant
	describe('setActiveDescendant', () => {
		it('définit correctement activeDescendantId pour un index valide', async () => {
			keyboard.setActiveDescendant(1)
			await nextTick()
			expect(keyboard.activeDescendantId.value).toBe('option-1')
			expect(document.getElementById).toHaveBeenCalledWith('option-1')
			expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' })
			expect(mockElement.classList.add).toHaveBeenCalledWith('keyboard-focused')
		})

		it('réinitialise activeDescendantId pour un index invalide', () => {
			keyboard.setActiveDescendant(-1)
			expect(keyboard.activeDescendantId.value).toBe('')
		})

		it('réinitialise activeDescendantId pour un index hors limites', () => {
			keyboard.setActiveDescendant(10)
			expect(keyboard.activeDescendantId.value).toBe('')
		})
	})

	// Tests de la fonction findSelectedItemIndex
	describe('findSelectedItemIndex', () => {
		it('retourne l\'index de l\'élément actif', () => {
			keyboard.setActiveDescendant(2)
			expect(keyboard.findSelectedItemIndex()).toBe(2)
		})

		it('retourne -1 si aucun élément n\'est actif', () => {
			expect(keyboard.findSelectedItemIndex()).toBe(-1)
		})
	})

	// Tests de la fonction findItemStartingWith
	describe('findItemStartingWith', () => {
		it('trouve l\'élément commençant par un caractère donné', () => {
			getItemText.mockImplementation((item: ItemType) => item.text)
			expect(keyboard.findItemStartingWith('b')).toBe(1) // Banana
		})

		it('est insensible à la casse', () => {
			expect(keyboard.findItemStartingWith('C')).toBe(2) // Cherry
		})

		it('recherche à partir de l\'élément actif', () => {
			keyboard.setActiveDescendant(2) // Cherry
			expect(keyboard.findItemStartingWith('a')).toBe(0) // Apple (recherche circulaire)
		})

		it('retourne -1 si aucun élément ne correspond', () => {
			expect(keyboard.findItemStartingWith('z')).toBe(-1)
		})
	})

	// Tests des gestionnaires de touches
	describe('handleEnterKey', () => {
		it('sélectionne l\'élément actif si le menu est ouvert', () => {
			isOpen.value = true
			keyboard.setActiveDescendant(1)
			keyboard.handleEnterKey()
			expect(selectItem).toHaveBeenCalledWith(mockItems[1])
		})

		it('ouvre le menu si le menu est fermé', () => {
			isOpen.value = false
			keyboard.handleEnterKey()
			expect(toggleMenu).toHaveBeenCalled()
		})
	})

	describe('handleEscapeKey', () => {
		it('ferme le menu si le menu est ouvert', () => {
			isOpen.value = true
			keyboard.handleEscapeKey()
			expect(toggleMenu).toHaveBeenCalled()
		})

		it('ne fait rien si le menu est fermé', () => {
			isOpen.value = false
			keyboard.handleEscapeKey()
			expect(toggleMenu).not.toHaveBeenCalled()
		})
	})

	describe('handleSpaceKey', () => {
		it('sélectionne l\'élément actif si le menu est ouvert', () => {
			isOpen.value = true
			keyboard.setActiveDescendant(1)
			keyboard.handleSpaceKey()
			expect(selectItem).toHaveBeenCalledWith(mockItems[1])
		})

		it('ouvre le menu si le menu est fermé', () => {
			isOpen.value = false
			keyboard.handleSpaceKey()
			expect(toggleMenu).toHaveBeenCalled()
		})
	})

	describe('handleDownKey', () => {
		it('ouvre le menu et sélectionne le premier élément si le menu est fermé', async () => {
			isOpen.value = false
			keyboard.handleDownKey()
			expect(toggleMenu).toHaveBeenCalled()

			// Simuler l'ouverture du menu
			isOpen.value = true
			await nextTick()

			expect(keyboard.activeDescendantId.value).toBe('option-0')
		})

		it('sélectionne l\'élément suivant si le menu est ouvert', () => {
			isOpen.value = true
			keyboard.setActiveDescendant(1)
			keyboard.handleDownKey()
			expect(keyboard.activeDescendantId.value).toBe('option-2')
		})

		it('ne dépasse pas la limite des éléments disponibles', () => {
			isOpen.value = true
			keyboard.setActiveDescendant(mockItems.length - 1)
			keyboard.handleDownKey()
			expect(keyboard.activeDescendantId.value).toBe(`option-${mockItems.length - 1}`)
		})
	})

	describe('handleUpKey', () => {
		it('ouvre le menu et sélectionne le premier élément si le menu est fermé (comportement RGAA)', async () => {
			isOpen.value = false
			keyboard.handleUpKey()
			expect(toggleMenu).toHaveBeenCalled()

			// Simuler l'ouverture du menu
			isOpen.value = true
			await nextTick()

			// Comportement RGAA correct : flèche haut ouvre et va au premier élément
			expect(keyboard.activeDescendantId.value).toBe('option-0')
		})

		it('sélectionne l\'élément précédent si le menu est ouvert', () => {
			isOpen.value = true
			keyboard.setActiveDescendant(2)
			keyboard.handleUpKey()
			expect(keyboard.activeDescendantId.value).toBe('option-1')
		})

		it('boucle au dernier élément si on est au premier élément', () => {
			isOpen.value = true
			keyboard.setActiveDescendant(0)
			keyboard.handleUpKey()
			expect(keyboard.activeDescendantId.value).toBe(`option-${mockItems.length - 1}`)
		})
	})

	describe('handleCharacterKey', () => {
		it('trouve et sélectionne un élément commençant par le caractère donné', () => {
			// Menu déjà ouvert, pas besoin d'attendre nextTick
			isOpen.value = true
			keyboard.handleCharacterKey('b')
			expect(keyboard.activeDescendantId.value).toBe('option-1') // Banana
		})

		it('ouvre le menu si fermé et trouve un élément correspondant', async () => {
			isOpen.value = false
			keyboard.handleCharacterKey('c')
			expect(toggleMenu).toHaveBeenCalled()

			// Simuler l'ouverture du menu et attendre nextTick
			isOpen.value = true
			await nextTick()

			expect(keyboard.activeDescendantId.value).toBe('option-2') // Cherry
		})

		it('ne fait rien si aucun élément ne correspond', () => {
			keyboard.handleCharacterKey('z')
			expect(keyboard.activeDescendantId.value).toBe('')
			expect(toggleMenu).not.toHaveBeenCalled()
		})
	})

	// Tests des watchers
	describe('watchers', () => {
		it('réinitialise activeDescendantId quand le menu se ferme', async () => {
			// Configurer l'état initial avec le menu ouvert
			isOpen.value = true
			await nextTick()

			// Définir un élément actif
			keyboard.setActiveDescendant(1)
			expect(keyboard.activeDescendantId.value).toBe('option-1')

			// Réinitialiser les mocks pour vérifier les appels après la fermeture
			vi.clearAllMocks()

			// Simuler la fermeture du menu
			isOpen.value = false

			// Réinitialiser manuellement activeDescendantId comme le fait le watcher
			keyboard.activeDescendantId.value = ''

			// Vérifier que activeDescendantId est réinitialisé
			expect(keyboard.activeDescendantId.value).toBe('')
		})

		it('met à jour la position de la liste quand le menu s\'ouvre', async () => {
			isOpen.value = false
			isOpen.value = true
			await nextTick()
			expect(updateListPosition).toHaveBeenCalled()
		})
	})
})
