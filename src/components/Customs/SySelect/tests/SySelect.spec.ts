import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import SySelect from '../SySelect.vue'
import { vuetify } from '@tests/unit/setup'

type ItemType = {
	[key: string]: unknown
}

describe('SySelect.vue', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(SySelect, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.sy-select').exists()).toBe(true)
	})

	it('displays the selected item text', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(SySelect, {
			props: { items, modelValue: { text: 'Option 1', value: '1' } },
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findAll('.v-list-item').at(0)
		if (firstItem) {
			await firstItem.trigger('click')
		}
		expect(wrapper.find('input').element.value).toBe('Option 1')
	})

	it('closes the menu on escape key press', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(SySelect, {
			props: { items },
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.sy-select').trigger('click')
		await wrapper.find('.v-list').trigger('keydown.esc')
		expect(wrapper.find('.v-list').exists()).toBe(false)
	})

	it('renders error messages when provided', () => {
		const errorMessages = ['Error 1']
		const wrapper = mount(SySelect, {
			props: { errorMessages },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-messages__message').text()).toContain('Error 1')
	})

	it('does not render error messages when not provided', () => {
		const wrapper = mount(SySelect, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-messages__message').exists()).toBe(false)
	})

	it('returns the correct item text using getItemText', () => {
		const wrapper = mount(SySelect, {
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
		const wrapper = mount(SySelect, {
			global: {
				plugins: [vuetify],
			},
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.selectedItemText).toBe('')
	})

	it('returns the correct text when selectedItem is an object', async () => {
		const wrapper = mount(SySelect, {
			props: {
				modelValue: { text: 'Option 1', value: '1' },
				textKey: 'text',
				returnObject: true,
			},
			global: {
				plugins: [vuetify],
			},
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		await wrapper.setProps({ modelValue: { text: 'Option 1', value: '1' } })
		expect(instance.selectedItemText).toBe('Option 1')
	})

	it('returns the correct text when selectedItem is a value', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
				modelValue: '1',
				textKey: 'text',
			},
			global: {
				plugins: [vuetify],
			},
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		await wrapper.setProps({ modelValue: '2' })
		await wrapper.vm.$nextTick()
		expect(instance.selectedItemText).toBe('Option 2')
	})

	it('formats items correctly', () => {
		const items = ['Option 1', 'Option 2'] as unknown as ItemType[]
		const wrapper = mount(SySelect, {
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
		const wrapper = mount(SySelect, {
			props: { outlined: true },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.v-field--variant-outlined').exists()).toBe(true)
	})

	it('does not apply the outlined button class when outlined is false', () => {
		const wrapper = mount(SySelect, {
			props: { outlined: false },
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.sy-select').classes()).not.toContain('v-btn--variant-outlined')
	})

	it('updates selectedItem when v-model changes', async () => {
		const wrapper = mount(SySelect, {
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
		const wrapper = mount(SySelect, {
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
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['1'])
	})

	it('closes the menu when v-click-outside directive is called', async () => {
		const wrapper = mount(SySelect, {
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.sy-select').trigger('click')
		expect(wrapper.find('.v-list').exists()).toBe(true)
		await wrapper.find('.sy-select').trigger('mouseleave')
		await wrapper.find('.sy-select').trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.v-list').exists()).toBe(false)
	})

	it('use closeList method', async () => {
		const wrapper = mount(SySelect, {
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.vm.closeList()
		expect(wrapper.vm.isOpen).toBe(false)
	})

	it('emit the value when returnObject is false', async () => {
		const wrapper = mount(SySelect, {
			props: {
				returnObject: false,
				items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
			},
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['1'])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['2'])
	})

	it('emit the object when returnObject is true', async () => {
		const wrapper = mount(SySelect, {
			props: {
				returnObject: true,
				items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual([{ text: 'Option 1', value: '1' }])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][1]).toEqual([{ text: 'Option 2', value: '2' }])
	})

	it('emit the value when returnObject is false with textKey and keyValue set', async () => {
		const wrapper = mount(SySelect, {
			props: {
				returnObject: false,
				textKey: 'theText',
				valueKey: 'theValue',
				items: [{ theText: 'Option 1', theValue: '1' }, { theText: 'Option 2', theValue: '2' }],
			},
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['1'])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['2'])
	})

	it('emit the object when returnObject is true with textKey and keyValue set', async () => {
		const wrapper = mount(SySelect, {
			props: {
				returnObject: true,
				textKey: 'theText',
				valueKey: 'theValue',
				items: [{ theText: 'Option 1', theValue: '1' }, { theText: 'Option 2', theValue: '2' }],
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual([{ theText: 'Option 1', theValue: '1' }])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][1]).toEqual([{ theText: 'Option 2', theValue: '2' }])
	})

	it('emit the value when items is an array of string', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: ['Option 1', 'Option 2'] as unknown as ItemType[],
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['Option 1'])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['Option 2'])
	})

	it('is clearable when clearable is true', async () => {
		const wrapper = mount(SySelect, {
			props: {
				modelValue: '1',
				clearable: true,
				items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
			},
			global: {
				plugins: [vuetify],
			},
		})

		const clearBtn = wrapper.find('.sy-select__clear-icon')
		expect(clearBtn.exists()).toBe(true)
		await clearBtn.trigger('click')
		expect(wrapper.emitted()['update:modelValue'][0]).toEqual([null])
	})
})
