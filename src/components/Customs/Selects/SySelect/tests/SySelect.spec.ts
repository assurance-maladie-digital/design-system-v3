import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { VList } from 'vuetify/components'
import SySelect from '../SySelect.vue'

type ItemType = {
	[key: string]: unknown
}

describe('SySelect.vue', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(SySelect, {
			attachTo: document.body,
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.sy-select').exists()).toBe(true)

		wrapper.unmount()
	})

	it('displays the selected item text', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(SySelect, {
			props: { items, modelValue: { text: 'Option 1', value: '1' } },
			attachTo: document.body,
		})
		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper
			.findComponent(VList)
			.findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.find('input').element.value).toBe('Option 1')

		wrapper.unmount()
	})

	it('closes the menu on escape key press', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(SySelect, {
			props: { items },
			attachTo: document.body,
		})
		await wrapper.find('.sy-select').trigger('click')
		await wrapper
			.findComponent(VList)
			.find('.v-list').trigger('keydown.esc')
		expect(wrapper.find('.v-list').exists()).toBe(false)

		wrapper.unmount()
	})

	it('renders error messages when provided', () => {
		const errorMessages = ['Error 1']
		const wrapper = mount(SySelect, {
			props: { errorMessages, hideMessages: false },
			attachTo: document.body,
		})
		const message = wrapper.find('.v-messages__message')
		expect(message.exists()).toBe(true)
		expect(message.text()).toContain('Error 1')

		wrapper.unmount()
	})

	it('does not render error messages when not provided', () => {
		const wrapper = mount(SySelect, {
			attachTo: document.body,
		})
		expect(wrapper.find('.v-messages__message').exists()).toBe(false)

		wrapper.unmount()
	})

	it('returns the correct item text using getItemText', () => {
		const wrapper = mount(SySelect, {
			props: { textKey: 'text' },
			attachTo: document.body,
		})
		const item = { text: 'Option 1', value: '1' }
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.getItemText(item)).toBe('Option 1')

		wrapper.unmount()
	})

	it('returns default text when selectedItem is null', () => {
		const wrapper = mount(SySelect, {
			attachTo: document.body,
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.selectedItemText).toBe('')

		wrapper.unmount()
	})

	it('returns the correct text when selectedItem is an object', async () => {
		const wrapper = mount(SySelect, {
			props: {
				modelValue: { text: 'Option 1', value: '1' },
				textKey: 'text',
				returnObject: true,
			},
			attachTo: document.body,
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		await wrapper.setProps({ modelValue: { text: 'Option 1', value: '1' } })
		expect(instance.selectedItemText).toBe('Option 1')

		wrapper.unmount()
	})

	it('returns the correct text when selectedItem is a value', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
				modelValue: '1',
				textKey: 'text',
			},
			attachTo: document.body,
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		await wrapper.setProps({ modelValue: '2' })
		await wrapper.vm.$nextTick()
		expect(instance.selectedItemText).toBe('Option 2')

		wrapper.unmount()
	})

	it('formats items correctly', () => {
		const items = ['Option 1', 'Option 2'] as unknown as ItemType[]
		const wrapper = mount(SySelect, {
			props: { items, textKey: 'text', valueKey: 'value' },
			attachTo: document.body,
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const formattedItems = (wrapper.vm as any).formattedItems
		expect(formattedItems).toEqual([
			{ text: 'Option 1', value: 'Option 1' },
			{ text: 'Option 2', value: 'Option 2' },
		])

		wrapper.unmount()
	})

	it('applies the correct button class when outlined is true', () => {
		const wrapper = mount(SySelect, {
			props: { outlined: true },
			attachTo: document.body,
		})
		expect(wrapper.find('.v-field--variant-outlined').exists()).toBe(true)

		wrapper.unmount()
	})

	it('does not apply the outlined button class when outlined is false', () => {
		const wrapper = mount(SySelect, {
			props: { outlined: false },
			attachTo: document.body,
		})
		expect(wrapper.find('.sy-select').classes()).not.toContain('v-btn--variant-outlined')

		wrapper.unmount()
	})

	it('updates selectedItem when v-model changes', async () => {
		const wrapper = mount(SySelect, {
			props: { modelValue: { text: 'Option 1', value: '1' }, textKey: 'text' },
			attachTo: document.body,
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.selectedItem).toEqual({ text: 'Option 1', value: '1' })

		await wrapper.setProps({ modelValue: { text: 'Option 2', value: '2' } })
		expect(instance.selectedItem).toEqual({ text: 'Option 2', value: '2' })

		wrapper.unmount()
	})

	it('emits update:modelValue when selectedItem changes', async () => {
		const wrapper = mount(SySelect, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			props: { modelValue: null as any, textKey: 'text' },
			attachTo: document.body,
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		instance.selectItem({ text: 'Option 1', value: '1' })
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['1'])

		wrapper.unmount()
	})

	it('ferme le menu avec la méthode closeList', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-select').trigger('click')
		await wrapper.vm.$nextTick()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const instance = wrapper.vm as any
		expect(instance.isOpen).toBe(true)

		instance.closeList()
		await wrapper.vm.$nextTick()

		expect(instance.isOpen).toBe(false)

		wrapper.unmount()
	})

	describe('Affichage de l\'astérisque', () => {
		it('affiche l\'astérisque quand displayAsterisk et required sont true', () => {
			const wrapper = mount(SySelect, {
				props: {
					displayAsterisk: true,
					required: true,
					label: 'Test Label',
				},
				attachTo: document.body,
			})

			const html = wrapper.html()
			expect(html).toContain('Test Label *')

			wrapper.unmount()
		})

		it('n\'affiche pas l\'astérisque quand displayAsterisk est false', () => {
			const wrapper = mount(SySelect, {
				props: {
					displayAsterisk: false,
					required: true,
					label: 'Test Label',
				},
				attachTo: document.body,
			})

			const html = wrapper.html()
			expect(html).not.toContain('Test Label *')
			expect(html).toContain('Test Label')

			wrapper.unmount()
		})

		it('n\'affiche pas l\'astérisque quand required est false', () => {
			const wrapper = mount(SySelect, {
				props: {
					displayAsterisk: true,
					required: false,
					label: 'Test Label',
				},
				attachTo: document.body,
			})

			const html = wrapper.html()
			expect(html).not.toContain('Test Label *')
			expect(html).toContain('Test Label')

			wrapper.unmount()
		})
	})

	describe('Mode readonly', () => {
		it('empêche l\'ouverture du menu en mode readonly', async () => {
			const wrapper = mount(SySelect, {
				props: {
					readonly: true,
					items: [{ text: 'Option 1', value: '1' }],
				},
				attachTo: document.body,
			})

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			expect(wrapper.find('.v-list').exists()).toBe(false)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.isOpen).toBe(false)

			wrapper.unmount()
		})

		it('affiche correctement le champ en mode readonly', () => {
			const wrapper = mount(SySelect, {
				props: {
					readonly: true,
					modelValue: { text: 'Option 1', value: '1' },
					textKey: 'text',
					returnObject: true,
				},
				attachTo: document.body,
			})

			expect(wrapper.find('.v-input--readonly').exists()).toBe(true)

			expect(wrapper.html()).toContain('Option 1')

			wrapper.unmount()
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
				attachTo: document.body,
			})

			expect(wrapper.find('.sy-select__clear-icon').exists()).toBe(true)

			wrapper.unmount()
		})

		it('n\'affiche pas l\'icône de suppression quand clearable est false', () => {
			const wrapper = mount(SySelect, {
				props: {
					clearable: false,
					modelValue: { text: 'Option 1', value: '1' },
					returnObject: true,
				},
				attachTo: document.body,
			})

			expect(wrapper.find('.v-icon.mdi-close-circle').exists()).toBe(false)

			wrapper.unmount()
		})

		it('efface la valeur sélectionnée avec la méthode selectItem', async () => {
			const wrapper = mount(SySelect, {
				props: {
					clearable: true,
					modelValue: { text: 'Option 1', value: '1' },
					returnObject: true,
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			instance.selectItem(null)
			await wrapper.vm.$nextTick()

			expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([null])

			wrapper.unmount()
		})
	})

	describe('Validation', () => {
		it('should pass validation when value meets the rule', () => {
			const rules = [
				(value: unknown) => value !== undefined || 'La valeur est requise',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					modelValue: '1',
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('should fail validation when value does not meet the rule', () => {
			const rules = [
				(value: unknown) => (typeof value === 'string' && value.length > 0) || 'La valeur doit être non vide',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					modelValue: '',
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(false)

			wrapper.unmount()
		})

		it('should collect errors from multiple rules', () => {
			const rules = [
				(value: unknown) => value !== undefined || 'La valeur est requise',
				(value: unknown) => (typeof value === 'string' && value.length > 3) || 'La valeur doit contenir plus de 3 caractères',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					modelValue: '12',
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(false)
			expect(instance.hasError).toBe(true)

			wrapper.unmount()
		})

		it('should validate array values with rules in multiple mode', () => {
			const rules = [
				(value: unknown) => (Array.isArray(value) && value.length > 0) || 'Au moins un élément doit être sélectionné',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					multiple: true,
					modelValue: [],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(false)

			wrapper.unmount()
		})

		it('should pass validation for array values that meet the rules', () => {
			const rules = [
				(value: unknown) => (Array.isArray(value) && value.length > 0) || 'Au moins un élément doit être sélectionné',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					multiple: true,
					modelValue: ['1', '2'],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('should always return true when in readonly mode regardless of rules', () => {
			const rules = [
				(value: unknown) => value !== undefined || 'La valeur est requise',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					readonly: true,
					modelValue: undefined,
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('should always return true when disableErrorHandling is true', () => {
			const rules = [
				(value: unknown) => value !== undefined || 'La valeur est requise',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					disableErrorHandling: true,
					modelValue: undefined,
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('should handle complex validation rules', () => {
			const rules = [
				(value: unknown) => {
					if (typeof value === 'string') {
						const numValue = parseInt(value, 10)
						return numValue > 0 && numValue <= 10 ? true : 'La valeur doit être entre 1 et 10'
					}
					return 'La valeur doit être une chaîne'
				},
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					modelValue: '5',
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('should fail complex validation when value is out of range', () => {
			const rules = [
				(value: unknown) => {
					if (typeof value === 'string') {
						const numValue = parseInt(value, 10)
						return numValue > 0 && numValue <= 10 ? true : 'La valeur doit être entre 1 et 10'
					}
					return 'La valeur doit être une chaîne'
				},
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					modelValue: '15',
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(false)
			expect(instance.hasError).toBe(true)

			wrapper.unmount()
		})

		it('should set hasError to true when validation fails', async () => {
			const rules = [
				(value: unknown) => value !== undefined || 'La valeur est requise',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					modelValue: undefined,
					required: true,
					disableErrorHandling: false,
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(false)
			expect(instance.hasError).toBe(true)

			wrapper.unmount()
		})

		it('should set hasError to false when validation passes', async () => {
			const rules = [
				(value: unknown) => value !== undefined || 'La valeur est requise',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					modelValue: '1',
					required: false,
					disableErrorHandling: false,
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(true)
			expect(instance.hasError).toBe(false)

			wrapper.unmount()
		})

		it('should validate with no rules when rules array is empty', () => {
			const wrapper = mount(SySelect, {
				props: {
					rules: [],
					modelValue: undefined,
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('should fail validation when field is required but no value is selected', () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					rules: [],
					modelValue: undefined,
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(false)

			wrapper.unmount()
		})

		it('should pass validation when field is required and a value is selected', () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					rules: [],
					modelValue: '1',
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('should fail validation when a rule returns an error message', () => {
			const rules = [
				(value: unknown) => (typeof value === 'string' && value !== '') || 'Erreur: Champ obligatoire',
			]
			const wrapper = mount(SySelect, {
				props: {
					rules,
					modelValue: '',
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			expect(isValid).toBe(false)
			expect(instance.hasError).toBe(true)

			wrapper.unmount()
		})
	})

	describe('Comportement du menu', () => {
		it('ouvre et ferme le menu au clic', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [{ text: 'Option 1', value: '1' }],
				},
				attachTo: document.body,
			})
			function findList() {
				return wrapper.findComponent(VList)
			}
			expect(findList().exists()).toBe(false)

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			expect(findList().exists()).toBe(true)

			wrapper.unmount()
		})

		it('met à jour isOpen quand on ouvre le menu', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [{ text: 'Option 1', value: '1' }],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.isOpen).toBe(false)

			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			expect(instance.isOpen).toBe(true)

			wrapper.unmount()
		})
	})

	it('ferme le menu après un clic sur le sélecteur', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-select').trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper
			.findComponent(VList)
			.find('.v-list').exists()).toBe(true)

		await wrapper.find('.sy-select').trigger('mouseleave')
		await wrapper.find('.sy-select').trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.isOpen).toBe(false)

		wrapper.unmount()
	})

	it('use closeList method', async () => {
		const wrapper = mount(SySelect, {
			attachTo: document.body,
		})
		wrapper.vm.closeList()
		expect(wrapper.vm.isOpen).toBe(false)

		wrapper.unmount()
	})

	it('emit the value when returnObject is false', async () => {
		const wrapper = mount(SySelect, {
			props: {
				returnObject: false,
				items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
			},
			attachTo: document.body,
		})
		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['1'])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findComponent(VList).findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[1]).toEqual(['2'])

		wrapper.unmount()
	})

	it('emit the object when returnObject is true', async () => {
		const wrapper = mount(SySelect, {
			props: {
				returnObject: true,
				items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([{ text: 'Option 1', value: '1' }])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findComponent(VList).findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[1]).toEqual([{ text: 'Option 2', value: '2' }])

		wrapper.unmount()
	})

	it('emit the value when returnObject is false with textKey and keyValue set', async () => {
		const wrapper = mount(SySelect, {
			props: {
				returnObject: false,
				textKey: 'theText',
				valueKey: 'theValue',
				items: [{ theText: 'Option 1', theValue: '1' }, { theText: 'Option 2', theValue: '2' }],
			},
			attachTo: document.body,
		})
		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['1'])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findComponent(VList).findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[1]).toEqual(['2'])

		wrapper.unmount()
	})

	it('emit the object when returnObject is true with textKey and keyValue set', async () => {
		const wrapper = mount(SySelect, {
			props: {
				returnObject: true,
				textKey: 'theText',
				valueKey: 'theValue',
				items: [{ theText: 'Option 1', theValue: '1' }, { theText: 'Option 2', theValue: '2' }],
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([{ theText: 'Option 1', theValue: '1' }])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findComponent(VList).findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[1]).toEqual([{ theText: 'Option 2', theValue: '2' }])

		wrapper.unmount()
	})

	it('emit the value when items is an array of string', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: ['Option 1', 'Option 2'] as unknown as ItemType[],
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-select').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['Option 1'])

		await wrapper.find('.sy-select').trigger('click')
		const secondItem = wrapper.findComponent(VList).findAll('.v-list-item').at(1)
		await secondItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[1]).toEqual(['Option 2'])

		wrapper.unmount()
	})

	it('is clearable when clearable is true', async () => {
		const wrapper = mount(SySelect, {
			props: {
				modelValue: '1',
				clearable: true,
				items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
			},
			attachTo: document.body,
		})

		const clearBtn = wrapper.find('.sy-select__clear-icon')
		expect(clearBtn.exists()).toBe(true)
		await clearBtn.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([null])

		wrapper.unmount()
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
				attachTo: document.body,
			})

			// Open the select menu
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			// Select Option 1
			const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
			await listItems[1]?.trigger('click')
			await wrapper.vm.$nextTick()

			// Check that Option 1 is selected
			expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([['1']])
			// Select Option 2 as well
			await listItems[2]?.trigger('click')
			await wrapper.vm.$nextTick()

			// Check that both options are selected
			expect(wrapper.emitted()['update:modelValue']?.[1]).toEqual([['1', '2']])
			wrapper.unmount()
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
				attachTo: document.body,
			})

			// Open the select menu
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			// Click on the default option
			const defaultOption = wrapper.findComponent(VList).findAll('.v-list-item')[0]!
			await defaultOption.trigger('click')
			await wrapper.vm.$nextTick()

			// Check that all selections are cleared
			expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([[]])

			wrapper.unmount()
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
				attachTo: document.body,
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

			wrapper.unmount()
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
				attachTo: document.body,
			})

			// Check that chips are rendered
			const chips = wrapper.findAll('.v-chip')
			expect(chips.length).toBe(2)
			expect(chips[0]?.text()).toBe('Option 1')
			expect(chips[1]?.text()).toBe('Option 2')

			wrapper.unmount()
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
				attachTo: document.body,
			})

			// Find the first chip's close button and click it
			const closeButton = wrapper.find('.v-chip__close')!
			await closeButton.trigger('click')
			await wrapper.vm.$nextTick()

			// Check that the chip was removed from the model
			expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([['2']])

			wrapper.unmount()
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
					modelValue: [items[0]!, items[1]!],
					textKey: 'text',
					valueKey: 'value',
				},
				attachTo: document.body,
			})

			// Check that chips display the correct text
			const chips = wrapper.findAll('.v-chip')
			expect(chips.length).toBe(2)
			expect(chips[0]?.text()).toBe('Option 1')
			expect(chips[1]?.text()).toBe('Option 2')

			wrapper.unmount()
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
				attachTo: document.body,
			})

			// Check that chips are rendered without errors
			const chips = wrapper.findAll('.v-chip')
			expect(chips.length).toBe(2)
			expect(chips[0]?.text()).toBe('Option 1')
			expect(chips[1]?.text()).toBe('Option 2')

			// Test the safeChipItem method directly
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const stringResult = instance.safeChipItem('test')
			const numberResult = instance.safeChipItem(123)
			const objectResult = instance.safeChipItem({ id: 3 })

			expect(stringResult).toBe('test')
			expect(numberResult).toBe(123)
			expect(typeof objectResult).toBe('object')

			wrapper.unmount()
		})
	})

	describe('Disposition horizontale (horizontal prop)', () => {
		it('renders horizontal label when horizontal is true', () => {
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: true,
				},
				attachTo: document.body,
			})

			const horizontalLabel = wrapper.find('.sy-select__label-horizontal')
			expect(horizontalLabel.exists()).toBe(true)
			expect(horizontalLabel.text()).toBe('Choisissez une option')

			wrapper.unmount()
		})

		it('does not render horizontal label when horizontal is false', () => {
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: false,
				},
				attachTo: document.body,
			})

			const horizontalLabel = wrapper.find('.sy-select__label-horizontal')
			expect(horizontalLabel.exists()).toBe(false)

			wrapper.unmount()
		})

		it('applies horizontal class to container when horizontal is true', () => {
			const wrapper = mount(SySelect, {
				props: {
					horizontal: true,
				},
				attachTo: document.body,
			})

			const container = wrapper.find('.sy-select-container')
			expect(container.classes()).toContain('horizontal')

			wrapper.unmount()
		})

		it('does not apply horizontal class when horizontal is false', () => {
			const wrapper = mount(SySelect, {
				props: {
					horizontal: false,
				},
				attachTo: document.body,
			})

			const container = wrapper.find('.sy-select-container')
			expect(container.classes()).not.toContain('horizontal')

			wrapper.unmount()
		})

		it('hides VTextField label when horizontal is true', () => {
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: true,
				},
				attachTo: document.body,
			})

			// La prop :label du VTextField doit être vide en mode horizontal
			const vTextField = wrapper.findComponent({ name: 'VTextField' })
			expect(vTextField.props('label')).toBe('')

			wrapper.unmount()
		})

		it('shows VTextField label when horizontal is false', () => {
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: false,
				},
				attachTo: document.body,
			})

			// La prop :label du VTextField doit contenir le label en mode vertical
			const vTextField = wrapper.findComponent({ name: 'VTextField' })
			expect(vTextField.props('label')).toContain('Choisissez une option')

			wrapper.unmount()
		})

		it('horizontal label has correct for attribute linking to input', () => {
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: true,
				},
				attachTo: document.body,
			})

			const horizontalLabel = wrapper.find('.sy-select__label-horizontal')
			const inputId = wrapper.find('input').attributes('id')

			expect(horizontalLabel.attributes('for')).toBe(inputId)

			wrapper.unmount()
		})

		it('displays asterisk in horizontal label when displayAsterisk and required are true', () => {
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: true,
					displayAsterisk: true,
					required: true,
				},
				attachTo: document.body,
			})

			const horizontalLabel = wrapper.find('.sy-select__label-horizontal')
			expect(horizontalLabel.text()).toContain('*')

			wrapper.unmount()
		})

		it('does not display asterisk in horizontal label when displayAsterisk is false', () => {
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: true,
					displayAsterisk: false,
					required: true,
				},
				attachTo: document.body,
			})

			const horizontalLabel = wrapper.find('.sy-select__label-horizontal')
			expect(horizontalLabel.text()).not.toContain('*')

			wrapper.unmount()
		})

		it('horizontal layout works with required validation', () => {
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: true,
					required: true,
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			// Validation should fail because no value is selected
			expect(isValid).toBe(false)

			wrapper.unmount()
		})

		it('horizontal layout works with custom rules', () => {
			const rules = [
				(value: unknown) => value !== undefined || 'La valeur est requise',
			]
			const wrapper = mount(SySelect, {
				props: {
					label: 'Choisissez une option',
					horizontal: true,
					rules,
					modelValue: '1',
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			const isValid = instance.validateOnSubmit()

			// Validation should pass because value is defined
			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('maintains menu functionality in horizontal layout', async () => {
			const items = [{ text: 'Option 1', value: '1' }]
			const wrapper = mount(SySelect, {
				props: {
					items,
					horizontal: true,
				},
				attachTo: document.body,
			})

			// Menu should open and close normally
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			const vList = wrapper.findComponent(VList)
			expect(vList.exists()).toBe(true)

			wrapper.unmount()
		})

		it('works with all select features in horizontal mode', async () => {
			const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
			const wrapper = mount(SySelect, {
				props: {
					items,
					label: 'Choisissez une option',
					horizontal: true,
					required: true,
					displayAsterisk: true,
					clearable: true,
				},
				attachTo: document.body,
			})

			// Check horizontal label with asterisk
			const horizontalLabel = wrapper.find('.sy-select__label-horizontal')
			expect(horizontalLabel.text()).toContain('Choisissez une option *')

			// Check that container has horizontal class
			const container = wrapper.find('.sy-select-container')
			expect(container.classes()).toContain('horizontal')

			// Check that select can still be used
			await wrapper.find('.sy-select').trigger('click')
			await wrapper.vm.$nextTick()

			const vList = wrapper.findComponent(VList)
			expect(vList.exists()).toBe(true)

			wrapper.unmount()
		})
	})

	describe('Slots', () => {
		describe('Slot append', () => {
			it('renders slot content in append', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
					},
					slots: {
						append: '<div id="append-content">Append Content</div>',
					},
					attachTo: document.body,
				})

				const appendContent = wrapper.find('#append-content')
				expect(appendContent.exists()).toBe(true)
				expect(appendContent.text()).toBe('Append Content')

				wrapper.unmount()
			})

			it('displays append slot after the input field', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
					},
					slots: {
						append: '<span id="custom-append">Custom Append</span>',
					},
					attachTo: document.body,
				})

				const appendSlot = wrapper.find('#custom-append')
				expect(appendSlot.exists()).toBe(true)
				expect(appendSlot.text()).toBe('Custom Append')

				wrapper.unmount()
			})

			it('can render multiple elements in append slot', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
					},
					slots: {
						append: `
							<div id="append-item-1">Item 1</div>
							<div id="append-item-2">Item 2</div>
						`,
					},
					attachTo: document.body,
				})

				expect(wrapper.find('#append-item-1').exists()).toBe(true)
				expect(wrapper.find('#append-item-2').exists()).toBe(true)

				wrapper.unmount()
			})

			it('renders append slot with dynamic content', async () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
					},
					slots: {
						append: '<div id="append-content">{{ message }}</div>',
					},
					global: {
						mocks: {
							message: 'Dynamic Append',
						},
					},
					attachTo: document.body,
				})

				expect(wrapper.find('#append-content').exists()).toBe(true)

				wrapper.unmount()
			})

			it('append slot works with clearable option', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
						clearable: true,
						modelValue: '1',
					},
					slots: {
						append: '<button id="custom-btn">Custom Button</button>',
					},
					attachTo: document.body,
				})

				// Both the clear button and custom append content should be present
				expect(wrapper.find('.sy-select__clear-icon').exists()).toBe(true)
				expect(wrapper.find('#custom-btn').exists()).toBe(true)

				wrapper.unmount()
			})

			it('append slot works in horizontal mode', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
						horizontal: true,
					},
					slots: {
						append: '<div id="append-horizontal">Append in Horizontal Mode</div>',
					},
					attachTo: document.body,
				})

				const appendContent = wrapper.find('#append-horizontal')
				expect(appendContent.exists()).toBe(true)
				expect(wrapper.find('.sy-select-container').classes()).toContain('horizontal')

				wrapper.unmount()
			})

			it('append slot works with multiple selection', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [
							{ text: 'Option 1', value: '1' },
							{ text: 'Option 2', value: '2' },
						],
						multiple: true,
					},
					slots: {
						append: '<div id="append-multiple">Append in Multiple Mode</div>',
					},
					attachTo: document.body,
				})

				expect(wrapper.find('#append-multiple').exists()).toBe(true)

				wrapper.unmount()
			})

			it('append slot receives correct context', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
					},
					slots: {
						append: '<div id="append-test">Test</div>',
					},
					attachTo: document.body,
				})

				const appendElement = wrapper.find('#append-test')
				expect(appendElement.exists()).toBe(true)

				wrapper.unmount()
			})
		})

		describe('Slot labelInfo', () => {
			it('renders labelInfo slot in horizontal mode', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
						horizontal: true,
						label: 'Test Label',
					},
					slots: {
						labelInfo: '<div id="label-info-content">Label Info Content</div>',
					},
					attachTo: document.body,
				})

				const labelInfoContent = wrapper.find('#label-info-content')
				expect(labelInfoContent.exists()).toBe(true)
				expect(labelInfoContent.text()).toBe('Label Info Content')

				wrapper.unmount()
			})

			it('labelInfo slot is positioned next to label in horizontal mode', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
						horizontal: true,
						label: 'Test Label',
					},
					slots: {
						labelInfo: '<span id="info-icon">(i)</span>',
					},
					attachTo: document.body,
				})

				const horizontalLabelWrapper = wrapper.find('.d-inline-flex.align-baseline')
				expect(horizontalLabelWrapper.exists()).toBe(true)
				expect(horizontalLabelWrapper.find('.sy-select__label-horizontal').exists()).toBe(true)
				expect(horizontalLabelWrapper.find('#info-icon').exists()).toBe(true)

				wrapper.unmount()
			})

			it('displays labelInfo with icon component', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
						horizontal: true,
						label: 'Test Label',
					},
					slots: {
						labelInfo: '<svg id="custom-icon" width="16" height="16"><circle cx="8" cy="8" r="7"/></svg>',
					},
					attachTo: document.body,
				})

				const customIcon = wrapper.find('#custom-icon')
				expect(customIcon.exists()).toBe(true)
				expect(customIcon.attributes('width')).toBe('16')

				wrapper.unmount()
			})

			it('labelInfo slot works with required field and asterisk', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
						horizontal: true,
						label: 'Required Field',
						required: true,
						displayAsterisk: true,
					},
					slots: {
						labelInfo: '<div id="label-info">Additional Info</div>',
					},
					attachTo: document.body,
				})

				const horizontalLabel = wrapper.find('.sy-select__label-horizontal')
				expect(horizontalLabel.text()).toContain('Required Field *')

				const labelInfo = wrapper.find('#label-info')
				expect(labelInfo.exists()).toBe(true)

				wrapper.unmount()
			})

			it('labelInfo slot works with multiple selection mode', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [
							{ text: 'Option 1', value: '1' },
							{ text: 'Option 2', value: '2' },
						],
						horizontal: true,
						multiple: true,
						label: 'Multiple Select',
					},
					slots: {
						labelInfo: '<span id="multi-info">(multiple)</span>',
					},
					attachTo: document.body,
				})

				const multiInfo = wrapper.find('#multi-info')
				expect(multiInfo.exists()).toBe(true)
				expect(multiInfo.text()).toBe('(multiple)')

				wrapper.unmount()
			})

			it('both append and labelInfo slots work together', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
						horizontal: true,
						label: 'Test Label',
					},
					slots: {
						append: '<div id="append-content">Append</div>',
						labelInfo: '<div id="label-info-content">Label Info</div>',
					},
					attachTo: document.body,
				})

				const appendContent = wrapper.find('#append-content')
				const labelInfoContent = wrapper.find('#label-info-content')

				expect(appendContent.exists()).toBe(true)
				expect(labelInfoContent.exists()).toBe(true)

				wrapper.unmount()
			})

			it('labelInfo slot works with clearable option', () => {
				const wrapper = mount(SySelect, {
					props: {
						items: [{ text: 'Option 1', value: '1' }],
						horizontal: true,
						clearable: true,
						modelValue: '1',
						label: 'Clearable Select',
					},
					slots: {
						labelInfo: '<div id="clearable-info">Info</div>',
					},
					attachTo: document.body,
				})

				// Both clear button and labelInfo should be present
				expect(wrapper.find('.sy-select__clear-icon').exists()).toBe(true)
				expect(wrapper.find('#clearable-info').exists()).toBe(true)

				wrapper.unmount()
			})
		})
	})
})
