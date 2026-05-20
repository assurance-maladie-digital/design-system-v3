import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createAccessibleIconAttributes, fixSvgAttributes } from '../iconUtils'

describe('createAccessibleIconAttributes', () => {
	describe('icône décorative', () => {
		it('retourne role="presentation" et aria-hidden="true"', () => {
			const attrs = createAccessibleIconAttributes(true)
			expect(attrs.role).toBe('presentation')
			expect(attrs['aria-hidden']).toBe('true')
		})

		it('ignore le label quand décorative', () => {
			const attrs = createAccessibleIconAttributes(true, 'Mon label')
			expect(attrs.role).toBe('presentation')
			expect(attrs['aria-hidden']).toBe('true')
		})
	})

	describe('icône fonctionnelle', () => {
		it('retourne role="img" et aria-hidden undefined', () => {
			const attrs = createAccessibleIconAttributes(false)
			expect(attrs.role).toBe('img')
			expect(attrs['aria-hidden']).toBeUndefined()
		})

		it('retourne aria-label avec le label fourni', () => {
			const attrs = createAccessibleIconAttributes(false, 'Fermer la modale')
			expect(attrs['aria-label']).toBe('Fermer la modale')
		})

		it('retourne aria-label undefined si aucun label fourni', () => {
			const attrs = createAccessibleIconAttributes(false)
			expect(attrs['aria-label']).toBeUndefined()
		})

		it('retourne aria-label undefined si label est une chaîne vide', () => {
			const attrs = createAccessibleIconAttributes(false, '')
			expect(attrs['aria-label']).toBeUndefined()
		})
	})
})

describe('fixSvgAttributes', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('ne fait rien si element est null', () => {
		expect(() => fixSvgAttributes(null, true)).not.toThrow()
		vi.runAllTimers()
	})

	it('supprime l\'attribut role sur le SVG quand décorative', () => {
		const container = document.createElement('div')
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttribute('role', 'img')
		container.appendChild(svg)

		fixSvgAttributes(container, true)
		vi.runAllTimers()

		expect(svg.hasAttribute('role')).toBe(false)
	})

	it('supprime aria-hidden sur le SVG quand fonctionnelle', () => {
		const container = document.createElement('div')
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttribute('aria-hidden', 'true')
		container.appendChild(svg)

		fixSvgAttributes(container, false)
		vi.runAllTimers()

		expect(svg.hasAttribute('aria-hidden')).toBe(false)
	})

	it('ne fait rien si aucun SVG dans l\'élément', () => {
		const container = document.createElement('div')
		container.appendChild(document.createElement('span'))

		expect(() => {
			fixSvgAttributes(container, true)
			vi.runAllTimers()
		}).not.toThrow()
	})

	it('agit de manière asynchrone (setTimeout)', () => {
		const container = document.createElement('div')
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttribute('role', 'img')
		container.appendChild(svg)

		fixSvgAttributes(container, true)

		// Avant le tick : l'attribut est encore présent
		expect(svg.hasAttribute('role')).toBe(true)

		vi.runAllTimers()

		// Après le tick : supprimé
		expect(svg.hasAttribute('role')).toBe(false)
	})
})
