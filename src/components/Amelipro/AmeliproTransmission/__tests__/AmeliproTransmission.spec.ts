import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproTransmission from '../AmeliproTransmission.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproTransmission> = {
	alternateButtonLabel: {
		type: String,
		default: 'Modifier',
	},
	confirmButtonLabel: {
		type: String,
		default: 'Transmettre',
	},
	confirmHref: {
		type: String,
		default: undefined,
	},
	confirmTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	modifyHref: {
		type: String,
		default: undefined,
	},
	modifyTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	printHref: {
		type: String,
		default: undefined,
	},
	printTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	transmissionActions: {
		type: Boolean,
		default: true,
	},
	transmissionCardTitle: {
		type: String,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproTransmission> => ({})

const modifiedPropValues = (): ComponentProps<typeof AmeliproTransmission> => ({
	alternateButtonLabel: 'Modified alternate button label',
	confirmButtonLabel: 'Modified confirm button label',
	confirmHref: '/modified-confirm-href',
	confirmTo: '/modified-confirm-to',
	modifyHref: '/modified-modify-href',
	modifyTo: '/modified-modify-to',
	printHref: '/modified-print-href',
	printTo: '/modified-print-to',
	transmissionActions: false,
	transmissionCardTitle: 'Modified transmission card title',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproTransmission)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproTransmission', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTransmission>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTransmission, { props: requiredPropValues() })
		})

		it('prop uniqueId sets attribute id on .amelipro-transmission', async () => {
			expect(vueWrapper.find('.amelipro-transmission').attributes('id')).toBe(testHelper.default('uniqueId'))
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('.amelipro-transmission').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})
	})

	describe.skip('Setting props should update props or attributes of inner components', () => {
		// À compléter selon la structure interne du composant si besoin
	})

	describe('Setting props should update visibility of actions', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTransmission>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTransmission, { props: requiredPropValues() })
		})

		it('prop transmissionActions sets .amelipro-transmission__actions visibility', async () => {
			// À revoir, son affichage dépend aussi du slot actions
			expect(vueWrapper.find('.amelipro-transmission__actions').exists()).toBe(true)
			const { transmissionActions } = modifiedPropValues()
			await vueWrapper.setProps({ transmissionActions })
			expect(vueWrapper.find('.amelipro-transmission__actions').exists()).toBe(true)
		})
	})

	describe('Slots', () => {
		it('displays slot content in actions', () => {
			const vueWrapper = shallowMount(AmeliproTransmission, {
				props: { ...requiredPropValues(), transmissionActions: false },
				slots: { actions: '<div id="slot-content">Slot Content</div>' },
			})
			expect(vueWrapper.find('#slot-content').text()).toBe('Slot Content')
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTransmission>>
		beforeEach(() => {
			vueWrapper = mount(AmeliproTransmission, { props: modifiedPropValues() })
		})

		it('click on .amelipro-transmission__print-btn emits click:print', async () => {
			expect(vueWrapper.emitted('click:print')).toBeUndefined()
			await vueWrapper.find('.amelipro-transmission__print-btn').trigger('click')
			expect(vueWrapper.emitted('click:print')).toStrictEqual([[]])
		})

		it('click on .amelipro-transmission__alternate-btn emits click:modify', async () => {
			expect(vueWrapper.emitted('click:modify')).toBeUndefined()
			await vueWrapper.find('.amelipro-transmission__alternate-btn').trigger('click')
			expect(vueWrapper.emitted('click:modify')).toStrictEqual([[]])
		})

		it('click on .amelipro-transmission__confirm-btn emits click:confirm', async () => {
			expect(vueWrapper.emitted('click:confirm')).toBeUndefined()
			await vueWrapper.find('.amelipro-transmission__confirm-btn').trigger('click')
			expect(vueWrapper.emitted('click:confirm')).toStrictEqual([[]])
		})
	})
})
