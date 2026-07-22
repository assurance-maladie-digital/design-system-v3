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
})
