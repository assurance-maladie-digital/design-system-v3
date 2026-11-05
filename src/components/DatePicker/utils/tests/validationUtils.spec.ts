import { describe, it, expect, vi, afterEach } from 'vitest'
import { adaptCustomRules, adaptCustomRulesWithStringFallback } from '../validationUtils'
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

describe('adaptCustomRulesWithStringFallback', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('rappelle la règle avec la chaîne formatée quand elle lève une exception sur un Date', () => {
		const receivedValue: unknown[] = []
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						receivedValue.push(value)
						// Règle écrite pour une chaîne : lève une TypeError sur un Date
						return !(value as string).includes('2025')
					},
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!
		const result = validateFn(new Date('2026-03-15T12:00:00'))

		expect(receivedValue).toHaveLength(2)
		expect(receivedValue[0]).toBeInstanceOf(Date)
		expect(receivedValue[1]).toBe('15/03/2026')
		expect(result).toBe(true)
	})

	it('émet un avertissement dev une seule fois par règle, même après ré-enveloppement', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => !(value as string).includes('2025'),
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!
		validateFn(new Date('2026-03-15T12:00:00'))
		validateFn(new Date('2026-03-16T12:00:00'))

		// Les règles sont ré-enveloppées à chaque validation (validateField) :
		// l'avertissement ne doit pas être réémis.
		const reWrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		reWrapped[0].options!.validate!(new Date('2026-03-17T12:00:00'))

		expect(warnSpy).toHaveBeenCalledTimes(1)
		expect(warnSpy.mock.calls[0][0]).toContain('[DatePicker]')
	})

	it('laisse passer le Date tel quel pour une règle écrite pour un Date (aucun repli)', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const receivedValue: unknown[] = []
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						receivedValue.push(value)
						return value instanceof Date && value.getFullYear() !== 2025
					},
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!
		const date = new Date('2026-03-15T12:00:00')
		const result = validateFn(date)

		expect(receivedValue).toHaveLength(1)
		expect(receivedValue[0]).toBe(date)
		expect(result).toBe(true)
		expect(warnSpy).not.toHaveBeenCalled()
	})

	it('n\'affecte pas une règle qui gère les deux types via instanceof', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) =>
						!(value instanceof Date)
						|| value.getFullYear() !== 2025,
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!

		// Date 2026 : valide sur les deux types → pas d'avertissement
		expect(validateFn(new Date('2026-03-15T12:00:00'))).toBe(true)
		expect(warnSpy).not.toHaveBeenCalled()

		// Date 2025 : invalide sur Date mais valide sur chaîne → la sonde avertit
		// mais le résultat d'origine est préservé (pas de substitution)
		expect(validateFn(new Date('2025-03-15T12:00:00'))).toBe(false)
		expect(warnSpy).toHaveBeenCalledTimes(1)
		expect(warnSpy.mock.calls[0][0]).toContain('résultat n\'est pas modifié')
	})

	it('rappelle la règle avec la chaîne quand la promesse est rejetée sur un Date', async () => {
		const receivedValue: unknown[] = []
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						receivedValue.push(value)
						if (value instanceof Date) {
							return Promise.reject(new Error('TypeError simulée'))
						}
						return Promise.resolve(true)
					},
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!
		const result = await validateFn(new Date('2026-03-15T12:00:00'))

		expect(receivedValue).toHaveLength(2)
		expect(receivedValue[1]).toBe('15/03/2026')
		expect(result).toBe(true)
	})

	it('sonde dev : avertit sans modifier le résultat quand la règle échoue silencieusement sur un Date', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					// Règle écrite pour une chaîne qui échoue SILENCIEUSEMENT sur un
					// Date (comparaison stricte, pas d'exception)
					validate: (value: unknown) => value === '15/03/2026',
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!
		const result = validateFn(new Date('2026-03-15T12:00:00'))

		// Le résultat d'origine est préservé : la sonde ne substitue jamais
		expect(result).toBe(false)
		expect(warnSpy).toHaveBeenCalledTimes(1)
		expect(warnSpy.mock.calls[0][0]).toContain('attend probablement une chaîne')
	})

	it('sonde dev : pas d\'avertissement quand la règle échoue sur les deux types', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => value === '01/01/2030',
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!

		expect(validateFn(new Date('2026-03-15T12:00:00'))).toBe(false)
		expect(warnSpy).not.toHaveBeenCalled()
	})

	it('sonde dev : détecte aussi la divergence quand la règle est asynchrone', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) =>
						Promise.resolve(value === '15/03/2026'),
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!
		const result = await validateFn(new Date('2026-03-15T12:00:00'))

		expect(result).toBe(false)
		// La sonde async est fire-and-forget : laisser les microtâches s'exécuter
		await new Promise(resolve => setTimeout(resolve, 0))
		expect(warnSpy).toHaveBeenCalledTimes(1)
		expect(warnSpy.mock.calls[0][0]).toContain('attend probablement une chaîne')
	})

	it('utilise toISOString quand aucun format n\'est fourni', () => {
		const receivedValue: unknown[] = []
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						receivedValue.push(value)
						return !(value as string).includes('2025')
					},
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, '')
		const validateFn = wrapped[0].options!.validate!
		const date = new Date('2026-03-15T10:30:00.000Z')
		validateFn(date)

		expect(receivedValue[1]).toBe(date.toISOString())
	})

	it('ne modifie pas les règles non-custom', () => {
		const rules: DatePickerRule[] = [
			{ type: 'required', options: {} },
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		expect(wrapped[0]).toBe(rules[0])
	})

	it('ne modifie pas la règle originale', () => {
		const originalValidate = (value: unknown) => Boolean(value)
		const rules: DatePickerRule[] = [
			{ type: 'custom', options: { validate: originalValidate } },
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		expect(wrapped[0].options!.validate).not.toBe(originalValidate)
		expect(rules[0].options!.validate).toBe(originalValidate)
	})

	it('propage l\'exception sans repli quand la valeur n\'est pas un Date', () => {
		const rules: DatePickerRule[] = [
			{
				type: 'custom',
				options: {
					validate: () => {
						throw new Error('toujours en échec')
					},
				},
			},
		]

		const wrapped = adaptCustomRulesWithStringFallback(rules, 'DD/MM/YYYY')
		const validateFn = wrapped[0].options!.validate!
		expect(() => validateFn('15/03/2026')).toThrow('toujours en échec')
	})
})
