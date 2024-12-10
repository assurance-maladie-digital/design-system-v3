import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyBtnSelect from '../SyBtnSelect.vue'
import { vuetify } from '@tests/unit/setup'

describe('SyBtnSelect', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				primaryInfo: 'John Doe',
			},
		})

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.text()).toContain('John Doe')
	})

	it('shows secondaryInfo if provided', () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				primaryInfo: 'John Doe',
				secondaryInfo: 'Additional Info',
			},
		})

		expect(wrapper.text()).toContain('Additional Info')
	})

	it('emits "update:modelValue" when an item is selected', async () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				menuItems: [
					{ text: 'Option 1', value: 'option1' },
					{ text: 'Option 2', value: 'option2' },
				],
				primaryInfo: 'John Doe',
			},
		})

		const button = wrapper.find('.vd-user-menu-btn')
		await button.trigger('click')

		expect(wrapper.vm.isOpen).toBe(true)

		const listItem = wrapper.findAllComponents({ name: 'VListItem' }).at(0)
		expect(listItem).toBeTruthy()
		await listItem?.trigger('click')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')![0]).toEqual([
			{ text: 'Option 1', value: 'option1' },
		])
	})

	it('toggles the menu open and closed', async () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				primaryInfo: 'John Doe',
			},
		})

		const button = wrapper.find('.vd-user-menu-btn')
		expect(wrapper.vm.isOpen).toBe(false)

		await button.trigger('click')
		expect(wrapper.vm.isOpen).toBe(true)

		await button.trigger('click')
		expect(wrapper.vm.isOpen).toBe(false)
	})

	it('formats menu items correctly', () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				primaryInfo: 'John Doe',
				menuItems: ['Option 1', 'Option 2'],
			},
		})

		const formattedItems = wrapper.vm.formattedItems
		expect(formattedItems).toEqual([
			{ text: 'Option 1', value: 'Option 1' },
			{ text: 'Option 2', value: 'Option 2' },
		])
	})

	it('updates selectedItem when modelValue changes', async () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: 'initial-value',
				primaryInfo: 'John Doe',
			},
		})

		expect(wrapper.vm.selectedItem).toBe('initial-value')

		await wrapper.setProps({ modelValue: 'new-value' })
		expect(wrapper.vm.selectedItem).toBe('new-value')
	})

	it('renders the primaryInfo in a span when isMobileVersion and hideIcon are true', async () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				primaryInfo: 'John Doe',
				isMobileView: true,
				hideIcon: true,
			},
		})

		const span = wrapper.find('span.font-weight-bold.text-caption')

		expect(span.text()).toBe('John Doe')
	})

	it('does not render the span if isMobileVersion is false', () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				primaryInfo: 'John Doe',
				isMobileView: false,
				hideIcon: true,
			},
		})

		const span = wrapper.find('span.font-weight-bold.text-sm-caption')
		expect(span.exists()).toBe(false)
	})

	it('does not render the span if hideIcon is false', () => {
		const wrapper = mount(SyBtnSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				primaryInfo: 'John Doe',
				isMobileView: true,
				hideIcon: false,
			},
		})

		const span = wrapper.find('span.font-weight-bold.text-sm-caption')
		expect(span.exists()).toBe(false)
	})
})
