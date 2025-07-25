import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproBtn from '../../AmeliproBtn/AmeliproBtn.vue'
import AmeliproIconBtn from '../../AmeliproIconBtn/AmeliproIconBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import UserMenu from '../UserMenu.vue'
import type { UserMenuInfos } from '../types'

const expectedPropOptions: ExpectedPropOptions<typeof UserMenu> = {
	icon: {
		type: String,
		default: 'utilisateur',
	},
	lastConnexion: {
		type: String,
		default: undefined,
	},
	uniqueId: {
		type: String,
		required: true,
	},
	userMenuInfos: {
		type: Object as PropType<UserMenuInfos>,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof UserMenu> => ({ uniqueId: 'required-unique-id' })

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof UserMenu> => ({
	icon: 'plus',
	lastConnexion: 'last connexion',
	uniqueId: 'modified-unique-id',
	userMenuInfos: {
		lastConnexion: 'last connexion 2',
		userMenuDetailsInfos: {
			adeli: 'adeli',
			email: 'test@test.fr',
			rpps: 'rpps',
			userName: 'userName',
		},
	} as UserMenuInfos,
})

const testHelper = new TestHelper(UserMenu)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('UserMenu', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof UserMenu>>
		beforeEach(() => {
			vueWrapper = shallowMount(UserMenu, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on root container', async () => {
			expect(vueWrapper.attributes('id')).toBe(testHelper.default('uniqueId'))
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
			expect(vueWrapper.attributes('id')).toBe(testHelper.modified('uniqueId'))
		})

		it('prop uniqueId sets unique-id prop on AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-open-btn`)
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-open-btn`)
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof UserMenu>>
		beforeEach(() => {
			vueWrapper = shallowMount(UserMenu, { props: requiredPropValues() })
		})

		it('prop icon sets icon prop on AmeliproIconBtn', async () => {
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('icon')).toBe(testHelper.default('icon'))
			await vueWrapper.setProps({ icon: testHelper.modified('icon') })
			expect(vueWrapper.findComponent({ name: 'AmeliproIconBtn' }).props('icon')).toBe(testHelper.modified('icon'))
		})

		// TODO: HS, à réparer
		it.skip('prop userMenuInfos sets user-menu-details-infos prop on UserMenuDetails', async () => {
			// UsermMenuDetails est dans le slot de VMenu, donc on ne peut pas le tester avec shallowMount
			vueWrapper = mount(UserMenu, {
				props: requiredPropValues(),
				global: {
					stubs: {
						AmeliproIconBtn: true,
						UserMenuDetails: true,
						// VMenu: true,
					},
				},
			})

			expect(vueWrapper.findComponent({ name: 'UserMenuDetails' }).exists()).toBe(false)
			await vueWrapper.setProps({ userMenuInfos: testHelper.modified('userMenuInfos') })
			expect(vueWrapper.findComponent({ name: 'UserMenuDetails' }).exists()).toBe(true)
			expect(vueWrapper.findComponent({ name: 'UserMenuDetails' }).props('userMenuDetailsInfos')).toStrictEqual(testHelper.modified('userMenuInfos').userMenuDetailsInfos)
		})
	})

	// TODO: HS, à réparer
	describe.skip('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof UserMenu>>
		beforeEach(() => {
			vueWrapper = shallowMount(UserMenu, { props: requiredPropValues() })
		})

		it('emitEventAccount', async () => {
			await vueWrapper.findComponent(AmeliproIconBtn).trigger('click')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('click:account')).toStrictEqual(undefined)
			await vueWrapper.findComponent(AmeliproBtn).trigger('click')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('click:account')).toStrictEqual([[]])
		})

		it('emitEventLogout', async () => {
			await vueWrapper.findComponent(AmeliproIconBtn).trigger('click')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('click:logout')).toStrictEqual(undefined)
			await vueWrapper.findAllComponents(AmeliproBtn).at(vueWrapper.findAllComponents(AmeliproBtn).length - 1)?.trigger('click')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('click:logout')).toStrictEqual([[]])
		})
	})
})
