/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable vue/require-default-prop */
import { DisplayTestComponent, attachToApp } from '@tests/helpers/utils'
import { type PropType, defineComponent, h } from 'vue'
import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { Service } from '../ServiceBtn/types'
import ServiceMenu from '../ServiceMenu.vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof ServiceMenu> = {
	icon: {
		type: String,
		default: 'applications',
	},
	messageToDisplay: {
		type: String,
		default: undefined,
	},
	modelValue: {
		type: Boolean,
		default: false,
	},
	servicesContact: {
		type: Array as PropType<Service[]>,
		default: () => [],
	},
	servicesPatient: {
		type: Array as PropType<Service[]>,
		default: () => [],
	},
	servicesPs: {
		type: Array as PropType<Service[]>,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

const serviceList = () => ([
	{
		href: '#',
		icon: 'modified-item-icon-1',
		label: 'Modified item label 1',
	},
	{
		href: '#',
		icon: 'modified-item-icon-2',
		label: 'Modified item label 2',
	},
])

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof ServiceMenu> => ({
	servicesPs: [],
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof ServiceMenu> => ({
	icon: 'modified-icon',
	messageToDisplay: 'Modified message to display',
	modelValue: true,
	servicesContact: serviceList(),
	servicesPatient: serviceList(),
	servicesPs: serviceList(),
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(ServiceMenu)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

const displayWrapper = mount(DisplayTestComponent)

const attachTargetId = (uniqueId: string) => `${uniqueId}-service-menu`

function createAttachTarget(id: string) {
	const el = document.createElement('div')
	el.setAttribute('id', id)
	document.body.appendChild(el)
	return el
}

function removeAttachTarget(id: string) {
	const el = document.getElementById(id)
	if (el) {
		el.remove()
	}
}

// ServiceMenu VMenu pour éviter la logique d'attache DOM de Vuetify
const VMenuMock = defineComponent({
	name: 'VMenu',
	props: {
		attach: [String, Boolean, Object],
		closeOnContentClick: Boolean,
		eager: Boolean,
		maxHeight: String,
		maxWidth: String,
		minWidth: String,
		modelValue: Boolean,
		scrollStrategy: String,
		transition: String,
	},
	setup(props, { slots }) {
		return () => h('div', { class: 'v-menu-mock', ...props }, slots.default ? slots.default() : [])
	},
})

describe('ServiceMenu', () => {
	let vueWrapper: VueWrapper<InstanceType<typeof ServiceMenu>>

	beforeEach(() => {
		createAttachTarget(attachTargetId(testHelper.default('uniqueId')))
		createAttachTarget(attachTargetId(testHelper.modified('uniqueId')))
	})
	afterEach(() => {
		removeAttachTarget(attachTargetId(testHelper.default('uniqueId')))
		removeAttachTarget(attachTargetId(testHelper.modified('uniqueId')))
	})

	describe('Snapshots', () => {
		testHelper.setMountOptions({ global: { stubs: { VMenu: VMenuMock } } })
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.setMountOptions({ global: { stubs: { VMenu: VMenuMock } } })
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		beforeEach(() => {
			vueWrapper = mount(ServiceMenu, {
				props: requiredPropValues(),
				global: { stubs: { VMenu: VMenuMock } },
			})
		})

		it('prop uniqueId sets id attribute on root container', async () => {
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		beforeEach(() => {
			vueWrapper = shallowMount(ServiceMenu, {
				props: requiredPropValues(),
				global: { stubs: { VMenu: VMenuMock } },
			})
		})

		it('prop icon sets icon prop on AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('icon')).toBe(testHelper.default('icon'))
			const { icon } = modifiedPropValues()
			await vueWrapper.setProps({ icon })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('icon')).toBe(testHelper.modified('icon'))
		})
		it('prop uniqueId sets unique-id prop on AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-service-menu-btn`)
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-service-menu-btn`)
		})
	})

	describe('Slots', () => {
		it('slot activator remplace le bouton par défaut', () => {
			vueWrapper = mount(ServiceMenu, {
				global: { stubs: { VMenu: VMenuMock } },
				props: requiredPropValues(),
				slots: { activator: '<button id="custom-activator">Custom</button>' },
			})
			expect(vueWrapper.find('#custom-activator').exists()).toBe(true)
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).exists()).toBe(false)
		})

		// TODO: à corriger
		it.skip('slot message est transmis à ServiceMenuContent (mobile)', async () => {
			vueWrapper = mount(ServiceMenu, {
				global: { stubs: { VMenu: VMenuMock } },
				props: { ...requiredPropValues(), modelValue: true },
				slots: { message: '<div id="slot-message">Slot Message</div>' },
			})
			// Utilise displayWrapper pour piloter mdAndUp
			await displayWrapper.vm.setMdAndUp(false)
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('#slot-message').exists()).toBe(true)
		})
	})

	describe('Events', () => {
		it('émet update:model-value quand visible change', async () => {
			vueWrapper = mount(ServiceMenu, {
				global: { stubs: { VMenu: VMenuMock } },
				props: { ...requiredPropValues(), modelValue: false },
			})
			await vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).trigger('click')
			expect(vueWrapper.emitted('update:model-value')).toBeTruthy()
			expect(vueWrapper.emitted('update:model-value')?.[0]).toEqual([true])
		})
	})

	describe('Public functions', () => {
		it('closeMenu() ferme le menu et focus le bouton', async () => {
			vueWrapper = mount(ServiceMenu, {
				attachTo: attachToApp(),
				global: { stubs: { VMenu: VMenuMock } },
				props: { ...requiredPropValues(), modelValue: true },
			})
			const btnId = `${testHelper.default('uniqueId')}-service-menu-btn`
			const btn = document.createElement('button')
			btn.id = btnId
			document.body.appendChild(btn)

			await (vueWrapper.vm as unknown as { closeMenu: (event: KeyboardEvent) => void }).closeMenu(new KeyboardEvent('keyup', { code: 'Escape' }))
			expect(vueWrapper.emitted('update:model-value')?.pop()).toEqual([false])
			expect(document.activeElement?.id).toBe(btnId)

			btn.remove()
		})
	})

	// TODO: à corriger
	describe.skip('Other', () => {
		it('setMenuAttrs() ajoute les attributs d’accessibilité sur le menu', () => {
			vueWrapper = mount(ServiceMenu, {
				attachTo: attachToApp(),
				global: { stubs: { VMenu: VMenuMock } },
				props: requiredPropValues(),
			})
			const menuId = `${testHelper.default('uniqueId')}-service-menu`
			const menuDiv = document.createElement('div')
			menuDiv.id = menuId
			const overlayContent = document.createElement('div')
			overlayContent.className = 'v-overlay__content'
			menuDiv.appendChild(overlayContent)
			document.body.appendChild(menuDiv);

			// Appelle la méthode setMenuAttrs

			(vueWrapper.vm as any).setMenuAttrs()
			expect(overlayContent.getAttribute('aria-label')).toBe('Liste des services')
			expect(overlayContent.getAttribute('aria-modal')).toBe('true')
			expect(overlayContent.getAttribute('role')).toBe('dialog')

			menuDiv.remove()
		})
	})
})
