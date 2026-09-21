import { describe, expect, it } from 'vitest'
import { isConformiteHidden } from '../isConformiteHidden'

describe('isConformiteHidden', () => {
	it('masque le panneau dans les dossiers de validation', () => {
		expect(isConformiteHidden('Composants/Formulaires/NirField/Validation')).toBe(true)
		expect(isConformiteHidden('Composants/Formulaires/DatePicker/Validation/Submit/MultiMode')).toBe(true)
		expect(isConformiteHidden('Composants/NirField/validation')).toBe(true)
	})

	it('affiche le panneau ailleurs', () => {
		expect(isConformiteHidden('Composants/Formulaires/NirField')).toBe(false)
		expect(isConformiteHidden('Composants/Données/SyTable/Usages')).toBe(false)
	})

	// Régression : `api.getCurrentStoryData()` renvoie `undefined` tant que
	// l'index n'est pas résolu, et l'ancien code déréférençait `.title` sans
	// garde. Titre inconnu = rien à masquer ; masquer par défaut faisait
	// disparaître l'onglet en dev, où il doit s'afficher.
	it('laisse le panneau visible tant que le titre est inconnu', () => {
		expect(isConformiteHidden(undefined)).toBe(false)
		expect(isConformiteHidden('')).toBe(false)
	})
})
