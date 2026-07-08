import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useFieldValidation, EMAIL_REGEXP } from '../useFieldValidation'

describe('useFieldValidation', () => {
	const { generateRules, parseDate } = useFieldValidation()

	// Mock Date pour les tests liés à la date
	let originalDate: typeof Date

	beforeEach(() => {
		// Sauvegarder la Date originale
		originalDate = global.Date
		// Mock de la date actuelle à 2023-01-15
		// Pas besoin de stocker mockDate car nous utilisons directement la classe
		global.Date = class extends Date {
			constructor(...args: unknown[]) {
				if (args.length === 0) {
					super(2023, 0, 15)
				}
				else {
					super(...args as [number, number, number])
				}
			}

			static now() {
				return new Date(2023, 0, 15).getTime()
			}
		} as typeof Date
	})

	afterEach(() => {
		// Restaurer la Date originale
		global.Date = originalDate
	})

	it('should validate required rule', async () => {
		const rules = generateRules([{ type: 'required', options: { message: 'This field is required.' } }])
		const rule = rules[0]!

		expect(await rule('')).toEqual({ error: 'This field is required.' })
		expect(await rule('value')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule(new Date())).toEqual({ success: 'Le champ est valide.' })
		expect(await rule({ key: 'value' })).toEqual({ success: 'Le champ est valide.' })
		expect(await rule(null)).toEqual({ error: 'This field is required.' })
	})

	it('should invalidate required rule for an empty array (multiple mode)', async () => {
		const rules = generateRules([{ type: 'required', options: { message: 'This field is required.' } }])
		const rule = rules[0]!

		// Tableau vide = aucune sélection → invalide
		expect(await rule([])).toEqual({ error: 'This field is required.' })
		// Tableau avec au moins une sélection → valide
		expect(await rule(['a'])).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate required rule with warning mode', async () => {
		const rules = generateRules([{ type: 'required', options: { isWarning: true, warningMessage: 'Warning: field required.' } }])
		const rule = rules[0]!

		expect(await rule('')).toEqual({ warning: 'Warning: field required.' })
		expect(await rule('value')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should use fieldIdentifier in error messages', async () => {
		const rules = generateRules([{
			type: 'required',
			options: { fieldIdentifier: 'l\'email du destinataire' },
		}])
		const rule = rules[0]!

		expect(await rule('')).toEqual({ error: 'Vous devez renseigner l\'email du destinataire.' })
	})

	it('should use default error message when no message provided', async () => {
		const rules = generateRules([{ type: 'required', options: { fieldName: 'Nom' } }])
		const rule = rules[0]!

		expect(await rule('')).toEqual({ error: 'Vous devez renseigner Nom.' })
	})

	it('should use default warning message when no warningMessage provided', async () => {
		const rules = generateRules([{ type: 'min', options: { value: 5, isWarning: true } }])
		const rule = rules[0]!

		expect(await rule(3)).toHaveProperty('warning')
	})

	it('should validate min rule', async () => {
		const rules = generateRules([{ type: 'min', options: { value: 5, message: 'Value must be at least 5.' } }])
		const rule = rules[0]!

		expect(await rule(3)).toEqual({ error: 'Value must be at least 5.' })
		expect(await rule(5)).toEqual({ success: 'Le champ est valide.' })
		expect(await rule(10)).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate max rule', async () => {
		const rules = generateRules([{ type: 'max', options: { value: 10, message: 'Value must be at most 10.' } }])
		const rule = rules[0]!

		expect(await rule(15)).toEqual({ error: 'Value must be at most 10.' })
		expect(await rule(10)).toEqual({ success: 'Le champ est valide.' })
		expect(await rule(5)).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate min and max rules with warning mode', async () => {
		const minRule = generateRules([{ type: 'min', options: { value: 5, isWarning: true } }])[0]!
		const maxRule = generateRules([{ type: 'max', options: { value: 10, isWarning: true } }])[0]!

		expect(await minRule(3)).toHaveProperty('warning')
		expect(await maxRule(15)).toHaveProperty('warning')
	})

	it('should handle non-number values for min and max rules', async () => {
		const minRule = generateRules([{ type: 'min', options: { value: 5, message: 'Min error.' } }])[0]!
		const maxRule = generateRules([{ type: 'max', options: { value: 10, message: 'Max error.' } }])[0]!

		// Test avec des strings (typeof value !== 'number' est true, donc la condition échoue)
		expect(await minRule('not-a-number')).toEqual({ error: 'Min error.' })
		expect(await maxRule('not-a-number')).toEqual({ error: 'Max error.' })
		// Test avec des objets
		expect(await minRule({})).toEqual({ error: 'Min error.' })
		expect(await maxRule({})).toEqual({ error: 'Max error.' })
	})

	it('should validate minLength rule', async () => {
		const rules = generateRules([{ type: 'minLength', options: { length: 5, message: 'Minimum length is 5.' } }])
		const rule = rules[0]!

		expect(await rule('1234')).toEqual({ error: 'Minimum length is 5.' })
		expect(await rule('12345')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('123456')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate minLength and maxLength with warning mode', async () => {
		const minLenRule = generateRules([{ type: 'minLength', options: { length: 5, isWarning: true } }])[0]!
		const maxLenRule = generateRules([{ type: 'maxLength', options: { length: 5, isWarning: true } }])[0]!

		expect(await minLenRule('1234')).toHaveProperty('warning')
		expect(await maxLenRule('123456')).toHaveProperty('warning')
	})

	it('should handle non-string values for string-based rules', async () => {
		const minLenRule = generateRules([{ type: 'minLength', options: { length: 5, message: 'MinLength error.' } }])[0]!
		const maxLenRule = generateRules([{ type: 'maxLength', options: { length: 5, message: 'MaxLength error.' } }])[0]!
		const exactLenRule = generateRules([{ type: 'exactLength', options: { length: 5, message: 'ExactLength error.' } }])[0]!
		const emailRule = generateRules([{ type: 'email', options: { message: 'Email error.' } }])[0]!
		const patternRule = generateRules([{ type: 'matchPattern', options: { pattern: /^[a-z]+$/, message: 'Pattern error.' } }])[0]!

		// Test avec des nombres (typeof value !== 'string' est true)
		expect(await minLenRule(12345)).toEqual({ error: 'MinLength error.' })
		expect(await maxLenRule(12345)).toEqual({ error: 'MaxLength error.' })
		expect(await exactLenRule(12345)).toEqual({ error: 'ExactLength error.' })
		expect(await emailRule(12345)).toEqual({ error: 'Email error.' })
		expect(await patternRule(12345)).toEqual({ error: 'Pattern error.' })
		// Test avec des objets
		expect(await minLenRule({})).toEqual({ error: 'MinLength error.' })
		expect(await emailRule({})).toEqual({ error: 'Email error.' })
	})

	it('should validate minLength rule with ignoreSpace option', async () => {
		const rules = generateRules([{
			type: 'minLength',
			options: {
				length: 5,
				message: 'Minimum length is 5.',
				ignoreSpace: true,
			},
		}])
		const rule = rules[0]!

		expect(await rule('1 2 3 4')).toEqual({ error: 'Minimum length is 5.' }) // Length without spaces is 4
		expect(await rule('1 2 3 4 5')).toEqual({ success: 'Le champ est valide.' }) // Length without spaces is 5
	})

	it('should validate maxLength rule', async () => {
		const rules = generateRules([{ type: 'maxLength', options: { length: 5, message: 'Maximum length is 5.' } }])
		const rule = rules[0]!

		expect(await rule('123456')).toEqual({ error: 'Maximum length is 5.' })
		expect(await rule('12345')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('1234')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate maxLength rule with ignoreSpace option', async () => {
		const rules = generateRules([{
			type: 'maxLength',
			options: {
				length: 5,
				message: 'Maximum length is 5.',
				ignoreSpace: true,
			},
		}])
		const rule = rules[0]!

		expect(await rule('1 2 3 4 5 6')).toEqual({ error: 'Maximum length is 5.' }) // Length without spaces is 6
		expect(await rule('1 2 3 4 5')).toEqual({ success: 'Le champ est valide.' }) // Length without spaces is 5
	})

	it('should validate exactLength rule', async () => {
		const rules = generateRules([{ type: 'exactLength', options: { length: 5, message: 'Length must be exactly 5.' } }])
		const rule = rules[0]!

		expect(await rule('1234')).toEqual({ error: 'Length must be exactly 5.' })
		expect(await rule('123456')).toEqual({ error: 'Length must be exactly 5.' })
		expect(await rule('12345')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate exactLength rule with ignoreSpace option', async () => {
		const rules = generateRules([{
			type: 'exactLength',
			options: {
				length: 5,
				message: 'Length must be exactly 5.',
				ignoreSpace: true,
			},
		}])
		const rule = rules[0]!

		expect(await rule('1 2 3 4')).toEqual({ error: 'Length must be exactly 5.' }) // Length without spaces is 4
		expect(await rule('1 2 3 4 5 6')).toEqual({ error: 'Length must be exactly 5.' }) // Length without spaces is 6
		expect(await rule('1 2 3 4 5')).toEqual({ success: 'Le champ est valide.' }) // Length without spaces is 5
	})

	it('should validate exactLength and matchPattern with warning mode', async () => {
		const exactLenRule = generateRules([{ type: 'exactLength', options: { length: 5, isWarning: true } }])[0]!
		const patternRule = generateRules([{ type: 'matchPattern', options: { pattern: /^[a-z]+$/, isWarning: true } }])[0]!

		expect(await exactLenRule('1234')).toHaveProperty('warning')
		expect(await patternRule('ABC')).toHaveProperty('warning')
	})

	it('should validate email rule', async () => {
		// Vérifions d'abord que la regex EMAIL_REGEXP fonctionne comme prévu
		expect(EMAIL_REGEXP.test('invalid-email')).toBe(false)
		// Note: La regex actuelle considère test@example comme valide
		expect(EMAIL_REGEXP.test('test@example')).toBe(true)
		expect(EMAIL_REGEXP.test('test@example.com')).toBe(true)

		const rules = generateRules([{ type: 'email', options: { message: 'Invalid email address.' } }])
		const rule = rules[0]!

		expect(await rule('invalid-email')).toEqual({ error: 'Invalid email address.' })
		expect(await rule('test@example.com')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('test.name@example.co.uk')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate email rule with warning mode', async () => {
		const emailRule = generateRules([{ type: 'email', options: { isWarning: true, warningMessage: 'Invalid email warning.' } }])[0]!

		expect(await emailRule('invalid')).toEqual({ warning: 'Invalid email warning.' })
		expect(await emailRule('test@example.com')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should validate matchPattern rule', async () => {
		const rules = generateRules([{
			type: 'matchPattern',
			options: { pattern: /^[a-z]+$/, message: 'Invalid format.' },
		}])
		const rule = rules[0]!

		expect(await rule('123')).toEqual({ error: 'Invalid format.' })
		expect(await rule('aBc')).toEqual({ error: 'Invalid format.' })
		expect(await rule('abc')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate notWeekend rule', async () => {
		const rules = generateRules([{
			type: 'notWeekend',
			options: { message: 'Date cannot be on a weekend.' },
		}])
		const rule = rules[0]!

		// 15 janvier 2023 est un dimanche (jour 0)
		expect(await rule(new Date(2023, 0, 15))).toEqual({ error: 'Date cannot be on a weekend.' })
		// 14 janvier 2023 est un samedi (jour 6)
		expect(await rule(new Date(2023, 0, 14))).toEqual({ error: 'Date cannot be on a weekend.' })
		// 13 janvier 2023 est un vendredi (jour 5)
		expect(await rule(new Date(2023, 0, 13))).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
		expect(await rule(null)).toEqual({}) // Null should be ignored
		expect(await rule(undefined)).toEqual({}) // Undefined should be ignored
		// Test avec une date invalide (string qui ne parse pas)
		expect(await rule('invalid-date-string')).toEqual({ error: 'Date invalide' })
	})

	it('should validate notBeforeToday rule', async () => {
		const rules = generateRules([{
			type: 'notBeforeToday',
			options: { message: 'Date cannot be before today.' },
		}])
		const rule = rules[0]!

		// 14 janvier 2023 est avant aujourd'hui (15 janvier 2023)
		expect(await rule(new Date(2023, 0, 14))).toEqual({ error: 'Date cannot be before today.' })
		// 15 janvier 2023 est aujourd'hui
		expect(await rule(new Date(2023, 0, 15))).toEqual({ success: 'Le champ est valide.' })
		// 16 janvier 2023 est après aujourd'hui
		expect(await rule(new Date(2023, 0, 16))).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
		expect(await rule(null)).toEqual({}) // Null should be ignored
		expect(await rule(undefined)).toEqual({}) // Undefined should be ignored
		// Test avec une date invalide (string qui ne parse pas)
		expect(await rule('not-a-valid-date')).toEqual({ error: 'Date invalide' })
	})

	it('should validate notAfterToday rule', async () => {
		const rules = generateRules([{
			type: 'notAfterToday',
			options: { message: 'Date cannot be after today.' },
		}])
		const rule = rules[0]!

		// 16 janvier 2023 est après aujourd'hui (15 janvier 2023)
		expect(await rule(new Date(2023, 0, 16))).toEqual({ error: 'Date cannot be after today.' })
		// 15 janvier 2023 est aujourd'hui
		expect(await rule(new Date(2023, 0, 15))).toEqual({ success: 'Le champ est valide.' })
		// 14 janvier 2023 est avant aujourd'hui
		expect(await rule(new Date(2023, 0, 14))).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored
		expect(await rule(null)).toEqual({}) // Null should be ignored
		expect(await rule(undefined)).toEqual({}) // Undefined should be ignored
		// Test avec une date invalide (string qui ne parse pas)
		expect(await rule('bad-date-format')).toEqual({ error: 'Date invalide' })
	})

	it('should validate date rules with warning mode', async () => {
		const notWeekendRule = generateRules([{
			type: 'notWeekend',
			options: { isWarning: true, warningMessage: 'Weekend warning.' },
		}])[0]!
		const notBeforeTodayRule = generateRules([{
			type: 'notBeforeToday',
			options: { isWarning: true, warningMessage: 'Before today warning.' },
		}])[0]!
		const notAfterTodayRule = generateRules([{
			type: 'notAfterToday',
			options: { isWarning: true, warningMessage: 'After today warning.' },
		}])[0]!

		expect(await notWeekendRule(new Date(2023, 0, 15))).toEqual({ warning: 'Weekend warning.' })
		expect(await notBeforeTodayRule(new Date(2023, 0, 14))).toEqual({ warning: 'Before today warning.' })
		expect(await notAfterTodayRule(new Date(2023, 0, 16))).toEqual({ warning: 'After today warning.' })
	})

	it('should test parseDate function directly', () => {
		// Test with valid date string
		expect(parseDate('15/01/2023')).toEqual(new Date(2023, 0, 15))

		// Test with Date object
		const dateObj = new Date(2023, 0, 15)
		expect(parseDate(dateObj)).toEqual(dateObj)

		// Test with different format
		expect(parseDate('2023-01-15', 'YYYY-MM-DD')).toEqual(new Date(2023, 0, 15))

		// Test with YY format
		expect(parseDate('15/01/23', 'DD/MM/YY')).toEqual(new Date(2023, 0, 15))

		// Test with invalid date
		expect(parseDate('invalid-date')).toBeNull()

		// Test with empty string
		expect(parseDate('')).toBeNull()

		// Test with null
		expect(parseDate(null as unknown as string | Date)).toBeNull()

		// Test with mismatched format parts
		expect(parseDate('15/01', 'DD/MM/YYYY')).toBeNull()

		// Test with invalid parts
		expect(parseDate('aa/bb/cccc', 'DD/MM/YYYY')).toBeNull()

		// Test with invalid month (out of range)
		expect(parseDate('15/13/2023', 'DD/MM/YYYY')).toBeNull()

		// Test with invalid day (out of range)
		expect(parseDate('32/01/2023', 'DD/MM/YYYY')).toBeNull()

		// Test with invalid year (out of range)
		expect(parseDate('15/01/1800', 'DD/MM/YYYY')).toBeNull()

		// Test with invalid date (e.g., 31 February)
		expect(parseDate('31/02/2023', 'DD/MM/YYYY')).toBeNull()
	})

	it('should validate notBeforeDate rule', async () => {
		const rules = generateRules([{
			type: 'notBeforeDate',
			options: {
				date: '10/01/2023', // 10 janvier 2023
				message: 'Date cannot be before reference date.',
			},
		}])
		const rule = rules[0]!

		// 9 janvier 2023 est avant la date de référence
		expect(await rule(new Date(2023, 0, 9))).toEqual({ error: 'Date cannot be before reference date.' })
		// 10 janvier 2023 est la date de référence
		expect(await rule(new Date(2023, 0, 10))).toEqual({ success: 'Le champ est valide.' })
		// 11 janvier 2023 est après la date de référence
		expect(await rule(new Date(2023, 0, 11))).toEqual({ success: 'Le champ est valide.' })
		// Test avec une date invalide
		expect(await rule('invalid-date')).toEqual({ error: 'Date invalide' })
		// Test sans option date
		const ruleWithoutDate = generateRules([{
			type: 'notBeforeDate',
			options: { message: 'Date cannot be before reference date.' },
		}])[0]!
		expect(await ruleWithoutDate(new Date())).toEqual({ error: 'Configuration de la règle invalide' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored

		const ruleWithEmptyDate = generateRules([{
			type: 'notBeforeDate',
			options: { date: '', message: 'Date cannot be before reference date.' },
		}])[0]!
		expect(await ruleWithEmptyDate(new Date())).toEqual({})

		const ruleWithUndefinedDate = generateRules([{
			type: 'notBeforeDate',
			options: { date: undefined as unknown as string, message: 'Date cannot be before reference date.' },
		}])[0]!
		expect(await ruleWithUndefinedDate(new Date())).toEqual({})
		// Test avec valeur null/undefined
		expect(await rule(null)).toEqual({}) // Null should be ignored
		expect(await rule(undefined)).toEqual({}) // Undefined should be ignored
		// Test avec une date de référence invalide (string qui ne parse pas)
		const ruleWithInvalidRefDate = generateRules([{
			type: 'notBeforeDate',
			options: { date: 'invalid-date', message: 'Date cannot be before reference date.' },
		}])[0]!
		expect(await ruleWithInvalidRefDate(new Date())).toEqual({ error: 'Date de référence invalide' })
	})

	it('should validate notBeforeDate and notAfterDate with warning mode', async () => {
		const notBeforeDateRule = generateRules([{
			type: 'notBeforeDate',
			options: {
				date: '10/01/2023',
				isWarning: true,
				warningMessage: 'Date before ref warning.',
			},
		}])[0]!
		const notAfterDateRule = generateRules([{
			type: 'notAfterDate',
			options: {
				date: '20/01/2023',
				isWarning: true,
				warningMessage: 'Date after ref warning.',
			},
		}])[0]!

		expect(await notBeforeDateRule(new Date(2023, 0, 9))).toEqual({ warning: 'Date before ref warning.' })
		expect(await notAfterDateRule(new Date(2023, 0, 21))).toEqual({ warning: 'Date after ref warning.' })
	})

	it('should throw when date reference is not a string in notBeforeDate rule', async () => {
		await expect(async () => {
			const invalidRule = generateRules([{
				type: 'notBeforeDate',
				options: {
					date: new Date() as unknown as string, // Date object instead of string
					message: 'Date cannot be before reference date.',
				},
			}])[0]!
			await invalidRule(new Date())
		}).rejects.toThrow('La date de référence doit être une chaîne au format DD/MM/YYYY')
	})

	it('should validate notAfterDate rule', async () => {
		const rules = generateRules([{
			type: 'notAfterDate',
			options: {
				date: '20/01/2023', // 20 janvier 2023
				message: 'Date cannot be after reference date.',
			},
		}])
		const rule = rules[0]!

		// 21 janvier 2023 est après la date de référence
		expect(await rule(new Date(2023, 0, 21))).toEqual({ error: 'Date cannot be after reference date.' })
		// 20 janvier 2023 est la date de référence
		expect(await rule(new Date(2023, 0, 20))).toEqual({ success: 'Le champ est valide.' })
		// 19 janvier 2023 est avant la date de référence
		expect(await rule(new Date(2023, 0, 19))).toEqual({ success: 'Le champ est valide.' })
		// Test avec une date invalide
		expect(await rule('invalid-date')).toEqual({ error: 'Date invalide' })
		// Test sans option date
		const ruleWithoutDate = generateRules([{
			type: 'notAfterDate',
			options: { message: 'Date cannot be after reference date.' },
		}])[0]!
		expect(await ruleWithoutDate(new Date())).toEqual({ error: 'Configuration de la règle invalide' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored

		const ruleWithEmptyDate = generateRules([{
			type: 'notAfterDate',
			options: { date: '', message: 'Date cannot be after reference date.' },
		}])[0]!
		expect(await ruleWithEmptyDate(new Date())).toEqual({})

		const ruleWithUndefinedDate = generateRules([{
			type: 'notAfterDate',
			options: { date: undefined as unknown as string, message: 'Date cannot be after reference date.' },
		}])[0]!
		expect(await ruleWithUndefinedDate(new Date())).toEqual({})
		// Test avec valeur null/undefined
		expect(await rule(null)).toEqual({}) // Null should be ignored
		expect(await rule(undefined)).toEqual({}) // Undefined should be ignored
		// Test avec une date de référence invalide (string qui ne parse pas)
		const ruleWithInvalidRefDate = generateRules([{
			type: 'notAfterDate',
			options: { date: 'invalid-date', message: 'Date cannot be after reference date.' },
		}])[0]!
		expect(await ruleWithInvalidRefDate(new Date())).toEqual({ error: 'Date de référence invalide' })
	})

	it('should throw when date reference is not a string in notAfterDate rule', async () => {
		await expect(async () => {
			const invalidRule = generateRules([{
				type: 'notAfterDate',
				options: {
					date: new Date() as unknown as string, // Date object instead of string
					message: 'Date cannot be after reference date.',
				},
			}])[0]!
			await invalidRule(new Date())
		}).rejects.toThrow('La date de référence doit être une chaîne au format DD/MM/YYYY')
	})

	it('should validate dateExact rule', async () => {
		const rules = generateRules([{
			type: 'dateExact',
			options: {
				date: '15/01/2023', // 15 janvier 2023
				message: 'Date must be exactly the reference date.',
			},
		}])
		const rule = rules[0]!

		// 14 janvier 2023 n'est pas la date exacte
		expect(await rule(new Date(2023, 0, 14))).toEqual({ error: 'Date must be exactly the reference date.' })
		// 15 janvier 2023 est la date exacte
		expect(await rule(new Date(2023, 0, 15))).toEqual({ success: 'Le champ est valide.' })
		// 16 janvier 2023 n'est pas la date exacte
		expect(await rule(new Date(2023, 0, 16))).toEqual({ error: 'Date must be exactly the reference date.' })
		// Test avec une date invalide
		expect(await rule('invalid-date')).toEqual({ error: 'Date invalide' })
		// Test sans option date
		const ruleWithoutDate = generateRules([{
			type: 'dateExact',
			options: { message: 'Date must be exactly the reference date.' },
		}])[0]!
		expect(await ruleWithoutDate(new Date())).toEqual({ error: 'Configuration de la règle invalide' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored

		const ruleWithEmptyDate = generateRules([{
			type: 'dateExact',
			options: { date: '', message: 'Date must be exactly the reference date.' },
		}])[0]!
		expect(await ruleWithEmptyDate(new Date())).toEqual({})

		const ruleWithUndefinedDate = generateRules([{
			type: 'dateExact',
			options: { date: undefined as unknown as string, message: 'Date must be exactly the reference date.' },
		}])[0]!
		expect(await ruleWithUndefinedDate(new Date())).toEqual({})
		// Test avec valeur null/undefined
		expect(await rule(null)).toEqual({}) // Null should be ignored
		expect(await rule(undefined)).toEqual({}) // Undefined should be ignored
		// Test avec une date de référence invalide (string qui ne parse pas)
		const ruleWithInvalidRefDate = generateRules([{
			type: 'dateExact',
			options: { date: 'invalid-date', message: 'Date must be exactly the reference date.' },
		}])[0]!
		expect(await ruleWithInvalidRefDate(new Date())).toEqual({ error: 'Date de référence invalide' })
	})

	it('should validate dateExact with warning mode', async () => {
		const dateExactRule = generateRules([{
			type: 'dateExact',
			options: {
				date: '15/01/2023',
				isWarning: true,
				warningMessage: 'Not exact date warning.',
			},
		}])[0]!

		expect(await dateExactRule(new Date(2023, 0, 14))).toEqual({ warning: 'Not exact date warning.' })
		expect(await dateExactRule(new Date(2023, 0, 15))).toEqual({ success: 'Le champ est valide.' })
	})

	it('should throw when date reference is not a string in dateExact rule', async () => {
		await expect(async () => {
			const invalidRule = generateRules([{
				type: 'dateExact',
				options: {
					date: new Date() as unknown as string, // Date object instead of string
					message: 'Date must be exactly the reference date.',
				},
			}])[0]!
			await invalidRule(new Date())
		}).rejects.toThrow('La date de référence doit être une chaîne au format DD/MM/YYYY')
	})

	it('should validate custom rule', async () => {
		const rules = generateRules([{
			type: 'custom',
			options: { validate: (value: unknown) => value === 'valid', message: 'Custom validation failed.' },
		}])
		const rule = rules[0]!

		expect(await rule('invalid')).toEqual({ error: 'Custom validation failed.' })
		expect(await rule('valid')).toEqual({ success: 'Le champ est valide.' })
		expect(await rule('')).toEqual({}) // Empty string should be ignored

		// Test avec un message personnalisé
		const customMessageRule = generateRules([{
			type: 'custom',
			options: { validate: (value: unknown) => value === 'valid' ? true : 'Custom error message' },
		}])[0]!
		expect(await customMessageRule('invalid')).toEqual({ error: 'Custom error message' })
	})

	it('should validate custom rule with async function', async () => {
		// Test avec une fonction async (Promise)
		const asyncRule = generateRules([{
			type: 'custom',
			options: {
				validate: async (value: unknown) => {
					await new Promise(resolve => setTimeout(resolve, 10))
					return value === 'async-valid'
				},
				message: 'Async validation failed.',
			},
		}])[0]!

		expect(await asyncRule('invalid')).toEqual({ error: 'Async validation failed.' })
		expect(await asyncRule('async-valid')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should handle custom rule async function returning string message', async () => {
		const asyncStringRule = generateRules([{
			type: 'custom',
			options: {
				validate: async (value: unknown) => {
					await new Promise(resolve => setTimeout(resolve, 10))
					return value === 'valid' ? true : 'Custom async error'
				},
			},
		}])[0]!

		expect(await asyncStringRule('invalid')).toEqual({ error: 'Custom async error' })
		expect(await asyncStringRule('valid')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should handle custom rule async function throwing error', async () => {
		const asyncErrorRule = generateRules([{
			type: 'custom',
			options: {
				validate: async () => {
					throw new Error('Async error message')
				},
				// Pas de message défini pour que l'erreur soit capturée
			},
		}])[0]!

		expect(await asyncErrorRule('any')).toEqual({ error: 'Async error message' })
	})

	it('should handle custom rule with warning and async function', async () => {
		const asyncWarningRule = generateRules([{
			type: 'custom',
			options: {
				validate: async (value: unknown) => {
					await new Promise(resolve => setTimeout(resolve, 10))
					return value === 'warning' ? 'Warning message' : true
				},
				isWarning: true,
			},
		}])[0]!

		expect(await asyncWarningRule('warning')).toEqual({ warning: 'Warning message' })
		expect(await asyncWarningRule('valid')).toEqual({ success: 'Le champ est valide.' })
	})

	it('should handle custom rule without validate function in error mode', async () => {
		// Test sans validate et isWarning=false (branche error par défaut)
		const noValidateErrorRule = generateRules([{
			type: 'custom',
			options: { message: 'No validate function provided.' },
		}])[0]!

		expect(await noValidateErrorRule('any')).toEqual({ error: 'No validate function provided.' })
	})

	it('should handle custom rule without validate function with default error message', async () => {
		// Test sans validate ni message (branche baseMessages.error)
		const noValidateDefaultRule = generateRules([{
			type: 'custom',
			options: { fieldName: 'TestField' },
		}])[0]!

		expect(await noValidateDefaultRule('any')).toHaveProperty('error')
	})

	it('should handle custom rule without validate function in warning mode', async () => {
		const noValidateWarningRule = generateRules([{
			type: 'custom',
			options: {
				warningMessage: 'Warning: no validation.',
				isWarning: true,
			},
		}])[0]!

		expect(await noValidateWarningRule('any')).toEqual({ warning: 'Warning: no validation.' })
	})

	it('should handle custom rule returning false with warning', async () => {
		const falseWarningRule = generateRules([{
			type: 'custom',
			options: {
				validate: () => false,
				isWarning: true,
				warningMessage: 'Custom warning for false.',
			},
		}])[0]!

		expect(await falseWarningRule('any')).toEqual({ warning: 'Custom warning for false.' })
	})

	it('should handle custom rule returning false with default warning', async () => {
		// Test res === false avec isWarning=true mais sans warningMessage (branche baseMessages.warning)
		const falseDefaultWarningRule = generateRules([{
			type: 'custom',
			options: {
				validate: () => false,
				isWarning: true,
				fieldName: 'TestField',
			},
		}])[0]!

		expect(await falseDefaultWarningRule('any')).toHaveProperty('warning')
	})

	it('should handle custom rule async error with warningMessage', async () => {
		const asyncErrorWarningRule = generateRules([{
			type: 'custom',
			options: {
				validate: async () => { throw new Error('Thrown error') },
				isWarning: true,
				warningMessage: 'Caught async warning.',
			},
		}])[0]!

		expect(await asyncErrorWarningRule('any')).toEqual({ warning: 'Caught async warning.' })
	})

	it('should handle async error that is not an Error instance', async () => {
		// Test où err n'est pas une instance de Error (branche String(err))
		const asyncNonErrorRule = generateRules([{
			type: 'custom',
			options: {
				validate: async () => { throw 'String error message' },
			},
		}])[0]!

		expect(await asyncNonErrorRule('any')).toEqual({ error: 'String error message' })
	})

	it('should handle custom rule returning string with warning', async () => {
		// Test typeof res === 'string' avec isWarning=true
		const stringWarningRule = generateRules([{
			type: 'custom',
			options: {
				validate: () => 'Custom warning string',
				isWarning: true,
			},
		}])[0]!

		expect(await stringWarningRule('any')).toEqual({ warning: 'Custom warning string' })
	})

	it('should handle warning mode instead of error', async () => {
		const rules = generateRules([{
			type: 'required',
			options: {
				message: 'This field is required.',
				isWarning: true,
			},
		}])
		const rule = rules[0]!

		expect(await rule('')).toEqual({ warning: 'This field is required.' })

		// Test avec un message d'avertissement personnalisé
		const warningMessageRule = generateRules([{
			type: 'required',
			options: {
				warningMessage: 'Warning: this field should be filled.',
				isWarning: true,
			},
		}])[0]!
		expect(await warningMessageRule('')).toEqual({ warning: 'Warning: this field should be filled.' })
	})

	it('should handle custom field identifiers', async () => {
		const rules = generateRules([{
			type: 'required',
			options: {
				fieldName: 'Email',
			},
		}])
		const rule = rules[0]!

		expect(await rule('')).toEqual({ error: 'Vous devez renseigner Email.' })

		const fieldIdentifierRule = generateRules([{
			type: 'required',
			options: {
				fieldIdentifier: 'l\'adresse email',
			},
		}])[0]!
		expect(await fieldIdentifierRule('')).toEqual({ error: 'Vous devez renseigner l\'adresse email.' })
	})

	it('should handle success messages', async () => {
		const rules = generateRules([{
			type: 'required',
			options: {
				successMessage: 'Field is valid!',
			},
		}])
		const rule = rules[0]!

		expect(await rule('value')).toEqual({ success: 'Field is valid!' })
	})

	it('should handle invalid rule types', async () => {
		const rules = generateRules([{
			type: 'invalidRuleType',
			options: { message: 'This should show an error.' },
		}])
		const rule = rules[0]!

		expect(await rule('any value')).toEqual({ error: 'La règle spécifiée pour ce champ n\'existe pas.' })
	})

	it('should validate isHolidayDay rule', async () => {
		const rules = generateRules([{
			type: 'isHolidayDay',
			options: { message: 'Date cannot be a holiday.' },
		}])
		const rule = rules[0]!

		// Test avec une date valide (pas un jour férié)
		expect(await rule(new Date(2023, 0, 13))).toEqual({ success: 'Le champ est valide.' })
		// Test avec null/undefined/empty
		expect(await rule(null)).toEqual({}) // Null should be ignored
		expect(await rule(undefined)).toEqual({}) // Undefined should be ignored
		expect(await rule('')).toEqual({}) // Empty string should be ignored
		// Test avec une date invalide
		expect(await rule('invalid-date')).toEqual({ error: 'Date invalide' })
	})

	it('should validate isHolidayDay with warning mode', async () => {
		const holidayRule = generateRules([{
			type: 'isHolidayDay',
			options: { isWarning: true, warningMessage: 'Holiday warning.' },
		}])[0]!

		// Le 1er janvier 2023 est un jour férié
		expect(await holidayRule(new Date(2023, 0, 1))).toEqual({ warning: 'Holiday warning.' })
		expect(await holidayRule(new Date(2023, 0, 13))).toEqual({ success: 'Le champ est valide.' })
	})
})
