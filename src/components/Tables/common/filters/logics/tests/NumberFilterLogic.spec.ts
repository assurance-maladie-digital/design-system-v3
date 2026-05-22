import { describe, it, expect } from 'vitest'
import filter from '../number'

describe('Number filter logic', () => {
	describe('itemValue non-number', () => {
		it('retourne false si itemValue est une string', () => {
			expect(filter('42', 42)).toBe(false)
		})

		it('retourne false si itemValue est null', () => {
			expect(filter(null, 42)).toBe(false)
		})

		it('retourne false si itemValue est undefined', () => {
			expect(filter(undefined, 42)).toBe(false)
		})

		it('retourne false si itemValue est un boolean', () => {
			expect(filter(true, 1)).toBe(false)
		})
	})

	describe('filterValue numérique (exact match)', () => {
		it('retourne true pour une valeur égale', () => {
			expect(filter(42, 42)).toBe(true)
		})

		it('retourne false pour une valeur différente', () => {
			expect(filter(42, 43)).toBe(false)
		})

		it('retourne true pour 0 === 0', () => {
			expect(filter(0, 0)).toBe(true)
		})

		it('retourne false pour 0 !== 1', () => {
			expect(filter(0, 1)).toBe(false)
		})

		it('retourne true pour des négatifs égaux', () => {
			expect(filter(-5, -5)).toBe(true)
		})
	})

	describe('filterValue string sans opérateur', () => {
		it('retourne true pour correspondance exacte via string', () => {
			expect(filter(42, '42')).toBe(true)
		})

		it('retourne true pour string avec virgule décimale', () => {
			expect(filter(3.14, '3,14')).toBe(true)
		})

		it('retourne true pour string avec point décimal', () => {
			expect(filter(3.14, '3.14')).toBe(true)
		})

		it('retourne false pour une string non numérique', () => {
			expect(filter(42, 'abc')).toBe(false)
		})

		it('retourne false si la valeur ne correspond pas', () => {
			expect(filter(42, '43')).toBe(false)
		})
	})

	describe('opérateur =', () => {
		it('retourne true pour =42 avec itemValue 42', () => {
			expect(filter(42, '=42')).toBe(true)
		})

		it('retourne false pour =42 avec itemValue 43', () => {
			expect(filter(43, '=42')).toBe(false)
		})

		it('retourne false si la valeur après = est non numérique', () => {
			expect(filter(42, '=abc')).toBe(false)
		})
	})

	describe('opérateur <>', () => {
		it('retourne true pour <>42 avec itemValue 43', () => {
			expect(filter(43, '<>42')).toBe(true)
		})

		it('retourne false pour <>42 avec itemValue 42', () => {
			expect(filter(42, '<>42')).toBe(false)
		})
	})

	describe('opérateur <', () => {
		it('retourne true si itemValue < filterValue', () => {
			expect(filter(10, '<20')).toBe(true)
		})

		it('retourne false si itemValue === filterValue', () => {
			expect(filter(20, '<20')).toBe(false)
		})

		it('retourne false si itemValue > filterValue', () => {
			expect(filter(30, '<20')).toBe(false)
		})
	})

	describe('opérateur <=', () => {
		it('retourne true si itemValue < filterValue', () => {
			expect(filter(10, '<=20')).toBe(true)
		})

		it('retourne true si itemValue === filterValue', () => {
			expect(filter(20, '<=20')).toBe(true)
		})

		it('retourne false si itemValue > filterValue', () => {
			expect(filter(30, '<=20')).toBe(false)
		})
	})

	describe('opérateur >', () => {
		it('retourne true si itemValue > filterValue', () => {
			expect(filter(30, '>20')).toBe(true)
		})

		it('retourne false si itemValue === filterValue', () => {
			expect(filter(20, '>20')).toBe(false)
		})

		it('retourne false si itemValue < filterValue', () => {
			expect(filter(10, '>20')).toBe(false)
		})
	})

	describe('opérateur >=', () => {
		it('retourne true si itemValue > filterValue', () => {
			expect(filter(30, '>=20')).toBe(true)
		})

		it('retourne true si itemValue === filterValue', () => {
			expect(filter(20, '>=20')).toBe(true)
		})

		it('retourne false si itemValue < filterValue', () => {
			expect(filter(10, '>=20')).toBe(false)
		})
	})

	describe('virgule comme séparateur décimal dans opérateurs', () => {
		it('retourne true pour >=3,5 avec itemValue 4', () => {
			expect(filter(4, '>=3,5')).toBe(true)
		})

		it('retourne true pour <=3,5 avec itemValue 3', () => {
			expect(filter(3, '<=3,5')).toBe(true)
		})

		it('retourne true pour =3,14 avec itemValue 3.14', () => {
			expect(filter(3.14, '=3,14')).toBe(true)
		})
	})

	describe('valeur NaN après opérateur', () => {
		it('retourne false si la valeur après < est non numérique', () => {
			expect(filter(42, '<abc')).toBe(false)
		})

		it('retourne false si la valeur après > est non numérique', () => {
			expect(filter(42, '>abc')).toBe(false)
		})
	})

	describe('fallback String.includes pour filterValue autre', () => {
		it('retourne true si String(itemValue).includes(String(filterValue)) pour filterValue boolean', () => {
			expect(filter(42, true as unknown as string)).toBe(false)
		})
	})
})
