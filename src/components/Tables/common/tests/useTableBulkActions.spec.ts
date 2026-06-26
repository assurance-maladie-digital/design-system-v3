import { describe, it, expect } from 'vitest'
import { computed, ref } from 'vue'
import { useTableBulkActions } from '../useTableBulkActions'
import type { Items } from '../types'

const getItemValue = (item: unknown): unknown =>
	item && typeof item === 'object' && 'id' in item ? (item as { id: unknown }).id : item

const items = computed<Items>(() => [
	{ id: 1, name: 'A' },
	{ id: 2, name: 'B' },
	{ id: 3, name: 'C' },
])

describe('useTableBulkActions', () => {
	it('selectedItems : résout les clés sélectionnées en objets complets', () => {
		const model = ref<unknown[]>([1, 3])
		const { selectedItems } = useTableBulkActions({ items, model, getItemValue })

		expect(selectedItems.value.map(i => i.id)).toEqual([1, 3])
	})

	it('selectedItems : vide quand aucune ligne n\'est sélectionnée', () => {
		const model = ref<unknown[]>([])
		const { selectedItems } = useTableBulkActions({ items, model, getItemValue })

		expect(selectedItems.value).toEqual([])
	})

	it('selectedItems : réactif aux changements de sélection', () => {
		const model = ref<unknown[]>([1])
		const { selectedItems } = useTableBulkActions({ items, model, getItemValue })
		expect(selectedItems.value).toHaveLength(1)

		model.value = [1, 2]
		expect(selectedItems.value.map(i => i.id)).toEqual([1, 2])
	})

	it('clearSelection : vide le modèle de sélection', () => {
		const model = ref<unknown[]>([1, 2])
		const { selectedItems, clearSelection } = useTableBulkActions({ items, model, getItemValue })

		clearSelection()

		expect(model.value).toEqual([])
		expect(selectedItems.value).toEqual([])
	})

	it('identité par objet quand il n\'y a pas de clé', () => {
		const identity = (item: unknown): unknown => item
		const a = { name: 'A' }
		const b = { name: 'B' }
		const objItems = computed<Items>(() => [a, b])
		const model = ref<unknown[]>([a])

		const { selectedItems } = useTableBulkActions({ items: objItems, model, getItemValue: identity })

		expect(selectedItems.value).toEqual([a])
	})

	describe('édition séquentielle', () => {
		it('initBulkEdit : un brouillon par ligne sélectionnée, positionné sur la première', () => {
			const model = ref<unknown[]>([1, 2, 3])
			const { initBulkEdit, bulkEditIndex, bulkEditCount, currentBulkDraft } = useTableBulkActions({ items, model, getItemValue })

			initBulkEdit()

			expect(bulkEditCount.value).toBe(3)
			expect(bulkEditIndex.value).toBe(0)
			expect(currentBulkDraft.value).toEqual({ id: 1, name: 'A' })
		})

		it('setBulkField : ne modifie QUE la ligne courante (les autres restent intactes)', () => {
			const model = ref<unknown[]>([1, 2, 3])
			const { initBulkEdit, setBulkField, bulkNext, currentBulkDraft, collectEditedItems } = useTableBulkActions({ items, model, getItemValue })

			initBulkEdit()
			setBulkField('name', 'Z') // modifie la 1re ligne
			expect(currentBulkDraft.value).toEqual({ id: 1, name: 'Z' })

			bulkNext()
			expect(currentBulkDraft.value).toEqual({ id: 2, name: 'B' }) // 2e ligne intacte

			expect(collectEditedItems()).toEqual([{ id: 1, name: 'Z' }])
		})

		it('bulkNext / bulkPrev : navigue dans les bornes', () => {
			const model = ref<unknown[]>([1, 2])
			const { initBulkEdit, bulkNext, bulkPrev, bulkEditIndex } = useTableBulkActions({ items, model, getItemValue })

			initBulkEdit()
			bulkPrev()
			expect(bulkEditIndex.value).toBe(0) // borne basse
			bulkNext()
			expect(bulkEditIndex.value).toBe(1)
			bulkNext()
			expect(bulkEditIndex.value).toBe(1) // borne haute
		})

		it('collectEditedItems : ne renvoie que les lignes modifiées (objets complets)', () => {
			const model = ref<unknown[]>([1, 2, 3])
			const { initBulkEdit, setBulkField, bulkNext, collectEditedItems } = useTableBulkActions({ items, model, getItemValue })

			initBulkEdit()
			expect(collectEditedItems()).toEqual([]) // aucune modification

			bulkNext()
			bulkNext()
			setBulkField('name', 'CC') // modifie la 3e ligne
			expect(collectEditedItems()).toEqual([{ id: 3, name: 'CC' }])
		})

		it('resetBulkEdit : vide l\'état d\'édition', () => {
			const model = ref<unknown[]>([1, 2])
			const { initBulkEdit, resetBulkEdit, bulkEditCount } = useTableBulkActions({ items, model, getItemValue })

			initBulkEdit()
			resetBulkEdit()
			expect(bulkEditCount.value).toBe(0)
		})
	})
})
