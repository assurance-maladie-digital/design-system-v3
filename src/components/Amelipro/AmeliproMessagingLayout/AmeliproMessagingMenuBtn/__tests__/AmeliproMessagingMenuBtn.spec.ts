import AmeliproMessagingMenuBtn from '../AmeliproMessagingMenuBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'
import { describe } from 'vitest'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproMessagingMenuBtn> = {
	active: {
		type: Boolean,
		default: false,
	},
	href: {
		type: String,
		default: undefined,
	},
	icon: {
		type: String,
		default: undefined,
	},
	label: {
		type: String,
		default: undefined,
	},
	to: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		required: true,
	},
	unreadNumber: {
		type: Number,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproMessagingMenuBtn> => ({ uniqueId: 'required-unique-id' })

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproMessagingMenuBtn> => ({
	active: true,
	href: '#modified',
	icon: 'modified-plus',
	label: 'Modified label',
	to: '/modified-home',
	uniqueId: 'modified-unique-id',
	unreadNumber: 5,
})

const testHelper = new TestHelper(AmeliproMessagingMenuBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproMessagingMenuBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	// const wrapper = mount(AmeliproMessagingMenuBtn, {
	//	props: modifiedPropValues(),
	//	stubs: { AmeliproIcon },
	// });
})
