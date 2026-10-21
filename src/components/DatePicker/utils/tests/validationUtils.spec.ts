import { describe, it, expect } from 'vitest'
import { adaptCustomRules } from '../validationUtils'
import type { DatePickerRule } from '../../types'

describe('adaptCustomRules', () => {
	it('devrait convertir les Date en chaînes formatées pour les règles custom', () => {
		const receivedValue: unknown[] = []
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						receivedValue.push(value)
						return true
					},
				},
			},
		]

		const adapted = adaptCustomRules(rules, 'DD/MM/YYYY')
		const validateFn = adapted[0].options!.validate!
		validateFn(new Date('2023-06-15'))

		expect(receivedValue[0]).toBe('15/06/2023')
		expect(receivedValue[0]).toBeTypeOf('string')
	})

	it('devrait passer les valeurs non-Date inchangées', () => {
		const receivedValue: unknown[] = []
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						receivedValue.push(value)
						return true
					},
				},
			},
		]

		const adapted = adaptCustomRules(rules, 'DD/MM/YYYY')
		const validateFn = adapted[0].options!.validate!
		validateFn('01/01/2023')
		validateFn(null)

		expect(receivedValue[0]).toBe('01/01/2023')
		expect(receivedValue[1]).toBe(null)
	})

	it('devrait utiliser toISOString quand aucun format n\'est fourni', () => {
		const receivedValue: unknown[] = []
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						receivedValue.push(value)
						return true
					},
				},
			},
		]

		const adapted = adaptCustomRules(rules, '')
		const validateFn = adapted[0].options!.validate!
		const date = new Date('2023-06-15T10:30:00.000Z')
		validateFn(date)

		expect(receivedValue[0]).toBe(date.toISOString())
	})

	it('ne devrait pas modifier les règles non-custom', () => {
		const rules: DatePickerRule[] = [
			{
				type: 'required',
				options: {},
			},
		]

		const adapted = adaptCustomRules(rules, 'DD/MM/YYYY')
		expect(adapted[0]).toBe(rules[0])
	})

	it('ne devrait pas modifier la règle originale', () => {
		const originalValidate = (value: unknown) => typeof value === 'string'
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: { validate: originalValidate },
			},
		]

		const adapted = adaptCustomRules(rules, 'DD/MM/YYYY')
		expect(adapted[0].options!.validate).not.toBe(originalValidate)
		expect(rules[0].options!.validate).toBe(originalValidate)
	})

	it('devrait fonctionner même si la fonction validate ne contient pas ".includes" dans son code source (simule la minification)', () => {
		// Règle qui attend une string (utilise .includes) mais dont toString()
		// ne contient pas ".includes" (simule la minification production)
		const minifiedValidate = (value: unknown) => {
			if (typeof value !== 'string') return 'Erreur: chaîne attendue'
			return value.includes('2024') ? 'Année 2024 interdite' : true
		}

		// Simule la minification: remplace toString pour ne pas contenir ".includes"
		Object.defineProperty(minifiedValidate, 'toString', {
			value: () => 'function(v){if(typeof v!=="s")return"E";return v.a("2024")?"X":true}',
		})

		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: { validate: minifiedValidate },
			},
		]

		const adapted = adaptCustomRules(rules, 'DD/MM/YYYY')
		const validateFn = adapted[0].options!.validate!

		// Avant le fix, la Date était passée telle quelle à cause de l'heuristique toString()
		// qui ne trouvait pas ".includes" → la règle recevait un objet Date → erreur
		const result = validateFn(new Date('2024-06-15'))
		expect(result).toBe('Année 2024 interdite')
	})
})
