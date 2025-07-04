import { VueWrapper, shallowMount } from '@vue/test-utils'
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
		mailObject: 'Objet du mail requis',
		messageInfoFirstLine: 'infos ligne 1 requise',
		messageInfoSecondLine: 'infos ligne 2 requise',
		messageInfoThirdLine: 'infos ligne 3 requise',
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
		mailObject: 'Objet du mail',
		messageInfoFirstLine: 'infos ligne 1',
		messageInfoSecondLine: 'infos ligne 2',
		messageInfoThirdLine: 'infos ligne 3',
		readValue: false,
	} as AmeliproMailTileType,
	uniqueId: 'required-unique-id',
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

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMailTile, { props: { ...requiredPropValues(), editable: true } })
		})

		it('test emitStatusChangeEvent', async () => {
			expect(vueWrapper.emitted('status-change')).toStrictEqual(undefined)

			await vueWrapper.find('.mail-status-btn').trigger('click')
			expect(vueWrapper.emitted('status-change')).toStrictEqual([['required-unique-id']])
		})

		it('test emitClickEvent', async () => {
			await vueWrapper.setProps({ editable: false })
			expect(vueWrapper.emitted('click')).toStrictEqual(undefined)

			await vueWrapper.find('.amelipro-mail-tile__not-editable').trigger('click')
			expect(vueWrapper.emitted('click')).toStrictEqual([['required-unique-id']])
		})
	})

	describe('Rendering', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMailTile, { props: { ...requiredPropValues(), editable: true } })
		})

		it('does not render comment icon if commentValue is false', async () => {
			const { mailInfo } = modifiedPropValues()
			await vueWrapper.setProps({ mailInfo: { ...mailInfo, commentValue: false } })
			expect(vueWrapper.find('.mail-info__comment-icon').exists()).toBe(false)
		})
	})

	describe('CSS classes according to readValue', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMailTile, { props: { ...requiredPropValues(), editable: true } })
		})

		it('mail-status-btn does not have class mail-status-btn--not-read if read', () => {
			expect(vueWrapper.find('.mail-status-btn').classes('mail-status-btn--not-read')).toBe(false)
		})
	})

	describe('backgroundStyle changes on status change', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMailTile>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMailTile, { props: { ...requiredPropValues(), editable: true } })
		})

		it('backgroundStyle changes after click', async () => {
			const btn = vueWrapper.find('.mail-status-btn')
			expect(btn.attributes('style')).toBe('background-color: #FFFFFF;')
			await btn.trigger('click')
			expect(btn.attributes('style')).toBe('background-color: #E6F6FC;')
		})
	})
})
