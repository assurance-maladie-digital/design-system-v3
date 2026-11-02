import { describe, expect, it } from 'vitest'
import { type FlyoutGeometry, resolveFlyoutPosition } from '../flyoutPosition'

// Liste de 240 px à gauche d'une fenêtre de 1280 × 800, sous-niveau de 200 × 100 px aligné sur sa première entrée
const geometry: FlyoutGeometry = {
	listLeft: 16,
	listRight: 256,
	flyoutWidth: 200,
	flyoutTop: 16,
	flyoutHeight: 100,
	viewportWidth: 1280,
	viewportHeight: 800,
	preferredSide: 'end',
	rtl: false,
}

describe('resolveFlyoutPosition', () => {
	it('garde le côté préféré quand le sous-niveau y tient', () => {
		expect(resolveFlyoutPosition(geometry)).toEqual({ side: 'end', shift: 0 })
	})

	it('ouvre de l\'autre côté une liste collée au bord droit', () => {
		expect(resolveFlyoutPosition({ ...geometry, listLeft: 1040, listRight: 1280 }).side).toBe('start')
	})

	it('garde le côté préféré quand l\'autre côté a encore moins de place', () => {
		expect(resolveFlyoutPosition({ ...geometry, listLeft: 60, listRight: 1100, flyoutWidth: 300 }).side).toBe('end')
	})

	it('poursuit la cascade du côté du parent tant qu\'il y a la place', () => {
		expect(resolveFlyoutPosition({ ...geometry, listLeft: 800, listRight: 1000, preferredSide: 'start' }).side).toBe('start')
		expect(resolveFlyoutPosition({ ...geometry, listLeft: 100, listRight: 300, preferredSide: 'start' }).side).toBe('end')
	})

	it('inverse les côtés en RTL : end est à gauche', () => {
		expect(resolveFlyoutPosition({ ...geometry, rtl: true }).side).toBe('start')
		expect(resolveFlyoutPosition({ ...geometry, listLeft: 1040, listRight: 1280, rtl: true }).side).toBe('end')
	})

	it('remonte un sous-niveau qui dépasse le bas de la fenêtre, avec une marge de 8 px', () => {
		expect(resolveFlyoutPosition({ ...geometry, flyoutTop: 750 }).shift).toBe(58)
	})

	it('ne remonte pas au-delà du haut de la fenêtre', () => {
		expect(resolveFlyoutPosition({ ...geometry, flyoutTop: 50, flyoutHeight: 1000 }).shift).toBe(42)
	})
})
