import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproNumberedCard from '../AmeliproNumberedCard.vue'
import type { AmeliproNumberedCardItem } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproNumberedCard> = {
	borderColor: {
		type: String,
		default: 'ap-grey-lighten-2',
	},
	bordered: {
		type: Boolean,
		default: true,
	},
	cardColor: {
		type: String,
		default: 'ap-white',
	},
	contentClasses: {
		type: String,
		default: undefined,
	},
	items: {
		type: Array as PropType<AmeliproNumberedCardItem[]>,
		required: true,
	},
	itemsPerLine: {
		type: Number,
		default: 2,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproNumberedCard> => ({
	uniqueId: 'required-unique-id',
	items: [],
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproNumberedCard> => ({
	borderColor: 'ap-blue',
	bordered: false,
	cardColor: 'ap-grey',
	contentClasses: 'modified-content-classes',
	items: [
		{
			email: 'modified-jean.bernard@gmail.com',
			firstname: 'Modified Jean',
			id: 0,
			name: 'Modified Bernard',
		},
		{
			email: 'modified-simon.pierre@gmail.com',
			firstname: 'Modified Simon',
			id: 1,
			name: 'Modified Pierre',
		},
		{
			email: 'modified-michel.souris@gmail.com',
			firstname: 'Modified Michel',
			id: 2,
			name: 'Modified Souris',
		},
	],
	itemsPerLine: 3,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproNumberedCard)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproNumberedCard', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Computed', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproNumberedCard>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproNumberedCard, { props: { ...requiredPropValues(), items: testHelper.modified('items') } })
		})

		it('generalCardStyles returns the good styles', async () => {
			expect(vueWrapper.find('.amelipro-card--numbered').attributes('style')).toStrictEqual('background-color: #FFFFFF; border: 1px solid #DDDEDE;')

			const { borderColor, bordered, cardColor } = modifiedPropValues()
			await vueWrapper.setProps({ borderColor, cardColor })
			expect(vueWrapper.find('.amelipro-card--numbered').attributes('style')).toStrictEqual('background-color: #545859; border: 1px solid #0C419A;')
			await vueWrapper.setProps({ bordered })
			expect(vueWrapper.find('.amelipro-card--numbered').attributes('style')).toStrictEqual('background-color: #545859;')
		})

		it('listClasses returns the good classes', async () => {
			expect(vueWrapper.find('ol').classes().includes('items-per-line-2')).toBeTruthy()

			await vueWrapper.setProps({ itemsPerLine: 3 })
			expect(vueWrapper.find('ol').classes().includes('items-per-line-3')).toBeTruthy()

			await vueWrapper.setProps({ itemsPerLine: 4 })
			expect(vueWrapper.find('ol').classes().includes('items-per-line-4')).toBeTruthy()
		})
	})
})
