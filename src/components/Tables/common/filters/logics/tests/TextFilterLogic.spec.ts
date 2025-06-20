import { it, expect, describe } from 'vitest'
import filter from '../text'

describe('Text filter logic', () => {
	it('should return true for empty string and empty filter', () => {
		expect(filter('', '')).toBe(true)
	})

	it('should return true for null item value and empty filter', () => {
		expect(filter(null, '')).toBe(true)
	})

	it('should return false for null item value and non-empty filter', () => {
		expect(filter(null, 'test')).toBe(false)
	})

	it('should return true for exact match', () => {
		expect(filter('test', 'test')).toBe(true)
	})

	it('should return false for non-matching strings', () => {
		expect(filter('test', 'example')).toBe(false)
	})

	it('should perform case-insensitive search by default', () => {
		expect(filter('Test', 'test')).toBe(true)
	})

	it('should handle special characters in filter', () => {
		expect(filter('hello world!', 'world')).toBe(true)
		expect(filter('hello world!', 'WORLD')).toBe(true)
	})

	it('should handle empty filter string', () => {
		expect(filter('any text', '')).toBe(true)
	})

	it('should not take accents into account', () => {
		expect(filter('café', 'cafe')).toBe(true)
		expect(filter('café', 'Café')).toBe(true)
		expect(filter('café', 'CAFE')).toBe(true)
		expect(filter('éèêëùûüîïñ', 'eeeuuuiin')).toBe(true)
		expect(filter('éèêëùûüîïñ', 'ÉÈÊËÙÛÜÎÏÑ')).toBe(true)
	})

	it('return true for a sequence found in the middle of a string or a word', () => {
		expect(filter('hello world', 'lo wo')).toBe(true)
		expect(filter('hello world', 'lo W')).toBe(true)
		expect(filter('hello world', 'loW')).toBe(false)
	})

	it('handles guillemets to case-sensitive search', () => {
		expect(filter('Hello World', '"Hello"')).toBe(true)
		expect(filter('Hello World', '"hello"')).toBe(false)
		expect(filter('Hello World', '"WORLD"')).toBe(false)
		expect(filter('Hello World', '"world"')).toBe(false)
	})

	it('handles guillemets to accents sensitive search', () => {
		expect(filter('café', '"cafe"')).toBe(false)
		expect(filter('éèêëùûüîïñ', '"éèêëùûüîïñ"')).toBe(true)
		expect(filter('éèêëùûüîïñ', '"eeeuuuiin"')).toBe(false)
		expect(filter('éèêëùûüîïñ', '"ÉÈÊËÙÛÜÎÏÑ"')).toBe(false)
	})

	it('perform a scrict comparaison when the search string begin by a =', () => {
		expect(filter('lorem ipsum', '=lorem ipsum')).toBe(true)
		expect(filter('lorem ipsum', '=lorem Ipsum')).toBe(false)
		expect(filter('lorem ipsum', '=lorem ipsum ')).toBe(false)
		expect(filter('lorem ipsum', '=ipsum')).toBe(false)
		expect(filter('lorem ipsum', '=lorem')).toBe(false)
	})

	it('permorm a non equal comparaison when the search string begin by <>', () => {
		expect(filter('lorem ipsum', '<>lorem ipsum')).toBe(false)
		expect(filter('lorem ipsum', '<>lorem Ipsum')).toBe(true)
	})

	it('accepts the wildcard ? in the search string', () => {
		expect(filter('lorem ipsum', 'lorem ?psum')).toBe(true)
		expect(filter('lorem ipsum', 'lorem ?psu?')).toBe(true)
		expect(filter('lorem ipsum', '???????????')).toBe(true)
		expect(filter('lorem ipsum', 'lorem ?psu?m')).toBe(false)
	})

	it('accepts the wildcard * in the search string', () => {
		expect(filter('lorem ipsum', 'lorem *um')).toBe(true)
		expect(filter('lorem ipsum', 'lorem*psu*')).toBe(true)
		expect(filter('lorem ipsum', '*ipsum')).toBe(true)
		expect(filter('lorem ipsum', 'lorem*')).toBe(true)
	})

	it('accepts the mixed use of the secials caracters in the search string', () => {
		expect(filter('lorem ipsum', '=l?rem ip*')).toBe(true)
		expect(filter('lorem ipsum', '=l?rEm ip*')).toBe(false)
		expect(filter('lorem ipsum', '<>l?rem ip*')).toBe(false)
		expect(filter('lorem ipsum', '<>l?rem ipsul')).toBe(true)
		expect(filter('lorem ipsum', '"lorem*psum"')).toBe(true)
		expect(filter('lorem ipsum', '"lorém*psum"')).toBe(false)
	})

	it('returns true when a next letter is found and the superior than operator is used', () => {
		expect(filter('b', '>a')).toBe(true)
		expect(filter('b', '>b')).toBe(false)
		expect(filter('b', '>c')).toBe(false)
		expect(filter('café', '>b')).toBe(true)
		expect(filter('café', '>c')).toBe(true)
		expect(filter('café', '>cd')).toBe(false)
		expect(filter('café', '>d')).toBe(false)
	})

	it('returns true when a next letter is found and the inferior than operator is used', () => {
		expect(filter('b', '<c')).toBe(true)
		expect(filter('b', '<b')).toBe(false)
		expect(filter('b', '<a')).toBe(false)
		expect(filter('café', '<d')).toBe(true)
		expect(filter('café', '<c')).toBe(false)
		expect(filter('café', '<ca')).toBe(false)
		expect(filter('café', '<e')).toBe(true)
	})

	it('returns true when a next letter is found and the superior or equal than operator is used', () => {
		expect(filter('b', '>=a')).toBe(true)
		expect(filter('b', '>=b')).toBe(true)
		expect(filter('b', '>=c')).toBe(false)
		expect(filter('café', '>=b')).toBe(true)
		expect(filter('café', '>=c')).toBe(true)
		expect(filter('café', '>=cd')).toBe(false)
		expect(filter('café', '>=d')).toBe(false)
	})

	it('returns true when a next letter is found and the inferior or equal than operator is used', () => {
		expect(filter('b', '<=c')).toBe(true)
		expect(filter('b', '<=b')).toBe(true)
		expect(filter('b', '<=a')).toBe(false)
		expect(filter('café', '<=d')).toBe(true)
		expect(filter('café', '<=c')).toBe(false)
		expect(filter('café', '<=ca')).toBe(false)
		expect(filter('café', '<=e')).toBe(true)
	})

	describe('specs specifics tests', () => {
		it('matches all words starting with "p" regardless of case', () => {
			expect(filter('pomme', 'p*')).toBe(true)
			expect(filter('Pomme', 'p*')).toBe(true)
			expect(filter('banane', 'p*')).toBe(false)
		})

		it('matches all words of exactly 4 letters', () => {
			expect(filter('test', '=????')).toBe(true)
			expect(filter('test', '=????')).toBe(true)
			expect(filter('tests', '=????')).toBe(false)
			expect(filter('tes', '=????')).toBe(false)
		})

		it('matches all empty values', () => {
			expect(filter('', '<>?*')).toBe(true)
			expect(filter(null, '<>?*')).toBe(true)
			expect(filter('test', '<>?*')).toBe(false)
			expect(filter(' ', '<>?*')).toBe(false)
		})

		it('matches all words containing a capital "W"', () => {
			expect(filter('Hello World', '"W"')).toBe(true)
			expect(filter('hello world', '"W"')).toBe(false)
			expect(filter('World', '"W"')).toBe(true)
			expect(filter('world', '"W"')).toBe(false)
		})

		it('matches all words alphabetically after "zu"', () => {
			expect(filter('zucchini', '>zu')).toBe(true)
			expect(filter('zu', '>zu')).toBe(false)
			expect(filter('zebra', '>zu')).toBe(false)
			expect(filter('apple', '>zu')).toBe(false)
		})
	})
})
