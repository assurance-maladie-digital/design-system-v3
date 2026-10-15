import { describe, expect, it } from 'vitest'
import type { ValidationRule } from 'vuetify'
import { evaluateVuetifyRules, normalizeVuetifyRuleResult } from '../vuetifyRuleEvaluation'
import { locales } from '../locales'

describe('normalizeVuetifyRuleResult', () => {
	it('returns null when the rule passes', () => {
		expect(normalizeVuetifyRuleResult(true)).toBeNull()
	})

	it('returns the message when the rule returns a string', () => {
		expect(normalizeVuetifyRuleResult('Valeur requise')).toBe('Valeur requise')
	})

	it.each([
		['false', false],
		['undefined', undefined],
		['null', null],
		['a number', 0],
	])('returns the generic message when the rule returns %s', (_, result) => {
		expect(normalizeVuetifyRuleResult(result)).toBe(locales.invalidValue)
	})
})

describe('evaluateVuetifyRules', () => {
	it('returns one result per rule, null meaning the rule passed', async () => {
		const rules: ValidationRule[] = [
			(value: unknown) => !!value || 'Valeur requise',
			(value: unknown) => String(value).length > 3 || 'Trop court',
		]

		expect(await evaluateVuetifyRules('ab', rules)).toEqual([null, 'Trop court'])
	})

	it('awaits async rules', async () => {
		const rules: ValidationRule[] = [async () => 'Erreur asynchrone']

		expect(await evaluateVuetifyRules('valeur', rules)).toEqual(['Erreur asynchrone'])
	})

	it('returns the generic message when a rule throws', async () => {
		const rules: ValidationRule[] = [() => {
			throw new Error('boom')
		}]

		expect(await evaluateVuetifyRules('valeur', rules)).toEqual([locales.invalidValue])
	})

	it('normalizes a non-function rule as its own result', async () => {
		const rules = [true, 'Message statique'] as unknown as ValidationRule[]

		expect(await evaluateVuetifyRules('valeur', rules)).toEqual([null, 'Message statique'])
	})

	it('returns an empty array without rules', async () => {
		expect(await evaluateVuetifyRules('valeur')).toEqual([])
	})
})
