import { describe, it, expect } from 'vitest'
import { useTableEditing } from '../useTableEditing'

// Identité de ligne : la clé `id` si présente, sinon l'objet lui-même
// (reproduit le comportement de `getItemValue` issu de la sélection).
const getItemValue = (item: unknown): unknown =>
	item && typeof item === 'object' && 'id' in item ? (item as { id: unknown }).id : item

describe('useTableEditing', () => {
	it('isRowEditing : faux tant qu\'aucune édition n\'est en cours', () => {
		const { isRowEditing } = useTableEditing({ getItemValue })
		expect(isRowEditing({ id: 1 })).toBe(false)
	})

	it('startEditing : marque la ligne et copie un brouillon indépendant de l\'original', () => {
		const { startEditing, isRowEditing, draft } = useTableEditing({ getItemValue })
		const item = { id: 1, name: 'Jean' }

		startEditing(item)

		expect(isRowEditing(item)).toBe(true)
		expect(isRowEditing({ id: 2 })).toBe(false)
		expect(draft.value).toEqual({ id: 1, name: 'Jean' })

		// Le brouillon est une copie : le muter ne touche pas l'item d'origine
		draft.value.name = 'Paul'
		expect(item.name).toBe('Jean')
	})

	it('setDraftField : met à jour le champ ciblé du brouillon', () => {
		const { startEditing, setDraftField, draft } = useTableEditing({ getItemValue })

		startEditing({ id: 1, name: 'Jean' })
		setDraftField('name', 'Paul')

		expect(draft.value.name).toBe('Paul')
	})

	it('saveEditing : renvoie { updated, original } correctement mergés puis réinitialise', () => {
		const { startEditing, setDraftField, saveEditing, isRowEditing } = useTableEditing({ getItemValue })
		const item = { id: 1, name: 'Jean', email: 'jean@example.com' }

		startEditing(item)
		setDraftField('name', 'Paul')
		const { updated, original } = saveEditing()

		expect(updated).toEqual({ id: 1, name: 'Paul', email: 'jean@example.com' })
		expect(original).toBe(item)
		// L'état d'édition est réinitialisé après sauvegarde
		expect(isRowEditing(item)).toBe(false)
	})

	it('cancelEditing : renvoie l\'original, ne propage aucune modification et réinitialise', () => {
		const { startEditing, setDraftField, cancelEditing, isRowEditing } = useTableEditing({ getItemValue })
		const item = { id: 1, name: 'Jean' }

		startEditing(item)
		setDraftField('name', 'Paul')
		const original = cancelEditing()

		expect(original).toBe(item)
		expect(item.name).toBe('Jean')
		expect(isRowEditing(item)).toBe(false)
	})

	it('une seule ligne éditable à la fois : éditer B remplace l\'édition de A', () => {
		const { startEditing, isRowEditing } = useTableEditing({ getItemValue })

		startEditing({ id: 1 })
		startEditing({ id: 2 })

		expect(isRowEditing({ id: 1 })).toBe(false)
		expect(isRowEditing({ id: 2 })).toBe(true)
	})

	it('resetEditing : sort du mode édition', () => {
		const { startEditing, resetEditing, isRowEditing, editingKey } = useTableEditing({ getItemValue })

		startEditing({ id: 1 })
		resetEditing()

		expect(editingKey.value).toBeNull()
		expect(isRowEditing({ id: 1 })).toBe(false)
	})

	it('identité par référence d\'objet quand il n\'y a pas de clé', () => {
		const identity = (item: unknown): unknown => item
		const { startEditing, isRowEditing } = useTableEditing({ getItemValue: identity })
		const a = { name: 'A' }
		const b = { name: 'B' }

		startEditing(a)

		expect(isRowEditing(a)).toBe(true)
		expect(isRowEditing(b)).toBe(false)
	})
})
