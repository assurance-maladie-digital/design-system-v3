import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AmeliproTooltips from '../AmeliproTooltips.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproTooltips> = {
	btnLabel: {
		type: String,
		default: 'plus d’informations',
	},
	classes: {
		type: String,
		default: undefined,
	},
	iconBgColor: {
		type: String,
		default: 'ap-white',
	},
	iconColor: {
		type: String,
		default: 'ap-parme-darken-1',
	},
	iconHoverBgColor: {
		type: String,
		default: 'ap-parme-darken-1',
	},
	iconHoverColor: {
		type: String,
		default: 'ap-white',
	},
	iconName: {
		type: String,
		default: 'aide',
	},
	tooltipBg: {
		type: String,
		default: 'ap-white',
	},
	tooltipText: {
		type: String,
		default: 'Test',
	},
	tooltipTextColor: {
		type: String,
		default: 'ap-grey-darken-1',
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproTooltips> => ({ uniqueId: 'required-unique-id' })

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproTooltips> => ({
	btnLabel: 'Modified btn label',
	iconBgColor: 'ap-green',
	iconColor: 'ap-green-darken-1',
	iconHoverBgColor: 'ap-red',
	iconHoverColor: 'ap-red-darken-1',
	iconName: 'home',
	tooltipBg: 'ap-blue',
	tooltipText: 'Modified tooltip text',
	tooltipTextColor: 'ap-blue-darken-1',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproTooltips)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproTooltips', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTooltips>>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproTooltips, { props: requiredPropValues() })
			})

			it('prop uniqueId sets id attribute on root and tooltip', async () => {
				expect(vueWrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)
				await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
				expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})
		})

		// Le contenu des #slot n'est pas visible avec shallowMount
		describe('tooltip text', () => {
			const tooltipContentFinder = () => document.querySelector('.amelipro-tooltip__text')

			beforeEach(() => {
				// On ne devrait théoriquement pas avoir besoin de ça, mais dans les faits...
				document.body.innerHTML = ''

				// console.log({ nb: document.querySelectorAll('.amelipro-tooltip__text').length });

				vueWrapper = mount(AmeliproTooltips, { props: requiredPropValues() })

				// Visiblement, VTooltip créé un tooltip dans le body dès qu'il est monté
				// console.log({ nb: document.querySelectorAll('.amelipro-tooltip__text').length });
			})

			afterEach(() => {
				if (vueWrapper) {
					vueWrapper.unmount()
				}
				// Nettoyer tous les tooltips restants dans le body
				document.querySelectorAll('.amelipro-tooltip__text').forEach(el => el.remove())
			})

			it('prop tooltipText sets tooltip text', async () => {
				// find activator button to trigger tooltip
				const activatorBtn = vueWrapper.find(`#${testHelper.default('uniqueId')}-btn`)
				expect(activatorBtn.exists()).toBe(true)

				// Trigger tooltip by clicking activator button
				await activatorBtn.trigger('touchstart')

				// Chercher dans le document global (et non dans le wrapper)
				expect(tooltipContentFinder()).not.toBeNull()
				expect(vueWrapper.find('.amelipro-tooltip__text').exists()).toBe(false)
				expect(tooltipContentFinder()?.textContent).toBe(testHelper.default('tooltipText'))
				await vueWrapper.setProps({ tooltipText: testHelper.modified('tooltipText') })
				expect(tooltipContentFinder()?.textContent).toBe(testHelper.modified('tooltipText'))
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTooltips>>

		beforeEach(() => {
			// On utilise mount car AmeliproIconBtn est contenu dans un slot
			// et shallowMount ne rend pas les slots.
			vueWrapper = mount(AmeliproTooltips, { props: requiredPropValues() })
		})

		it('prop btnLabel sets btn-label prop of AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('btnLabel')).toBe(testHelper.default('btnLabel'))
			await vueWrapper.setProps({ btnLabel: testHelper.modified('btnLabel') })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('btnLabel')).toBe(testHelper.modified('btnLabel'))
		})
		it('prop iconName sets icon prop of AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('icon')).toBe(testHelper.default('iconName'))
			await vueWrapper.setProps({ iconName: testHelper.modified('iconName') })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('icon')).toBe(testHelper.modified('iconName'))
		})
		it('prop iconBgColor sets icon-bg-color prop of AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconBgColor')).toBe(testHelper.default('iconBgColor'))
			await vueWrapper.setProps({ iconBgColor: testHelper.modified('iconBgColor') })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconBgColor')).toBe(testHelper.modified('iconBgColor'))
		})
		it('prop iconColor sets icon-color prop of AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconColor')).toBe(testHelper.default('iconColor'))
			await vueWrapper.setProps({ iconColor: testHelper.modified('iconColor') })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconColor')).toBe(testHelper.modified('iconColor'))
		})
		it('prop iconHoverBgColor sets icon-hover-bg-color prop of AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconHoverBgColor')).toBe(testHelper.default('iconHoverBgColor'))
			await vueWrapper.setProps({ iconHoverBgColor: testHelper.modified('iconHoverBgColor') })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconHoverBgColor')).toBe(testHelper.modified('iconHoverBgColor'))
		})
		it('prop iconHoverColor sets icon-hover-color prop of AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconHoverColor')).toBe(testHelper.default('iconHoverColor'))
			await vueWrapper.setProps({ iconHoverColor: testHelper.modified('iconHoverColor') })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('iconHoverColor')).toBe(testHelper.modified('iconHoverColor'))
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTooltips>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTooltips, { props: requiredPropValues() })
		})
		it('should not emit any event by default', () => {
			expect(vueWrapper.emitted()).toEqual({})
		})
	})

	describe('Slots', () => {
		//  le contenu du slot par défaut (celui du tooltip) n’est rendu que si show est à true.
		it('renders default slot content', () => {
			mount(AmeliproTooltips, {
				props: requiredPropValues(),
				slots: { default: '<span id="slot-content">Slot Content</span>' },
			})
			expect(document.querySelector('#slot-content')?.textContent).toContain('Slot Content')
		})
		it('renders tooltipActivator slot content', () => {
			const vueWrapper = mount(AmeliproTooltips, {
				props: requiredPropValues(),
				slots: { tooltipActivator: '<button id="activator-btn">Activator</button>' },
			})
			expect(vueWrapper.find('#activator-btn').exists()).toBe(true)
		})
	})
})
