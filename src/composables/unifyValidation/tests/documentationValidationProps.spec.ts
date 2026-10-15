import { describe, it, expect } from 'vitest'
import { getValidationDocumentation } from '../documentationValidationProps'

const EXPECTED_KEYS = [
	'readonly',
	'disabled',
	'required',
	'isValidateOnBlur',
	'showSuccessMessages',
	'disableErrorHandling',
	'useVuetifyValidation',
	'label',
	'rules',
	'customRules',
	'customWarningRules',
	'customSuccessRules',
	'errorMessages',
	'warningMessages',
	'successMessages',
	'hasError',
	'hasWarning',
	'hasSuccess',
	'hideDetails',
	'maxErrors',
] as const

describe('getValidationDocumentation', () => {
	describe('returned structure', () => {
		it('returns every expected key for the "all" type (default)', () => {
			const doc = getValidationDocumentation()
			for (const key of EXPECTED_KEYS) {
				expect(doc).toHaveProperty(key)
			}
		})

		it('gives every entry a non-empty string description', () => {
			const doc = getValidationDocumentation()
			for (const key of EXPECTED_KEYS) {
				expect(typeof doc[key].description).toBe('string')
				expect(doc[key].description.length).toBeGreaterThan(0)
			}
		})

		it('gives every entry a table with a type', () => {
			const doc = getValidationDocumentation()
			for (const key of EXPECTED_KEYS) {
				expect(doc[key]).toHaveProperty('table')
				expect(doc[key].table).toHaveProperty('type')
			}
		})
	})

	describe('"all" type (default)', () => {
		it('customRules includes the string, number and date types', () => {
			const doc = getValidationDocumentation('all')
			const detail = doc.customRules.table.type.detail
			expect(detail).toContain('minLength')
			expect(detail).toContain('min')
			expect(detail).toContain('notWeekend')
		})

		it('customWarningRules includes every type', () => {
			const doc = getValidationDocumentation('all')
			const detail = doc.customWarningRules.table.type.detail
			expect(detail).toContain('maxLength')
			expect(detail).toContain('max')
			expect(detail).toContain('notAfterDate')
		})
	})

	describe('"string" type', () => {
		it('customRules includes the string types but neither number nor date', () => {
			const doc = getValidationDocumentation('string')
			const detail = doc.customRules.table.type.detail
			expect(detail).toContain('minLength')
			expect(detail).toContain('email')
			expect(detail).not.toContain('notWeekend')
			expect(detail).not.toContain('notAfterDate')
		})
	})

	describe('"number" type', () => {
		it('customRules includes the number types but neither string nor date', () => {
			const doc = getValidationDocumentation('number')
			const detail = doc.customRules.table.type.detail
			expect(detail).toContain('\'min\'')
			expect(detail).toContain('\'max\'')
			expect(detail).not.toContain('minLength')
			expect(detail).not.toContain('notWeekend')
		})
	})

	describe('"date" type', () => {
		it('customRules includes the date types but neither string nor number', () => {
			const doc = getValidationDocumentation('date')
			const detail = doc.customRules.table.type.detail
			expect(detail).toContain('notWeekend')
			expect(detail).toContain('notAfterDate')
			expect(detail).not.toContain('minLength')
		})
	})

	describe('documented default values', () => {
		it('readonly defaults to false', () => {
			const doc = getValidationDocumentation()
			expect(doc.readonly.table.defaultValue).toEqual({ summary: 'false' })
		})

		it('isValidateOnBlur defaults to true', () => {
			const doc = getValidationDocumentation()
			expect(doc.isValidateOnBlur.table.defaultValue).toEqual({ summary: 'true' })
		})

		it('showSuccessMessages defaults to false', () => {
			const doc = getValidationDocumentation()
			expect(doc.showSuccessMessages.table.defaultValue).toEqual({ summary: 'false' })
		})

		it('disableErrorHandling defaults to false', () => {
			const doc = getValidationDocumentation()
			expect(doc.disableErrorHandling.table.defaultValue).toEqual({ summary: 'false' })
		})

		it('useVuetifyValidation defaults to false', () => {
			const doc = getValidationDocumentation()
			expect(doc.useVuetifyValidation.table.defaultValue).toEqual({ summary: 'false' })
		})
	})

	describe('Storybook controls', () => {
		it('boolean props use control="boolean"', () => {
			const doc = getValidationDocumentation()
			const booleanProps = ['readonly', 'disabled', 'required', 'isValidateOnBlur', 'showSuccessMessages', 'disableErrorHandling', 'useVuetifyValidation', 'hasError', 'hasWarning', 'hasSuccess', 'hideDetails'] as const
			for (const key of booleanProps) {
				expect(doc[key].control).toBe('boolean')
			}
		})

		it('label uses control="text"', () => {
			const doc = getValidationDocumentation()
			expect(doc.label.control).toBe('text')
		})

		it('customRules uses control="object"', () => {
			const doc = getValidationDocumentation()
			expect(doc.customRules.control).toBe('object')
		})

		it('maxErrors uses control="number"', () => {
			const doc = getValidationDocumentation()
			expect(doc.maxErrors.control).toBe('number')
		})
	})

	describe('table categories', () => {
		it('puts every entry in category="props"', () => {
			const doc = getValidationDocumentation()
			for (const key of EXPECTED_KEYS) {
				expect(doc[key].table.category).toBe('props')
			}
		})
	})

	describe('successive calls', () => {
		it('returns equivalent objects for two calls with the same type', () => {
			const doc1 = getValidationDocumentation('string')
			const doc2 = getValidationDocumentation('string')
			expect(JSON.stringify(doc1)).toBe(JSON.stringify(doc2))
		})

		it('returns different customRules objects for two calls with different types', () => {
			const docString = getValidationDocumentation('string')
			const docDate = getValidationDocumentation('date')
			expect(docString.customRules.table.type.detail).not.toBe(docDate.customRules.table.type.detail)
		})
	})
})
