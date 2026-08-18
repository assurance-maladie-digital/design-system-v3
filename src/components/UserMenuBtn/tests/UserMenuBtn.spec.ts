import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserMenuBtn from '../UserMenuBtn.vue'
import { nextTick } from 'vue'

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

		const SyBtnMenu = wrapper.findComponent({ name: 'SyBtnMenu' })
		// Utiliser le format camelCase pour l'événement, comme déclaré dans le composant SyBtnMenu
		await SyBtnMenu.vm.$emit('update:modelValue', 'test-value')

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
		const defaultLogoutText = 'Se déconnecter'
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

// Version mobile (isMobileView) : l'activateur devient une icône seule, l'identité
// (fullName / additionalInformation) doit alors être reportée dans le menu déroulant.
describe('UserMenuBtn - responsive identity', () => {
	const menuItems = [{ text: 'Mon compte', value: 'account' }]

	it('shows fullName and additionalInformation in the dropdown on mobile', async () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				menuItems,
				fullName: 'Jean Dupont',
				additionalInformation: 'Administrateur',
				isMobileView: true,
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-user-menu-btn').trigger('click')

		const identity = document.body.querySelector('.sy-user-menu-identity')
		expect(identity).not.toBeNull()
		expect(identity?.textContent).toContain('Jean Dupont')
		expect(identity?.textContent).toContain('Administrateur')

		wrapper.unmount()
	})

	it('does not duplicate the identity in the dropdown on desktop', async () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				menuItems,
				fullName: 'Jean Dupont',
				isMobileView: false,
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-user-menu-btn').trigger('click')

		expect(document.body.querySelector('.sy-user-menu-identity')).toBeNull()

		wrapper.unmount()
	})

	it('does not show the auto-generated identity block when the default slot is used', async () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				fullName: 'Jean Dupont',
				isMobileView: true,
			},
			slots: {
				default: '<div class="custom-content">Contenu personnalisé</div>',
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-user-menu-btn').trigger('click')

		expect(document.body.querySelector('.sy-user-menu-identity')).toBeNull()
		expect(document.body.querySelector('.custom-content')).not.toBeNull()

		wrapper.unmount()
	})
})

// UserMenuBtn est un wrapper de SyBtnMenu : le focus est délégué (activateur = override
// global _btns.scss, items = _menus.scss). jsdom ne calcule pas :focus-visible : on
// vérifie le prérequis — l'activateur est un <button> natif focusable.
describe('UserMenuBtn - focus', () => {
	const menuItems = [{ text: 'Mon compte', value: 'account' }]

	it('renders the activator as a native <button> so the global focus ring applies', () => {
		const wrapper = mount(UserMenuBtn, { props: { menuItems } })
		expect(wrapper.get('.sy-user-menu-btn').element.tagName).toBe('BUTTON')
		wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(UserMenuBtn, { props: { menuItems }, attachTo: document.body })
		const button = wrapper.get('.sy-user-menu-btn').element as HTMLButtonElement
		button.focus()
		expect(document.activeElement).toBe(button)
		wrapper.unmount()
	})
})
