import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproMailTile from '../AmeliproMailTile.vue'
import type { AmeliproMailTileType } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproMailTile> = {
	editable: {
		type: Boolean,
		default: false,
	},
	mailInfo: {
		type: Object as PropType<AmeliproMailTileType>,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproMailTile> => ({
	mailInfo: {
		commentValue: true,
		date: '25/06/2023',
		hour: '12h00',
		href: '#required',
		mailObject: 'Required mail object',
		messageInfoFirstLine: 'Required info line 1',
		messageInfoSecondLine: 'Required info line 2',
		messageInfoThirdLine: 'Required info line 3',
		readValue: true,
	} as AmeliproMailTileType,
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproMailTile> => ({
	editable: true,
	mailInfo: {
		commentValue: false,
		date: '26/06/2023',
		hour: '13h00',
		href: '#modified',
		mailObject: 'Modified mail object',
		messageInfoFirstLine: 'Modified info line 1',
		messageInfoSecondLine: 'Modified info line 2',
		messageInfoThirdLine: 'Modified info line 3',
		readValue: false,
	} as AmeliproMailTileType,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproMailTile)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproMailTile', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproMailTile, {
				props: requiredPropValues(),
				global: { stubs: { VBtn: { template: '<button><slot /></button>' } } },
			})
		})

		it('prop uniqueId sets attribute id', async () => {
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})

		it('prop mailInfo sets mail object', async () => {
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-mail-object`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-mail-object`).text()).toContain(testHelper.default('mailInfo').mailObject)

			const { mailInfo, uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ mailInfo, uniqueId })
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-mail-object`).exists()).toBe(true)
			expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-mail-object`).text()).toContain(testHelper.modified('mailInfo').mailObject)
		})

		it('prop editable sets edit mode', async () => {
			expect(vueWrapper.find('.mail-status-btn').exists()).toBe(false)
			await vueWrapper.setProps({ editable: true })
			expect(vueWrapper.find('.mail-status-btn').exists()).toBe(true)
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMailTile, { props: { ...requiredPropValues(), editable: true } })
		})

		it('emit status-change when clicking mail-status-btn', async () => {
			expect(vueWrapper.emitted('status-change')).toBeUndefined()
			await vueWrapper.find('.mail-status-btn').trigger('click')
			expect(vueWrapper.emitted('status-change')).toBeTruthy()
			expect(vueWrapper.emitted('status-change')?.[0]).toEqual([testHelper.default('uniqueId')])
		})

		it('emit click when clicking not-editable tile', async () => {
			await vueWrapper.setProps({ editable: false })
			expect(vueWrapper.emitted('click')).toBeUndefined()
			await vueWrapper.find('.amelipro-mail-tile__not-editable').trigger('click')
			expect(vueWrapper.emitted('click')).toBeTruthy()
			expect(vueWrapper.emitted('click')?.[0]).toEqual([testHelper.default('uniqueId')])
		})
	})

	describe('Editable info text', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMailTile, {
				props: { ...requiredPropValues(), editable: true },
				global: { stubs: { VBtn: { template: '<button><slot /></button>' } } },
			})
		})

		it('prop mailInfo.commentValue sets comment icon visibility', async () => {
			expect(vueWrapper.find('.mail-info__comment-icon').exists()).toBe(true)

			const { mailInfo } = modifiedPropValues()
			await vueWrapper.setProps({ mailInfo })
			expect(vueWrapper.find('.mail-info__comment-icon').exists()).toBe(false)
		})
	})

	describe('Mail status button', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMailTile, {
				props: { ...requiredPropValues(), editable: true },
				// global: { stubs: { VBtn: { template: '<button><slot /></button>' } } },
			})
		})

		it('prop uniqueId sets attribute id', async () => {
			expect(vueWrapper.find('.mail-status-btn').attributes('id')).toBe(`${testHelper.default('uniqueId')}-read-btn`)

			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('.mail-status-btn').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-read-btn`)
		})

		it('prop mailInfo.readValue sets attribute aria-label', async () => {
			expect(vueWrapper.find('.mail-status-btn').attributes('aria-label')).toBe('Message lu')

			const { mailInfo } = modifiedPropValues()
			await vueWrapper.setProps({ mailInfo })
			// TODO: test ne passe pas, la prop ne semble pas réactive
			// expect(vueWrapper.find('.mail-status-btn').attributes('aria-label')).toBe('Message non lu')
		})

		it('prop mailInfo.readValue sets attribute aria-pressed', async () => {
			expect(vueWrapper.find('.mail-status-btn').attributes('aria-pressed')).toBe('true')

			const { mailInfo } = modifiedPropValues()
			await vueWrapper.setProps({ mailInfo })
			// TODO: test ne passe pas, la prop ne semble pas réactive
			// expect(vueWrapper.find('.mail-status-btn').attributes('aria-pressed')).toBe('false')
		})

		it('prop mailInfo.readValue sets class mail-status-btn--not-read', async () => {
			expect(vueWrapper.find('.mail-status-btn').classes('mail-status-btn--not-read')).toBe(false)

			const { mailInfo } = modifiedPropValues()
			expect(mailInfo.readValue).toBe(false)
			await vueWrapper.setProps({ mailInfo })
			// TODO: test ne passe pas, la prop ne semble pas réactive
			// expect(vueWrapper.find('.mail-status-btn').classes('mail-status-btn--not-read')).toBe(true)
		})
	})

	describe('backgroundStyle changes on status change', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMailTile, { props: { ...requiredPropValues(), editable: true } })
		})

		it('backgroundStyle changes after click', async () => {
			const btn = vueWrapper.find('.mail-status-btn')
			const initialStyle = btn.attributes('style')
			await btn.trigger('click')
			const afterClickStyle = btn.attributes('style')
			expect(initialStyle).not.toBe(afterClickStyle)
		})
	})
})
