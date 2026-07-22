import { describe, it, expect } from 'vitest'

import { mergeLocales } from '../mergeLocales'

const defaultLocales = {
	thanks: 'Merci',
	toValidate: 'À valider',
	defaultEmotionLabels: ['Pas du tout', 'Moyen', 'Parfait !'],
	compteEntreprise: {
		title: {
			text: 'Compte ',
			highlight: 'entreprise',
		},
		subTitle: 'Vos démarches',
	},
	ratingAriaLabel: (index: number, length: number): string => `${index} sur ${length}`,
}

describe('mergeLocales', () => {
	it('returns the defaults when no override is provided', () => {
		const result = mergeLocales(defaultLocales)

		expect(result).toEqual(defaultLocales)
	})

	it('overrides a flat string key while keeping the others', () => {
		const result = mergeLocales(defaultLocales, { thanks: 'Thanks!' })

		expect(result.thanks).toBe('Thanks!')
		expect(result.toValidate).toBe('À valider')
	})

	it('merges nested objects partially', () => {
		const result = mergeLocales(defaultLocales, {
			compteEntreprise: { title: { highlight: 'société' } },
		})

		expect(result.compteEntreprise.title.highlight).toBe('société')
		expect(result.compteEntreprise.title.text).toBe('Compte ')
		expect(result.compteEntreprise.subTitle).toBe('Vos démarches')
	})

	it('replaces a function with the provided one', () => {
		const custom = (index: number): string => `note ${index}`
		const result = mergeLocales(defaultLocales, {
			ratingAriaLabel: custom,
		})

		expect(result.ratingAriaLabel(3, 5)).toBe('note 3')
	})

	it('replaces arrays when overridden', () => {
		const result = mergeLocales(defaultLocales, {
			defaultEmotionLabels: ['Bof'],
		})

		expect(result.defaultEmotionLabels).toEqual([
			'Bof',
		])
	})
})
