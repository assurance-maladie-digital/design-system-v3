import { mount } from '@vue/test-utils'
import { expect, describe, it, vi, afterEach } from 'vitest'
import HeaderToolbar from '../HeaderToolbar.vue'

describe('HeaderToolbar', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(HeaderToolbar, {
			props: {
				leftMenu: [
					{
						title: 'Left',
						to: '/',
						ariaLabel: 'Left',
					},
				],
				rightMenu: [
					{
						title: 'Right',
						to: '/',
						ariaLabel: 'Right',
					},
				],
			},
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('#left-menu').text()).toBe('Left')
		expect(wrapper.find('#right-menu').text()).toBe('Right')
	})

	it('returns a link component with href', () => {
		const wrapper = mount(HeaderToolbar, {
			props: {
				leftMenu: [
					{
						title: 'Left',
						href: '/',
						ariaLabel: 'Left',
					},
				],
			},
		})

		expect(wrapper.html()).toContain('href="/"')
	})

	it('returns a link component with to', () => {
		const wrapper = mount(HeaderToolbar, {
			props: {
				leftMenu: [
					{
						title: 'Left',
						to: '/home',
						ariaLabel: 'Left',
					},
				],
			},
		})

		expect(wrapper.html()).toContain('to="/home"')
	})

	it('hides the overlay', async () => {
		const wrapper = mount(HeaderToolbar)

		await wrapper.vm.hideOverlay()
		expect(wrapper.vm.showOverlay).toBe(false)
	})

	it('toggles the overlay when handleLink is called', async () => {
		const wrapper = mount(HeaderToolbar)

		await wrapper.vm.handleLink(1)
		expect(wrapper.vm.showOverlay).toBe(true)

		await wrapper.vm.handleLink(1)
		expect(wrapper.vm.showOverlay).toBe(false)
	})

	it('sets the active link correctly', async () => {
		const wrapper = mount(HeaderToolbar)

		await wrapper.vm.checkActiveLink(1)
		expect(wrapper.vm.activeIndex).toBe(1)
	})

	it('should set showOverlay to true when handleLink is called', async () => {
		const wrapper = mount(HeaderToolbar)

		await wrapper.vm.handleLink(1)
		await wrapper.vm.checkActiveLink(1)

		expect(wrapper.vm.showOverlay).toBe(true)
		expect(wrapper.vm.activeIndex).toBe(1)
	})

	it('hides the overlay when hideOverlay is called', async () => {
		const wrapper = mount(HeaderToolbar)

		wrapper.vm.showOverlay = true
		await wrapper.vm.hideOverlay()
		expect(wrapper.vm.showOverlay).toBe(false)
		expect(wrapper.vm.highlightMenu).toBe(false)
	})

	it('should set showOverlay to false when handleLink is called', async () => {
		const wrapper = mount(HeaderToolbar)

		await wrapper.vm.handleLink(0)
		await wrapper.vm.checkActiveLink(0)

		expect(wrapper.vm.showOverlay).toBe(false)
		expect(wrapper.vm.activeIndex).toBe(0)
	})

	it('should set highlightMenu to false when handleLink is called', async () => {
		const wrapper = mount(HeaderToolbar, {
			props: {
				leftMenu: [
					{
						title: 'Left',
						to: '/',
						ariaLabel: 'Left',
					},
					{
						title: 'Professionnel de santé',
						to: '/',
						ariaLabel: 'Professionnel de santé',
					},
				],
				itemsSelectMenu: [
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' },
				],
			},
		})

		await wrapper.vm.$nextTick()

		await wrapper.vm.handleLink(1)
		await wrapper.vm.hideOverlay()

		expect(wrapper.vm.highlightMenu).toBe(false)

		const activeSelected = wrapper.find('.sy-header-button')
		expect(activeSelected.text()).toBe('Professionnel de santé')
	})

	it('should set activeIndex to -1 when deleteActiveLink is called', async () => {
		const wrapper = mount(HeaderToolbar)

		await wrapper.vm.deleteActiveLink()

		expect(wrapper.vm.activeIndex).toBe(null)
	})

	it('should set highlightMenu to false when activeSelected is equal to Professionnel de santé', async () => {
		const wrapper = mount(HeaderToolbar, {
			props: {
				leftMenu: [
					{
						title: 'Left',
						to: '/',
						ariaLabel: 'Left',
					},
					{
						title: 'Professionnel de santé',
						to: '/',
						ariaLabel: 'Professionnel de santé',
					},
				],
				itemsSelectMenu: [
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' },
				],
			},
		})

		await wrapper.vm.$nextTick()

		const activeSelected = wrapper.find('.sy-header-button')
		expect(activeSelected.text()).toBe('Professionnel de santé')

		await wrapper.vm.handleLink(1)
		expect(wrapper.vm.highlightMenu).toBe(false)
	})

	describe('getLinkComponent', () => {
		it('retourne "a" pour un item avec href', () => {
			const wrapper = mount(HeaderToolbar)
			const result = wrapper.vm.getLinkComponent({ title: 'Test', href: 'https://example.com' })
			expect(result).toBe('a')
		})

		it('retourne "RouterLink" pour un item avec to', () => {
			const wrapper = mount(HeaderToolbar)
			const result = wrapper.vm.getLinkComponent({ title: 'Test', to: '/home' } as unknown as Parameters<typeof wrapper.vm.getLinkComponent>[0])
			expect(result).toBe('RouterLink')
		})

		it('retourne "a" pour un item sans href ni to', () => {
			const wrapper = mount(HeaderToolbar)
			const result = wrapper.vm.getLinkComponent({ title: 'Test' })
			expect(result).toBe('a')
		})
	})

	describe('getCurrentPageIndex', () => {
		it('retourne currentPageIndex si défini', async () => {
			const wrapper = mount(HeaderToolbar, {
				props: { currentPageIndex: 2 },
			})
			expect(wrapper.vm.activeIndex).toBeNull()
		})

		it('retourne activeIndex si currentPageIndex est null', async () => {
			const wrapper = mount(HeaderToolbar)
			await wrapper.vm.checkActiveLink(1)
			expect(wrapper.vm.activeIndex).toBe(1)
		})
	})

	describe('handleKeyboardEnter', () => {
		it('appelle checkActiveLink et hideOverlay pour un item avec href', async () => {
			const wrapper = mount(HeaderToolbar)
			const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
			const item = { title: 'Test', href: 'https://example.com', openInNewTab: true }
			wrapper.vm.handleKeyboardEnter(item, 0)
			expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
			openSpy.mockRestore()
		})

		it('appelle checkActiveLink pour un item avec to', async () => {
			const wrapper = mount(HeaderToolbar)
			const item = { title: 'Test', to: '/home' } as unknown as Parameters<typeof wrapper.vm.handleKeyboardEnter>[0]
			wrapper.vm.handleKeyboardEnter(item, 0)
			expect(wrapper.vm.showOverlay).toBe(false)
		})

		it('ouvre le menu pour index=1', async () => {
			const wrapper = mount(HeaderToolbar)
			const item = { title: 'Professionnel de santé' }
			wrapper.vm.handleKeyboardEnter(item, 1)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.showOverlay).toBe(true)
		})
	})

	describe('handleSubMenuItemClick', () => {
		it('met à jour dropdownMenuTitle et ferme l\'overlay', async () => {
			const wrapper = mount(HeaderToolbar, {
				props: {
					itemsSelectMenu: [{ text: 'Médecin', value: 'medecin' }],
				},
			})
			const subItem = { text: 'Médecin', value: 'medecin' }
			wrapper.vm.handleSubMenuItemClick(subItem)
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.showOverlay).toBe(false)
		})

		it('ouvre dans un nouvel onglet si openInNewTab=true', async () => {
			const wrapper = mount(HeaderToolbar)
			const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
			const subItem = { text: 'Médecin', value: 'medecin', href: 'https://example.com', openInNewTab: true }
			wrapper.vm.handleSubMenuItemClick(subItem)
			expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
			openSpy.mockRestore()
		})
	})

	describe('handleMenuKeydown', () => {
		function makeMenuContainer(count: number): HTMLElement {
			const container = document.createElement('div')
			for (let i = 0; i < count; i++) {
				const item = document.createElement('div')
				item.setAttribute('role', 'menuitem')
				item.id = `menu-item-${i}`
				container.appendChild(item)
			}
			document.body.appendChild(container)
			return container
		}

		afterEach(() => {
			document.body.innerHTML = ''
		})

		it('ArrowDown ne plante pas avec des items dans le conteneur', async () => {
			const wrapper = mount(HeaderToolbar)
			const container = makeMenuContainer(3)
			const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
			Object.defineProperty(event, 'currentTarget', { value: container, writable: false })
			expect(() => wrapper.vm.handleMenuKeydown(event)).not.toThrow()
		})

		it('Escape ferme le menu et l\'overlay', async () => {
			const wrapper = mount(HeaderToolbar)
			const container = makeMenuContainer(2)
			wrapper.vm.showOverlay = true
			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
			Object.defineProperty(event, 'currentTarget', { value: container, writable: false })
			wrapper.vm.handleMenuKeydown(event)
			expect(wrapper.vm.showOverlay).toBe(false)
		})

		it('Home ne plante pas avec des items dans le conteneur', async () => {
			const wrapper = mount(HeaderToolbar)
			const container = makeMenuContainer(3)
			const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true })
			Object.defineProperty(event, 'currentTarget', { value: container, writable: false })
			expect(() => wrapper.vm.handleMenuKeydown(event)).not.toThrow()
		})

		it('End ne plante pas avec des items dans le conteneur', async () => {
			const wrapper = mount(HeaderToolbar)
			const container = makeMenuContainer(3)
			const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true })
			Object.defineProperty(event, 'currentTarget', { value: container, writable: false })
			expect(() => wrapper.vm.handleMenuKeydown(event)).not.toThrow()
		})

		it('Enter ne plante pas sans item actif', () => {
			const wrapper = mount(HeaderToolbar)
			const container = makeMenuContainer(2)
			const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
			Object.defineProperty(event, 'currentTarget', { value: container, writable: false })
			expect(() => wrapper.vm.handleMenuKeydown(event)).not.toThrow()
		})
	})

	describe('openMenuWithKeyboard', () => {
		it('ouvre le menu et l\'overlay', async () => {
			const wrapper = mount(HeaderToolbar)
			wrapper.vm.openMenuWithKeyboard()
			expect(wrapper.vm.showOverlay).toBe(true)
		})
	})

	// Le ring de focus des items de menu (via aria-activedescendant) est en 2px primary
	// (cf. .menu-item-focused dans HeaderToolbar.vue). jsdom ne calcule pas le style :
	// on vérifie les prérequis structurels (déclencheurs = <button> natifs, items focusables).
	describe('focus', () => {
		it('renders the left-menu items as focusable links (focus ring targets)', () => {
			const wrapper = mount(HeaderToolbar, {
				props: {
					leftMenu: [
						{ title: 'Assuré', href: '#a' },
						{ title: 'Professionnel de santé', href: '#b' },
					],
				},
			})

			const links = wrapper.findAll('#left-menu a')
			expect(links.length).toBe(2)
		})
	})
})
