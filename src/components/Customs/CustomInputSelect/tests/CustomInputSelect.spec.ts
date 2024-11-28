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

	it('closes the menu on escape key press', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(CustomSelect, {
			props: { items },
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.custom-select').trigger('click')
		await wrapper.find('.v-list').trigger('keydown.esc')
		expect(wrapper.find('.v-list').exists()).toBe(false)
	})

	it('renders error messages when provided', () => {
		const errorMessages = ['Error 1']
		const wrapper = mount(CustomSelect, {
			props: { errorMessages },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-messages__message').text()).toContain('Error 1')
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

	it('returns the correct item text using getItemText', () => {
		const wrapper = mount(CustomSelect, {
			props: { textKey: 'text' },
			global: {
				plugins: [vuetify],
			},
		})
		const item = { text: 'Option 1', value: '1' }
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.getItemText(item)).toBe('Option 1')
	})

	it('returns default text when selectedItem is null', () => {
		const wrapper = mount(CustomSelect, {
			global: {
				plugins: [vuetify],
			},
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.selectedItemText).toBe('Sélectionnez une option')
	})

	it('returns the correct text when selectedItem is an object', async () => {
		const wrapper = mount(CustomSelect, {
			props: { modelValue: { text: 'Option 1', value: '1' }, textKey: 'text' },
			global: {
				plugins: [vuetify],
			},
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		await wrapper.setProps({ modelValue: { text: 'Option 1', value: '1' } })
		expect(instance.selectedItemText).toBe('Option 1')
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

	it('does not apply the outlined button class when outlined is false', () => {
		const wrapper = mount(CustomSelect, {
			props: { outlined: false },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.custom-select').classes()).not.toContain('v-btn--variant-outlined')
	})

	it('updates selectedItem when v-model changes', async () => {
		const wrapper = mount(CustomSelect, {
			props: { modelValue: { text: 'Option 1', value: '1' }, textKey: 'text' },
			global: {
				plugins: [vuetify],
			},
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.selectedItem).toEqual({ text: 'Option 1', value: '1' })

		await wrapper.setProps({ modelValue: { text: 'Option 2', value: '2' } })
		expect(instance.selectedItem).toEqual({ text: 'Option 2', value: '2' })
	})

	it('emits update:modelValue when selectedItem changes', async () => {
		const wrapper = mount(CustomSelect, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			props: { modelValue: null as any, textKey: 'text' },
			global: {
				plugins: [vuetify],
			},
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		instance.selectItem({ text: 'Option 1', value: '1' })
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual([{ text: 'Option 1', value: '1' }])
	})
})
