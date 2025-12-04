import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { AmeliproIcon } from '@/components'
import type { AmeliproIllustratedDataInfoTypes } from '../types'
import AmeliproIllustratedDataTile from '../AmeliproIllustratedDataTile.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproIllustratedDataTile> = {
	complementaryInformation: {
		type: Array as PropType<AmeliproIllustratedDataInfoTypes[]>,
		default: () => [],
	},
	iconName: {
		type: String,
		default: undefined,
	},
	imgSrc: {
		type: String,
		default: undefined,
	},
	labelFirstLine: {
		type: String,
		required: true,
	},
	labelSecondLine: {
		type: String,
		required: true,
	},
	tileInfoColor: {
		type: String,
		default: 'ap-grey-darken-1',
	},
	tileMinHeight: {
		type: String,
		default: undefined,
	},
	tilePadding: {
		type: String,
		default: '2rem 1rem',
	},
	tileWidth: {
		type: String,
		default: '100%',
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

const complementaryInformationDatas = (): AmeliproIllustratedDataInfoTypes[] => ([
	{
		label: 'Complementary information label 1',
		value: 'complementary-information-value-1',
	},
	{ label: 'Complementary information label 2' },
])

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproIllustratedDataTile> => ({
	labelFirstLine: 'Required label first line',
	labelSecondLine: 'Required label second line',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproIllustratedDataTile> => ({
	complementaryInformation: complementaryInformationDatas(),
	iconName: 'plus',
	imgSrc: 'modified-img-src',
	labelFirstLine: 'Modified label first line',
	labelSecondLine: 'Modified label second line',
	tileInfoColor: 'ap-white',
	tileMinHeight: '300px',
	tilePadding: '20px',
	tileWidth: '250px',
	titleLevel: 3,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproIllustratedDataTile)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproIllustratedDataTile', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIllustratedDataTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
		})

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})

			it('props tileWidth & tileMinHeight set attribute style', async () => {
				expect(vueWrapper.attributes('style')).toBe(`width: ${testHelper.default('tileWidth')};`)

				const { tileWidth, tileMinHeight } = modifiedPropValues()
				await vueWrapper.setProps({ tileWidth, tileMinHeight })
				expect(vueWrapper.attributes('style')).toBe(`width: ${testHelper.modified('tileWidth')}; min-height: ${testHelper.modified('tileMinHeight')};`)
			})
		})

		describe('wrapper', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop tilePadding sets attribute style', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__wrapper').attributes('style')).toBe('border: 2px solid #EEEEEE !important; padding: 2rem 1rem;')

				const { tilePadding } = modifiedPropValues()
				await vueWrapper.setProps({ tilePadding })
				expect(vueWrapper.find('.illustrated-data-tile__wrapper').attributes('style')).toBe('border: 2px solid #EEEEEE !important; padding: 20px;')
			})
		})

		describe('img', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop imgSrc sets img visibility', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__img').exists()).toBe(false)

				const { imgSrc } = modifiedPropValues()
				await vueWrapper.setProps({ imgSrc })
				expect(vueWrapper.find('.illustrated-data-tile__img').exists()).toBe(true)
			})

			it('prop uniqueId sets attribute id', async () => {
				const { imgSrc, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ imgSrc })
				expect(vueWrapper.find('.illustrated-data-tile__img').attributes('id')).toBe(testHelper.default('uniqueId'))

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.illustrated-data-tile__img').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-img`)
			})

			it('prop imgSrc sets attribute src', async () => {
				const { imgSrc } = modifiedPropValues()
				await vueWrapper.setProps({ imgSrc })
				expect(vueWrapper.find('.illustrated-data-tile__img').attributes('src')).toBe(testHelper.modified('imgSrc'))

				await vueWrapper.setProps({ imgSrc: '#imgSrc' })
				expect(vueWrapper.find('.illustrated-data-tile__img').attributes('src')).toBe('#imgSrc')
			})
		})

		describe('label', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__label').attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.illustrated-data-tile__label').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-label`)
			})

			it('prop titleLevel sets attribute heading-level', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__label').attributes('aria-level')).toBe(`${testHelper.default('titleLevel')}`)

				const { titleLevel } = modifiedPropValues()
				await vueWrapper.setProps({ titleLevel })
				expect(vueWrapper.find('.illustrated-data-tile__label').attributes('aria-level')).toBe(`${testHelper.modified('titleLevel')}`)
			})
		})

		describe('label line 1', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__label-line-1').attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.illustrated-data-tile__label-line-1').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-label-line-1`)
			})

			it('prop labelFirstLine set label line 1 content', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__label-line-1').text()).toBe(testHelper.default('labelFirstLine'))

				const { labelFirstLine } = modifiedPropValues()
				await vueWrapper.setProps({ labelFirstLine })
				expect(vueWrapper.find('.illustrated-data-tile__label-line-1').text()).toBe(testHelper.modified('labelFirstLine'))
			})
		})

		describe('label line 2', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__label-line-2').attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.illustrated-data-tile__label-line-2').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-label-line-2`)
			})

			it('prop labelSecondLine set label line 2 content', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__label-line-2').text()).toBe(testHelper.default('labelSecondLine'))

				const { labelSecondLine } = modifiedPropValues()
				await vueWrapper.setProps({ labelSecondLine })
				expect(vueWrapper.find('.illustrated-data-tile__label-line-2').text()).toBe(testHelper.modified('labelSecondLine'))
			})
		})

		describe('complementary info', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.illustrated-data-tile__info').attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.illustrated-data-tile__info').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-complementary-info`)
			})
		})

		describe('complementary info > span', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop complementaryInformation sets complementary info content', async () => {
				expect(vueWrapper.findAll('.illustrated-data-tile__info > span').length).toBe(0)

				const { complementaryInformation } = modifiedPropValues()
				await vueWrapper.setProps({ complementaryInformation })
				expect(vueWrapper.findAll('.illustrated-data-tile__info > span').length).toBe(2)

				expect(vueWrapper.findAll('.illustrated-data-tile__info > span').at(0)?.text()).toBe('Complementary information label 1 complementary-information-value-1')
				expect(vueWrapper.findAll('.illustrated-data-tile__info > span').at(1)?.text()).toBe('Complementary information label 2')
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIllustratedDataTile>>

		describe('AmeliproIcon', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedDataTile, { props: requiredPropValues() })
			})

			it('prop imgSrc & iconName sets icon visibility', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).exists()).toBe(false)

				const { iconName, imgSrc } = modifiedPropValues()
				await vueWrapper.setProps({ iconName })
				expect(vueWrapper.findComponent(AmeliproIcon).exists()).toBe(true)

				await vueWrapper.setProps({ imgSrc })
				expect(vueWrapper.findComponent(AmeliproIcon).exists()).toBe(false)
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				const { iconName, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ iconName })
				expect(vueWrapper.findComponent(AmeliproIcon).props('uniqueId')).toBeUndefined()

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproIcon).props('uniqueId')).toBe('modified-unique-id-icon')
			})

			it('prop iconName sets prop icon', async () => {
				const { iconName } = modifiedPropValues()
				await vueWrapper.setProps({ iconName })
				expect(vueWrapper.findComponent(AmeliproIcon).props('icon')).toBe('plus')

				await vueWrapper.setProps({ iconName: 'new-icon-name' })
				expect(vueWrapper.findComponent(AmeliproIcon).props('icon')).toBe('new-icon-name')
			})

			it('prop tileInfoColor sets prop iconColor', async () => {
				const { iconName, tileInfoColor } = modifiedPropValues()
				await vueWrapper.setProps({ iconName })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('ap-grey-darken-1')

				await vueWrapper.setProps({ tileInfoColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('ap-white')
			})
		})
	})
})
