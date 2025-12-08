import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AmeliproPatientBanner from '../AmeliproPatientBanner.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproPatientBanner> = {
	birthName: {
		type: String,
		default: undefined,
	},
	birthdate: {
		type: String,
		default: undefined,
	},
	moreInformationHref: {
		type: String,
		default: undefined,
	},
	moreInformationTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	name: {
		type: String,
		default: undefined,
	},
	noMoreInformation: {
		type: Boolean,
		default: false,
	},
	noPatientChange: {
		type: Boolean,
		default: false,
	},
	patientDoctorInfos: {
		type: String,
		default: undefined,
	},
	patientNir: {
		type: String,
		default: undefined,
	},
	patientOrganism: {
		type: String,
		default: undefined,
	},
	patientStatus: {
		type: String,
		default: undefined,
	},
	patientSystem: {
		type: String,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproPatientBanner> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproPatientBanner> => ({
	birthName: 'Modified birth name',
	birthdate: 'Modified birthdate',
	moreInformationHref: 'modified-more-information-href',
	moreInformationTo: 'modified-more-information-to',
	name: 'Modified name',
	noMoreInformation: true,
	noPatientChange: true,
	patientDoctorInfos: 'Modified doctor infos',
	patientNir: 'Modified XXXXXXXXX',
	patientOrganism: 'Modified organism',
	patientStatus: 'Modified status',
	patientSystem: 'Modified system',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproPatientBanner)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproPatientBanner', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	const displayWrapper = mount(DisplayTestComponent)

	describe('Setting props should update inner attribute and tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPatientBanner>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPatientBanner, { props: requiredPropValues() })
		})

		describe('Root tag', () => {
			it('prop uniqueId sets attribute id', async () => {
				// root container
				expect(vueWrapper.attributes('id')).toBeUndefined()
				await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
				expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})
		})

		describe('Content tag', () => {
			it('prop uniqueId sets attribute id', async () => {
				// wrapper
				expect(vueWrapper.find('.amelipro-patient-banner__content').attributes('id')).toBeUndefined()
				await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
				expect(vueWrapper.find('.amelipro-patient-banner__content').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-wrapper`)
			})
		})

		describe('Patien info tag', () => {
			it('prop name sets patient name', async () => {
				expect(vueWrapper.find('.amelipro-patient-banner__patient-info__name .text-h3').text()).toBe('')
				await vueWrapper.setProps({ name: testHelper.modified('name') })
				expect(vueWrapper.find('.amelipro-patient-banner__patient-info__name .text-h3').text()).toBe(testHelper.modified('name'))
			})

			it('prop birthName sets birth name span', async () => {
				expect(vueWrapper.find('.amelipro-patient-banner__patient-info__name').findAll('span').length).toBe(1)
				await vueWrapper.setProps({ birthName: testHelper.modified('birthName') })
				expect(vueWrapper.find('.amelipro-patient-banner__patient-info__name').findAll('span').length).toBe(2)
			})

			it('prop patientDoctorInfos sets doctor infos', async () => {
				expect(vueWrapper.find('.amelipro-patient-banner__patient-info__doctor').text()).toBe('')
				await vueWrapper.setProps({ patientDoctorInfos: testHelper.modified('patientDoctorInfos') })
				expect(vueWrapper.find('.amelipro-patient-banner__patient-info__doctor').text()).toBe(testHelper.modified('patientDoctorInfos'))
			})
		})
	})

	describe('Computed', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPatientBanner>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPatientBanner, { props: requiredPropValues() })
		})

		afterEach(() => {
			displayWrapper.vm.resetDefaults()
		})

		it('Test innerWidth', async () => {
			expect(vueWrapper.find('.amelipro-patient-banner__content').attributes('style')).toStrictEqual('width: 100%;')

			displayWrapper.vm.setWidth(1172)
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('.amelipro-patient-banner__content').attributes('style')).toStrictEqual('width: 980px;')
		})

		it('Test hasBirthName', async () => {
			expect(vueWrapper.find('.amelipro-patient-banner__patient-info__name').findAll('span').length).toBe(1)

			const { birthName } = modifiedPropValues()
			await vueWrapper.setProps({ birthName })
			expect(vueWrapper.find('.amelipro-patient-banner__patient-info__name').findAll('span').length).toBe(2)
		})

		it('Test main content classes', async () => {
			await vueWrapper.setProps({ noMoreInformation: false })
			expect(vueWrapper.find('.patient-banner-main').classes().includes('justify-space-between')).toBeTruthy()
			expect(vueWrapper.find('.patient-banner-main').classes().includes('align-center')).toBeTruthy()

			await vueWrapper.setProps({ noMoreInformation: true })
			expect(vueWrapper.find('.patient-banner-main').classes().includes('justify-space-between')).toBeFalsy()
			expect(vueWrapper.find('.patient-banner-main').classes().includes('align-center')).toBeTruthy()

			displayWrapper.vm.setMdAndUp(false)
			displayWrapper.vm.setSmAndDown(true)
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('.patient-banner-main').classes().includes('align-center')).toBeFalsy()
			expect(vueWrapper.find('.patient-banner-main').classes().includes('flex-column')).toBeTruthy()
			expect(vueWrapper.find('.patient-banner-main').classes().includes('align-start')).toBeTruthy()
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPatientBanner>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPatientBanner, { props: requiredPropValues() })
		})

		it('Test emitPatientChangeEvent', async () => {
			expect(vueWrapper.emitted('click:patient-change')).toStrictEqual(undefined)

			await vueWrapper.setProps({ noPatientChange: false })
			await vueWrapper.find('.amelipro-patient-banner__patient-change__btn').trigger('click')
			expect(vueWrapper.emitted('click:patient-change')).toStrictEqual([[]])
		})
	})
})
