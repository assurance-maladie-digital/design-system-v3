import type { ExpectedPropOptions } from '@tests/types'
import AmeliproAccordionGroup from '../AmeliproAccordionGroup.vue'
import TestHelper from '@tests/helpers/TestHelper'
import type { ComponentProps } from 'vue-component-type-helpers'
import { beforeEach, describe, expect, it } from 'vitest'
import type { PropType } from 'vue'
import type { AmeliproAccordionGroupItem } from '../types'
import { VueWrapper, shallowMount } from '@vue/test-utils'
import AmeliproAccordionTemplate from '../../AmeliproAccordion/AmeliproAccordionTemplate/AmeliproAccordionTemplate.vue'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproAccordionGroup> = {
	defaultItemOpened: {
		type: [Number, null] as PropType<number | null>,
		default: null,
	},
	groupBorderColor: {
		type: String,
		default: 'ap-grey-lighten-2',
	},
	groupBordered: {
		type: Boolean,
		default: true,
	},
	groupColor: {
		type: String,
		default: 'ap-white',
	},
	groupTitleLevel: {
		type: Number,
		default: 2,
	},
	groupTitleUppercase: {
		type: Boolean,
		default: false,
	},
	headerRightWidth: {
		type: String,
		default: '50%',
	},
	hideSeparator: {
		type: Boolean,
		default: false,
	},
	items: {
		type: Array as PropType<AmeliproAccordionGroupItem[]>,
		required: true,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

const requiredPropValues = (): ComponentProps<typeof AmeliproAccordionGroup> => ({
	items: [
		{
			title: 'Accordion 1',
			id: 'accordion-1-id',
		},
		{
			title: 'Accordion 2',
			id: 'accordion-2-id',
		},
	],
})
const modifiedPropValues = (): ComponentProps<typeof AmeliproAccordionGroup> => ({
	defaultItemOpened: 1,
	groupBorderColor: 'ap-red-lighten-2',
	groupBordered: false,
	groupColor: 'ap-red',
	groupTitleLevel: 3,
	groupTitleUppercase: true,
	headerRightWidth: '100px',
	hideSeparator: true,
	items: [
		{
			title: 'Modified accordion 1',
			id: 'modified-accordion-1-id',
		},
		{
			title: 'Modified accordion 2',
			id: 'modified-accordion-2-id',
		},
	],
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproAccordionGroup)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproAccordionGroup', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproAccordionGroup>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproAccordionGroup, { props: requiredPropValues() })
		})

		describe('main div', () => {
			it('prop uniqueId sets attribute id', async () => {
			// assertion par défaut
				expect(wrapper.attributes('id')).toBe(testHelper.default('uniqueId'))

				// assertion modifiée
				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.attributes('id')).toBe(testHelper.modified('uniqueId'))
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproAccordionGroup>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproAccordionGroup, { props: requiredPropValues() })
		})

		describe('AmeliproAccordionTemplate', () => {
			it('prop groupBorderColor sets prop borderColor', async () => {
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('borderColor')).toBe(testHelper.default('groupBorderColor'))

				const { groupBorderColor } = modifiedPropValues()
				await wrapper.setProps({ groupBorderColor })
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('borderColor')).toBe(testHelper.modified('groupBorderColor'))
			})

			it('prop groupBordered sets prop bordered', async () => {
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('bordered')).toBe(testHelper.default('groupBordered'))
				const { groupBordered } = modifiedPropValues()
				await wrapper.setProps({ groupBordered })
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('bordered')).toBe(testHelper.modified('groupBordered'))
			})

			it('prop groupColor sets prop cardColor', async () => {
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('cardColor')).toBe(testHelper.default('groupColor'))
				const { groupColor } = modifiedPropValues()
				await wrapper.setProps({ groupColor })
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('cardColor')).toBe(testHelper.modified('groupColor'))
			})

			it('prop headerRightWidth sets prop headerRightWidth', async () => {
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('headerRightWidth')).toBe(testHelper.default('headerRightWidth'))
				const { headerRightWidth } = modifiedPropValues()
				await wrapper.setProps({ headerRightWidth })
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('headerRightWidth')).toBe(testHelper.modified('headerRightWidth'))
			})

			it('prop hideSeparator sets prop hideSeparator', async () => {
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('hideSeparator')).toBe(testHelper.default('hideSeparator'))
				const { hideSeparator } = modifiedPropValues()
				await wrapper.setProps({ hideSeparator })
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('hideSeparator')).toBe(testHelper.modified('hideSeparator'))
			})

			it('prop groupTitleLevel sets prop titleLevel', async () => {
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('titleLevel')).toBe(testHelper.default('groupTitleLevel'))
				const { groupTitleLevel } = modifiedPropValues()
				await wrapper.setProps({ groupTitleLevel })
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('titleLevel')).toBe(testHelper.modified('groupTitleLevel'))
			})

			it('prop groupTitleUppercase sets prop titleUppercase', async () => {
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('titleUppercase')).toBe(testHelper.default('groupTitleUppercase'))
				const { groupTitleUppercase } = modifiedPropValues()
				await wrapper.setProps({ groupTitleUppercase })
				expect(wrapper.findComponent(AmeliproAccordionTemplate).props('titleUppercase')).toBe(testHelper.modified('groupTitleUppercase'))
			})

			it('prop items sets accordion-title and unique-id for each item', async () => {
				const defaultItems = testHelper.default('items')
				const templates = wrapper.findAllComponents(AmeliproAccordionTemplate)
				expect(templates.length).toBe(defaultItems.length)
				for (let i = 0; i < templates.length; i++) {
					expect(templates[i].props('accordionTitle')).toBe(defaultItems[i].title)
					expect(templates[i].props('uniqueId')).toBe(defaultItems[i].id)
				}

				const { items } = modifiedPropValues()
				await wrapper.setProps({ items })
				const modTemplates = wrapper.findAllComponents(AmeliproAccordionTemplate)
				expect(modTemplates.length).toBe(items.length)
				for (let i = 0; i < modTemplates.length; i++) {
					expect(modTemplates[i].props('accordionTitle')).toBe(items[i].title)
					expect(modTemplates[i].props('uniqueId')).toBe(items[i].id)
				}
			})
		})
	})

	describe('Events', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproAccordionGroup>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproAccordionGroup, {
				props: requiredPropValues(),
			})
		})

		it('emit \'change\' with correct id when openClose is called', async () => {
			const items = testHelper.default('items')
			await wrapper.vm.openClose(items[0].id)
			// L'accordéon s'ouvre, l'id est celui de l'item
			const emitted = wrapper.emitted('change')
			expect(emitted).toBeTruthy()
			expect(emitted![0][0]).toBe(items[0].id)

			// On referme le même accordéon, l'id devient null
			await wrapper.vm.openClose(items[0].id)
			const emitted2 = wrapper.emitted('change')
			expect(emitted2![1][0]).toBe(null)
		})

		it('emit \'change\' with correct id when clicking on accordion', async () => {
			const items = testHelper.default('items')
			const templates = wrapper.findAllComponents(AmeliproAccordionTemplate)
			await templates[1].vm.$emit('open-close')
			const emitted = wrapper.emitted('change')
			expect(emitted).toBeTruthy()
			expect(emitted![0][0]).toBe(items[1].id)
		})
	})
})
