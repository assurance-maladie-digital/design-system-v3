import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AmeliproOnboarding from '../AmeliproOnboarding.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { IOnboarding } from '../types'
import TestHelper from '@tests/helpers/TestHelper'

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
		{
			content: ['Contenu 7'],
			img: 'img5.png',
			title: 'Step 5',
		},
	],
	title: 'Modified title',
	uniqueId: 'modified-unique-id',
	width: '600px',
})

class NoopMutationObserver {
	observe = vi.fn()
	disconnect = vi.fn()
	takeRecords = vi.fn(() => [])
}

global.MutationObserver = NoopMutationObserver as any

const testHelper = new TestHelper(AmeliproOnboarding)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproOnboarding', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproOnboarding>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproOnboarding, {
				props: requiredPropValues(),
				global: { mocks: { AmeliproDialog: '<div class="amelipro-dialog"><slot name="header" /><slot /></div>' } },
			})
		})

		describe('Default slot content', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-ondoarding__content').attributes('id')).toBe(`${testHelper.default('uniqueId')}-main-content`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-ondoarding__content').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-main-content`)
			})
		})

		// TODO: contenu du slot introuvable
		describe.skip('Header slot content', () => {
			it.skip('prop title sets header content', async () => {
				expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-title`).text()).toBe(testHelper.default('title'))

				const { title } = modifiedPropValues()
				await vueWrapper.setProps({ title })
				expect(vueWrapper.find(`#${testHelper.default('uniqueId')}-title`).text()).toBe(title)
			})
			it('prop uniqueId sets id attribute on header', async () => {
				expect(vueWrapper.find('.amelipro-onboarding__header').attributes('id')).toBe(`${testHelper.default('uniqueId')}-header`)
				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-onboarding__header').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-header`)
			})
		})

		it('prop steps sets step content', async () => {
			expect(vueWrapper.findAll('.amelipro-onboarding__step-dot').length).toBe(2)

			const { steps } = modifiedPropValues()
			await vueWrapper.setProps({ steps })
			expect(vueWrapper.findAll('.amelipro-onboarding__step-dot').length).toBe(3)
		})

		// TODO: bouton final introuvable
		describe.skip('Final button', () => {
			it('prop finalBtnLabel sets final button label', async () => {
				vueWrapper = shallowMount(AmeliproOnboarding, { props: { ...requiredPropValues(), modelValue: true } })
				// Vérifier le snapshot
				expect(vueWrapper.html()).toMatchSnapshot()
				// Aller à la dernière étape
				// await vueWrapper.setData({ currentStepIndex: 1 })
				// Simuler un clic sur le dernier bouton
				await vueWrapper.find('.amelipro-onboarding__content__btn--final').trigger('click')
				expect(vueWrapper.find('.amelipro-onboarding__content__btn--final').text()).toBe(testHelper.default('finalBtnLabel'))

				const { finalBtnLabel } = modifiedPropValues()
				await vueWrapper.setProps({ finalBtnLabel })
				expect(vueWrapper.find('.amelipro-onboarding__content__btn--final').text()).toBe(testHelper.modified('finalBtnLabel'))
			})
		})

		// TODO: bouton skip introuvable
		describe.skip('Skip button', () => {
			it('prop skipBtnLabel sets skip button label', async () => {
				vueWrapper = shallowMount(AmeliproOnboarding, { props: requiredPropValues() })
				expect(vueWrapper.find('.amelipro-onboarding__content__btn--skip').text()).toBe(testHelper.default('skipBtnLabel'))

				const { skipBtnLabel } = modifiedPropValues()
				await vueWrapper.setProps({ skipBtnLabel })
				expect(vueWrapper.find('.amelipro-onboarding__content__btn--skip').text()).toBe(testHelper.modified('skipBtnLabel'))
			})
		})
	})

	// TODO: bouton final introuvable
	describe.skip('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproOnboarding>>

		it('emit update:model-value when closing onboarding', async () => {
			vueWrapper = shallowMount(AmeliproOnboarding, { props: { ...requiredPropValues(), modelValue: true } })
			await vueWrapper.find('.amelipro-onboarding__content__btn--final').trigger('click')
			expect(vueWrapper.emitted('update:model-value')).toBeTruthy()
		})
	})
})
