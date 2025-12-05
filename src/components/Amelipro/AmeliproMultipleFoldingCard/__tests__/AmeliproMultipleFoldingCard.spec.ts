import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AmeliproMultipleFoldingCard from '../AmeliproMultipleFoldingCard.vue'
import type { AmeliproMultipleFoldingCardItem } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import { type PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const getTabs = (): AmeliproMultipleFoldingCardItem[] => [
	{ id: 'modified-item-id-1', title: 'Modified item title 1' },
	{ id: 'modified-item-id-2', title: 'Modified item title 2' },
	{ id: 'modified-item-id-3', title: 'Modified item title 3' },
	{ id: 'modified-item-id-4', title: 'Modified item title 4' },
	{ id: 'modified-item-id-5', title: 'Modified item title 5' },
]

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

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproMultipleFoldingCard> => ({
	tabs: [],
	title: 'Required title',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproMultipleFoldingCard> => ({
	borderColor: 'ap-red darken-2',
	bordered: false,
	cardColor: 'ap-red',
	defaultItemOpened: 2,
	headerRightWidth: '55px',
	manualValidation: true,
	tabs: getTabs(),
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
	let wrapper: VueWrapper<InstanceType<typeof AmeliproMultipleFoldingCard>>

	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update list of buttons', () => {
		beforeEach(() => {
			wrapper = shallowMount(AmeliproMultipleFoldingCard, { props: requiredPropValues() })
		})

		it('prop tabs sets number of buttons', async () => {
			const btns = () => (wrapper.findAll('.amelipro-card--multi-folding__btn'))
			expect(Array.isArray(btns())).toBe(true)
			expect(btns().length).toBe(0)

			const { tabs } = modifiedPropValues()
			await wrapper.setProps({ tabs })

			expect(Array.isArray(btns())).toBe(true)
			expect(btns().length).toBe(5)
		})
	})

	describe('Setting props should update attributes of inner tags', () => {
		beforeEach(() => {
			wrapper = shallowMount(AmeliproMultipleFoldingCard, { props: requiredPropValues() })
		})

		describe('main div', () => {
			it('props cardColor, borderColor & bordered set style attribute', async () => {
				expect(wrapper.attributes('style')).toBe('background-color: #FFFFFF; border: 1px solid #DDDEDE;')

				const { borderColor, cardColor } = modifiedPropValues()
				await wrapper.setProps({ borderColor, cardColor })
				expect(wrapper.attributes('style')).toBe('background-color: #B33F2E; border: 1px solid #B33F2E;')

				await wrapper.setProps({ bordered: false })
				expect(wrapper.attributes('style')).toBe('background-color: #B33F2E;')
			})
		})

		describe('header', () => {
			const getHeaderWrapper = () => (wrapper.find('.amelipro-card--multi-folding-header > div'))
			it('props borderColor & defaultItemOpened set style attribute', async () => {
				expect(wrapper.props('defaultItemOpened')).toBe(null)
				expect(getHeaderWrapper().exists()).toBe(true)
				expect(getHeaderWrapper().attributes('style')).toBeUndefined()

				await wrapper.setProps({ tabs: testHelper.modified('tabs') })
				const btns = wrapper.findAll('button')
				expect(Array.isArray(btns)).toBe(true)
				expect(btns.length).toBeGreaterThan(0)
				await btns[0]?.trigger('click')
				expect(getHeaderWrapper().attributes('style')).toContain('border-bottom-color: #DDDEDE;')

				const { borderColor } = modifiedPropValues()
				await wrapper.setProps({ borderColor })
				expect(getHeaderWrapper().attributes('style')).toContain('border-bottom-color: #B33F2E;')
			})
		})

		describe('title', () => {
			const getTitleWrapper = () => (wrapper.find('.amelipro-card--multi-folding-header [role="heading"]'))
			it('prop titleLevel sets aria-level attribute', async () => {
				expect(getTitleWrapper().attributes('aria-level')).toBe('2')

				const { titleLevel } = modifiedPropValues()
				await wrapper.setProps({ titleLevel })
				expect(getTitleWrapper().attributes('aria-level')).toBe('1')
			})

			it('prop titleUppercase sets class attribute', async () => {
				expect(getTitleWrapper().attributes('class')).toBe('font-weight-bold text-h3 mb-0')

				const { titleUppercase } = modifiedPropValues()
				await wrapper.setProps({ titleUppercase })
				expect(getTitleWrapper().attributes('class')).toBe('font-weight-bold text-h3 mb-0 text-uppercase')
			})

			it('prop title sets text', async () => {
				expect(getTitleWrapper().text()).toBe('Required title')

				await wrapper.setProps({ title: 'New title' })
				expect(getTitleWrapper().text()).toBe('New title')
			})
		})
	})

	describe('Events', () => {
		const getButtonWrappers = () => (wrapper.findAll('button.amelipro-card--multi-folding__btn'))
		beforeEach(() => {
			wrapper = shallowMount(AmeliproMultipleFoldingCard, { props: { ...requiredPropValues(), tabs: testHelper.modified('tabs') } })
		})

		it('prop tabs sets number of buttons', () => {
			const btns = getButtonWrappers()
			expect(Array.isArray(btns)).toBe(true)
			expect(btns.length).toBe(5)
		})

		it('should react to button event and update attributes', async () => {
			const btns = getButtonWrappers()
			expect(Array.isArray(btns)).toBe(true)
			expect(btns.length).toBeGreaterThan(1)
			expect(wrapper.emitted('tab-clicked')).toBeUndefined()
			if (btns[0]) {
				expect(btns[0].attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn')
				expect(btns[0].attributes('id')).toBe('modified-item-id-1-title')
				expect(btns[0].attributes('aria-controls')).toBe('modified-item-id-1')
				expect(btns[0].attributes('aria-expanded')).toBe('false')
			}
			if (btns[1]) {
				expect(btns[1].attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn')
				expect(btns[1].attributes('id')).toBe('modified-item-id-2-title')
				expect(btns[1].attributes('aria-controls')).toBe('modified-item-id-2')
				expect(btns[1].attributes('aria-expanded')).toBe('false')
			}

			await btns[0]?.trigger('click')
			expect(wrapper.emitted('tab-clicked')).toStrictEqual([['modified-item-id-1']])
			if (btns[0]) {
				expect(btns[0].attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn active-btn')
				expect(btns[0].attributes('aria-expanded')).toBe('true')
			}

			await btns[1]?.trigger('click')
			expect(wrapper.emitted('tab-clicked')).toStrictEqual([['modified-item-id-1'], ['modified-item-id-2']])
			if (btns[0]) {
				expect(btns[0].attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn checked-btn')
				expect(btns[0].attributes('aria-expanded')).toBe('false')
			}
			if (btns[1]) {
				expect(btns[1].attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn active-btn')
				expect(btns[1].attributes('aria-expanded')).toBe('true')
			}

			await btns[0]?.trigger('click')
			expect(wrapper.emitted('tab-clicked')).toStrictEqual([['modified-item-id-1'], ['modified-item-id-2'], ['modified-item-id-1']])
			if (btns[0]) {
				expect(btns[0].attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn active-btn')
				expect(btns[0].attributes('aria-expanded')).toBe('true')
			}
			if (btns[1]) {
				expect(btns[1].attributes('class')).toBe('d-inline-flex align-center amelipro-card--multi-folding__btn classic-btn checked-btn')
				expect(btns[1].attributes('aria-expanded')).toBe('false')
			}
		})
	})

	describe('Slots', () => {
		beforeEach(() => {
			displayWrapper.vm.setSmAndUp(true)
			wrapper = shallowMount(AmeliproMultipleFoldingCard, {
				props: requiredPropValues(),
				slots: { headerRight: '<p>Right slot</p>' },
			})
		})

		afterEach(() => {
			displayWrapper.vm.resetDefaults()
		})

		describe('header left', () => {
			const wrapperFinder = () => (wrapper.find('.amelipro-card--multi-folding-header-left'))

			it('prop headerRightWidth sets style attribute', async () => {
				expect(wrapperFinder().attributes('style')).toBe('display: inline-block; margin-right: 10px;')

				const { headerRightWidth } = modifiedPropValues()
				await wrapper.setProps({ headerRightWidth })
				// *************************************
				// BUG JSDOM !!!
				// Cf : https://github.com/jsdom/jsdom/issues/3538
				// *************************************
				// Les "calc()" ne s'affichent pas dans le DOM de JSDOM si le calc() contient des parenthèses
				// OK sur un vrai navigateur
				// 	- calc(${props.headerRightWidth} - 10px) ==> OK
				// 	- calc(100% - (${props.headerRightWidth} + 10px)) ==> FAIL
				// Fausse le retour des TU

				// Attendu : expect(wrapperFinder().attributes('style')).toBe('display: inline-block; width: calc(100% - (55px + 10px)); margin-right: 10px;');
				expect(wrapperFinder().attributes('style')).toBe('display: inline-block; margin-right: 10px;')

				displayWrapper.vm.setSmAndUp(false)
				await wrapper.vm.$nextTick()
				expect(wrapperFinder().attributes('style')).toBe('display: inline-block; width: 100%;')
			})
		})

		describe('header right', () => {
			const wrapperFinder = () => (wrapper.find('.amelipro-card--multi-folding-header-right'))

			it('prop headerRightWidth sets style attribute', async () => {
				expect(wrapperFinder().attributes('style')).toBe('width: calc(50% - 10px); margin-left: 10px;')

				const { headerRightWidth } = modifiedPropValues()
				await wrapper.setProps({ headerRightWidth })
				expect(wrapperFinder().attributes('style')).toBe('width: calc(55px - 10px); margin-left: 10px;')

				displayWrapper.vm.setSmAndUp(false)
				await wrapper.vm.$nextTick()
				expect(wrapperFinder().attributes('style')).toBe('width: 100%;')
			})
		})
	})
})
