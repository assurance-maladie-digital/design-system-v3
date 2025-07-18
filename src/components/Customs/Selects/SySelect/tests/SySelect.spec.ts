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
			props: { errorMessages, hideMessages: false },
			global: {
				plugins: [vuetify],
			},
		})
		const message = wrapper.find('.v-messages__message')
		expect(message.exists()).toBe(true)
		expect(message.text()).toContain('Error 1')
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

	it('ferme le menu avec la méthode closeList', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('.sy-select').trigger('click')
		await wrapper.vm.$nextTick()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.isOpen).toBe(true)

		instance.closeList()
		await wrapper.vm.$nextTick()

		expect(instance.isOpen).toBe(false)
	})

	describe('Affichage de l\'astérisque', () => {
		it('affiche l\'astérisque quand displayAsterisk et required sont true', () => {
			const wrapper = mount(SySelect, {
				props: {
					displayAsterisk: true,
					required: true,
					label: 'Test Label',
				},
				global: {
					plugins: [vuetify],
				},
			})

			const html = wrapper.html()
			expect(html).toContain('Test Label *')
		})

		it('n\'affiche pas l\'astérisque quand displayAsterisk est false', () => {
			const wrapper = mount(SySelect, {
				props: {
					displayAsterisk: false,
					required: true,
					label: 'Test Label',
				},
				global: {
					plugins: [vuetify],
				},
			})

			const html = wrapper.html()
			expect(html).not.toContain('Test Label *')
			expect(html).toContain('Test Label')
		})

		it('n\'affiche pas l\'astérisque quand required est false', () => {
			const wrapper = mount(SySelect, {
				props: {
					displayAsterisk: true,
					required: false,
					label: 'Test Label',
				},
				global: {
					plugins: [vuetify],
				},
			})

			const html = wrapper.html()
			expect(html).not.toContain('Test Label *')
			expect(html).toContain('Test Label')
		})
	})

	describe('Mode readonly', () => {
		it('empêche l\'ouverture du menu en mode readonly', async () => {
			const wrapper = mount(SySelect, {
				props: {
					readonly: true,
					items: [{ text: 'Option 1', value: '1' }],
				},
				global: {
					plugins: [vuetify],
				},
			})

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			expect(wrapper.find('.v-list').exists()).toBe(false)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.isOpen).toBe(false)
		})

		it('affiche correctement le champ en mode readonly', () => {
			const wrapper = mount(SySelect, {
				props: {
					readonly: true,
					modelValue: { text: 'Option 1', value: '1' },
					textKey: 'text',
					returnObject: true,
				},
				global: {
					plugins: [vuetify],
				},
			})

			expect(wrapper.find('.v-input--readonly').exists()).toBe(true)

			expect(wrapper.html()).toContain('Option 1')
		})
	})

	describe('Option clearable', () => {
		it('affiche l\'icône de suppression quand clearable est true et qu\'une valeur est sélectionnée', async () => {
			const wrapper = mount(SySelect, {
				props: {
					clearable: true,
					modelValue: { text: 'Option 1', value: '1' },
					returnObject: true,
				},
				global: {
					plugins: [vuetify],
				},
			})

			expect(wrapper.find('.sy-select__clear-icon').exists()).toBe(true)
		})

		it('n\'affiche pas l\'icône de suppression quand clearable est false', () => {
			const wrapper = mount(SySelect, {
				props: {
					clearable: false,
					modelValue: { text: 'Option 1', value: '1' },
					returnObject: true,
				},
				global: {
					plugins: [vuetify],
				},
			})

			expect(wrapper.find('.v-icon.mdi-close-circle').exists()).toBe(false)
		})

		it('efface la valeur sélectionnée avec la méthode selectItem', async () => {
			const wrapper = mount(SySelect, {
				props: {
					clearable: true,
					modelValue: { text: 'Option 1', value: '1' },
					returnObject: true,
				},
				global: {
					plugins: [vuetify],
				},
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			instance.selectItem(null)
			await wrapper.vm.$nextTick()

			expect(wrapper.emitted()['update:modelValue'][0]).toEqual([null])
		})
	})

	describe('Validation', () => {
		it('affiche une erreur pour un champ requis sans valeur', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: undefined,
				},
				global: {
					plugins: [vuetify],
				},
			})

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasError).toBe(true)
		})

		it('n\'affiche pas d\'erreur pour un champ requis avec une valeur', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: { text: 'Option 1', value: '1' },
					returnObject: true,
				},
				global: {
					plugins: [vuetify],
				},
			})

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasError).toBe(false)
		})

		it('n\'affiche pas d\'erreur quand disableErrorHandling est true', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: undefined,
					disableErrorHandling: true,
				},
				global: {
					plugins: [vuetify],
				},
			})

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasError).toBe(false)
		})
	})

	describe('Comportement du menu', () => {
		it('ouvre et ferme le menu au clic', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [{ text: 'Option 1', value: '1' }],
				},
				global: {
					plugins: [vuetify],
				},
			})

			expect(wrapper.find('.v-list').exists()).toBe(false)

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			expect(wrapper.find('.v-list').exists()).toBe(true)

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			expect(wrapper.find('.v-list').exists()).toBe(false)
		})

		it('met à jour isOpen quand on ouvre le menu', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [{ text: 'Option 1', value: '1' }],
				},
				global: {
					plugins: [vuetify],
				},
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.isOpen).toBe(false)

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			expect(instance.isOpen).toBe(true)
		})
	})

	it('ferme le menu après un clic sur le sélecteur', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('.sy-select').trigger('click')
		await wrapper.vm.$nextTick()
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

	describe('Multiple selection mode', () => {
		it('handles multiple selection correctly', async () => {
			const items = [
				{ text: '-choisir-', value: null },
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
				{ text: 'Option 3', value: '3' },
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					multiple: true,
					modelValue: [],
					textKey: 'text',
					valueKey: 'value',
				},
				global: {
					plugins: [vuetify],
				},
			})

			// Open the select menu
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			// Select Option 1
			const listItems = wrapper.findAll('.v-list-item')
			await listItems[1].trigger('click')
			await wrapper.vm.$nextTick()

			// Check that Option 1 is selected
			expect(wrapper.emitted()['update:modelValue'][0]).toEqual([['1']])

			// Select Option 2 as well
			await listItems[2].trigger('click')
			await wrapper.vm.$nextTick()

			// Check that both options are selected
			expect(wrapper.emitted()['update:modelValue'][1]).toEqual([['1', '2']])
		})

		it('clears all selections when default option is clicked', async () => {
			const items = [
				{ text: '-choisir-', value: null },
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					multiple: true,
					modelValue: ['1', '2'],
					textKey: 'text',
					valueKey: 'value',
				},
				global: {
					plugins: [vuetify],
				},
			})

			// Open the select menu
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			// Click on the default option
			const defaultOption = wrapper.findAll('.v-list-item')[0]
			await defaultOption.trigger('click')
			await wrapper.vm.$nextTick()

			// Check that all selections are cleared
			expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[]])
		})

		it('treats default option as selected when no items are selected', async () => {
			const items = [
				{ text: '-choisir-', value: null },
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					multiple: true,
					modelValue: [],
					textKey: 'text',
					valueKey: 'value',
				},
				global: {
					plugins: [vuetify],
				},
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any

			// Check that the selectedItemText is the default option
			expect(instance.selectedItemText).toBe('-choisir-')

			// Check that isDefaultOption returns true for the default item
			const defaultItem = items[0]
			expect(instance.isDefaultOption(defaultItem)).toBe(true)

			// Check that isItemSelected returns true for the default item when no selections
			expect(instance.isItemSelected(defaultItem)).toBe(true)
		})
	})

	describe('Chips mode', () => {
		it('renders chips for selected items', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
				{ text: 'Option 3', value: '3' },
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					multiple: true,
					chips: true,
					modelValue: ['1', '2'],
					textKey: 'text',
					valueKey: 'value',
				},
				global: {
					plugins: [vuetify],
				},
			})

			// Check that chips are rendered
			const chips = wrapper.findAll('.v-chip')
			expect(chips.length).toBe(2)
			expect(chips[0].text()).toBe('Option 1')
			expect(chips[1].text()).toBe('Option 2')
		})

		it('removes a chip when close button is clicked', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
				{ text: 'Option 3', value: '3' },
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					multiple: true,
					chips: true,
					modelValue: ['1', '2'],
					textKey: 'text',
					valueKey: 'value',
				},
				global: {
					plugins: [vuetify],
				},
			})

			// Find the first chip's close button and click it
			const closeButton = wrapper.find('.v-chip__close')
			await closeButton.trigger('click')
			await wrapper.vm.$nextTick()

			// Check that the chip was removed from the model
			expect(wrapper.emitted()['update:modelValue'][0]).toEqual([['2']])
		})

		it('handles chip text correctly for object items', async () => {
			const items = [
				{ text: 'Option 1', value: '1', data: { id: 101 } },
				{ text: 'Option 2', value: '2', data: { id: 102 } },
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					multiple: true,
					chips: true,
					returnObject: true,
					modelValue: [items[0], items[1]],
					textKey: 'text',
					valueKey: 'value',
				},
				global: {
					plugins: [vuetify],
				},
			})

			// Check that chips display the correct text
			const chips = wrapper.findAll('.v-chip')
			expect(chips.length).toBe(2)
			expect(chips[0].text()).toBe('Option 1')
			expect(chips[1].text()).toBe('Option 2')
		})

		it('safely handles different item types in chips', async () => {
			// This test verifies our safeChipItem function works correctly
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: 2 }, // Number value
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					multiple: true,
					chips: true,
					modelValue: ['1', 2],
					textKey: 'text',
					valueKey: 'value',
				},
				global: {
					plugins: [vuetify],
				},
			})

			// Check that chips are rendered without errors
			const chips = wrapper.findAll('.v-chip')
			expect(chips.length).toBe(2)
			expect(chips[0].text()).toBe('Option 1')
			expect(chips[1].text()).toBe('Option 2')

			// Test the safeChipItem method directly
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const stringResult = instance.safeChipItem('test')
			const numberResult = instance.safeChipItem(123)
			const objectResult = instance.safeChipItem({ id: 3 })

			expect(stringResult).toBe('test')
			expect(numberResult).toBe(123)
			expect(typeof objectResult).toBe('object')
		})
	})
})
