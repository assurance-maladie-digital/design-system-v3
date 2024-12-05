import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import CustomSelect from '../CustomInputSelect.vue'
import { vuetify } from '@tests/unit/setup'

describe('CustomInputSelect', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(CustomSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.custom-select').text()).toBe('Sélectionnez une option')
	})

	it('toggles the menu when clicked', async () => {
		const wrapper = mount(CustomSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.custom-select').trigger('click')
		expect(wrapper.find('.v-list').exists()).toBe(true)
		await wrapper.find('.custom-select').trigger('click')
		expect(wrapper.find('.v-list').exists()).toBe(false)
	})

	it('selects an item when clicked', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(CustomSelect, {
			props: { items },
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.custom-select').trigger('click')
		const firstItem = wrapper.findAll('.v-list-item').at(0)
		if (firstItem) {
			await firstItem.trigger('click')
		}
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual([{ text: 'Option 1', value: '1' }])
	})

	it('closes the menu when an item is selected', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(CustomSelect, {
			props: { items },
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.custom-select').trigger('click')
		const firstItem = wrapper.findAll('.v-list-item').at(0)
		if (firstItem) {
			await firstItem.trigger('click')
		}
		expect(wrapper.find('.v-list').exists()).toBe(false)
	})

	it('displays the selected item text', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(CustomSelect, {
			props: { items, modelValue: { text: 'Option 1', value: '1' } },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.custom-select').text()).toContain('Option 1')
	})

	it('does not render error messages when not provided', () => {
		const wrapper = mount(CustomSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-messages__message').exists()).toBe(false)
	})

	it('does not render the label when not provided', () => {
		const wrapper = mount(CustomSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('label').exists()).toBe(false)
	})

	it('formats items correctly', () => {
		const items = ['Option 1', 'Option 2']
		const wrapper = mount(CustomSelect, {
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
		const wrapper = mount(CustomSelect, {
			props: { outlined: true },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.custom-select').classes()).toContain('v-btn--variant-outlined')
	})
})
