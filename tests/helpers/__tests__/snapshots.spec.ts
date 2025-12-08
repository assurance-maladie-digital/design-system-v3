import { expectedPropOptions, modifiedPropValues, requiredPropValues } from './TestComponentData'
import TestComponent from './TestComponent.vue'
import TestHelper from '../TestHelper'
import { describe } from 'vitest'

const testHelper = new TestHelper(TestComponent)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('snapshots', () => {
	testHelper.snapshots()
})
