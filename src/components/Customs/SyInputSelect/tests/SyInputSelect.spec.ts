import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import SyInputSelect from '../SyInputSelect.vue'
import { vuetify } from '@tests/unit/setup'

describe('SyInputSelect', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(SyInputSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.sy-input-select').text()).toBe('Sélectionnez une option')
	})

	it('displays the selected item text', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(SyInputSelect, {
			props: { items, modelValue: { text: 'Option 1', value: '1' } },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.sy-input-select').text()).toContain('Option 1')
	})

	it('does not render error messages when not provided', () => {
		const wrapper = mount(SyInputSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-messages__message').exists()).toBe(false)
	})

	it('does not render the label when not provided', () => {
		const wrapper = mount(SyInputSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('label').exists()).toBe(false)
	})

	it('formats items correctly', () => {
		const items = ['Option 1', 'Option 2']
		const wrapper = mount(SyInputSelect, {
			props: { items, textKey: 'text', valueKey: 'value' },
			global: {
				plugins: [vuetify],
			},
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const formattedItems = (wrapper.vm as any).formattedItems
		expect(formattedItems).toEqual([
			{ text: 'Option 1', value: 'Option 1' },
			{ text: 'Option 2', value: 'Option 2' },
		])
	})

	it('applies the correct button class when outlined is true', () => {
		const wrapper = mount(SyInputSelect, {
			props: { outlined: true },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.sy-input-select').classes()).toContain('v-btn--variant-outlined')
	})

	it('toggles the menu when the button is clicked', async () => {
		const wrapper = mount(SyInputSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		const button = wrapper.find('.sy-input-select')
		await button.trigger('click')
		expect(wrapper.vm.isOpen).toBe(true)
		await button.trigger('click')
		expect(wrapper.vm.isOpen).toBe(false)
	})

	it('use closeList method', async () => {
		const wrapper = mount(SyInputSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.vm.closeList()
		expect(wrapper.vm.isOpen).toBe(false)
	})

	it('selectItem method', async () => {
		const wrapper = mount(SyInputSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.vm.selectItem({ text: 'Option 1', value: '1' })
		expect(wrapper.vm.isOpen).toBe(false)
		expect(wrapper.vm.selectedItem).toEqual({ text: 'Option 1', value: '1' })
	})

	it('getItemText method', async () => {
		const wrapper = mount(SyInputSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		const item = { text: 'Option 1', value: '1' }
		const text = wrapper.vm.getItemText(item)
		expect(text).toBe('Option 1')
	})

	it('watch modelValue', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { modelValue: { text: 'Option 1', value: '1' } },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.vm.selectedItem).toEqual({ text: 'Option 1', value: '1' })
		await wrapper.setProps({ modelValue: { text: 'Option 2', value: '2' } })
		expect(wrapper.vm.selectedItem).toEqual({ text: 'Option 2', value: '2' })
	})

	it('watch errorMessages', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { errorMessages: ['Error message'] },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-messages__message').exists()).toBe(true)
		await wrapper.setProps({ errorMessages: [] })
		expect(wrapper.find('.v-messages__message').exists()).toBe(false)
	})
})
