import { describe, it, expect } from 'vitest'
import { insertAt } from '../insertAt'

describe('insertAt', () => {
	it('insère au milieu de la chaîne', () => {
		expect(insertAt('abcd', 2, '-')).toBe('ab-cd')
	})

	it('insère en début si index est 0', () => {
		expect(insertAt('abc', 0, 'X')).toBe('Xabc')
	})

	it('insère en début si index est négatif', () => {
		expect(insertAt('abc', -5, 'X')).toBe('Xabc')
	})

	it('retourne la chaîne inchangée si index est égal à la longueur', () => {
		expect(insertAt('abc', 3, 'X')).toBe('abc')
	})

	it('retourne la chaîne inchangée si index dépasse la longueur', () => {
		expect(insertAt('abc', 99, 'X')).toBe('abc')
	})

	it('insère avant le dernier caractère (index = length - 1)', () => {
		expect(insertAt('abc', 2, '-')).toBe('ab-c')
	})

	it('insère une chaîne vide sans modifier la valeur', () => {
		expect(insertAt('abc', 1, '')).toBe('abc')
	})

	it('insère dans une chaîne vide avec index 0', () => {
		expect(insertAt('', 0, 'X')).toBe('X')
	})

	it('retourne la chaîne vide inchangée si index >= 0 et value est vide', () => {
		expect(insertAt('', 1, 'X')).toBe('')
	})

	it('insère une chaîne multi-caractères', () => {
		expect(insertAt('hello', 2, '---')).toBe('he---llo')
	})
})
