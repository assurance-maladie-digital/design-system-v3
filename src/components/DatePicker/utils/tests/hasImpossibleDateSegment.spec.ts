import { describe, expect, it } from 'vitest'
import { hasImpossibleDateSegment } from '../validationUtils'

describe('hasImpossibleDateSegment', () => {
	// Régression #2571 : `isDateComplete` ne compte que les chiffres, une saisie
	// comme `00/__/____` passait donc pour « incomplète donc valide ».
	it('signale un segment complet hors plage', () => {
		expect(hasImpossibleDateSegment('00', 'DD/MM/YYYY')).toBe(true)
		expect(hasImpossibleDateSegment('00/__/____', 'DD/MM/YYYY')).toBe(true)
		expect(hasImpossibleDateSegment('32/01/2026', 'DD/MM/YYYY')).toBe(true)
		expect(hasImpossibleDateSegment('01/13/2026', 'DD/MM/YYYY')).toBe(true)
	})

	// Sans quoi le champ afficherait une erreur dès la première frappe.
	it('laisse passer un segment encore partiel', () => {
		expect(hasImpossibleDateSegment('0', 'DD/MM/YYYY')).toBe(false)
		expect(hasImpossibleDateSegment('3', 'DD/MM/YYYY')).toBe(false)
		expect(hasImpossibleDateSegment('01', 'DD/MM/YYYY')).toBe(false)
	})

	it('accepte une date valide et une saisie vide', () => {
		expect(hasImpossibleDateSegment('31/12/2026', 'DD/MM/YYYY')).toBe(false)
		expect(hasImpossibleDateSegment('', 'DD/MM/YYYY')).toBe(false)
	})

	it('suit les séparateurs et l ordre du format', () => {
		expect(hasImpossibleDateSegment('00-01-2026', 'DD-MM-YYYY')).toBe(true)
		expect(hasImpossibleDateSegment('2026/00/01', 'YYYY/MM/DD')).toBe(true)
		expect(hasImpossibleDateSegment('2026/12/31', 'YYYY/MM/DD')).toBe(false)
	})
})
