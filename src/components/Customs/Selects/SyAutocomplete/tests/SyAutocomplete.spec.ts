import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VMenu, VChip } from 'vuetify/components'

import SyAutocomplete from '../SyAutocomplete.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

describe('SyAutocomplete', () => {
	let wrapper: ReturnType<typeof mount<typeof SyAutocomplete>>
	const menuId = 'sy-autocomplete-menu-test'

	const getMenu = () => document.body.querySelector(`#${menuId}`)
	const getOption = (index: number) => document.body.querySelector(`#${menuId}-option-${index}`)
	const isMenuOverlayActive = () => !!document.body.querySelector(`.v-overlay--active #${menuId}`)
	const getInputEl = () => {
		const el = document.getElementById(`${menuId}-input`)
		if (!el) return null
		if (el instanceof HTMLInputElement) return el
		return el.querySelector('input') as HTMLInputElement | null
	}

	const items = [
		{ text: 'Option 1', value: '1' },
		{ text: 'Option 2', value: '2' },
		{ text: 'Option 3', value: '3' },
	]

	beforeEach(() => {
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: null,
				items,
				label: 'Test Autocomplete',
				textKey: 'text',
				valueKey: 'value',
				menuId,
			},
			attachTo: document.body,
		})
	})

	afterEach(() => {
		wrapper.unmount()
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(VMenu).exists()).toBe(true)
		expect(getMenu()).toBeNull() // Menu closed by default
	})

	it('opens menu when input is clicked', async () => {
		const input = wrapper.find('input')
		await input.trigger('click')
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(getMenu()).not.toBeNull()
	})

	it('filters items based on search', async () => {
		await wrapper.setProps({ modelValue: '1' })
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.search).toBe('Option 1')
	})

	it('emits update:modelValue when item is selected', async () => {
		wrapper.vm.selectItem('1')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
	})

	it('supports multiple selection', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [],
				items,
				multiple: true,
				label: 'Test Multiple',
				textKey: 'text',
				valueKey: 'value',
				menuId,
			},
			attachTo: document.body,
		})
		const input = wrapper.find('input')
		await input.trigger('click')
		await flushPromises()
		await wrapper.vm.$nextTick()

		const option0 = getOption(0)
		expect(option0).not.toBeNull()
		option0?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }))
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['1']])
	})

	it('clears typed query after selecting an item in multiple mode without chips', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [],
				items,
				multiple: true,
				chips: false,
				label: 'Test Multiple No Chips',
				textKey: 'text',
				valueKey: 'value',
				menuId,
			},
			attachTo: document.body,
		})

		// User types a query
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.exists()).toBe(true)
		textField.vm.$emit('update:modelValue', 'Opt')
		await flushPromises()
		await wrapper.vm.$nextTick()

		// Select first option
		const option0 = getOption(0)
		expect(option0).not.toBeNull()
		option0?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }))
		await flushPromises()
		await wrapper.vm.$nextTick()

		// Some environments can emit a follow-up input event with the previous DOM value.
		// Ensure it doesn't re-populate the query after selection.
		textField.vm.$emit('update:modelValue', 'Option 1, Opt')
		await flushPromises()
		await wrapper.vm.$nextTick()

		// Query should be cleared, leaving only selected label prefix in input
		expect(wrapper.vm.search).toBe('')
		expect(getInputEl()!.value).toBe('Option 1, ')
	})

	it('displays chips in multiple mode', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: items.slice(0, 1),
				items,
				multiple: true,
				chips: true,
				returnObject: true,
				label: 'Test Chips',
				textKey: 'text',
				valueKey: 'value',
			},
		})

		await wrapper.vm.$nextTick()
		const chips = wrapper.findAllComponents(VChip)
		expect(chips.length).toBe(1)
		expect(chips[0]!.text()).toBe('Option 1')
	})

	it('removes chip when close button is clicked', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: items.slice(0, 1),
				items,
				multiple: true,
				chips: true,
				returnObject: true,
				label: 'Test Chips',
				textKey: 'text',
				valueKey: 'value',
			},
		})

		await wrapper.vm.$nextTick()
		const chip = wrapper.findComponent(VChip)
		await chip.vm.$emit('click:close')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
	})

	it('shows clear button when clearable and has selection', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: items[0],
				items,
				clearable: true,
				label: 'Test Clear',
				textKey: 'text',
				valueKey: 'value',
			},
		})

		await wrapper.vm.$nextTick()
		const clearButton = wrapper.find('button[aria-label="Réinitialiser la sélection"]')
		expect(clearButton.exists()).toBe(true)
	})

	it('clears selection when clear button is clicked', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: items[0],
				items,
				clearable: true,
				label: 'Test Clear',
				textKey: 'text',
				valueKey: 'value',
			},
		})

		await wrapper.vm.$nextTick()
		const clearButton = wrapper.find('button[aria-label="Réinitialiser la sélection"]')
		await clearButton.trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
	})

	it('validates field with custom rules', async () => {
		wrapper.unmount()
		const customRule = {
			type: 'custom',
			options: {
				validate: value => Array.isArray(value) && value.length >= 2,
				message: 'Sélectionnez au moins 2 éléments',
			},
		}

		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: items.slice(0, 1),
				items,
				multiple: true,
				label: 'Test Validation',
				textKey: 'text',
				valueKey: 'value',
				customRules: [customRule],
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.find('input').trigger('blur')
		await wrapper.vm.$nextTick()

		const messages = wrapper.find('.v-messages')
		expect(messages.text()).toContain('Sélectionnez au moins 2 éléments')
	})

	it('handles keyboard navigation', async () => {
		await wrapper.vm.$nextTick()
		await flushPromises()

		const inputEl = getInputEl()
		expect(inputEl).not.toBeNull()
		inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(getMenu()).not.toBeNull()
	})

	it('selects item on enter key', async () => {
		await wrapper.vm.$nextTick()
		await flushPromises()

		const inputEl = getInputEl()
		expect(inputEl).not.toBeNull()
		inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(getMenu()).not.toBeNull()

		inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
	})

	it('closes menu on escape', async () => {
		const input = wrapper.find('input')
		await input.trigger('click') // Open menu
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(getMenu()).not.toBeNull()
		expect(isMenuOverlayActive()).toBe(true)

		const inputEl = getInputEl()
		expect(inputEl).not.toBeNull()
		inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()
		// Vuetify VMenu keeps teleported content mounted; check overlay visibility instead of DOM removal
		expect(getMenu()).not.toBeNull()
		expect(isMenuOverlayActive()).toBe(false)
	})

	it('selects and deselects items in multiple mode (mouse + keyboard)', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [],
				items,
				multiple: true,
				label: 'Test Multiple',
				textKey: 'text',
				valueKey: 'value',
				menuId,
			},
			attachTo: document.body,
		})

		// Keyboard: select + deselect option 0 in multiple mode
		const inputEl = getInputEl()
		expect(inputEl).not.toBeNull()
		inputEl?.focus()
		await flushPromises()
		await wrapper.vm.$nextTick()

		// ArrowDown opens the menu and sets the active option to 0
		inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(getMenu()).not.toBeNull()

		// Select option 0
		inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()
		let option0 = getOption(0)
		expect(option0?.getAttribute('aria-selected')).toBe('true')

		// Deselect option 0
		inputEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()
		option0 = getOption(0)
		expect(option0?.getAttribute('aria-selected')).toBe('false')
	})
})
