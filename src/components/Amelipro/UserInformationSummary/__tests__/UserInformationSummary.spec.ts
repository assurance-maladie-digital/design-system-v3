import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import UserInformationSummary from '../UserInformationSummary.vue'
import type { UserInformationSummaryInfos } from '../types'

const expectedPropOptions: ExpectedPropOptions<typeof UserInformationSummary> = {
	uniqueId: {
		type: String,
		default: undefined,
	},
	userInformationSummaryInfos: {
		type: Object as PropType<UserInformationSummaryInfos>,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof UserInformationSummary> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof UserInformationSummary> => ({
	uniqueId: 'modified-unique-id',
	userInformationSummaryInfos: {
		adresseLigne1: 'modified-address-line-1',
		adresseLigne2: 'modified-address-line-2',
		categorieSpecialite: 'Modified specialty',
		denomination: 'Modified denomination',
		nomCabinet: 'Modified office',
		userName: 'Modified user name',
	} as UserInformationSummaryInfos,
})

const testHelper = new TestHelper(UserInformationSummary)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('UserInformationSummary', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof UserInformationSummary>>
		beforeEach(() => {
			vueWrapper = shallowMount(UserInformationSummary, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on root container', async () => {
			expect(vueWrapper.find('.user-information-summary').exists()).toBe(false)
			await vueWrapper.setProps({ userInformationSummaryInfos: modifiedPropValues().userInformationSummaryInfos })
			expect(vueWrapper.find('.user-information-summary').exists()).toBe(true)

			expect(vueWrapper.find('.user-information-summary').attributes('id')).toBe(testHelper.default('uniqueId'))
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
			expect(vueWrapper.find('.user-information-summary').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})

		it('prop uniqueId sets id attribute on userName', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-user-name`).exists()).toBe(false)
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId'), userInformationSummaryInfos: modifiedPropValues().userInformationSummaryInfos })
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-user-name`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-user-name`).text()).toBe(testHelper.modified('userInformationSummaryInfos').userName)
		})

		it('prop uniqueId sets id attribute on denomination', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-denomination`).exists()).toBe(false)
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId'), userInformationSummaryInfos: modifiedPropValues().userInformationSummaryInfos })
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-denomination`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-denomination`).text()).toBe(testHelper.modified('userInformationSummaryInfos').denomination)
		})

		it('prop uniqueId sets id attribute on specialty', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-specialty`).exists()).toBe(false)
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId'), userInformationSummaryInfos: modifiedPropValues().userInformationSummaryInfos })
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-specialty`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-specialty`).text()).toBe(testHelper.modified('userInformationSummaryInfos').categorieSpecialite)
		})

		it('prop uniqueId sets id attribute on office', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-office`).exists()).toBe(false)
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId'), userInformationSummaryInfos: modifiedPropValues().userInformationSummaryInfos })
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-office`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-office`).text()).toBe(testHelper.modified('userInformationSummaryInfos').nomCabinet)
		})

		it('prop uniqueId sets id attribute on address-line-1', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-address-line-1`).exists()).toBe(false)
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId'), userInformationSummaryInfos: modifiedPropValues().userInformationSummaryInfos })
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-address-line-1`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-address-line-1`).text()).toBe(testHelper.modified('userInformationSummaryInfos').adresseLigne1)
		})

		it('prop uniqueId sets id attribute on address-line-2', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-address-line-2`).exists()).toBe(false)
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId'), userInformationSummaryInfos: modifiedPropValues().userInformationSummaryInfos })
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-address-line-2`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-address-line-2`).text()).toBe(testHelper.modified('userInformationSummaryInfos').adresseLigne2)
		})
	})

	describe('Other', () => {
		it('does not render missing fields', () => {
			// Teste que les champs non présents dans userInformationSummaryInfos ne sont pas rendus
			const wrapper2 = shallowMount(UserInformationSummary, {
				props: {
					uniqueId: 'unique-id',
					userInformationSummaryInfos: {
						userName: 'Test User',
						// pas de denomination, pas de categorieSpecialite, etc.
					},
				},
			})
			expect(wrapper2.find('#unique-id-denomination').exists()).toBe(false)
			expect(wrapper2.find('#unique-id-specialty').exists()).toBe(false)
			expect(wrapper2.find('#unique-id-office').exists()).toBe(false)
			expect(wrapper2.find('#unique-id-address-line-1').exists()).toBe(false)
			expect(wrapper2.find('#unique-id-address-line-2').exists()).toBe(false)
		})

		it('renders profil if present', () => {
			const wrapper3 = shallowMount(UserInformationSummary, {
				props: {
					uniqueId: 'unique-id',
					userInformationSummaryInfos: { profil: 'Modified profil' },
				},
			})
			expect(wrapper3.find('#unique-id-profil').exists()).toBe(true)
			expect(wrapper3.find('#unique-id-profil').text()).toBe('Modified profil')
		})
	})
})
