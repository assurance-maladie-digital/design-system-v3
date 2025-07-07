import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AmeliproMultipleFoldingCard from '../AmeliproMultipleFoldingCard.vue'
import type { AmeliproMultipleFoldingCardItem } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import { type PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import { DisplayTestComponent } from '@tests/helpers/utils'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproMultipleFoldingCard> = {
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
	defaultItemOpened: {
		type: [Number, null] as PropType<number | null>,
		default: null,
	},
	headerRightWidth: {
		type: String,
		default: '50%',
	},
	manualValidation: {
		type: Boolean,
		default: false,
	},
	tabs: {
		type: Array as PropType<AmeliproMultipleFoldingCardItem[]>,
		required: true,
	},
	title: {
		type: String,
		required: true,
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
		default: undefined,
	},
}

// Valeurs pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproMultipleFoldingCard> => ({
	tabs: [],
	title: 'Required title',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproMultipleFoldingCard> => ({
	borderColor: 'ap-blue',
	bordered: false,
	cardColor: 'ap-red',
	defaultItemOpened: 2,
	headerRightWidth: '55px', // conforme : valeur CSS valide pour une largeur
	manualValidation: true,
	tabs: [
		{ id: 'modified-item-id-1', title: 'Modified item title 1' },
		{ id: 'modified-item-id-2', title: 'Modified item title 2' },
		{ id: 'modified-item-id-3', title: 'Modified item title 3' },
		{ id: 'modified-item-id-4', title: 'Modified item title 4' },
		{ id: 'modified-item-id-5', title: 'Modified item title 5' },
	],
	title: 'Modified title',
	titleLevel: 1,
	titleUppercase: true,
	uniqueId: 'modified-unique-id',
})

const displayWrapper = mount(DisplayTestComponent)
const testHelper = new TestHelper(AmeliproMultipleFoldingCard)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproMultipleFoldingCard', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update list of buttons', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMultipleFoldingCard>>
		const getButtonWrappers = () => (vueWrapper.findAll('.amelipro-card--multi-folding-header button'))

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMultipleFoldingCard, { props: requiredPropValues() })
		})

		it('should return no button', () => {
			expect(getButtonWrappers().length).toBe(0)
		})
		it('should return 5 buttons', async () => {
			await vueWrapper.setProps({ tabs: testHelper.modified('tabs') })
			expect(getButtonWrappers().length).toBe(testHelper.modified('tabs').length)
		})
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMultipleFoldingCard>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMultipleFoldingCard, { props: requiredPropValues() })
		})

		describe('main div', () => {
			it('props cardColor, borderColor & bordered sets attribute style', async () => {
				expect(vueWrapper.attributes('style')).toBe('background-color: #FFFFFF; border: 1px solid #DDDEDE;')

				const { borderColor, cardColor } = modifiedPropValues()
				await vueWrapper.setProps({ borderColor, cardColor })
				expect(vueWrapper.attributes('style')).toBe('background-color: #B33F2E; border: 1px solid #0C419A;')

				await vueWrapper.setProps({ bordered: false })
				expect(vueWrapper.attributes('style')).toBe('background-color: #B33F2E;')
			})
		})

		describe('header', () => {
			const getHeaderWrapper = () => (vueWrapper.find('.amelipro-card--multi-folding-header > div'))
			it('prop borderColor & defaultItemOpened sets attribute style', async () => {
				expect(vueWrapper.props('defaultItemOpened')).toBe(null)
				expect(getHeaderWrapper().exists()).toBe(true)
				expect(getHeaderWrapper().attributes('style')).toBeUndefined()

				// Requiert des boutons à cliquer, donc des tabs
				await vueWrapper.setProps({ tabs: testHelper.modified('tabs') })
				await vueWrapper.findAll('button').at(0)?.trigger('click')
				expect(getHeaderWrapper().attributes('style')).toContain('border-bottom-color: #DDDEDE;')

				const { borderColor } = modifiedPropValues()
				await vueWrapper.setProps({ borderColor })
				expect(getHeaderWrapper().attributes('style')).toContain('border-bottom-color: #0C419A;')
			})
		})

		describe('title', () => {
			const getTitleWrapper = () => (vueWrapper.find('.amelipro-card--multi-folding-header [role="heading"]'))
			it('prop titleLevel sets attribute aria-level', async () => {
				expect(getTitleWrapper().attributes('aria-level')).toBe('2')

				const { titleLevel } = modifiedPropValues()
				await vueWrapper.setProps({ titleLevel })
				expect(getTitleWrapper().attributes('aria-level')).toBe('1')
			})

			it('prop titleUppercase sets attribute class', async () => {
				expect(getTitleWrapper().attributes('class')).toBe('font-weight-semibold text-h3 mb-0')

				const { titleUppercase } = modifiedPropValues()
				await vueWrapper.setProps({ titleUppercase })
				expect(getTitleWrapper().attributes('class')).toBe('font-weight-semibold text-h3 mb-0 text-uppercase')
			})

			it('prop title sets text', async () => {
				expect(getTitleWrapper().text()).toBe('Required title')

				await vueWrapper.setProps({ title: 'New title' })
				expect(getTitleWrapper().text()).toBe('New title')
			})
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMultipleFoldingCard>>
		const getButtonWrappers = () => (vueWrapper.findAll('.amelipro-card--multi-folding-header button'))

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMultipleFoldingCard, { props: { ...requiredPropValues(), tabs: testHelper.modified('tabs') } })
		})

		it('should test the buttons vueWrapper', () => {
			expect(getButtonWrappers().length).toBe(testHelper.modified('tabs').length)
		})

		it('should react to button event', async () => {
			expect(vueWrapper.emitted('tab-clicked')).toBeUndefined()
			expect(getButtonWrappers().at(0)?.attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn')
			expect(getButtonWrappers().at(0)?.attributes('id')).toBe(`${testHelper.modified('tabs')[0].id}-title`)
			expect(getButtonWrappers().at(0)?.attributes('aria-controls')).toBe(testHelper.modified('tabs')[0].id)
			expect(getButtonWrappers().at(0)?.attributes('aria-expanded')).toBe('false')

			expect(getButtonWrappers().at(1)?.attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn')
			expect(getButtonWrappers().at(1)?.attributes('id')).toBe(`${testHelper.modified('tabs')[1].id}-title`)
			expect(getButtonWrappers().at(1)?.attributes('aria-controls')).toBe(testHelper.modified('tabs')[1].id)
			expect(getButtonWrappers().at(1)?.attributes('aria-expanded')).toBe('false')

			await getButtonWrappers().at(0)?.trigger('click')
			expect(vueWrapper.emitted('tab-clicked')).toStrictEqual([[testHelper.modified('tabs')[0].id]])
			expect(getButtonWrappers().at(0)?.attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn active-btn')
			expect(getButtonWrappers().at(0)?.attributes('aria-expanded')).toBe('true')

			await getButtonWrappers().at(1)?.trigger('click')
			expect(vueWrapper.emitted('tab-clicked')).toStrictEqual([[testHelper.modified('tabs')[0].id], [testHelper.modified('tabs')[1].id]])
			expect(getButtonWrappers().at(0)?.attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn checked-btn')
			expect(getButtonWrappers().at(0)?.attributes('aria-expanded')).toBe('false')
			expect(getButtonWrappers().at(1)?.attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn active-btn')
			expect(getButtonWrappers().at(1)?.attributes('aria-expanded')).toBe('true')

			await getButtonWrappers().at(0)?.trigger('click')
			expect(vueWrapper.emitted('tab-clicked')).toStrictEqual([[testHelper.modified('tabs')[0].id], [testHelper.modified('tabs')[1].id], [testHelper.modified('tabs')[0].id]])
			expect(getButtonWrappers().at(0)?.attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn active-btn')
			expect(getButtonWrappers().at(0)?.attributes('aria-expanded')).toBe('true')
			expect(getButtonWrappers().at(1)?.attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn checked-btn')
			expect(getButtonWrappers().at(1)?.attributes('aria-expanded')).toBe('false')
		})
	})

	describe('Slots', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMultipleFoldingCard>>

		beforeEach(() => {
			displayWrapper.vm.setSmAndUp(true)
			vueWrapper = shallowMount(AmeliproMultipleFoldingCard, {
				props: requiredPropValues(),
				slots: { headerRight: '<p>Right slot</p>' },
			})
		})

		afterEach(() => {
			displayWrapper.vm.resetDefaults()
		})

		describe('header left', () => {
			const wrapperFinder = () => (vueWrapper.find('.amelipro-card--multi-folding-header-left'))

			it.skip('prop headerRightWidth sets attribute style', async () => {
				expect(displayWrapper.vm.smAndUp).toBe(true)
				// TODO: à réparer (problème de propagation smAndUp ?)
				expect(wrapperFinder().attributes('style')).toBe('display: inline-block; width: calc(100% - (50% + 10px)); margin-right: 10px;')

				const { headerRightWidth } = modifiedPropValues()
				await vueWrapper.setProps({ headerRightWidth })
				expect(wrapperFinder().attributes('style')).toBe('display: inline-block; width: calc(100% - (55px + 10px)); margin-right: 10px;')

				displayWrapper.vm.setSmAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(wrapperFinder().attributes('style')).toBe('display: inline-block; width: 100%;')
			})
		})

		describe('header right', () => {
			const wrapperFinder = () => (vueWrapper.find('.amelipro-card--multi-folding-header-right'))

			it('prop headerRightWidth sets attribute style', async () => {
				expect(wrapperFinder().attributes('style')).toBe('width: calc(50% - 10px); margin-left: 10px;')

				const { headerRightWidth } = modifiedPropValues()
				await vueWrapper.setProps({ headerRightWidth })
				expect(wrapperFinder().attributes('style')).toBe('width: calc(55px - 10px); margin-left: 10px;')

				displayWrapper.vm.setSmAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(wrapperFinder().attributes('style')).toBe('width: 100%;')
			})
		})
	})
})
