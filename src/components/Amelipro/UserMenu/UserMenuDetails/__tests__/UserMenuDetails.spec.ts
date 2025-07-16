import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import UserMenuDetails from '../UserMenuDetails.vue'
import type { UserMenuDetailsInfos } from '../types'

const expectedPropOptions: ExpectedPropOptions<typeof UserMenuDetails> = {
	uniqueId: {
		type: String,
		default: undefined,
	},
	userMenuDetailsInfos: {
		type: Object as PropType<UserMenuDetailsInfos>,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof UserMenuDetails> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof UserMenuDetails> => ({
	uniqueId: 'modified-unique-id',
	userMenuDetailsInfos: {
		adeli: 'modified-adeli',
		adresse: {
			codePostal: '75001',
			commune: 'Paris',
			complement: 'bis',
			nom: 'de la Paix',
			numero: '12',
			type: 'rue',
		},
		am: 'modified-am',
		denomination: 'Modified denomination',
		email: 'modified-email@test.fr',
		finess: 'modified-finess',
		profil: 'Modified profil',
		rpps: 'modified-rpps',
		userName: 'Modified user name',
	},
})

const testHelper = new TestHelper(UserMenuDetails)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('UserMenuDetails', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof UserMenuDetails>>
		beforeEach(() => {
			vueWrapper = shallowMount(UserMenuDetails, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on root container', async () => {
			expect(vueWrapper.find('.user-menu-details').exists()).toBe(false)
			await vueWrapper.setProps({ userMenuDetailsInfos: modifiedPropValues().userMenuDetailsInfos })
			expect(vueWrapper.find('.user-menu-details').exists()).toBe(true)

			expect(vueWrapper.find('.user-menu-details').attributes('id')).toBe(testHelper.default('uniqueId'))
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
			expect(vueWrapper.find('.user-menu-details').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})

		it('prop uniqueId sets id attribute on userName', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-user-name`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-user-name`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-user-name`).text()).toBe(testHelper.modified('userMenuDetailsInfos').userName)
		})

		it('prop uniqueId sets id attribute on profil', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-profile`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-profile`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-profile`).text()).toBe(testHelper.modified('userMenuDetailsInfos').profil)
		})

		it('prop uniqueId sets id attribute on denomination', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-denomination`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-denomination`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-denomination`).text()).toBe(testHelper.modified('userMenuDetailsInfos').denomination)
		})

		it('prop uniqueId sets id attribute on rpps', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-rpps`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-rpps`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-rpps`).text()).toContain(testHelper.modified('userMenuDetailsInfos').rpps)
		})

		it('prop uniqueId sets id attribute on adeli', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-adeli`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-adeli`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-adeli`).text()).toContain(testHelper.modified('userMenuDetailsInfos').adeli)
		})

		it('prop uniqueId sets id attribute on am', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-am`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-am`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-am`).text()).toContain(testHelper.modified('userMenuDetailsInfos').am)
		})

		it('prop uniqueId sets id attribute on finess', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-finess`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-finess`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-finess`).text()).toContain(testHelper.modified('userMenuDetailsInfos').finess)
		})

		it('prop uniqueId sets id attribute on email', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-email`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-email`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-email`).text()).toBe(testHelper.modified('userMenuDetailsInfos').email)
		})

		it('prop uniqueId sets id attribute on address-line-1', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-address-line-1`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-address-line-1`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-address-line-1`).text()).toContain(`12
				bis
				rue
				de la Paix`)
		})

		it('prop uniqueId sets id attribute on address-line-2', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-address-line-2`).exists()).toBe(false)
			await vueWrapper.setProps(modifiedPropValues())
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-address-line-2`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-address-line-2`).text()).toContain('75001 Paris')
		})
	})
})
