import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { AmeliproStep } from '../types'
import AmeliproStepBtn from '../AmeliproStepBtn/AmeliproStepBtn.vue'
import { AmeliproStepper } from '@/components'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproStepper> = {
	centered: {
		type: Boolean,
		default: false,
	},
	finalStepBtn: {
		type: String,
		default: 'Transmettre',
	},
	hideBackBtn: {
		type: Boolean,
		default: false,
	},
	items: {
		type: Array as PropType<AmeliproStep[]>,
		default: () => [],
	},
	manualChangeStep: {
		type: Boolean,
		default: false,
	},
	nextBtnLabel: {
		type: String,
		default: 'Suivant',
	},
	noDefaultStyle: {
		type: Boolean,
		default: false,
	},
	previousBtnLabel: {
		type: String,
		default: 'Précédent',
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
	value: {
		type: Number,
		default: 0,
	},
}

const steps = (): AmeliproStep[] => [
	{
		disabled: false,
		label: 'etape 1',
		titleDisabled: false,
	},
	{
		disabled: false,
		label: 'etape 2',
		titleDisabled: false,
	},
	{
		disabled: false,
		label: 'etape 3',
		titleDisabled: false,
	},
]

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproStepper> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproStepper> => ({
	centered: true,
	finalStepBtn: 'Modified final step',
	hideBackBtn: true,
	items: [
		{
			disabled: false,
			label: 'Modified step label 1',
			titleDisabled: false,
		},
		{
			disabled: false,
			label: 'Modified step label 2',
			titleDisabled: false,
		},
		{
			disabled: false,
			label: 'Modified step label 3',
			titleDisabled: false,
		},
	],
	manualChangeStep: true,
	nextBtnLabel: 'Modified next label',
	noDefaultStyle: true,
	previousBtnLabel: 'Modified previous label',
	uniqueId: 'modified-unique-id',
	value: 1,
})

const testHelper = new TestHelper(AmeliproStepper)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproStepper', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	const displayWrapper = mount(DisplayTestComponent)

	describe('Setting props should update props or attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproStepper>>
		displayWrapper.vm.setMdAndUp(true)

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproStepper, { props: requiredPropValues() })
		})

		afterEach(() => {
			displayWrapper.vm.resetDefaults()
		})

		it('prop centered sets list class', async () => {
			expect(vueWrapper.find('.amelipro-stepper__list').classes('justify-center')).toBe(testHelper.default('centered'))
			await vueWrapper.setProps({ centered: testHelper.modified('centered') })
			expect(vueWrapper.find('.amelipro-stepper__list').classes('justify-center')).toBe(testHelper.modified('centered'))
		})

		it('prop finalStepBtn sets button text of final step', async () => {
			vueWrapper = mount(AmeliproStepper, {
				props: {
					...requiredPropValues(),
					items: testHelper.modified('items'),
					value: 2,
				},
			})
			expect(vueWrapper.find('.amelipro-stepper__btn--final').text()).toBe(testHelper.default('finalStepBtn'))
			await vueWrapper.setProps({ finalStepBtn: testHelper.modified('finalStepBtn') })
			expect(vueWrapper.find('.amelipro-stepper__btn--final').text()).toBe(testHelper.modified('finalStepBtn'))
		})

		it('prop hideBackBtn sets visibility of back button', async () => {
			vueWrapper = shallowMount(AmeliproStepper, {
				props: {
					...requiredPropValues(),
					items: testHelper.modified('items'),
					value: 1,
				},
			})
			expect(vueWrapper.find('.amelipro-stepper__btn--previous').exists()).toBe(!testHelper.default('hideBackBtn'))
			await vueWrapper.setProps({ hideBackBtn: testHelper.modified('hideBackBtn') })
			expect(vueWrapper.find('.amelipro-stepper__btn--previous').exists()).toBe(!testHelper.modified('hideBackBtn'))
		})

		it('prop items sets step list', async () => {
			expect(vueWrapper.findAll('.amelipro-stepper__item').length).toBe(testHelper.default('items').length)
			await vueWrapper.setProps({ items: testHelper.modified('items') })
			expect(vueWrapper.findAll('.amelipro-stepper__item').length).toBe(testHelper.modified('items').length)
		})

		it('prop nextBtnLabel sets label of the Next button', async () => {
			vueWrapper = mount(AmeliproStepper, {
				props: {
					...requiredPropValues(),
					items: testHelper.modified('items'),
				},
			})
			expect(vueWrapper.find('.amelipro-stepper__btn--next').text()).toBe(testHelper.default('nextBtnLabel'))
			await vueWrapper.setProps({ nextBtnLabel: testHelper.modified('nextBtnLabel') })
			expect(vueWrapper.find('.amelipro-stepper__btn--next').text()).toBe(testHelper.modified('nextBtnLabel'))
		})

		it('prop noDefaultStyle sets the use of default content class', async () => {
			expect(vueWrapper.find('.amelipro-stepper__content').classes('amelipro-stepper__content--default')).toBe(!testHelper.default('noDefaultStyle'))
			await vueWrapper.setProps({ noDefaultStyle: testHelper.modified('noDefaultStyle') })
			expect(vueWrapper.find('.amelipro-stepper__content').classes('amelipro-stepper__content--default')).toBe(!testHelper.modified('noDefaultStyle'))
		})

		it('prop previousBtnLabel sets label of the Previous button', async () => {
			vueWrapper = mount(AmeliproStepper, {
				props: {
					...requiredPropValues(),
					items: testHelper.modified('items'),
					value: 2,
				},
			})
			expect(vueWrapper.find('.amelipro-stepper__btn--previous').text()).toBe(testHelper.default('previousBtnLabel'))
			await vueWrapper.setProps({ previousBtnLabel: testHelper.modified('previousBtnLabel') })
			expect(vueWrapper.find('.amelipro-stepper__btn--previous').text()).toBe(testHelper.modified('previousBtnLabel'))
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproStepper>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproStepper, {
				props: {
					...requiredPropValues(),
					items: steps(),
				},
			})
		})

		it('emits "next-step" event when next button is clicked', async () => {
			expect(vueWrapper.emitted('next-step')).toBeUndefined()

			await vueWrapper.find('.amelipro-stepper__btn--next').trigger('click')
			expect(vueWrapper.emitted('next-step')).toStrictEqual([[1]])
		})

		it('emits "previous-step" event when previous button is clicked', async () => {
			expect(vueWrapper.emitted('previous-step')).toBeUndefined()

			await vueWrapper.setProps({ value: 1 })
			await vueWrapper.find('.amelipro-stepper__btn--previous').trigger('click')
			expect(vueWrapper.emitted('previous-step')).toStrictEqual([[0]])
		})

		it('emits "change-step" event when a step is clicked', async () => {
			expect(vueWrapper.emitted('change-step')).toBeUndefined()

			await vueWrapper.setProps({ value: 1 })
			expect(vueWrapper.findAllComponents(AmeliproStepBtn).at(0)?.exists()).toBe(true)
			await vueWrapper.findAllComponents(AmeliproStepBtn).at(0)?.find('button').trigger('click')
			expect(vueWrapper.emitted('change-step')).toStrictEqual([[0]])
		})

		it('emits "submit" event when final step is clicked', async () => {
			expect(vueWrapper.emitted('submit')).toBeUndefined()

			await vueWrapper.setProps({ value: 2 })
			await vueWrapper.find('.amelipro-stepper__btn--final').trigger('click')
			expect(vueWrapper.emitted('submit')).toStrictEqual([[]])
		})
	})
})
