import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproStateTile from '../AmeliproStateTile.vue'
import type { AmeliproStateTileTypes } from '../AmeliproStateTileTypes'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproStateTile> = {
	btnStyledText: {
		type: String,
		default: undefined,
	},
	contentMinHeight: {
		type: String,
		default: '284px',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	href: {
		type: String,
		default: undefined,
	},
	labelFirstLine: {
		type: String,
		default: undefined,
	},
	labelSecondLine: {
		type: String,
		default: undefined,
	},
	labelThirdLine: {
		type: String,
		default: undefined,
	},
	linkStyleText: {
		type: String,
		default: 'Consulter',
	},
	noPdfIcon: {
		type: Boolean,
		default: false,
	},
	tileMinHeight: {
		type: String,
		default: undefined,
	},
	tilePaddingX: {
		type: String,
		default: '24px',
	},
	tileType: {
		default: 'toDo',
		type: String as PropType<keyof typeof AmeliproStateTileTypes>,
		validator(value: string): boolean {
			return ['date', 'done', 'doneNoCertificate', 'doneNoCertificateBlue', 'doneToCorrect', 'optionnal', 'toDo', 'toDoNoCertificate', 'toDoNoCertificateBlue'].includes(value)
		},
	},
	tileWidth: {
		type: String,
		default: '100%',
	},
	to: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

const requiredPropValues = (): ComponentProps<typeof AmeliproStateTile> => ({})

const modifiedPropValues = (): ComponentProps<typeof AmeliproStateTile> => ({
	btnStyledText: 'Modified styled text',
	contentMinHeight: '300px',
	disabled: true,
	href: '/modified-href',
	labelFirstLine: 'Modified first line',
	labelSecondLine: 'Modified second line',
	labelThirdLine: 'Modified third line',
	linkStyleText: 'Modified link style text',
	noPdfIcon: true,
	tileMinHeight: '350px',
	tilePaddingX: '32px',
	tileType: 'done',
	tileWidth: '80%',
	to: '/modified-to',
	uniqueId: 'modified-unique-id',
})

const globalStubs = {
	VBtn: {
		props: [
			'uniqueId',
			'disabled',
			'href',
			'tileMinHeight',
			'tileStyles',
			'to',
			'tileWidth',
		],
		template: `<button 
		:id="uniqueId"
		class="amelipro-state-tile text-none text-h5"
		:disabled="disabled"
		:href="href"
		:min-height="tileMinHeight"
		:style="tileStyles"
		:to="to"
		:width="tileWidth"
		@click="emitClickEvent && emitClickEvent()"
		><slot /></button>`,
	},
}

const testHelper = new TestHelper(AmeliproStateTile)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)
	.setMountOptions({ global: { stubs: globalStubs } })

describe('AmeliproStateTile', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproStateTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproStateTile, { props: requiredPropValues(), global: { stubs: globalStubs } })
		})

		it('prop uniqueId sets attribute id', async () => {
			expect(vueWrapper.find('.amelipro-state-tile').attributes('id')).toBeUndefined()

			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('.amelipro-state-tile').attributes('id')).toBe(testHelper.modified('uniqueId'))
		})

		it('prop labelFirstLine sets first line content', async () => {
			expect(vueWrapper.find('.amelipro-state-tile__first-line').text()).toBe('')

			const { labelFirstLine } = modifiedPropValues()
			await vueWrapper.setProps({ labelFirstLine })
			expect(vueWrapper.find('.amelipro-state-tile__first-line').text()).toBe(testHelper.modified('labelFirstLine'))
		})

		it('prop labelSecondLine sets second line content', async () => {
			expect(vueWrapper.find('.amelipro-state-tile__second-line').exists()).toBe(false)

			const { labelSecondLine } = modifiedPropValues()
			await vueWrapper.setProps({ labelSecondLine })
			expect(vueWrapper.find('.amelipro-state-tile__second-line').text()).toBe(testHelper.modified('labelSecondLine'))
		})

		it('prop labelThirdLine sets third line content', async () => {
			expect(vueWrapper.find('.amelipro-state-tile__third-line').exists()).toBe(false)

			const { labelThirdLine } = modifiedPropValues()
			await vueWrapper.setProps({ labelThirdLine })
			expect(vueWrapper.find('.amelipro-state-tile__third-line').text()).toBe(testHelper.modified('labelThirdLine'))
		})

		it('prop btnStyledText sets styled button text', async () => {
			expect(vueWrapper.find('.btn-styled-text').exists()).toBe(false)

			const { btnStyledText } = modifiedPropValues()
			await vueWrapper.setProps({ btnStyledText, disabled: false })
			expect(vueWrapper.find('.btn-styled-text').text()).toBe(testHelper.modified('btnStyledText'))
		})

		it('prop disabled sets unavailable text', async () => {
			expect(vueWrapper.find('.amelipro-state-tile__unavailable').exists()).toBe(false)

			const { disabled } = modifiedPropValues()
			await vueWrapper.setProps({ disabled })
			expect(vueWrapper.find('.amelipro-state-tile__unavailable').exists()).toBe(true)
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproStateTile>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproStateTile, { props: { ...requiredPropValues(), uniqueId: 'event-id' } })
		})

		it('emit click event when tile is clicked', async () => {
			await vueWrapper.find('.amelipro-state-tile').trigger('click')
			expect(vueWrapper.emitted('click')).toBeTruthy()
			expect(vueWrapper.emitted('click')?.[0]).toEqual(['event-id'])
		})
	})
})
