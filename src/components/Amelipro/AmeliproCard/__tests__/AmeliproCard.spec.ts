import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproCard from '../AmeliproCard.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'
// import * as vuetifyDisplay from 'vuetify/lib/framework.mjs' // adapte le chemin si besoin

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproCard> = {
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
	cardTitle: {
		type: String,
		default: undefined,
	},
	classes: {
		type: String,
		default: undefined,
	},
	contentClasses: {
		type: String,
		default: undefined,
	},
	divider: {
		type: Boolean,
		default: true,
	},
	headerRightWidth: {
		type: String,
		default: '50%',
	},
	noCardHeader: {
		type: Boolean,
		default: false,
	},
	rightPart: {
		type: Boolean,
		default: false,
	},
	rightPartClasses: {
		type: String,
		default: undefined,
	},
	rightPartWidth: {
		type: String,
		default: '25%',
	},
	titleColor: {
		type: String,
		default: 'ap-grey-darken-1',
	},
	titleLevel: {
		type: Number,
		default: 2,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproCard> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproCard> => ({
	borderColor: 'ap-red lighten-2',
	bordered: false,
	cardColor: 'ap-red',
	cardTitle: 'Modified card title',
	classes: 'modified-classe-1 modified-classe-2',
	contentClasses: 'modified-content-classe-1 modified-content-classe-2',
	divider: false,
	headerRightWidth: '100px',
	noCardHeader: true,
	rightPart: true,
	rightPartClasses: 'modified-right-part-classe-1 modified-right-part-classe-2',
	rightPartWidth: '50px',
	titleColor: 'ap-yellow-darken-1',
	titleLevel: 1,
	uniqueId: 'modified-unique-id',
})

const displayWrapper = mount(DisplayTestComponent)
const testHelper = new TestHelper(AmeliproCard)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproCard', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})
	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproCard>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproCard, { props: requiredPropValues() })
		})

		describe('root', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe('modified-unique-id-container')
			})

			it('prop classes sets attribute class', async () => {
				expect(vueWrapper.attributes('class')).toBe('amelipro-card w-100 d-flex flex-column flex-md-row')

				const { classes } = modifiedPropValues()
				await vueWrapper.setProps({ classes })
				expect(vueWrapper.attributes('class')).toBe('amelipro-card w-100 d-flex flex-column flex-md-row modified-classe-1 modified-classe-2')
			})

			it('props borderColor, bordered & cardColor set attribute style', async () => {
				expect(vueWrapper.attributes('style')).toBe('background-color: #FFFFFF; border: 1px solid #DDDEDE;')

				const { borderColor, bordered, cardColor } = modifiedPropValues()
				await vueWrapper.setProps({ borderColor })
				expect(vueWrapper.attributes('style')).toBe('background-color: #FFFFFF; border: 1px solid #B33F2E;')

				await vueWrapper.setProps({ bordered })
				expect(vueWrapper.attributes('style')).toBe('background-color: #FFFFFF;')

				await vueWrapper.setProps({ cardColor })
				expect(vueWrapper.attributes('style')).toBe('background-color: #B33F2E;')
			})
		})

		describe('left part', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-card__left-part').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-card__left-part').attributes('id')).toBe('modified-unique-id-left-part')
			})

			it('props rightPart & rightPartWidth set attribute id', async () => {
				expect(vueWrapper.find('.amelipro-card__left-part').attributes('style')).toBe('width: 100%;')

				const { rightPart, rightPartWidth } = modifiedPropValues()
				await vueWrapper.setProps({ rightPart })
				expect(vueWrapper.find('.amelipro-card__left-part').attributes('style')).toBe('width: calc( 100% - 25% ); max-width: calc( 100% - 25% ); min-width: calc( 100% - 25% );')

				await vueWrapper.setProps({ rightPartWidth })
				expect(vueWrapper.find('.amelipro-card__left-part').attributes('style')).toBe('width: calc( 100% - 50px ); max-width: calc( 100% - 50px ); min-width: calc( 100% - 50px );')

				await vueWrapper.setProps({ rightPart: undefined })
				expect(vueWrapper.find('.amelipro-card__left-part').attributes('style')).toBe('width: 100%;')
			})
		})

		describe('header', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-card__header').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-card__header').attributes('id')).toBe('modified-unique-id-header')
			})

			it('props rightPart sets attribute class', async () => {
				expect(vueWrapper.find('.amelipro-card__header').classes('amelipro-card__header--left')).toBe(false)

				const { rightPart } = modifiedPropValues()
				await vueWrapper.setProps({ rightPart })
				expect(vueWrapper.find('.amelipro-card__header').classes('amelipro-card__header--left')).toBe(true)
			})

			it('prop noCardHeader sets tag visibility', async () => {
				expect(vueWrapper.find('.amelipro-card__header').exists()).toBe(true)

				const { noCardHeader } = modifiedPropValues()

				await vueWrapper.setProps({ noCardHeader })
				expect(vueWrapper.find('.amelipro-card__header').exists()).toBe(false)
			})
		})

		describe('header content', () => {
			it('prop divider sets attribute style', async () => {
				expect(vueWrapper.find('.amelipro-card__header-content').attributes('style')).toBe('border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #DDDEDE;')

				const { divider } = modifiedPropValues()
				await vueWrapper.setProps({ divider })
				expect(vueWrapper.find('.amelipro-card__header-content').attributes('style')).toBeUndefined()
			})
		})

		describe('header slot wrapper left', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproCard, {
					props: requiredPropValues(),
					slots: { headerRight: 'Header Right Slot Content' },
				})
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-card__header-slot-wrapper--left').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-card__header-slot-wrapper--left').attributes('id')).toBe('modified-unique-id-header-left-part')
			})

			it.skip('prop headerRightWidth & slot headerRight set attribute style', async () => {
				// TODO: à réparer (problème de propagation mdAndUp ou slot)
				// Par défaut, mdAndUp est false, donc width: 100%
				await displayWrapper.vm.setMdAndUp(false)
				expect(vueWrapper.find('.amelipro-card__header-slot-wrapper--left').attributes('style')).toBe('width: 100%;')

				// Quand mdAndUp passe à true, width doit être en calc(...)
				await displayWrapper.vm.setMdAndUp(true)
				expect(vueWrapper.find('.amelipro-card__header-slot-wrapper--left').attributes('style')).toBe('width: calc(100% - (50% + 10px)); margin-right: 10px;')

				// Si on change la prop headerRightWidth, le style doit s'adapter
				const { headerRightWidth } = modifiedPropValues()
				await vueWrapper.setProps({ headerRightWidth })
				expect(vueWrapper.find('.amelipro-card__header-slot-wrapper--left').attributes('style')).toBe('width: calc(100% - (100px + 10px)); margin-right: 10px;')
			})
		})

		describe('title', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproCard, {
					props: requiredPropValues(),
					slots: { headerRight: 'Header Right Slot Content' },
				})
			})

			it('prop cardTitle sets title visiblity', async () => {
				expect(vueWrapper.find('.amelipro-card__title').exists()).toBe(false)

				const { cardTitle } = modifiedPropValues()
				await vueWrapper.setProps({ cardTitle })
				expect(vueWrapper.find('.amelipro-card__title').exists()).toBe(true)
			})

			it('prop uniqueId sets attribute id', async () => {
				const { cardTitle, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ cardTitle })

				expect(vueWrapper.find('.amelipro-card__title').attributes('id')).toBeUndefined()

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-card__title').attributes('id')).toBe('modified-unique-id-title')
			})

			it('prop titleColor sets attribute style', async () => {
				const { cardTitle, titleColor } = modifiedPropValues()
				await vueWrapper.setProps({ cardTitle })

				expect(vueWrapper.find('.amelipro-card__title').attributes('style')).toBe('color: #1A1B1B;')

				await vueWrapper.setProps({ titleColor })
				expect(vueWrapper.find('.amelipro-card__title').attributes('style')).toBe('color: #D8A120;')
			})

			it('prop titleLevel sets attribute aria-level', async () => {
				const { cardTitle, titleLevel } = modifiedPropValues()
				await vueWrapper.setProps({ cardTitle })

				expect(vueWrapper.find('.amelipro-card__title').attributes('aria-level')).toBe('2')

				await vueWrapper.setProps({ titleLevel })
				expect(vueWrapper.find('.amelipro-card__title').attributes('aria-level')).toBe('1')
			})
		})

		describe('header slot wrapper right', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproCard, {
					props: requiredPropValues(),
					slots: { headerRight: 'Header Right Slot Content' },
				})
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-card__header__slot-wrapper--right').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-card__header__slot-wrapper--right').attributes('id')).toBe('modified-unique-id-header-right-part')
			})

			it.skip('prop headerRightWidth & slot headerRight set attribute style', async () => {
				// TODO: à réparer (problème de propagation mdAndUp ou slot)
				await displayWrapper.vm.setMdAndUp(false)
				expect(vueWrapper.find('.amelipro-card__header__slot-wrapper--right').attributes('style')).toBe('width: 100%;')

				await displayWrapper.vm.setMdAndUp(true)
				expect(vueWrapper.find('.amelipro-card__header__slot-wrapper--right').attributes('style')).toBe('width: calc(50% - 10px); margin-left: 10px;')

				const { headerRightWidth } = modifiedPropValues()
				await vueWrapper.setProps({ headerRightWidth })
				expect(vueWrapper.find('.amelipro-card__header__slot-wrapper--right').attributes('style')).toBe('width: calc(90px); margin-left: 10px;')
			})
		})

		describe('content', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-card__content').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-card__content').attributes('id')).toBe('modified-unique-id-content')
			})

			it('props contentClasses & rightPart set attribute class', async () => {
				expect(vueWrapper.find('.amelipro-card__content').attributes('class')).toBe('amelipro-card__content')

				const { contentClasses, rightPart } = modifiedPropValues()
				await vueWrapper.setProps({ rightPart })
				expect(vueWrapper.find('.amelipro-card__content').classes('amelipro-card__content--left')).toBe(true)

				await vueWrapper.setProps({ contentClasses })
				expect(vueWrapper.find('.amelipro-card__content').classes('amelipro-card__content--left')).toBe(true)
				expect(vueWrapper.find('.amelipro-card__content').classes('modified-content-classe-1')).toBe(true)
				expect(vueWrapper.find('.amelipro-card__content').classes('modified-content-classe-2')).toBe(true)

				await vueWrapper.setProps({ rightPart: false })
				expect(vueWrapper.find('.amelipro-card__content').classes('amelipro-card__content--left')).toBe(false)
				expect(vueWrapper.find('.amelipro-card__content').classes('modified-content-classe-1')).toBe(true)
				expect(vueWrapper.find('.amelipro-card__content').classes('modified-content-classe-2')).toBe(true)
			})
		})

		describe('right part', () => {
			it('prop cardTitle sets right part visiblity', async () => {
				expect(vueWrapper.find('.amelipro-card__right-part').exists()).toBe(false)

				const { rightPart } = modifiedPropValues()
				await vueWrapper.setProps({ rightPart })
				expect(vueWrapper.find('.amelipro-card__right-part').exists()).toBe(true)
			})

			it('prop uniqueId sets attribute id', async () => {
				const { rightPart, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ rightPart })

				expect(vueWrapper.find('.amelipro-card__right-part').attributes('id')).toBeUndefined()

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-card__right-part').attributes('id')).toBe('modified-unique-id-right-part')
			})

			it('props rightPart & rightPartWidth set attribute style', async () => {
				const { rightPart, rightPartWidth } = modifiedPropValues()
				await vueWrapper.setProps({ rightPart })

				expect(vueWrapper.find('.amelipro-card__right-part').attributes('style')).toBe('max-width: 25%; min-width: 25%; width: 25%;')

				await vueWrapper.setProps({ rightPartWidth })
				expect(vueWrapper.find('.amelipro-card__right-part').attributes('style')).toBe('max-width: 50px; min-width: 50px; width: 50px;')
			})
		})
	})

	describe('Slots', () => {
		it('displays headerRight slot content when hasRightSlot is true', async () => {
			const wrapper = mount(AmeliproCard, {
				props: requiredPropValues(),
				slots: { headerRight: '<div id="header-right-slot-content">Header Right Slot Content</div>' },
			})

			const slotContent = await wrapper.find('#header-right-slot-content')
			expect(slotContent.text()).toBe('Header Right Slot Content')
		})

		it('displays right part content when rightPart prop is true', async () => {
			const rightPartContent = 'This is the right part content.'

			const wrapper = mount(AmeliproCard, {
				props: { ...requiredPropValues(), rightPart: true },
				slots: { rightPartContent },
			})

			// await wrapper.setProps({ rightPart: true });
			const rightPartElement = await wrapper.find('.amelipro-card__right-part')
			expect(rightPartElement.text()).toBe(rightPartContent)
		})
	})
})
