import { describe, it, expect } from 'vitest'
import { useError } from '../useError'

describe('useError', () => {
	it('retourne un objet avec la méthode propError', () => {
		const { propError } = useError()
		expect(typeof propError).toBe('function')
	})

	it('propError lève une Error avec le message fourni', () => {
		const { propError } = useError()
		expect(() => propError('message d\'erreur')).toThrow('message d\'erreur')
	})

	it('propError lève une instance de Error', () => {
		const { propError } = useError()
		expect(() => propError('test')).toThrowError(Error)
	})

	it('propError lève une erreur avec un message vide si chaîne vide', () => {
		const { propError } = useError()
		expect(() => propError('')).toThrow('')
	})

	it('chaque appel à useError retourne une nouvelle instance indépendante', () => {
		const a = useError()
		const b = useError()
		expect(a.propError).not.toBe(b.propError)
	})
})
