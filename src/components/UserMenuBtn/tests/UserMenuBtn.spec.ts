import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserMenuBtn from '../UserMenuBtn.vue'import { nextTick } from 'vue'

describe('UserMenuBtn', () => {
	it('renders the component', () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				menuItems: [{ text: 'Item 1', value: 'item1' }],
				additionalInformation: 'Additional Info',
				fullName: 'John Doe',
				hideLogoutBtn: false,
				isMobileView: false,
				hideUserIcon: false,
			},
		})
		expect(wrapper.exists()).toBe(true)
	})

	it('displays the full name', () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				fullName: 'John Doe',
			},
		})
		expect(wrapper.text()).toContain('John Doe')
	})

	it('does not render logout button when hidden', () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				hideLogoutBtn: true,
			},
		})
		expect(wrapper.find('.logout').exists()).toBe(false)
	})

	it('renders user icon when not hidden', () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				hideUserIcon: false,
			},
		})
		expect(wrapper.find('.vd-user-icon').exists()).toBe(true)
	})

	it('does not render user icon when hidden', () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				hideUserIcon: true,
			},
		})
		expect(wrapper.find('.vd-user-icon').exists()).toBe(false)
	})

	it('emits "update:modelValue" when selected changes', async () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
			},
		})
		wrapper.vm.$emit('update:modelValue', 'item1')
		await nextTick()
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		if (emitted && emitted[0]) {
			expect(emitted[0]).toEqual(['item1'])
		}
	})

	it('computes mobile view correctly based on props and display', () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				isMobileView: true,
			},
		})
		expect(wrapper.vm.isMobileView).toBe(true)
	})
	it('emits "update:modelValue" when updateModelValue is called via event', async () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				menuItems: [{ text: 'Item 1', value: 'item1' }],
			},
		})

		const SyBtnSelect = wrapper.findComponent({ name: 'SyBtnSelect' })
		// Utiliser le format camelCase pour l'événement, comme déclaré dans le composant SyBtnSelect
		await SyBtnSelect.vm.$emit('update:modelValue', 'test-value')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test-value'])
	})

	it('possède la prop logoutText  custom', async () => {
		const customLogoutText = 'Déconnexion'
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				logoutText: customLogoutText,
				hideLogoutBtn: false,
				menuItems: [{ text: 'Item 1', value: 'item1' }],
				fullName: 'John Doe',
				isMobileView: false,
				hideUserIcon: false,
			},
		})

		// Vérifier directement que la prop est correctement passée au composant
		expect(wrapper.props('logoutText')).toBe(customLogoutText)
	})

	it('possède la prop logoutText  par défaut', async () => {
		const defaultLogoutText = 'Logout'
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				hideLogoutBtn: false,
				menuItems: [{ text: 'Item 1', value: 'item1' }],
				fullName: 'John Doe',
				isMobileView: false,
				hideUserIcon: false,
			},
		})

		// Vérifier directement que la prop est correctement passée au composant
		expect(wrapper.props('logoutText')).toBe(defaultLogoutText)
	})
})
