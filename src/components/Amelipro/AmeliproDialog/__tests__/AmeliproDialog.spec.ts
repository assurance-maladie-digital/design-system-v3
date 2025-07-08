import { VueWrapper, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AmeliproDialog from '../AmeliproDialog.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproDialog> = {
	attach: {
		type: Boolean,
		default: false,
	},
	cancelBtnLabel: {
		type: String,
		default: 'Annuler',
	},
	eager: {
		type: Boolean,
		default: false,
	},
	fullscreen: {
		type: Boolean,
		default: false,
	},
	hiddenCancelBtn: {
		type: Boolean,
		default: false,
	},
	labelledby: {
		type: String,
		required: true,
	},
	mainContentMaxHeight: {
		type: String,
		default: undefined,
	},
	mainContentMinHeight: {
		type: String,
		default: '150px',
	},
	modelValue: {
		type: Boolean,
		default: false,
	},
	noClickOutside: {
		type: Boolean,
		default: false,
	},
	noFooter: {
		type: Boolean,
		default: true,
	},
	persistent: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: undefined,
	},
	uniqueId: {
		type: String,
		required: true,
	},
	validationBtnLabel: {
		type: String,
		default: 'Valider',
	},
	width: {
		type: String,
		default: '800px',
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproDialog> => ({
	labelledby: 'required-labelledby',
	uniqueId: 'required-uniqueid',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproDialog> => ({
	cancelBtnLabel: 'Modified cancel btn label',
	fullscreen: true,
	hiddenCancelBtn: true,
	labelledby: 'modified-labelledby',
	mainContentMaxHeight: '300px',
	mainContentMinHeight: '200px',
	modelValue: true,
	noClickOutside: true,
	noFooter: false,
	persistent: true,
	title: 'Modified title',
	uniqueId: 'modified-uniqueid',
	validationBtnLabel: 'Modified validation btn label',
	width: '700px',
})

const testHelper = new TestHelper(AmeliproDialog)
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

describe('AmeliproDialog', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Slots', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDialog>>

		it('renders default slot content', () => {
			vueWrapper = mount(AmeliproDialog, {
				global: {
					stubs: {
						AmeliproBtn: true,
						AmeliproIconBtn: true,
						VDialog: { template: '<div><slot /></div>' },
					},
				},
				props: requiredPropValues(),
				slots: { default: '<div id="slot-content">Slot Content</div>' },
			})
			expect(vueWrapper.find('#slot-content').exists()).toBe(true)
			expect(vueWrapper.find('#slot-content').text()).toBe('Slot Content')
		})

		it('renders header slot content', () => {
			vueWrapper = mount(AmeliproDialog, {
				global: {
					stubs: {
						AmeliproBtn: true,
						AmeliproIconBtn: true,
						VDialog: { template: '<div><slot /></div>' },
					},
				},
				props: requiredPropValues(),
				slots: { header: '<div id="header-slot">Header Slot</div>' },
			})
			expect(vueWrapper.find('#header-slot').exists()).toBe(true)
			expect(vueWrapper.find('#header-slot').text()).toBe('Header Slot')
		})

		it('renders footer slot content', () => {
			vueWrapper = mount(AmeliproDialog, {
				global: {
					stubs: {
						AmeliproBtn: true,
						AmeliproIconBtn: true,
						VDialog: { template: '<div><slot /></div>' },
					},
				},
				props: { ...requiredPropValues(), noFooter: false },
				slots: { footer: '<div id="footer-slot">Footer Slot</div>' },
			})
			expect(vueWrapper.find('#footer-slot').exists()).toBe(true)
			expect(vueWrapper.find('#footer-slot').text()).toBe('Footer Slot')
		})
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDialog>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproDialog, {
				global: {
					stubs: {
						AmeliproBtn: true,
						AmeliproIconBtn: true,
						VDialog: { template: '<div><slot /></div>' },
					},
				},
				props: { ...requiredPropValues(), noFooter: false },
			})
		})

		it('prop uniqueId sets attribute id on root dialog element', async () => {
			expect(vueWrapper.find('.dialog').attributes('id')).toBe(testHelper.default('uniqueId'))
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('.dialog').attributes('id')).toBe(testHelper.modified('uniqueId'))
		})

		it('prop uniqueId sets attribute id on header/content/footer', async () => {
			expect(vueWrapper.find('.dialog__header').attributes('id')).toBe(`${testHelper.default('uniqueId')}-header`)
			expect(vueWrapper.find('.dialog__content').attributes('id')).toBe(`${testHelper.default('uniqueId')}-content`)
			expect(vueWrapper.find('.dialog__footer').attributes('id')).toBe(`${testHelper.default('uniqueId')}-footer`)

			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('.dialog__header').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-header`)
			expect(vueWrapper.find('.dialog__content').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-content`)
			expect(vueWrapper.find('.dialog__footer').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-footer`)
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDialog>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproDialog, {
				props: { ...requiredPropValues(), hiddenCancelBtn: false, noFooter: false },
				global: {
					stubs: {
						// AmeliproBtn: { template: '<button class="dialog__cancel-btn"><slot /></button>' },
						AmeliproIconBtn: true,
						VDialog: { template: '<div><slot /></div>' },
					},
				},
			})
		})

		it('prop cancelBtnLabel sets AmeliproBtn cancel label', async () => {
			expect(vueWrapper.find('.dialog__cancel-btn').text()).toBe(testHelper.default('cancelBtnLabel'))
			const { cancelBtnLabel } = modifiedPropValues()
			await vueWrapper.setProps({ cancelBtnLabel })
			expect(vueWrapper.find('.dialog__cancel-btn').text()).toBe(testHelper.modified('cancelBtnLabel'))
		})
	})

	describe('Affichage conditionnel du footer', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDialog>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproDialog, {
				props: requiredPropValues(),
				global: {
					stubs: {
						AmeliproBtn: true,
						AmeliproIconBtn: true,
						VDialog: { template: '<div><slot /></div>' },
					},
				},
			})
		})

		it('prop noFooter sets footer visibility', async () => {
			expect(vueWrapper.find('.dialog__footer').exists()).toBe(false)
			await vueWrapper.setProps({ noFooter: false })
			expect(vueWrapper.find('.dialog__footer').exists()).toBe(true)
		})
	})
})
