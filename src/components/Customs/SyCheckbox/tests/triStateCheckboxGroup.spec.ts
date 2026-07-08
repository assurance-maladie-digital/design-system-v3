import { describe, it, expect } from 'vitest'
import { useTriStateCheckboxGroup } from '../triStateCheckboxGroup'

const childValues = (group: ReturnType<typeof useTriStateCheckboxGroup>) =>
	group.childrenChecked.map(child => child.value)

describe('useTriStateCheckboxGroup', () => {
	it('starts in a partial state derived from the default mixed combination', () => {
		const group = useTriStateCheckboxGroup([true, false, false])

		expect(childValues(group)).toEqual([true, false, false])
		expect(group.parentChecked.value).toBe(false)
		expect(group.parentIndeterminate.value).toBe(true)
		expect(group.canCycleIndeterminate.value).toBe(true)
	})

	it('supports an arbitrary number of children when given a count', () => {
		const group = useTriStateCheckboxGroup(5)

		expect(group.childrenChecked).toHaveLength(5)
		expect(childValues(group)).toEqual([true, false, false, false, false])
		expect(group.parentIndeterminate.value).toBe(true)
	})

	it('checks all children when the parent is checked', () => {
		const group = useTriStateCheckboxGroup(4)

		group.handleParentModelUpdate(true)

		expect(childValues(group)).toEqual([true, true, true, true])
		expect(group.parentChecked.value).toBe(true)
		expect(group.parentIndeterminate.value).toBe(false)
	})

	it('unchecks all children when the parent is unchecked but keeps the mixed memory', () => {
		const group = useTriStateCheckboxGroup([true, false, false])

		group.handleParentModelUpdate(true)
		group.handleParentModelUpdate(false)

		expect(childValues(group)).toEqual([false, false, false])
		expect(group.parentChecked.value).toBe(false)
		expect(group.parentIndeterminate.value).toBe(false)
		// La combinaison partielle reste mémorisée pour le retour à l'état indéterminé
		expect(group.canCycleIndeterminate.value).toBe(true)
	})

	it('restores the last partial combination when returning to indeterminate (does not uncheck everything)', () => {
		const group = useTriStateCheckboxGroup([true, false, false])

		// mixed -> checked -> unchecked
		group.handleParentModelUpdate(true)
		group.handleParentModelUpdate(false)

		// unchecked -> indeterminate
		group.handleParentIndeterminateUpdate(true)

		expect(childValues(group)).toEqual([true, false, false])
		expect(group.parentIndeterminate.value).toBe(true)
		expect(group.parentChecked.value).toBe(false)
	})

	it('forgets the mixed memory when all children are checked individually', () => {
		const group = useTriStateCheckboxGroup([true, false, false])

		// L'utilisateur coche les enfants restants un par un
		group.childrenChecked[1]!.value = true
		group.childrenChecked[2]!.value = true

		expect(group.parentChecked.value).toBe(true)
		expect(group.parentIndeterminate.value).toBe(false)
		expect(group.canCycleIndeterminate.value).toBe(false)
	})

	it('forgets the mixed memory when all children are unchecked individually', () => {
		const group = useTriStateCheckboxGroup([true, false, false])

		// L'utilisateur décoche le seul enfant coché
		group.childrenChecked[0]!.value = false

		expect(group.parentChecked.value).toBe(false)
		expect(group.parentIndeterminate.value).toBe(false)
		expect(group.canCycleIndeterminate.value).toBe(false)
	})

	it('does not force indeterminate when the mixed memory has been cleared', () => {
		const group = useTriStateCheckboxGroup([true, false, false])

		// Tous cochés individuellement -> mémoire effacée
		group.childrenChecked[1]!.value = true
		group.childrenChecked[2]!.value = true
		expect(group.canCycleIndeterminate.value).toBe(false)

		// Une demande d'indéterminé ne restaure aucune sélection partielle obsolète
		group.handleParentIndeterminateUpdate(true)

		expect(group.parentIndeterminate.value).toBe(false)
	})

	it('re-enables the indeterminate cycle after a new partial selection', () => {
		const group = useTriStateCheckboxGroup([true, false, false])

		// Tous cochés individuellement -> mémoire effacée
		group.childrenChecked[1]!.value = true
		group.childrenChecked[2]!.value = true
		expect(group.canCycleIndeterminate.value).toBe(false)

		// Nouvelle sélection partielle -> mémoire reconstituée
		group.childrenChecked[2]!.value = false

		expect(group.parentIndeterminate.value).toBe(true)
		expect(group.canCycleIndeterminate.value).toBe(true)
	})

	it('respects a fully checked initial state instead of forcing a partial one', () => {
		const group = useTriStateCheckboxGroup([true, true, true])

		expect(childValues(group)).toEqual([true, true, true])
		expect(group.parentChecked.value).toBe(true)
		expect(group.parentIndeterminate.value).toBe(false)
		expect(group.canCycleIndeterminate.value).toBe(false)
	})

	it('respects a fully unchecked initial state', () => {
		const group = useTriStateCheckboxGroup([false, false, false])

		expect(childValues(group)).toEqual([false, false, false])
		expect(group.parentChecked.value).toBe(false)
		expect(group.parentIndeterminate.value).toBe(false)
		expect(group.canCycleIndeterminate.value).toBe(false)
	})

	it('enforces at least two children when given a too short state', () => {
		const group = useTriStateCheckboxGroup([true])

		expect(group.childrenChecked).toHaveLength(2)
		expect(childValues(group)).toEqual([true, false])
		expect(group.parentIndeterminate.value).toBe(true)
	})

	it('cycles correctly for a large group of children', () => {
		const group = useTriStateCheckboxGroup(6)

		// mixed -> checked
		group.handleParentModelUpdate(true)
		expect(childValues(group)).toEqual([true, true, true, true, true, true])
		expect(group.parentChecked.value).toBe(true)

		// checked -> unchecked
		group.handleParentModelUpdate(false)
		expect(childValues(group)).toEqual([false, false, false, false, false, false])

		// unchecked -> indeterminate (restaure la combinaison partielle initiale)
		group.handleParentIndeterminateUpdate(true)
		expect(childValues(group)).toEqual([true, false, false, false, false, false])
		expect(group.parentIndeterminate.value).toBe(true)
	})
})
