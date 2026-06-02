import { describe, it, expect } from 'vitest'
import filter from '../select'

describe('Select filter logic', () => {
	describe('filterValue scalaire (valeur unique)', () => {
		it('retourne true pour une correspondance exacte de string', () => {
			expect(filter('foo', 'foo')).toBe(true)
		})

		it('retourne false pour une non-correspondance de string', () => {
			expect(filter('foo', 'bar')).toBe(false)
		})

		it('retourne true pour une correspondance exacte de number', () => {
			expect(filter(42, 42)).toBe(true)
		})

		it('retourne false pour une non-correspondance de number', () => {
			expect(filter(42, 43)).toBe(false)
		})

		it('retourne true pour null === null', () => {
			expect(filter(null, null)).toBe(true)
		})

		it('retourne false pour null !== "foo"', () => {
			expect(filter(null, 'foo')).toBe(false)
		})

		it('retourne true pour boolean true === true', () => {
			expect(filter(true, true)).toBe(true)
		})

		it('retourne false pour boolean true !== false', () => {
			expect(filter(true, false)).toBe(false)
		})
	})

	describe('filterValue objet (comparaison JSON)', () => {
		it('retourne true pour deux objets identiques', () => {
			expect(filter({ id: 1, label: 'A' }, { id: 1, label: 'A' })).toBe(true)
		})

		it('retourne false pour deux objets différents', () => {
			expect(filter({ id: 1, label: 'A' }, { id: 2, label: 'B' })).toBe(false)
		})

		it('retourne false si itemValue est une string et filterValue un objet', () => {
			expect(filter('foo', { id: 1 })).toBe(false)
		})

		it('retourne true pour deux objets imbriqués identiques', () => {
			const obj = { a: { b: 1 } }
			expect(filter({ a: { b: 1 } }, obj)).toBe(true)
		})
	})

	describe('filterValue tableau — itemValue scalaire', () => {
		it('retourne true si itemValue est dans le tableau', () => {
			expect(filter('foo', ['foo', 'bar'])).toBe(true)
		})

		it('retourne false si itemValue n\'est pas dans le tableau', () => {
			expect(filter('baz', ['foo', 'bar'])).toBe(false)
		})

		it('retourne true pour un number inclus dans le tableau', () => {
			expect(filter(2, [1, 2, 3])).toBe(true)
		})

		it('retourne false pour un number non inclus dans le tableau', () => {
			expect(filter(5, [1, 2, 3])).toBe(false)
		})

		it('retourne false pour un tableau filterValue vide', () => {
			expect(filter('foo', [])).toBe(false)
		})
	})

	describe('filterValue tableau — itemValue tableau', () => {
		it('retourne true si au moins un élément commun (primitifs)', () => {
			expect(filter(['Vue', 'React'], ['Vue', 'Angular'])).toBe(true)
		})

		it('retourne false si aucun élément commun (primitifs)', () => {
			expect(filter(['Svelte', 'Angular'], ['Vue', 'React'])).toBe(false)
		})

		it('retourne true si au moins un objet commun (comparaison JSON)', () => {
			expect(filter(
				[{ id: 1 }, { id: 2 }],
				[{ id: 2 }, { id: 3 }],
			)).toBe(true)
		})

		it('retourne false si aucun objet commun (comparaison JSON)', () => {
			expect(filter(
				[{ id: 1 }],
				[{ id: 2 }],
			)).toBe(false)
		})

		it('retourne false si itemValue est tableau vide', () => {
			expect(filter([], ['foo'])).toBe(false)
		})

		it('retourne false si filterValue est tableau vide', () => {
			expect(filter(['foo'], [])).toBe(false)
		})
	})
})
