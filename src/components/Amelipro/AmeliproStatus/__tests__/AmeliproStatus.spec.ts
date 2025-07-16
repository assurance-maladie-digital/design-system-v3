import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproStatus from '../AmeliproStatus.vue'
import type { AmeliproStatusTypes } from '../AmeliproStatusTypes'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproStatus> = {
	isSpan: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: undefined,
	},
	paddingX: {
		type: String,
		default: '12px',
	},
	paddingY: {
		type: String,
		default: '4px',
	},
	type: {
		default: 'draft',
		type: String as PropType<keyof typeof AmeliproStatusTypes>,
		validator(value: string): boolean {
			return ['action', 'archive', 'canceled', 'closed', 'draft', 'failure', 'progress', 'success'].includes(value.toLowerCase())
		},
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproStatus> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproStatus> => ({
	isSpan: true,
	label: 'Modified label',
	paddingX: '16px',
	paddingY: '15px',
	type: 'canceled',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproStatus)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproStatus', () => {
	let vueWrapper: VueWrapper<InstanceType<typeof AmeliproStatus>>

	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproStatus, { props: requiredPropValues() })
		})

		describe('main tag', () => {
			it('prop isSpan sets type of tag', async () => {
				expect(vueWrapper.findAll('p').length).toBe(1)
				expect(vueWrapper.findAll('span').length).toBe(0)

				const { isSpan } = modifiedPropValues()
				await vueWrapper.setProps({ isSpan })
				expect(vueWrapper.findAll('p').length).toBe(0)
				expect(vueWrapper.findAll('span').length).toBe(1)
			})

			it('props label & type sets text content', async () => {
				expect(vueWrapper.find('p').text()).toBe('Brouillon')

				const { type } = modifiedPropValues()
				await vueWrapper.setProps({ type })
				expect(vueWrapper.find('p').text()).toBe('Annulé')

				const { label } = modifiedPropValues()
				await vueWrapper.setProps({ label })
				expect(vueWrapper.find('p').text()).toBe('Modified label')
			})

			it('props paddingX, paddingY & type sets component style', async () => {
				expect(vueWrapper.find('p').attributes('style')).toBe('border: 2px solid transparent; border-radius: 16px; padding: 4px 12px;')

				const { paddingX, paddingY } = modifiedPropValues()
				await vueWrapper.setProps({ paddingX, paddingY })
				expect(vueWrapper.find('p').attributes('style')).toBe('border: 2px solid transparent; border-radius: 16px; padding: 15px 16px;')

				// TODO: type 'canceled' => borderColor: 'bg-ap-grey-lighten-1' => pourquoi #000 ?
				const { type } = modifiedPropValues()
				await vueWrapper.setProps({ type })
				expect(vueWrapper.find('p').attributes('style')).toBe('border: 2px solid #000; border-radius: 16px; padding: 15px 16px;')
			})

			it('prop type sets component classes', async () => {
				expect(vueWrapper.find('p').classes('bg-ap-yellow-lighten-3')).toBe(true)
				expect(vueWrapper.find('p').classes('bg-ap-red-lighten-3')).toBe(false)

				await vueWrapper.setProps({ type: 'progress' })
				expect(vueWrapper.find('p').classes('bg-ap-yellow-lighten-3')).toBe(false)
				expect(vueWrapper.find('p').classes('bg-ap-red-lighten-3')).toBe(true)
			})
		})
	})
})
