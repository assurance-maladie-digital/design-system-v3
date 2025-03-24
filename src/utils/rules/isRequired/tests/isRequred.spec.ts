import { isRequiredFn } from '../index'
import { describe, it, expect } from 'vitest'

describe('isRequiredFn', () => {
	it('returns true for non-empty string', () => {
		const rule = isRequiredFn()
		const result = rule('non-empty')
		expect(result).toBe(true)
	})

	it('returns false for empty string', () => {
		const rule = isRequiredFn()
		const result = rule('')
		expect(result).toBe('Le champ est requis.')
	})

	it('returns true for non-empty array', () => {
		const rule = isRequiredFn()
		const result = rule(['item'])
		expect(result).toBe(true)
	})

	it('returns false for empty array', () => {
		const rule = isRequiredFn()
		const result = rule([])
		expect(result).toBe('Le champ est requis.')
	})

	it('returns true for non-null value', () => {
		const rule = isRequiredFn()
		const result = rule('value')
		expect(result).toBe(true)
	})

	it('returns false for null value', () => {
		const rule = isRequiredFn()
		const result = rule(null)
		expect(result).toBe('Le champ est requis.')
	})

	it('returns custom error message for empty string', () => {
		const customMessages = { default: 'Custom required message' }
		const rule = isRequiredFn(customMessages)
		const result = rule('')
		expect(result).toBe('Custom required message')
	})
})
