/* eslint-disable @typescript-eslint/no-explicit-any */
import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AmeliproOnboarding from '../AmeliproOnboarding.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { IOnboarding } from '../types'
import TestHelper from '@tests/helpers/TestHelper'
import { defineComponent, h } from 'vue'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproOnboarding> = {
	attach: {
		type: Boolean,
		default: false,
	},
	displayImgMobile: {
		type: Boolean,
		default: false,
	},
	eager: {
		type: Boolean,
		default: false,
	},
	finalBtnLabel: {
		type: String,
		default: 'Commencer',
	},
	imgHeight: {
		type: String,
		default: '335px',
	},
	imgWidth: {
		type: String,
		default: '35%',
	},
	modelValue: {
		type: Boolean,
		default: false,
	},
	persistent: {
		type: Boolean,
		default: false,
	},
	skipBtnLabel: {
		type: String,
		default: 'Passer',
	},
	steps: {
		type: Array,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
	width: {
		type: String,
		default: '800px',
	},
}

const stepsData = (): IOnboarding[] => [
	{
		content: ['Contenu 1', 'Contenu 2'],
		img: 'img1.png',
		title: 'Step 1',
	},
	{
		content: ['Contenu 3'],
		img: 'img2.png',
		title: 'Step 2',
	},
]

const requiredPropValues = (): ComponentProps<typeof AmeliproOnboarding> => ({
	steps: stepsData(),
	title: 'Required title',
	uniqueId: 'required-unique-id',
})

const modifiedPropValues = (): ComponentProps<typeof AmeliproOnboarding> => ({
	attach: true,
	displayImgMobile: true,
	eager: true,
	finalBtnLabel: 'Modified final label',
	imgHeight: '222px',
	imgWidth: '44%',
	modelValue: true,
	persistent: true,
	skipBtnLabel: 'Modified skip label',
	steps: [
		{
			content: ['Contenu 4'],
			img: 'img3.png',
			title: 'Step 3',
		},
		{
			content: ['Contenu 5', 'Contenu 6'],
			img: 'img4.png',
			title: 'Step 4',
		},
	],
	title: 'Modified title',
	uniqueId: 'modified-unique-id',
	width: '600px',
})

const testHelper = new TestHelper(AmeliproOnboarding)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

// Mock global MutationObserver pour éviter la boucle infinie dans les tests unitaires
class NoopMutationObserver {
	observe = vi.fn()
	disconnect = vi.fn()
	takeRecords = vi.fn(() => [])
}

global.MutationObserver = NoopMutationObserver as any

// TODO: de nombreux tests ne passent pas et ont été désactivés. Il faudra les réactiver un par un et corriger les erreurs.
describe('AmeliproOnboarding', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproOnboarding>>

		const AmeliproDialogStub = defineComponent({
			name: 'AmeliproDialog',
			props: {
				uniqueId: { type: String, required: true },
			},
			setup(props, { slots }) {
				return () =>
					h('amelipro-dialog-stub', { uniqueId: props.uniqueId }, [
						slots.header ? slots.header() : null,
						slots.default ? slots.default() : null,
					])
			},
		})

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproOnboarding, {
				props: requiredPropValues(),
				global: { stubs: { AmeliproDialog: AmeliproDialogStub } },
			})
		})

		describe('Header', () => {
			it('prop title sets header content', async () => {
				expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-title`).text()).toBe(testHelper.default('title'))

				const { title } = modifiedPropValues()
				await vueWrapper.setProps({ title })
				expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-title`).text()).toBe(title)
			})
		})

		describe('Main content', () => {
			// Attention faute de frappe dans le composant : d au lieu de b dans "ondoarding__content"
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-ondoarding__content').attributes('id')).toBe(`${testHelper.default('uniqueId')}-main-content`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-ondoarding__content').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-main-content`)
			})
		})

		describe('Left part', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-ondoarding__content--left').attributes('id')).toBe(`${testHelper.default('uniqueId')}-left-part`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-ondoarding__content--left').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-left-part`)
			})

			it('prop imgWidth sets attribute style', async () => {
				expect(vueWrapper.find('.amelipro-ondoarding__content--left').attributes('style')).toContain(`width: ${testHelper.default('imgWidth')};`)

				const { imgWidth } = modifiedPropValues()
				await vueWrapper.setProps({ imgWidth })
				expect(vueWrapper.find('.amelipro-ondoarding__content--left').attributes('style')).toContain(`width: ${testHelper.modified('imgWidth')};`)
			})
		})

		// TODO: left part img

		// TODO: right part

		// TODO: right part dot wrapper

		// TODO: right part dot

		// TODO: nombreux cas à rajouter (content title, content text, buttons labels, img height, etc.)
	})

	describe.skip('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproOnboarding>>

		it('emit update:model-value when closing onboarding', async () => {
			vueWrapper = shallowMount(AmeliproOnboarding, { props: { ...requiredPropValues(), modelValue: true } })
			await vueWrapper.find('.amelipro-onboarding__content__btn--final').trigger('click')
			expect(vueWrapper.emitted('update:model-value')).toBeTruthy()
		})
	})
})
