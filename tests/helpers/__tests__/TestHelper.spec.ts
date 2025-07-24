import { describe, expect, it } from 'vitest'
import { expectedPropOptions, modifiedPropValues, requiredPropValues } from './TestComponentData'
import TestComponent from './TestComponent.vue'
import TestHelper from '../TestHelper'

describe('TestHelper (API publique)', () => {
	const testHelper = new TestHelper(TestComponent)

	it('setExpectedPropOptions, setRequiredPropValues, setModifiedPropValues configurent correctement les valeurs', () => {
		expect(() => testHelper.setExpectedPropOptions(expectedPropOptions)).not.toThrow()
		expect(() => testHelper.setRequiredPropValues(requiredPropValues)).not.toThrow()
		expect(() => testHelper.setModifiedPropValues(modifiedPropValues)).not.toThrow()
	})

	it('default(prop) retourne la valeur requise si la prop est required, sinon la valeur par défaut', () => {
		testHelper
			.setExpectedPropOptions(expectedPropOptions)
			.setRequiredPropValues(requiredPropValues)
			.setModifiedPropValues(modifiedPropValues)

		// Prop required
		expect(testHelper.default('requiredString')).toBe(requiredPropValues().requiredString)
		// Prop non required avec default
		expect(testHelper.default('classes')).toBe((expectedPropOptions.classes as { default: unknown }).default)
	})

	it('modified(prop) retourne la valeur modifiée', () => {
		testHelper
			.setExpectedPropOptions(expectedPropOptions)
			.setRequiredPropValues(requiredPropValues)
			.setModifiedPropValues(modifiedPropValues)

		expect(testHelper.modified('classes')).toBe(modifiedPropValues().classes)
		expect(testHelper.modified('requiredString')).toBe(modifiedPropValues().requiredString)
	})
})
