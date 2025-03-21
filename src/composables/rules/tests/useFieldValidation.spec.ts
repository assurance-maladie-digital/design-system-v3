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

	it('should validate required rule', () => {
		const rules = generateRules([{ type: 'required', options: { message: 'This field is required.' } }])
		const rule = rules[0]

		expect(rule('')).toEqual({ error: 'This field is required.' })
		expect(rule('value')).toEqual({ success: 'Le champ est valide.' })
		expect(rule(new Date())).toEqual({ success: 'Le champ est valide.' })
		expect(rule({ key: 'value' })).toEqual({ success: 'Le champ est valide.' })
		expect(rule(null)).toEqual({ error: 'This field is required.' })
	})

	it('should validate min rule', () => {
		const rules = generateRules([{ type: 'min', options: { value: 5, message: 'Value must be at least 5.' } }])
		const rule = rules[0]

		expect(rule(3)).toEqual({ error: 'Value must be at least 5.' })
		expect(rule(5)).toEqual({ success: 'Le champ est valide.' })
		expect(rule(10)).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate max rule', () => {
		const rules = generateRules([{ type: 'max', options: { value: 10, message: 'Value must be at most 10.' } }])
		const rule = rules[0]

		expect(rule(15)).toEqual({ error: 'Value must be at most 10.' })
		expect(rule(10)).toEqual({ success: 'Le champ est valide.' })
		expect(rule(5)).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate minLength rule', () => {
		const rules = generateRules([{ type: 'minLength', options: { length: 5, message: 'Minimum length is 5.' } }])
		const rule = rules[0]

		expect(rule('1234')).toEqual({ error: 'Minimum length is 5.' })
		expect(rule('12345')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('123456')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate minLength rule with ignoreSpace option', () => {
		const rules = generateRules([{
			type: 'minLength',
			options: {
				length: 5,
				message: 'Minimum length is 5.',
				ignoreSpace: true,
			},
		}])
		const rule = rules[0]

		expect(rule('1 2 3 4')).toEqual({ error: 'Minimum length is 5.' }) // Length without spaces is 4
		expect(rule('1 2 3 4 5')).toEqual({ success: 'Le champ est valide.' }) // Length without spaces is 5
	})

	it('should validate maxLength rule', () => {
		const rules = generateRules([{ type: 'maxLength', options: { length: 5, message: 'Maximum length is 5.' } }])
		const rule = rules[0]

		expect(rule('123456')).toEqual({ error: 'Maximum length is 5.' })
		expect(rule('12345')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('1234')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate maxLength rule with ignoreSpace option', () => {
		const rules = generateRules([{
			type: 'maxLength',
			options: {
				length: 5,
				message: 'Maximum length is 5.',
				ignoreSpace: true,
			},
		}])
		const rule = rules[0]

		expect(rule('1 2 3 4 5 6')).toEqual({ error: 'Maximum length is 5.' }) // Length without spaces is 6
		expect(rule('1 2 3 4 5')).toEqual({ success: 'Le champ est valide.' }) // Length without spaces is 5
	})

	it('should validate exactLength rule', () => {
		const rules = generateRules([{ type: 'exactLength', options: { length: 5, message: 'Length must be exactly 5.' } }])
		const rule = rules[0]

		expect(rule('1234')).toEqual({ error: 'Length must be exactly 5.' })
		expect(rule('123456')).toEqual({ error: 'Length must be exactly 5.' })
		expect(rule('12345')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate exactLength rule with ignoreSpace option', () => {
		const rules = generateRules([{
			type: 'exactLength',
			options: {
				length: 5,
				message: 'Length must be exactly 5.',
				ignoreSpace: true,
			},
		}])
		const rule = rules[0]

		expect(rule('1 2 3 4')).toEqual({ error: 'Length must be exactly 5.' }) // Length without spaces is 4
		expect(rule('1 2 3 4 5 6')).toEqual({ error: 'Length must be exactly 5.' }) // Length without spaces is 6
		expect(rule('1 2 3 4 5')).toEqual({ success: 'Le champ est valide.' }) // Length without spaces is 5
	})

	it('should validate email rule', () => {
		// Vérifions d'abord que la regex EMAIL_REGEXP fonctionne comme prévu
		expect(EMAIL_REGEXP.test('invalid-email')).toBe(false)
		// Note: La regex actuelle considère test@example comme valide
		expect(EMAIL_REGEXP.test('test@example')).toBe(true)
		expect(EMAIL_REGEXP.test('test@example.com')).toBe(true)

		const rules = generateRules([{ type: 'email', options: { message: 'Invalid email address.' } }])
		const rule = rules[0]

		expect(rule('invalid-email')).toEqual({ error: 'Invalid email address.' })
		expect(rule('test@example.com')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('test.name@example.co.uk')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate matchPattern rule', () => {
		const rules = generateRules([{
			type: 'matchPattern',
			options: { pattern: /^[a-z]+$/, message: 'Invalid format.' },
		}])
		const rule = rules[0]

		expect(rule('123')).toEqual({ error: 'Invalid format.' })
		expect(rule('aBc')).toEqual({ error: 'Invalid format.' })
		expect(rule('abc')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate notWeekend rule', () => {
		const rules = generateRules([{
			type: 'notWeekend',
			options: { message: 'Date cannot be on a weekend.' },
		}])
		const rule = rules[0]

		// 15 janvier 2023 est un dimanche (jour 0)
		expect(rule(new Date(2023, 0, 15))).toEqual({ error: 'Date cannot be on a weekend.' })
		// 14 janvier 2023 est un samedi (jour 6)
		expect(rule(new Date(2023, 0, 14))).toEqual({ error: 'Date cannot be on a weekend.' })
		// 13 janvier 2023 est un vendredi (jour 5)
		expect(rule(new Date(2023, 0, 13))).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate notBeforeToday rule', () => {
		const rules = generateRules([{
			type: 'notBeforeToday',
			options: { message: 'Date cannot be before today.' },
		}])
		const rule = rules[0]

		// 14 janvier 2023 est avant aujourd'hui (15 janvier 2023)
		expect(rule(new Date(2023, 0, 14))).toEqual({ error: 'Date cannot be before today.' })
		// 15 janvier 2023 est aujourd'hui
		expect(rule(new Date(2023, 0, 15))).toEqual({ success: 'Le champ est valide.' })
		// 16 janvier 2023 est après aujourd'hui
		expect(rule(new Date(2023, 0, 16))).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should validate notAfterToday rule', () => {
		const rules = generateRules([{
			type: 'notAfterToday',
			options: { message: 'Date cannot be after today.' },
		}])
		const rule = rules[0]

		// 16 janvier 2023 est après aujourd'hui (15 janvier 2023)
		expect(rule(new Date(2023, 0, 16))).toEqual({ error: 'Date cannot be after today.' })
		// 15 janvier 2023 est aujourd'hui
		expect(rule(new Date(2023, 0, 15))).toEqual({ success: 'Le champ est valide.' })
		// 14 janvier 2023 est avant aujourd'hui
		expect(rule(new Date(2023, 0, 14))).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
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

	it('should validate notBeforeDate rule', () => {
		const rules = generateRules([{
			type: 'notBeforeDate',
			options: {
				date: '10/01/2023', // 10 janvier 2023
				message: 'Date cannot be before reference date.',
			},
		}])
		const rule = rules[0]

		// 9 janvier 2023 est avant la date de référence
		expect(rule(new Date(2023, 0, 9))).toEqual({ error: 'Date cannot be before reference date.' })
		// 10 janvier 2023 est la date de référence
		expect(rule(new Date(2023, 0, 10))).toEqual({ success: 'Le champ est valide.' })
		// 11 janvier 2023 est après la date de référence
		expect(rule(new Date(2023, 0, 11))).toEqual({ success: 'Le champ est valide.' })
		// Test avec une date invalide
		expect(rule('invalid-date')).toEqual({ error: 'Date invalide' })
		// Test sans option date
		const ruleWithoutDate = generateRules([{
			type: 'notBeforeDate',
			options: { message: 'Date cannot be before reference date.' },
		}])[0]
		expect(ruleWithoutDate(new Date())).toEqual({ error: 'Configuration de la règle invalide' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should throw when date reference is not a string in notBeforeDate rule', () => {
		expect(() => {
			const invalidRule = generateRules([{
				type: 'notBeforeDate',
				options: {
					date: new Date() as unknown as string, // Date object instead of string
					message: 'Date cannot be before reference date.',
				},
			}])[0]
			invalidRule(new Date())
		}).toThrow('Date reference must be a string in DD/MM/YYYY format')
	})

	it('should validate notAfterDate rule', () => {
		const rules = generateRules([{
			type: 'notAfterDate',
			options: {
				date: '20/01/2023', // 20 janvier 2023
				message: 'Date cannot be after reference date.',
			},
		}])
		const rule = rules[0]

		// 21 janvier 2023 est après la date de référence
		expect(rule(new Date(2023, 0, 21))).toEqual({ error: 'Date cannot be after reference date.' })
		// 20 janvier 2023 est la date de référence
		expect(rule(new Date(2023, 0, 20))).toEqual({ success: 'Le champ est valide.' })
		// 19 janvier 2023 est avant la date de référence
		expect(rule(new Date(2023, 0, 19))).toEqual({ success: 'Le champ est valide.' })
		// Test avec une date invalide
		expect(rule('invalid-date')).toEqual({ error: 'Date invalide' })
		// Test sans option date
		const ruleWithoutDate = generateRules([{
			type: 'notAfterDate',
			options: { message: 'Date cannot be after reference date.' },
		}])[0]
		expect(ruleWithoutDate(new Date())).toEqual({ error: 'Configuration de la règle invalide' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should throw when date reference is not a string in notAfterDate rule', () => {
		expect(() => {
			const invalidRule = generateRules([{
				type: 'notAfterDate',
				options: {
					date: new Date() as unknown as string, // Date object instead of string
					message: 'Date cannot be after reference date.',
				},
			}])[0]
			invalidRule(new Date())
		}).toThrow('Date reference must be a string in DD/MM/YYYY format')
	})

	it('should validate dateExact rule', () => {
		const rules = generateRules([{
			type: 'dateExact',
			options: {
				date: '15/01/2023', // 15 janvier 2023
				message: 'Date must be exactly the reference date.',
			},
		}])
		const rule = rules[0]

		// 14 janvier 2023 n'est pas la date exacte
		expect(rule(new Date(2023, 0, 14))).toEqual({ error: 'Date must be exactly the reference date.' })
		// 15 janvier 2023 est la date exacte
		expect(rule(new Date(2023, 0, 15))).toEqual({ success: 'Le champ est valide.' })
		// 16 janvier 2023 n'est pas la date exacte
		expect(rule(new Date(2023, 0, 16))).toEqual({ error: 'Date must be exactly the reference date.' })
		// Test avec une date invalide
		expect(rule('invalid-date')).toEqual({ error: 'Date invalide' })
		// Test sans option date
		const ruleWithoutDate = generateRules([{
			type: 'dateExact',
			options: { message: 'Date must be exactly the reference date.' },
		}])[0]
		expect(ruleWithoutDate(new Date())).toEqual({ error: 'Configuration de la règle invalide' })
		expect(rule('')).toEqual({}) // Empty string should be ignored
	})

	it('should throw when date reference is not a string in dateExact rule', () => {
		expect(() => {
			const invalidRule = generateRules([{
				type: 'dateExact',
				options: {
					date: new Date() as unknown as string, // Date object instead of string
					message: 'Date must be exactly the reference date.',
				},
			}])[0]
			invalidRule(new Date())
		}).toThrow('Date reference must be a string in DD/MM/YYYY format')
	})

	it('should validate custom rule', () => {
		const rules = generateRules([{
			type: 'custom',
			options: { validate: (value: unknown) => value === 'valid', message: 'Custom validation failed.' },
		}])
		const rule = rules[0]

		expect(rule('invalid')).toEqual({ error: 'Custom validation failed.' })
		expect(rule('valid')).toEqual({ success: 'Le champ est valide.' })
		expect(rule('')).toEqual({}) // Empty string should be ignored

		// Test avec un message personnalisé
		const customMessageRule = generateRules([{
			type: 'custom',
			options: { validate: (value: unknown) => value === 'valid' ? true : 'Custom error message' },
		}])[0]
		expect(customMessageRule('invalid')).toEqual({ error: 'Custom error message' })
	})

	it('should handle warning mode instead of error', () => {
		const rules = generateRules([{
			type: 'required',
			options: {
				message: 'This field is required.',
				isWarning: true,
			},
		}])
		const rule = rules[0]

		expect(rule('')).toEqual({ warning: 'This field is required.' })

		// Test avec un message d'avertissement personnalisé
		const warningMessageRule = generateRules([{
			type: 'required',
			options: {
				warningMessage: 'Warning: this field should be filled.',
				isWarning: true,
			},
		}])[0]
		expect(warningMessageRule('')).toEqual({ warning: 'Warning: this field should be filled.' })
	})

	it('should handle custom field identifiers', () => {
		const rules = generateRules([{
			type: 'required',
			options: {
				fieldName: 'Email',
			},
		}])
		const rule = rules[0]

		expect(rule('')).toEqual({ error: 'Vous devez renseigner Email.' })

		const fieldIdentifierRule = generateRules([{
			type: 'required',
			options: {
				fieldIdentifier: 'l\'adresse email',
			},
		}])[0]
		expect(fieldIdentifierRule('')).toEqual({ error: 'Vous devez renseigner l\'adresse email.' })
	})

	it('should handle success messages', () => {
		const rules = generateRules([{
			type: 'required',
			options: {
				successMessage: 'Field is valid!',
			},
		}])
		const rule = rules[0]

		expect(rule('value')).toEqual({ success: 'Field is valid!' })
	})

	it('should handle invalid rule types', () => {
		const rules = generateRules([{
			type: 'invalidRuleType',
			options: { message: 'This should show an error.' },
		}])
		const rule = rules[0]

		expect(rule('any value')).toEqual({ error: 'La règle spécifiée pour ce champ n\'existe pas.' })
	})
})
