import { describe, it, expect } from 'vitest'
import { checkNIR } from '../nirValidation'

describe('checkNIR', () => {
	// Corps de NIR valide au format : AA(année) MM(mois) DD(dépt) CCC(commune) RRR(rang)
	const body = '840275123456'

	describe('type complexe — code sexe', () => {
		it.each(['1', '2', '3', '4', '5', '6', '7', '8'])(
			'accepte le code sexe %s',
			(code) => {
				expect(checkNIR(`${code}${body}`, 'complexe')).toBe(true)
			},
		)

		// Régression issue #2283 : matricules MIG « migrants de passage » (5 = masculin, 6 = féminin)
		it('accepte spécifiquement les codes 5 et 6 (matricules MIG)', () => {
			expect(checkNIR(`5${body}`, 'complexe')).toBe(true)
			expect(checkNIR(`6${body}`, 'complexe')).toBe(true)
		})

		it('rejette les codes sexe hors plage (0 et 9)', () => {
			expect(checkNIR(`0${body}`, 'complexe')).toBe(false)
			expect(checkNIR(`9${body}`, 'complexe')).toBe(false)
		})
	})

	describe('type simple — reste restreint aux codes 1 et 2', () => {
		it('accepte 1 et 2', () => {
			expect(checkNIR(`1${body}`, 'simple')).toBe(true)
			expect(checkNIR(`2${body}`, 'simple')).toBe(true)
		})

		it('rejette les codes 3 à 8 (dont 5 et 6)', () => {
			for (const code of ['3', '4', '5', '6', '7', '8']) {
				expect(checkNIR(`${code}${body}`, 'simple')).toBe(false)
			}
		})
	})
})
