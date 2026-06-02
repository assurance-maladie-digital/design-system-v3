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
	describe('structure retournée', () => {
		it('retourne toutes les clés attendues pour le type "all" (défaut)', () => {
			const doc = getValidationDocumentation()
			for (const key of EXPECTED_KEYS) {
				expect(doc).toHaveProperty(key)
			}
		})

		it('chaque entrée possède une description string non vide', () => {
			const doc = getValidationDocumentation()
			for (const key of EXPECTED_KEYS) {
				expect(typeof doc[key].description).toBe('string')
				expect(doc[key].description.length).toBeGreaterThan(0)
			}
		})

		it('chaque entrée possède une table avec un type', () => {
			const doc = getValidationDocumentation()
			for (const key of EXPECTED_KEYS) {
				expect(doc[key]).toHaveProperty('table')
				expect(doc[key].table).toHaveProperty('type')
			}
		})
	})

	describe('type "all" (défaut)', () => {
		it('customRules inclut les types string, number et date', () => {
			const doc = getValidationDocumentation('all')
			const detail = doc.customRules.table.type.detail
			expect(detail).toContain('minLength')
			expect(detail).toContain('min')
			expect(detail).toContain('noWeekend')
		})

		it('customWarningRules inclut tous les types', () => {
			const doc = getValidationDocumentation('all')
			const detail = doc.customWarningRules.table.type.detail
			expect(detail).toContain('maxLength')
			expect(detail).toContain('max')
			expect(detail).toContain('notAfterDate')
		})
	})

	describe('type "string"', () => {
		it('customRules inclut les types string mais pas number ni date', () => {
			const doc = getValidationDocumentation('string')
			const detail = doc.customRules.table.type.detail
			expect(detail).toContain('minLength')
			expect(detail).toContain('email')
			expect(detail).not.toContain('noWeekend')
			expect(detail).not.toContain('notAfterDate')
		})
	})

	describe('type "number"', () => {
		it('customRules inclut les types number mais pas string ni date', () => {
			const doc = getValidationDocumentation('number')
			const detail = doc.customRules.table.type.detail
			expect(detail).toContain('\'min\'')
			expect(detail).toContain('\'max\'')
			expect(detail).not.toContain('minLength')
			expect(detail).not.toContain('noWeekend')
		})
	})

	describe('type "date"', () => {
		it('customRules inclut les types date mais pas string ni number', () => {
			const doc = getValidationDocumentation('date')
			const detail = doc.customRules.table.type.detail
			expect(detail).toContain('noWeekend')
			expect(detail).toContain('notAfterDate')
			expect(detail).not.toContain('minLength')
		})
	})

	describe('valeurs par défaut documentées', () => {
		it('readonly a un defaultValue false', () => {
			const doc = getValidationDocumentation()
			expect(doc.readonly.table.defaultValue).toEqual({ summary: 'false' })
		})

		it('isValidateOnBlur a un defaultValue true', () => {
			const doc = getValidationDocumentation()
			expect(doc.isValidateOnBlur.table.defaultValue).toEqual({ summary: 'true' })
		})

		it('showSuccessMessages a un defaultValue false', () => {
			const doc = getValidationDocumentation()
			expect(doc.showSuccessMessages.table.defaultValue).toEqual({ summary: 'false' })
		})

		it('disableErrorHandling a un defaultValue false', () => {
			const doc = getValidationDocumentation()
			expect(doc.disableErrorHandling.table.defaultValue).toEqual({ summary: 'false' })
		})

		it('useVuetifyValidation a un defaultValue false', () => {
			const doc = getValidationDocumentation()
			expect(doc.useVuetifyValidation.table.defaultValue).toEqual({ summary: 'false' })
		})
	})

	describe('contrôles Storybook', () => {
		it('les props booléennes ont control="boolean"', () => {
			const doc = getValidationDocumentation()
			const booleanProps = ['readonly', 'disabled', 'required', 'isValidateOnBlur', 'showSuccessMessages', 'disableErrorHandling', 'useVuetifyValidation', 'hasError', 'hasWarning', 'hasSuccess', 'hideDetails'] as const
			for (const key of booleanProps) {
				expect(doc[key].control).toBe('boolean')
			}
		})

		it('label a control="text"', () => {
			const doc = getValidationDocumentation()
			expect(doc.label.control).toBe('text')
		})

		it('customRules a control="object"', () => {
			const doc = getValidationDocumentation()
			expect(doc.customRules.control).toBe('object')
		})

		it('maxErrors a control="number"', () => {
			const doc = getValidationDocumentation()
			expect(doc.maxErrors.control).toBe('number')
		})
	})

	describe('catégories table', () => {
		it('toutes les entrées ont category="props"', () => {
			const doc = getValidationDocumentation()
			for (const key of EXPECTED_KEYS) {
				expect(doc[key].table.category).toBe('props')
			}
		})
	})

	describe('appels successifs', () => {
		it('deux appels avec le même type retournent des objets équivalents', () => {
			const doc1 = getValidationDocumentation('string')
			const doc2 = getValidationDocumentation('string')
			expect(JSON.stringify(doc1)).toBe(JSON.stringify(doc2))
		})

		it('deux appels avec des types différents retournent des objets différents pour customRules', () => {
			const docString = getValidationDocumentation('string')
			const docDate = getValidationDocumentation('date')
			expect(docString.customRules.table.type.detail).not.toBe(docDate.customRules.table.type.detail)
		})
	})
})
