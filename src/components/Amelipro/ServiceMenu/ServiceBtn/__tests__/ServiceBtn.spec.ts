import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { Service } from '../types'
import ServiceBtn from '../ServiceBtn.vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof ServiceBtn> = {
	iconBgColor: {
		type: String,
		required: true,
	},
	iconHoverBgColor: {
		type: String,
		required: true,
	},
	item: {
		type: Object as PropType<Service>,
		required: true,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof ServiceBtn> => ({
	iconBgColor: 'required-icon-bg-color',
	iconHoverBgColor: 'required-icon-hover-bg-color',
	item: {
		icon: 'required-item-icon',
		label: 'Required item label',
	},
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof ServiceBtn> => ({
	iconBgColor: 'ap-blue-darken-1',
	iconHoverBgColor: 'ap-blue darken-2',
	item: {
		icon: 'modified-item-icon',
		label: 'Modified item label',
	},
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(ServiceBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('ServiceBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof ServiceBtn>>
		beforeEach(() => {
			// On utilie mount car le label est dans un slot
			// et shallowMount ne gère pas les slots
			vueWrapper = mount(ServiceBtn, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on label span', async () => {
			// Par défaut, uniqueId n'est pas défini donc pas d'id sur le span
			expect(vueWrapper.find('.service-btn__text').attributes('id')).toBeUndefined()
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('.service-btn__text').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-text`)
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof ServiceBtn>>
		beforeEach(() => {
			vueWrapper = shallowMount(ServiceBtn, { props: requiredPropValues() })
		})

		it('prop iconBgColor sets prop icon-bg-color on AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconBgColor')).toBe(testHelper.default('iconBgColor'))
			const { iconBgColor } = modifiedPropValues()
			await vueWrapper.setProps({ iconBgColor })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconBgColor')).toBe(testHelper.modified('iconBgColor'))
		})

		it('prop iconHoverBgColor sets prop icon-hover-bg-color on AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconHoverBgColor')).toBe(testHelper.default('iconHoverBgColor'))
			const { iconHoverBgColor } = modifiedPropValues()
			await vueWrapper.setProps({ iconHoverBgColor })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconHoverBgColor')).toBe(testHelper.modified('iconHoverBgColor'))
		})
	})

	describe('Events', () => {
		it('emits click when AmeliproIconBtn is clicked', async () => {
			const vueWrapper = mount(ServiceBtn, { props: requiredPropValues() })
			await vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).trigger('click')
			expect(vueWrapper.emitted('click')).toBeTruthy()
		})
		it('emits click when AmeliproBtn is clicked', async () => {
			const vueWrapper = mount(ServiceBtn, {
				props: {
					...requiredPropValues(),
					item: { imgSrc: 'img.png', label: 'Required item label' },
				},
			})
			await vueWrapper.findComponent({ name: 'AmeliproBtn' }).trigger('click')
			expect(vueWrapper.emitted('click')).toBeTruthy()
		})
	})

	describe('Other', () => {
		it('renders AmeliproIconBtn if item.icon is defined', () => {
			const vueWrapper = shallowMount(ServiceBtn, { props: requiredPropValues() })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).exists()).toBe(true)
			expect(vueWrapper.findComponent({ name: 'AmeliproBtn' }).exists()).toBe(false)
		})
		it('renders AmeliproBtn if item.imgSrc is defined and no icon', () => {
			const vueWrapper = shallowMount(ServiceBtn, {
				props: {
					...requiredPropValues(),
					item: { imgSrc: 'img.png', label: 'Required item label' },
				},
			})
			expect(vueWrapper.findComponent({ name: 'AmeliproBtn' }).exists()).toBe(true)
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).exists()).toBe(false)
		})
	})
})
