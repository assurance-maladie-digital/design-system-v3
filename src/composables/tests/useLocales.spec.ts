import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'

import { useLocales } from '../useLocales'

const defaultLocales = {
	thanks: 'Merci',
	toValidate: 'À valider',
	labels: ['Pas du tout', 'Moyen', 'Parfait !'],
	nested: {
		title: 'Compte',
		subTitle: 'Vos démarches',
	},
	ratingAriaLabel: (index: number, length: number): string => `${index} sur ${length}`,
}

describe('useLocales', () => {
	it('returns the defaults when no override is provided', () => {
		const locales = useLocales(defaultLocales, () => undefined)

		expect(locales.value).toEqual(defaultLocales)
	})

	it('returns the defaults when override is null', () => {
		const locales = useLocales(defaultLocales, () => null)

		expect(locales.value).toEqual(defaultLocales)
	})

	it('returns the defaults when override is an empty object', () => {
		const locales = useLocales(defaultLocales, () => ({}))

		expect(locales.value).toEqual(defaultLocales)
	})

	it('overrides a flat string key while keeping the others', () => {
		const locales = useLocales(defaultLocales, () => ({ thanks: 'Thanks!' }))

		expect(locales.value.thanks).toBe('Thanks!')
		expect(locales.value.toValidate).toBe('À valider')
	})

	it('merges nested objects partially', () => {
		const locales = useLocales(defaultLocales, () => ({
			nested: { title: 'Société' },
		}))

		expect(locales.value.nested.title).toBe('Société')
		expect(locales.value.nested.subTitle).toBe('Vos démarches')
	})

	it('replaces arrays when overridden', () => {
		const locales = useLocales(defaultLocales, () => ({
			labels: ['Bof'],
		}))

		expect(locales.value.labels).toEqual(['Bof'])
	})

	it('replaces a function with the provided one', () => {
		const custom = (index: number): string => `note ${index}`
		const locales = useLocales(defaultLocales, () => ({
			ratingAriaLabel: custom,
		}))

		expect(locales.value.ratingAriaLabel(3, 5)).toBe('note 3')
	})

	it('reacts to changes in the overrides getter', async () => {
		const overrides = ref<{ thanks?: string }>({})

		const locales = useLocales(defaultLocales, () => overrides.value)

		expect(locales.value.thanks).toBe('Merci')

		overrides.value = { thanks: 'Thanks!' }
		await nextTick()

		expect(locales.value.thanks).toBe('Thanks!')

		overrides.value = {}
		await nextTick()

		expect(locales.value.thanks).toBe('Merci')
	})
})
