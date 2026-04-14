import { describe, expect, it } from 'vitest'
import { buildContextual, buildPrimitives, formatColor, formatLength } from '../builders'

describe('formatColor', () => {
	it('normalizes valid hex colors', () => {
		expect(formatColor('#0C419A')).toBe('#0c419a')
	})

	it('keeps valid rgba colors after whitespace normalization', () => {
		expect(formatColor('rgba(255,255, 255, 0.080)')).toBe('rgba(255, 255, 255, 0.080)')
	})

	it('accepts modern rgb slash syntax', () => {
		expect(formatColor('rgb(255 255 255/20%)')).toBe('rgb(255 255 255 / 20%)')
	})

	it('rejects malformed hex colors', () => {
		expect(() => formatColor('#12')).toThrow('Invalid color token')
	})

	it('rejects malformed rgba colors', () => {
		expect(() => formatColor('rgba(255, 255, 255)')).toThrow('Invalid color token')
	})

	it('rejects non-string color values', () => {
		expect(() => formatColor(undefined)).toThrow('Expected color token to be a string')
	})
})

describe('formatLength', () => {
	it('normalizes numeric values to px', () => {
		expect(formatLength(12)).toBe('12px')
	})

	it('trims valid string values', () => {
		expect(formatLength(' 12px ')).toBe('12px')
	})

	it('rejects empty string values', () => {
		expect(() => formatLength('   ')).toThrow('Expected length token to be a non-empty string or number')
	})
})

describe('buildPrimitives', () => {
	it('fails fast when a color token is invalid', () => {
		expect(() => buildPrimitives({
			blue: {
				base: '#12',
			},
		})).toThrow('Invalid color token "#12"')
	})
})

describe('buildContextual', () => {
	it('fails fast when a spacing token is blank', () => {
		expect(() => buildContextual({
			colors: {
				background: '#ffffff',
				border: '#000000',
				text: '#000000',
				icon: '#000000',
				overlay: 'rgba(0, 0, 0, 0.5)',
				interactive: '#0c419a',
			},
			gap: {
				0: '0',
				1: '4px',
				2: '8px',
				3: '12px',
				4: '16px',
				5: '20px',
				6: '24px',
				7: '28px',
				8: '32px',
				9: '36px',
				10: '40px',
				11: '44px',
				12: '48px',
				13: '52px',
				14: '56px',
				15: '60px',
				16: '64px',
			},
			iconSize: {
				xsmall: '12px',
				small: '16px',
				default: '24px',
				large: '32px',
			},
			radius: {
				rounded0: '0',
				rounded: '4px',
				roundedLg: '8px',
				roundedPill: '9999px',
			},
			padding: {
				0: '0',
				2: '8px',
				3: '12px',
				4: '16px',
				6: '24px',
				8: '32px',
				10: '40px',
				14: '56px',
				16: '64px',
			},
			fontSize: {
				titres: '24px',
				titresAlternatifs: '20px',
				corpsDeTexte: '16px',
				liensEtLibelles: '14px',
			},
		}, {}, {
			vertical: {
				none: ' ',
			},
			horizontal: {},
			container: {},
		})).toThrow('Expected length token to be a non-empty string or number')
	})
})
