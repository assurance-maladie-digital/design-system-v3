import { describe, expect, it } from 'vitest'
import { isConformiteHidden } from '../isConformiteHidden'

describe('isConformiteHidden', () => {
	it('masque le panneau dans les dossiers de validation', () => {
		expect(isConformiteHidden('Composants/Formulaires/NirField/Validation')).toBe(true)
		expect(isConformiteHidden('Composants/Formulaires/DatePicker/Validation/Submit/MultiMode')).toBe(true)
	})

	it('affiche le panneau ailleurs', () => {
		expect(isConformiteHidden('Composants/Formulaires/NirField')).toBe(false)
		expect(isConformiteHidden('Composants/Données/SyTable/Usages')).toBe(false)
	})

	// Régression : `api.getCurrentStoryData()` renvoie `undefined` tant que
	// l'index n'est pas résolu. L'ancien code déréférençait `.title` sans garde,
	// levait, et le panneau restait affiché — visible en prod, pas en dev.
	it('masque le panneau tant que le titre est inconnu', () => {
		expect(isConformiteHidden(undefined)).toBe(true)
		expect(isConformiteHidden('')).toBe(true)
	})

	it('ignore la casse et les espaces du segment', () => {
		expect(isConformiteHidden('Composants/NirField/validation')).toBe(true)
		expect(isConformiteHidden('Composants/NirField/ Validation ')).toBe(true)
	})

	// Un segment qui commence par « validation » sans y être égal reste visible :
	// le comportement est inchangé, il est documenté ici pour être explicite.
	it('ne masque pas un segment seulement préfixé par validation', () => {
		expect(isConformiteHidden('Validation manuelle')).toBe(false)
	})
})
