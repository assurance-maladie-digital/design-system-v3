import type { AmeliproPageLayoutInfos, SkipLink } from '../types'
import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproPageLayout from '../AmeliproPageLayout.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproPageLayout> = {
	ameliproPageLayoutInfos: {
		type: Object as () => AmeliproPageLayoutInfos,
		default: undefined,
	},
	customMainContent: {
		type: Boolean,
		default: false,
	},
	skipLinks: {
		type: Array as () => SkipLink[],
		default: () => [],
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

const requiredPropValues = (): ComponentProps<typeof AmeliproPageLayout> => ({})

const modifiedPropValues = (): ComponentProps<typeof AmeliproPageLayout> => ({
	ameliproPageLayoutInfos: {
		ameliproFooterInfos: {
			a11yCompliance: 'conforme',
			version: '1.2.3',
		},
		ameliproHeaderInfos: {
			backoffice: true,
			headerTitle: 'Modified header title',
			serviceName: 'Modified service name',
		},
		ameliproPatientBannerInfos: {
			birthName: 'Patient Birth Name',
			birthdate: '01/01/1980',
			name: 'Patient Name',
			noMoreInformation: true,
			noPatientChange: true,
			patientNir: '1234567890123',
			patientOrganism: 'Organism',
			patientStatus: 'Status',
			patientSystem: 'System',
		},
		displayPatientBanner: true,
	},
	customMainContent: true,
	skipLinks: [
		{ label: 'Modified skip link', href: '#modified' },
	],
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproPageLayout)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproPageLayout', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPageLayout>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPageLayout, { props: requiredPropValues() })
		})

		it('prop uniqueId sets attribute id', async () => {
			expect(vueWrapper.find('.amelipro-page-layout').attributes('id')).toBeUndefined()

			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('.amelipro-page-layout').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})

		it('prop skipLinks sets skip link content', async () => {
			expect(vueWrapper.findAll('.skip-link__item').length).toBe(1)

			const { skipLinks } = modifiedPropValues()
			await vueWrapper.setProps({ skipLinks })
			expect(vueWrapper.findAll('.skip-link__item').length).toBe(2)
			expect(vueWrapper.find('.skip-link__item:last-child .skip-link').text()).toBe('Modified skip link')
		})

		it('prop ameliproPageLayoutInfos sets header and footer', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproHeader' }).exists()).toBe(false)
			expect(vueWrapper.findComponent({ name: 'AmeliproFooter' }).exists()).toBe(false)

			const { ameliproPageLayoutInfos } = modifiedPropValues()
			await vueWrapper.setProps({ ameliproPageLayoutInfos })
			expect(vueWrapper.findComponent({ name: 'AmeliproHeader' }).exists()).toBe(true)
			expect(vueWrapper.findComponent({ name: 'AmeliproFooter' }).exists()).toBe(true)
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPageLayout>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPageLayout, { props: { ...modifiedPropValues(), uniqueId: 'event-id' } })
		})

		it('emit back-btn-click when header emits back-btn-click', () => {
			const header = vueWrapper.findComponent({ name: 'AmeliproHeader' })
			header.vm.$emit('back-btn-click')
			expect(vueWrapper.emitted('back-btn-click')).toBeTruthy()
		})

		it('emit click:patient-change when patient banner emits click:patient-change', () => {
			const patientBanner = vueWrapper.findComponent({ name: 'AmeliproPatientBanner' })
			patientBanner.vm.$emit('click:patient-change')
			expect(vueWrapper.emitted('click:patient-change')).toBeTruthy()
		})
	})
})
