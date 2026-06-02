import { describe, it, expect } from 'vitest'
import { formatNir } from '../formatNir'

describe('formatNir', () => {
	it('formate un NIR complet avec clé (15 chiffres)', () => {
		expect(formatNir('123456789012345')).toBe('1 23 45 67 890 123 45')
	})

	it('formate un NIR sans clé (13 chiffres)', () => {
		expect(formatNir('1234567890123')).toBe('1 23 45 67 890 123')
	})

	it('retourne une chaîne vide si la valeur est vide', () => {
		expect(formatNir('')).toBe('')
	})

	it('ne plante pas avec une valeur courte (moins de 13 chiffres)', () => {
		expect(() => formatNir('123')).not.toThrow()
	})

	it('trim le résultat final (pas d\'espace en début ni en fin)', () => {
		const result = formatNir('123456789012345')
		expect(result.startsWith(' ')).toBe(false)
		expect(result.endsWith(' ')).toBe(false)
	})

	it('formate un NIR commençant par 2 (femme)', () => {
		expect(formatNir('298012345678912')).toBe('2 98 01 23 456 789 12')
	})

	it('ne modifie pas un NIR d\'un seul caractère', () => {
		expect(formatNir('1')).toBe('1')
	})
})
