import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
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
})
