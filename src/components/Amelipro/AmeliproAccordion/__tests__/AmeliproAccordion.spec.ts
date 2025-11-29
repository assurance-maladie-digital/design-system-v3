import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproAccordion from '../AmeliproAccordion.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'
import AmeliproAccordionTemplate from '../AmeliproAccordionTemplate/AmeliproAccordionTemplate.vue'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproAccordion> = {
	accordionTitle: {
		type: String,
		required: true,
	},
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
	headerRightWidth: {
		type: String,
		default: '50%',
	},
	hideSeparator: {
		type: Boolean,
		default: false,
	},
	isOpen: {
		type: Boolean,
		default: false,
	},
	titleLevel: {
		type: Number,
		default: 2,
	},
	titleUppercase: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproAccordion> => ({
	accordionTitle: 'Required accordion title',
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproAccordion> => ({
	accordionTitle: 'Modified accordion title',
	borderColor: 'modified-border-color',
	bordered: false,
	cardColor: 'modified-card-color',
	headerRightWidth: 'modified-header-right-width',
	hideSeparator: true,
	isOpen: true,
	titleLevel: 3,
	titleUppercase: true,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproAccordion)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproAccordion', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('setting props should update props of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproAccordion>>

		describe('AmeliproAccordionTemplate', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproAccordion, { props: requiredPropValues() })
			})

			it('prop accordionTitle sets prop accordionTitle', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('accordionTitle')).toBe('Required accordion title')

				const { accordionTitle } = modifiedPropValues()
				await vueWrapper.setProps({ accordionTitle })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('accordionTitle')).toBe('Modified accordion title')
			})

			it('prop borderColor sets prop borderColor', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('borderColor')).toBe('ap-grey-lighten-2')

				const { borderColor } = modifiedPropValues()
				await vueWrapper.setProps({ borderColor })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('borderColor')).toBe('modified-border-color')
			})

			it('prop bordered sets prop bordered', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('bordered')).toBe(true)

				const { bordered } = modifiedPropValues()
				await vueWrapper.setProps({ bordered })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('bordered')).toBe(false)
			})

			it('prop cardColor sets prop cardColor', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('cardColor')).toBe('ap-white')

				const { cardColor } = modifiedPropValues()
				await vueWrapper.setProps({ cardColor })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('cardColor')).toBe('modified-card-color')
			})

			it('prop headerRightWidth sets prop headerRightWidth', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('headerRightWidth')).toBe('50%')

				const { headerRightWidth } = modifiedPropValues()
				await vueWrapper.setProps({ headerRightWidth })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('headerRightWidth')).toBe('modified-header-right-width')
			})

			it('prop hideSeparator sets prop hideSeparator', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('hideSeparator')).toBe(false)

				const { hideSeparator } = modifiedPropValues()
				await vueWrapper.setProps({ hideSeparator })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('hideSeparator')).toBe(true)
			})

			it('prop titleLevel sets prop titleLevel', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('titleLevel')).toBe(2)

				const { titleLevel } = modifiedPropValues()
				await vueWrapper.setProps({ titleLevel })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('titleLevel')).toBe(3)
			})

			it('prop titleUppercase sets prop titleUppercase', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('titleUppercase')).toBe(false)

				const { titleUppercase } = modifiedPropValues()
				await vueWrapper.setProps({ titleUppercase })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('titleUppercase')).toBe(true)
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('uniqueId')).toBe('required-unique-id')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproAccordionTemplate).props('uniqueId')).toBe('modified-unique-id')
			})
		})
	})

	describe('Public functions', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproAccordion>>
		const findInnerWrapper = (): VueWrapper<InstanceType<typeof AmeliproAccordionTemplate>> => vueWrapper.findComponent(AmeliproAccordionTemplate)
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproAccordion, { props: requiredPropValues() })
		})

		it('should test openClose()', async () => {
			expect(findInnerWrapper().props('isOpen')).toBe(false)

			await vueWrapper.vm.openClose()
			expect(findInnerWrapper().props('isOpen')).toBe(true)

			await vueWrapper.vm.openClose()
			expect(findInnerWrapper().props('isOpen')).toBe(false)
		})
	})
})
