import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import AmeliproCallback from '../AmeliproCallback.vue'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'
import { describe } from 'vitest'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproCallback> = {
	cardTitle: {
		type: String,
		default: undefined,
	},
	contentText: {
		type: String,
		default: undefined,
	},
	contentTitle: {
		type: String,
		default: undefined,
	},
	contentTitleColor: {
		type: String,
		default: 'ap-grey-darken-1',
	},
	failure: {
		type: Boolean,
		default: false,
	},
	imgMinWidth: {
		type: String,
		default: '100',
	},
	imgUrl: {
		type: String,
		default: undefined,
	},
	imgWidth: {
		type: String,
		default: '32px',
	},
	retryBtn: {
		type: Boolean,
		default: false,
	},
	transmissionHref: {
		type: String,
		default: undefined,
	},
	transmissionTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproCallback> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproCallback> => ({
	cardTitle: 'Modified card title',
	contentText: 'Modified content text',
	contentTitle: 'Modified content title',
	contentTitleColor: 'ap-blue',
	failure: true,
	imgMinWidth: 'modified-img-min-width',
	imgUrl: 'modified-img-url',
	imgWidth: 'modified-img-width',
	retryBtn: true,
	transmissionHref: 'modified-transmission-href',
	transmissionTo: 'modified-transmission-to',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproCallback)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproCallback', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})
})
