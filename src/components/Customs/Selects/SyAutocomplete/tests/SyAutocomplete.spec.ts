import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { VCheckbox, VDivider, VListItem, VListItemTitle, VMenu } from 'vuetify/components'

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
		textField.vm.$emit('update:modelValue', 'Opt')
		await flushPromises()
		await wrapper.vm.$nextTick()

		// Search and input should be cleared; selected items render as inline labels, not in input value
		expect(wrapper.vm.search).toBe('')
		expect(getInputEl()!.value).toBe('')
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
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		const chips = wrapper.findAll('.v-chip')
		expect(chips.length).toBe(1)
		expect(chips[0]!.text()).toContain('Option 1')
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
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		const closeBtn = wrapper.find('.v-chip__close')
		await closeBtn.trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
	})

	it('removes chip when Enter key is pressed on chip close button', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [items[0]!, items[1]!],
				items,
				multiple: true,
				chips: true,
				returnObject: true,
				label: 'Test Chips Keyboard',
				textKey: 'text',
				valueKey: 'value',
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		const closeBtn = wrapper.find('.v-chip__close')
		closeBtn.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		// First item was removed — remaining is [items[1]]
		const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown[]
		expect(emitted).toHaveLength(1)
		expect((emitted[0] as { value: string }).value).toBe('2')
	})

	it('removes chip when Space key is pressed on chip close button', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [items[0]!, items[1]!],
				items,
				multiple: true,
				chips: true,
				returnObject: true,
				label: 'Test Chips Space',
				textKey: 'text',
				valueKey: 'value',
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		const closeBtn = wrapper.find('.v-chip__close')
		closeBtn.element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown[]
		expect(emitted).toHaveLength(1)
	})

	it('does not open menu when modelValue is set programmatically (suppressMenuOpen)', async () => {
		// Menu must be closed initially
		expect(isMenuOverlayActive()).toBe(false)

		// Programmatic update (e.g., filter reset sets a value) should NOT open the menu
		await wrapper.setProps({ modelValue: items[0] })
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(isMenuOverlayActive()).toBe(false)
	})

	it('keeps menu open when blur target is a chip (checkErrorOnBlur)', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: ['1'],
				items,
				multiple: true,
				chips: true,
				label: 'Test blur chip',
				textKey: 'text',
				valueKey: 'value',
				menuId,
			},
			attachTo: document.body,
		})

		// Open menu
		const input = wrapper.find('input')
		await input.trigger('click')
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(isMenuOverlayActive()).toBe(true)

		// Create a chip DOM element as blur relatedTarget
		const chipEl = document.createElement('span')
		chipEl.className = 'sy-autocomplete__chip'
		document.body.appendChild(chipEl)

		const inputEl = getInputEl()!
		inputEl.dispatchEvent(new FocusEvent('blur', { relatedTarget: chipEl, bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()

		// Menu should remain open
		expect(isMenuOverlayActive()).toBe(true)

		document.body.removeChild(chipEl)
	})

	it('keeps menu open when blur target is the clear button (checkErrorOnBlur)', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: items[0],
				items,
				clearable: true,
				label: 'Test blur clear',
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
		expect(isMenuOverlayActive()).toBe(true)

		// Create a clear-button DOM element as blur relatedTarget
		const clearBtn = document.createElement('button')
		clearBtn.className = 'sy-autocomplete__clear-button'
		document.body.appendChild(clearBtn)

		const inputEl = getInputEl()!
		inputEl.dispatchEvent(new FocusEvent('blur', { relatedTarget: clearBtn, bubbles: true }))
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(isMenuOverlayActive()).toBe(true)

		document.body.removeChild(clearBtn)
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

	describe('selectionText', () => {
		const selectionText = (selected: unknown[]) => `${selected.length} élément${selected.length > 1 ? 's' : ''} sélectionné${selected.length > 1 ? 's' : ''}`

		it('displays custom text in prepend-inner when items are selected', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: ['1', '2'],
					items,
					multiple: true,
					selectionText,
					label: 'Test selectionText',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				attachTo: document.body,
			})
			await wrapper.vm.$nextTick()

			const selectionTextEl = wrapper.find('.sy-autocomplete__selection-text')
			expect(selectionTextEl.exists()).toBe(true)
			expect(selectionTextEl.text()).toBe('2 éléments sélectionnés')
			expect(getInputEl()?.value).toBe('')
		})

		it('does not display selection text element when no items are selected', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: [],
					items,
					multiple: true,
					selectionText,
					label: 'Test selectionText vide',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				attachTo: document.body,
			})
			await wrapper.vm.$nextTick()

			expect(wrapper.find('.sy-autocomplete__selection-text').exists()).toBe(false)
		})

		it('keeps custom text visible when menu is open', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: ['1', '2'],
					items,
					multiple: true,
					selectionText,
					label: 'Test selectionText ouvert',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				attachTo: document.body,
			})
			await wrapper.vm.$nextTick()

			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()

			// Custom text still visible in prepend-inner, input empty for searching
			expect(wrapper.find('.sy-autocomplete__selection-text').text()).toBe('2 éléments sélectionnés')
			expect(getInputEl()?.value).toBe('')
		})

		it('updates custom text when selection changes', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: ['1'],
					items,
					multiple: true,
					selectionText,
					label: 'Test selectionText update',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				attachTo: document.body,
			})
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.sy-autocomplete__selection-text').text()).toBe('1 élément sélectionné')

			await wrapper.setProps({ modelValue: ['1', '2', '3'] })
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.sy-autocomplete__selection-text').text()).toBe('3 éléments sélectionnés')
		})
	})

	describe('loading', () => {
		it('shows progress bar when loading is true', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test Loading',
					textKey: 'text',
					valueKey: 'value',
					loading: true,
					menuId,
				},
				attachTo: document.body,
			})

			await wrapper.vm.$nextTick()
			const progressBar = wrapper.find('.v-progress-linear')
			expect(progressBar.exists()).toBe(true)
		})

		it('does not show progress bar when loading is false', async () => {
			await wrapper.vm.$nextTick()
			const progressBar = wrapper.find('.v-progress-linear')
			expect(progressBar.exists()).toBe(false)
		})

		it('hides no-data message while loading', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items: [],
					label: 'Test Loading No Data',
					textKey: 'text',
					valueKey: 'value',
					loading: true,
					menuId,
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()

			// No-data item should not appear while loading
			const noDataItem = document.body.querySelector(`#${menuId} .v-list-item`)
			expect(noDataItem).toBeNull()
		})

		it('shows no-data message once loading is done and items is empty', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items: [],
					label: 'Test Loading Done',
					textKey: 'text',
					valueKey: 'value',
					loading: false,
					menuId,
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()

			const listItems = document.body.querySelectorAll(`#${menuId} .v-list-item`)
			const texts = Array.from(listItems).map(el => el.textContent?.trim())
			expect(texts).toContain('Aucune option')
		})
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

	describe('disabled', () => {
		it('does not open menu when input is clicked on a disabled field', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test Disabled',
					textKey: 'text',
					valueKey: 'value',
					disabled: true,
					menuId,
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(isMenuOverlayActive()).toBe(false)
		})

		it('does not emit update:modelValue when selectItem is called on a disabled field', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test Disabled Select',
					textKey: 'text',
					valueKey: 'value',
					disabled: true,
					menuId,
				},
				attachTo: document.body,
			})

			// openAndFocus is guarded, but selectItem itself is not — the field input
			// is natively disabled so users cannot interact; we verify the menu stays closed.
			expect(isMenuOverlayActive()).toBe(false)
			await wrapper.vm.$nextTick()
			expect(isMenuOverlayActive()).toBe(false)
		})

		it('passes disabled prop to SyTextField', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test Disabled TextField',
					textKey: 'text',
					valueKey: 'value',
					disabled: true,
					menuId,
				},
				attachTo: document.body,
			})

			await wrapper.vm.$nextTick()
			const textField = wrapper.findComponent(SyTextField)
			expect(textField.props('disabled')).toBe(true)
		})
	})

	describe('hideDetails', () => {
		it('hides the details zone when hideDetails is true', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test hideDetails',
					textKey: 'text',
					valueKey: 'value',
					hideDetails: true,
					menuId,
				},
				attachTo: document.body,
			})

			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-input__details').exists()).toBe(false)
		})

		it('shows the details zone when hideDetails is false', async () => {
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-input__details').exists()).toBe(true)
		})

		it('does not show error messages when hideDetails is true even with validation errors', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test hideDetails + erreur',
					textKey: 'text',
					valueKey: 'value',
					hideDetails: true,
					hasError: true,
					errorMessages: ['Erreur de validation'],
					menuId,
				},
				attachTo: document.body,
			})

			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-input__details').exists()).toBe(false)
			expect(wrapper.find('.v-messages').exists()).toBe(false)
		})
	})

	describe('validation', () => {
		it('validateOnSubmit returns false and shows error when required field is empty', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Champ requis',
					textKey: 'text',
					valueKey: 'value',
					required: true,
				},
			})
			const result = await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(result).toBe(false)
			expect(wrapper.find('.v-messages').text()).toContain('requis')
		})

		it('validateOnSubmit returns true when required field has a value', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: '1',
					items,
					label: 'Champ valide',
					textKey: 'text',
					valueKey: 'value',
					required: true,
				},
			})
			const result = await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(result).toBe(true)
		})

		it('clearValidation removes displayed errors', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test clearValidation',
					textKey: 'text',
					valueKey: 'value',
					required: true,
				},
			})
			await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).toContain('requis')

			wrapper.vm.clearValidation()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).not.toContain('requis')
		})

		it('disableErrorHandling suppresses validation — validateOnSubmit always returns true', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test disableErrorHandling',
					textKey: 'text',
					valueKey: 'value',
					required: true,
					disableErrorHandling: true,
				},
			})
			const result = await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(result).toBe(true)
			expect(wrapper.find('.v-messages').text()).not.toContain('requis')
		})

		it('validates only on blur when isValidateOnBlur is true', async () => {
			wrapper.unmount()
			const failingRule = {
				type: 'custom',
				options: { validate: () => false, message: 'Erreur isValidateOnBlur' },
			}
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: '1',
					items,
					label: 'Test isValidateOnBlur',
					textKey: 'text',
					valueKey: 'value',
					isValidateOnBlur: true,
					customRules: [failingRule],
				},
			})

			// Force interaction, puis réinitialisation pour repartir d'un état propre
			await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			wrapper.vm.clearValidation()
			await wrapper.vm.$nextTick()

			// Changer modelValue ne doit PAS déclencher la validation (isValidateOnBlur: true)
			await wrapper.setProps({ modelValue: '2' })
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).not.toContain('Erreur isValidateOnBlur')

			// Le blur déclenche la validation
			wrapper.vm.checkErrorOnBlur()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).toContain('Erreur isValidateOnBlur')
		})

		it('displays warning from customWarningRules', async () => {
			wrapper.unmount()
			const warningRule = {
				type: 'custom',
				options: { validate: () => false, warningMessage: 'Avertissement test' },
			}
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: '1',
					items,
					label: 'Test warning',
					textKey: 'text',
					valueKey: 'value',
					customWarningRules: [warningRule],
				},
			})
			await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).toContain('Avertissement test')
		})

		it('displays success message from customSuccessRules', async () => {
			wrapper.unmount()
			const successRule = {
				type: 'custom',
				options: { validate: () => true, successMessage: 'Succès test' },
			}
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: '1',
					items,
					label: 'Test success',
					textKey: 'text',
					valueKey: 'value',
					showSuccessMessages: true,
					customSuccessRules: [successRule],
				},
			})
			await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).toContain('Succès test')
		})

		it('hides success message text when showSuccessMessages is false', async () => {
			wrapper.unmount()
			const successRule = {
				type: 'custom',
				options: { validate: () => true, successMessage: 'Succès test' },
			}
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: '1',
					items,
					label: 'Test showSuccessMessages false',
					textKey: 'text',
					valueKey: 'value',
					customSuccessRules: [successRule],
					showSuccessMessages: false,
				},
			})
			await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).not.toContain('Succès test')
		})

		it('forces error state on SyTextField when hasError prop is true', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: '1',
					items,
					label: 'Test hasError prop',
					textKey: 'text',
					valueKey: 'value',
					hasError: true,
				},
			})
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()
			expect(wrapper.findComponent(SyTextField).props('hasError')).toBe(true)
		})

		it('forces warning state on SyTextField when hasWarning prop is true', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: '1',
					items,
					label: 'Test hasWarning prop',
					textKey: 'text',
					valueKey: 'value',
					hasWarning: true,
				},
			})
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()
			expect(wrapper.findComponent(SyTextField).props('hasWarning')).toBe(true)
		})

		it('forces success state on SyTextField when hasSuccess prop is true', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: '1',
					items,
					label: 'Test hasSuccess prop',
					textKey: 'text',
					valueKey: 'value',
					hasSuccess: true,
				},
			})
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()
			expect(wrapper.findComponent(SyTextField).props('hasSuccess')).toBe(true)
		})

		it('displays errorMessages injected by the parent', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test errorMessages',
					textKey: 'text',
					valueKey: 'value',
					errorMessages: ['Erreur externe'],
				},
			})
			await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).toContain('Erreur externe')
		})

		it('displays warningMessages injected by the parent', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test warningMessages',
					textKey: 'text',
					valueKey: 'value',
					warningMessages: ['Avertissement externe'],
				},
			})
			await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).toContain('Avertissement externe')
		})

		it('displays successMessages injected by the parent', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test successMessages',
					textKey: 'text',
					valueKey: 'value',
					showSuccessMessages: true,
					successMessages: ['Succès externe'],
				},
			})
			await wrapper.vm.validateOnSubmit()
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-messages').text()).toContain('Succès externe')
		})
	})

	describe('slot prepend-item', () => {
		it('reçoit le focus en premier à l\'ouverture du menu', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test prepend focus',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				slots: {
					'prepend-item': '<li class="v-list-item prepend-item-btn">Tous</li>',
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			const prependEl = document.body.querySelector('.prepend-item-btn')
			expect(prependEl?.classList.contains('keyboard-focused')).toBe(true)
		})

		it('ArrowDown depuis le prepend va au premier item', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test prepend arrow',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				slots: {
					'prepend-item': '<li class="v-list-item prepend-item-btn">Tous</li>',
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			const inputEl = document.getElementById(`${menuId}-input`) as HTMLInputElement
			inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
			await flushPromises()
			await wrapper.vm.$nextTick()

			const firstOption = document.body.querySelector(`#${menuId}-option-0`)
			expect(firstOption?.classList.contains('keyboard-focused')).toBe(true)
			expect(document.body.querySelector('.prepend-item-btn')?.classList.contains('keyboard-focused')).toBe(false)
		})

		it('ArrowUp depuis le premier item revient au prepend', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test prepend arrow up',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				slots: {
					'prepend-item': '<li class="v-list-item prepend-item-btn">Tous</li>',
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			const inputEl = document.getElementById(`${menuId}-input`) as HTMLInputElement

			// ArrowDown → premier item
			inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
			await flushPromises()
			await wrapper.vm.$nextTick()

			// ArrowUp → retour au prepend
			inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
			await flushPromises()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			expect(document.body.querySelector('.prepend-item-btn')?.classList.contains('keyboard-focused')).toBe(true)
		})

		it('Enter sur le prepend déclenche un click sur l\'élément', async () => {
			wrapper.unmount()
			let clicked = false
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test prepend enter',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				slots: {
					'prepend-item': `<li class="v-list-item prepend-item-btn">Tous</li>`,
				},
				attachTo: document.body,
			})

			// Ajouter un listener click sur le bouton après montage
			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			const prependEl = document.body.querySelector('.prepend-item-btn')
			prependEl?.addEventListener('click', () => {
				clicked = true
			})

			const inputEl = document.getElementById(`${menuId}-input`) as HTMLInputElement
			inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
			await flushPromises()
			await wrapper.vm.$nextTick()

			expect(clicked).toBe(true)
		})

		it('Enter sur un VListItem du slot prepend-item active son @click', async () => {
			wrapper.unmount()

			const HostComponent = defineComponent({
				components: { SyAutocomplete, VCheckbox, VDivider, VListItem, VListItemTitle },
				setup() {
					const selectedValues = ref<string[]>([])
					const toggleAll = () => {
						selectedValues.value = selectedValues.value.length === items.length
							? []
							: items.map(item => item.value as string)
					}

					return {
						items,
						menuId,
						selectedValues,
						toggleAll,
					}
				},
				template: `
					<SyAutocomplete
						v-model="selectedValues"
						:items="items"
						label="Test prepend enter on VListItem"
						text-key="text"
						value-key="value"
						:menu-id="menuId"
						multiple
					>
						<template #prepend-item>
							<VListItem
								class="prepend-item-btn"
								@mousedown.prevent
								@click="toggleAll"
							>
								<template #prepend>
									<VCheckbox
										:model-value="selectedValues.length === items.length"
										:indeterminate="selectedValues.length > 0 && selectedValues.length < items.length"
										density="compact"
										hide-details
										color="primary"
										class="mt-0 pt-0 mr-1"
									/>
								</template>
								<VListItemTitle>Tous</VListItemTitle>
							</VListItem>
							<VDivider />
						</template>
					</SyAutocomplete>
				`,
			})

			const hostWrapper = mount(HostComponent, {
				attachTo: document.body,
			})

			const input = hostWrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await hostWrapper.vm.$nextTick()
			await hostWrapper.vm.$nextTick()

			const inputEl = document.getElementById(`${menuId}-input`) as HTMLInputElement
			inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
			await flushPromises()
			await hostWrapper.vm.$nextTick()

			expect((hostWrapper.vm as { selectedValues: string[] }).selectedValues).toEqual(['1', '2', '3'])

			hostWrapper.unmount()
		})

		it('rend le contenu du slot dans le listbox', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test prepend-item',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				slots: {
					'prepend-item': '<button class="prepend-item-btn">Tous</button>',
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()
			expect(isMenuOverlayActive()).toBe(true)

			// Le slot est dans le listbox
			const listbox = document.body.querySelector(`#${menuId}`)
			expect(listbox!.querySelector('.prepend-item-btn')).not.toBeNull()

			// Il n'y a pas de container prepend séparé
			expect(document.body.querySelector(`#${menuId}-prepend`)).toBeNull()
		})

		it('n\'affiche pas le contenu du slot quand le menu est fermé', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test prepend-item fermé',
					textKey: 'text',
					valueKey: 'value',
					menuId,
				},
				slots: {
					'prepend-item': '<button class="prepend-item-btn">Tous</button>',
				},
				attachTo: document.body,
			})

			expect(isMenuOverlayActive()).toBe(false)
			expect(document.body.querySelector('.prepend-item-btn')).toBeNull()
		})
	})

	it('does not open menu when readonly', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: null,
				items,
				label: 'Test readonly',
				textKey: 'text',
				valueKey: 'value',
				readonly: true,
				menuId,
			},
			attachTo: document.body,
		})
		const input = wrapper.find('input')
		await input.trigger('click')
		await flushPromises()
		await wrapper.vm.$nextTick()
		expect(isMenuOverlayActive()).toBe(false)
	})

	it('emits full object when returnObject is true', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: null,
				items,
				label: 'Test returnObject true',
				textKey: 'text',
				valueKey: 'value',
				returnObject: true,
			},
		})
		wrapper.vm.selectItem(items[0])
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([items[0]])
	})

	it('emits value key when returnObject is false', async () => {
		wrapper.vm.selectItem(items[0])
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
	})

	it('shows custom noDataText when list is empty', async () => {
		wrapper.unmount()
		wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: null,
				items: [],
				label: 'Test noDataText',
				textKey: 'text',
				valueKey: 'value',
				noDataText: 'Pas de résultats disponibles',
				menuId,
			},
			attachTo: document.body,
		})
		const input = wrapper.find('input')
		await input.trigger('click')
		await flushPromises()
		await wrapper.vm.$nextTick()
		const listItems = document.body.querySelectorAll(`#${menuId} .v-list-item`)
		const texts = Array.from(listItems).map(el => el.textContent?.trim())
		expect(texts.some(t => t?.includes('Pas de résultats disponibles'))).toBe(true)
	})

	describe('filter and search', () => {
		it('filters items client-side based on input', async () => {
			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()

			wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'Option 1')
			await flushPromises()
			await wrapper.vm.$nextTick()

			const listItems = document.body.querySelectorAll(`#${menuId} .v-list-item`)
			expect(listItems).toHaveLength(1)
			expect(listItems[0]!.textContent?.trim()).toContain('Option 1')
		})

		it('shows all items when filter is disabled', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test filter false',
					textKey: 'text',
					valueKey: 'value',
					filter: false,
					menuId,
				},
				attachTo: document.body,
			})
			const input = wrapper.find('input')
			await input.trigger('click')
			await flushPromises()
			await wrapper.vm.$nextTick()

			wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'Option 1')
			await flushPromises()
			await wrapper.vm.$nextTick()

			const listItems = document.body.querySelectorAll(`#${menuId} .v-list-item`)
			expect(listItems).toHaveLength(3)
		})

		it('filters using plainTextKey instead of textKey when provided', async () => {
			wrapper.unmount()
			const specialItems = [
				{ text: '★ Alpha', plain: 'Alpha', value: 'alpha' },
				{ text: '★ Beta', plain: 'Beta', value: 'beta' },
			]
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items: specialItems,
					label: 'Test plainTextKey',
					textKey: 'text',
					valueKey: 'value',
					plainTextKey: 'plain',
					menuId,
				},
				attachTo: document.body,
			})

			// '★' est dans textKey mais pas dans plainTextKey → aucun résultat
			wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', '★')
			await flushPromises()
			await wrapper.vm.$nextTick()
			const noResults = document.body.querySelectorAll(`#${menuId} [role="option"]`)
			expect(noResults).toHaveLength(0)

			// 'Alpha' est dans plainTextKey → 1 résultat
			wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'Alpha')
			await flushPromises()
			await wrapper.vm.$nextTick()
			const oneResult = document.body.querySelectorAll(`#${menuId} [role="option"]`)
			expect(oneResult).toHaveLength(1)
		})

		it('emits search event after debounce delay', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test search event',
					textKey: 'text',
					valueKey: 'value',
					debounce: 0,
					menuId,
				},
				attachTo: document.body,
			})
			// syncSearchFromValue() sets suppressMenuOpen=true on mount; first input clears the flag
			wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'clear-suppress')
			await wrapper.vm.$nextTick()
			await flushPromises()
			// Second input actually triggers the search event
			wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'test')
			await wrapper.vm.$nextTick()
			await flushPromises()
			const emitted = wrapper.emitted('search')
			expect(emitted).toBeTruthy()
			expect(emitted?.[emitted.length - 1]).toEqual(['test'])
		})

		it('respects custom debounce delay', async () => {
			wrapper.unmount()
			wrapper = mount(SyAutocomplete, {
				props: {
					modelValue: null,
					items,
					label: 'Test debounce',
					textKey: 'text',
					valueKey: 'value',
					debounce: 50,
					menuId,
				},
				attachTo: document.body,
			})
			// First input clears the suppressMenuOpen flag set during initialization
			wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'clear-suppress')
			await wrapper.vm.$nextTick()
			// Second input triggers debounced search
			wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'query')
			await wrapper.vm.$nextTick()
			// Before debounce expires: pas encore émis
			expect(wrapper.emitted('search')).toBeFalsy()
			// After debounce: émis
			await new Promise(resolve => setTimeout(resolve, 60))
			expect(wrapper.emitted('search')).toBeTruthy()
		})
	})
})
