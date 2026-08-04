import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SyBtnMenu from '../SyBtnMenu.vue'

describe('SyBtnMenu', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
			},
			attachTo: document.body,
		})

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.text()).toContain('John Doe')

		wrapper.unmount()
	})

	it('shows secondaryInfo if provided', () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				secondaryInfo: 'Additional Info',
			},
			attachTo: document.body,
		})

		expect(wrapper.text()).toContain('Additional Info')

		wrapper.unmount()
	})

	it('emits "update:modelValue" when an item is selected', async () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				modelValue: null,
				menuItems: [
					{ text: 'Option 1', value: 'option1' },
					{ text: 'Option 2', value: 'option2' },
				],
				primaryInfo: 'John Doe',
			},
			attachTo: document.body,
		})

		const button = wrapper.find('.sy-user-menu-btn')
		await button.trigger('click')

		expect(wrapper.vm.isOpen).toBe(true)

		const listItem = wrapper.findAllComponents({ name: 'VListItem' }).at(0)
		expect(listItem).toBeTruthy()
		await listItem?.trigger('click')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')![0]).toEqual([
			{ text: 'Option 1', value: 'option1' },
		])

		wrapper.unmount()
	})

	it('toggles the menu open and closed', async () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
			},
			attachTo: document.body,
		})

		const button = wrapper.find('.sy-user-menu-btn')
		expect(wrapper.vm.isOpen).toBe(false)

		await button.trigger('click')
		expect(wrapper.vm.isOpen).toBe(true)

		await button.trigger('click')
		expect(wrapper.vm.isOpen).toBe(false)

		wrapper.unmount()
	})

	it('formats menu items correctly', () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				menuItems: ['Option 1', 'Option 2'],
			},
			attachTo: document.body,
		})

		const formattedItems = wrapper.vm.formattedItems
		expect(formattedItems).toEqual([
			{ text: 'Option 1', value: 'Option 1' },
			{ text: 'Option 2', value: 'Option 2' },
		])

		wrapper.unmount()
	})

	it('updates selectedItem when modelValue changes', async () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				modelValue: 'initial-value',
				primaryInfo: 'John Doe',
			},
			attachTo: document.body,
		})

		expect(wrapper.vm.selectedItem).toBe('initial-value')

		await wrapper.setProps({ modelValue: 'new-value' })
		expect(wrapper.vm.selectedItem).toBe('new-value')

		wrapper.unmount()
	})

	it('renders the primaryInfo in a span when isMobileVersion and hideIcon are true', async () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				isMobileView: true,
				hideIcon: true,
			},
			attachTo: document.body,
		})

		const span = wrapper.find('span.font-weight-bold.text-caption')

		expect(span.text()).toBe('John Doe')

		wrapper.unmount()
	})

	it('does not render the span if isMobileVersion is false', () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				isMobileView: false,
				hideIcon: true,
			},
			attachTo: document.body,
		})

		const span = wrapper.find('span.font-weight-bold.text-sm-caption')
		expect(span.exists()).toBe(false)

		wrapper.unmount()
	})

	it('does not render the span if hideIcon is false', () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				isMobileView: true,
				hideIcon: false,
			},
			attachTo: document.body,
		})

		const span = wrapper.find('span.font-weight-bold.text-sm-caption')
		expect(span.exists()).toBe(false)

		wrapper.unmount()
	})

	it('renders a prepend icon when menu item provides icon', async () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				menuItems: [
					{ text: 'Administration', value: 'admin', icon: 'mdi-account' },
				],
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-user-menu-btn').trigger('click')
		await nextTick()

		const prependIcon = document.body.querySelector('.v-list-item__prepend .v-icon') as HTMLElement | null
		expect(prependIcon).not.toBeNull()
		expect(prependIcon?.classList.contains('mdi-account')).toBe(true)

		wrapper.unmount()
	})

	it('does not render a prepend icon when menu item has no icon', async () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				menuItems: [
					{ text: 'Administration', value: 'admin' },
				],
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-user-menu-btn').trigger('click')

		const prependIcon = wrapper.find('.v-list-item__prepend .v-icon')
		expect(prependIcon.exists()).toBe(false)

		wrapper.unmount()
	})

	// showIdentityInList : en mode icône seule, l'identité (primaryInfo/secondaryInfo)
	// est masquée dans l'activateur ; elle doit alors réapparaître en tête du menu.
	// Le menu (VMenu) est téléporté hors de l'arbre DOM du wrapper : on interroge
	// document.body (cf. tests existants sur .v-list-item__prepend plus haut).
	describe('identity in list', () => {
		it('shows primaryInfo and secondaryInfo in the menu when iconOnly and showIdentityInList are true', async () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					primaryInfo: 'Jean Dupont',
					secondaryInfo: 'Administrateur',
					iconOnly: true,
					showIdentityInList: true,
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

		it('does not show the identity block when showIdentityInList is false (default)', async () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					primaryInfo: 'Jean Dupont',
					secondaryInfo: 'Administrateur',
					iconOnly: true,
					hideLogoutBtn: true,
				},
				attachTo: document.body,
			})

			await wrapper.find('.sy-user-menu-btn').trigger('click')

			expect(document.body.querySelector('.sy-user-menu-identity')).toBeNull()

			wrapper.unmount()
		})

		it('does not show the identity block when iconOnly is false, even if showIdentityInList is true', async () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					primaryInfo: 'Jean Dupont',
					showIdentityInList: true,
				},
				attachTo: document.body,
			})

			await wrapper.find('.sy-user-menu-btn').trigger('click')

			expect(document.body.querySelector('.sy-user-menu-identity')).toBeNull()

			wrapper.unmount()
		})

		it('enables the menu (not disabled) when only the identity block would be shown', async () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					primaryInfo: 'Jean Dupont',
					iconOnly: true,
					showIdentityInList: true,
					hideLogoutBtn: true,
				},
				attachTo: document.body,
			})

			await wrapper.find('.sy-user-menu-btn').trigger('click')

			expect(document.body.querySelector('.sy-user-menu-identity')).not.toBeNull()

			wrapper.unmount()
		})

		it('allows overriding the identity block via the header-list-item slot', async () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					primaryInfo: 'Jean Dupont',
					iconOnly: true,
					showIdentityInList: true,
				},
				slots: {
					'header-list-item': '<div class="custom-identity">Custom</div>',
				},
				attachTo: document.body,
			})

			await wrapper.find('.sy-user-menu-btn').trigger('click')

			expect(document.body.querySelector('.custom-identity')).not.toBeNull()
			expect(document.body.querySelector('.sy-user-menu-identity')).toBeNull()

			wrapper.unmount()
		})
	})

	// Le ring de focus est géré globalement (_btns.scss) sur le bouton natif ;
	// jsdom ne calcule pas :focus-visible, on vérifie donc les prérequis structurels.
	describe('focus', () => {
		it('renders a native <button> activator so the global focus ring applies', () => {
			const wrapper = mount(SyBtnMenu, {
				props: { primaryInfo: 'John Doe' },
				attachTo: document.body,
			})

			expect(wrapper.get('.sy-user-menu-btn').element.tagName).toBe('BUTTON')

			wrapper.unmount()
		})

		it('activator is focusable', () => {
			const wrapper = mount(SyBtnMenu, {
				props: { primaryInfo: 'John Doe' },
				attachTo: document.body,
			})

			const button = wrapper.get('.sy-user-menu-btn').element as HTMLButtonElement
			button.focus()

			expect(document.activeElement).toBe(button)

			wrapper.unmount()
		})
	})
	// Le nom accessible du bouton doit rester le même quel que soit le format : ce que la version
	// compacte masque visuellement est reporté dans le libellé lu par les lecteurs d'écran. Sans
	// ça, en icône seule le bouton s'annonce « Menu utilisateur » sans dire de quel compte il
	// s'agit — le bloc d'identité en tête du menu n'y répond pas, il n'est jamais annoncé en
	// navigation clavier.
	describe('activator accessible name', () => {
		const srOnlyText = (wrapper: ReturnType<typeof mount>) =>
			wrapper.get('.sy-user-menu-btn .d-sr-only').text()

		it('keeps the plain label when the identity is visible in the activator', () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					label: 'Menu utilisateur',
					primaryInfo: 'Jean Dupont',
					secondaryInfo: 'Administrateur',
				},
				attachTo: document.body,
			})

			expect(srOnlyText(wrapper)).toBe('Menu utilisateur')

			wrapper.unmount()
		})

		it('carries the whole identity when the activator is icon only', () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					label: 'Menu utilisateur',
					primaryInfo: 'Jean Dupont',
					secondaryInfo: 'Administrateur',
					iconOnly: true,
				},
				attachTo: document.body,
			})

			expect(srOnlyText(wrapper)).toBe('Menu utilisateur, Jean Dupont, Administrateur')

			wrapper.unmount()
		})

		it('carries the secondary info only when the mobile version hides it', () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					label: 'Menu utilisateur',
					primaryInfo: 'Jean Dupont',
					secondaryInfo: 'Administrateur',
					isMobileView: true,
				},
				attachTo: document.body,
			})

			// `primaryInfo` reste affiché dans le bouton : l'ajouter le ferait annoncer deux fois.
			expect(srOnlyText(wrapper)).toBe('Menu utilisateur, Administrateur')

			wrapper.unmount()
		})

		it('omits missing values instead of leaving empty separators', () => {
			const wrapper = mount(SyBtnMenu, {
				props: {
					label: 'Menu utilisateur',
					primaryInfo: 'Jean Dupont',
					iconOnly: true,
				},
				attachTo: document.body,
			})

			expect(srOnlyText(wrapper)).toBe('Menu utilisateur, Jean Dupont')

			wrapper.unmount()
		})
	})
})
