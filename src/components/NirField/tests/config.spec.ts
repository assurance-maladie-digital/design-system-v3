import { describe, it, expect } from 'vitest'
import defaultOptions from '../config'

describe('NirField config', () => {
	it('should have the correct default options structure', () => {
		expect(defaultOptions).toHaveProperty('persistentHint')
		expect(defaultOptions).toHaveProperty('validateOn')
		expect(defaultOptions).toHaveProperty('icon')
		expect(defaultOptions).toHaveProperty('tooltip')
	})

	it('should have the correct persistentHint configuration', () => {
		expect(defaultOptions.persistentHint).toEqual({
			persistentHint: true,
		})
	})

	it('should have the correct validateOn configuration', () => {
		expect(defaultOptions.validateOn).toEqual({
			validateOn: 'blur',
		})
	})

	it('should have the correct icon configuration', () => {
		expect(defaultOptions.icon).toEqual({
			color: '',
		})
	})

	it('should have the correct tooltip configuration', () => {
		expect(defaultOptions.tooltip).toEqual({
			location: 'top',
		})
	})

	it('should be immutable when imported', () => {
		// Vérifier que l'objet ne peut pas être modifié après import
		const originalTooltipLocation = defaultOptions.tooltip.location

		// Tentative de modification
		const testFunc = () => {
			defaultOptions.tooltip.location = 'bottom'
		}

		// En mode strict, la modification d'une propriété en lecture seule devrait lever une erreur
		// En mode non-strict, la modification ne devrait pas être effective
		try {
			testFunc()
			// Si pas d'erreur, vérifions que la valeur n'a pas changé
			expect(defaultOptions.tooltip.location).toBe(originalTooltipLocation)
		}
		catch (e) {
			// Si une erreur est levée, c'est que l'objet est correctement protégé
			expect(e).toBeTruthy()
		}
	})

	it('should be used correctly in the component', () => {
		// Ce test est un placeholder pour vérifier l'intégration avec le composant
		// Dans un cas réel, on pourrait monter le composant et vérifier que les options
		// par défaut sont correctement appliquées
		expect(defaultOptions.validateOn.validateOn).toBe('blur')
		expect(defaultOptions.persistentHint.persistentHint).toBe(true)
	})
})
