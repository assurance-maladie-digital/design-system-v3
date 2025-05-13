import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import SyInputSelect from '../SyInputSelect.vue'
import { vuetify } from '@tests/unit/setup'

describe('SyInputSelect', () => {
	describe('Rendu et affichage', () => {
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

	describe('Validation', () => {
		it('validateField valide correctement un champ requis avec une valeur', async () => {
			const wrapper = mount(SyInputSelect, {
				props: {
					required: true,
					modelValue: { text: 'Option 1', value: '1' },
				},
				global: {
					plugins: [vuetify],
				},
			})

			const result = wrapper.vm.validateField({ text: 'Option 1', value: '1' })
			expect(result).toBe(true)
			expect(wrapper.find('.v-messages__message').exists()).toBe(false)
		})

		it('validateField échoue pour un champ requis sans valeur', async () => {
			const wrapper = mount(SyInputSelect, {
				props: {
					required: true,
					label: 'Test Label',
					errorMessages: [],
				},
				global: {
					plugins: [vuetify],
				},
			})

			const result = wrapper.vm.validateField(null)
			expect(result).toBe(false)

			await wrapper.setProps({ errorMessages: ['Test Label est requis'] })
			await wrapper.vm.$nextTick()

			expect(wrapper.find('.v-messages__message').exists()).toBe(true)
			expect(wrapper.find('.v-messages__message').text()).toContain('Test Label est requis')
		})

		it('validateOnSubmit retourne le résultat de validation', async () => {
			const wrapper = mount(SyInputSelect, {
				props: { required: true },
				global: {
					plugins: [vuetify],
				},
			})

			const result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(false)

			await wrapper.setProps({ modelValue: { text: 'Option 1', value: '1' } })
			const resultWithValue = wrapper.vm.validateOnSubmit()
			expect(resultWithValue).toBe(true)
		})

		it('vérifie que checkForErrors retourne le résultat de la validation', () => {
			const wrapper1 = mount(SyInputSelect, {
				props: {
					required: true,
					modelValue: null,
				},
				global: {
					plugins: [vuetify],
				},
			})

			const result1 = wrapper1.vm.checkForErrors()
			expect(result1).toBe(false)

			const wrapper2 = mount(SyInputSelect, {
				props: {
					required: true,
					modelValue: { text: 'Option 1', value: '1' },
				},
				global: {
					plugins: [vuetify],
				},
			})

			const result2 = wrapper2.vm.checkForErrors()
			expect(result2).toBe(true)
		})
	})

	describe('Mode readonly', () => {
		it('désactive la validation en mode readonly', () => {
			const wrapper = mount(SyInputSelect, {
				props: {
					readonly: true,
					required: true,
				},
				global: {
					plugins: [vuetify],
				},
			})

			const result = wrapper.vm.validateField(null)
			expect(result).toBe(true)
			expect(wrapper.find('.v-messages__message').exists()).toBe(false)
		})

		it('empêche l\'ouverture du menu en mode readonly', async () => {
			const wrapper = mount(SyInputSelect, {
				props: { readonly: true },
				global: {
					plugins: [vuetify],
				},
			})

			const button = wrapper.find('.sy-input-select')
			await button.trigger('click')
			expect(wrapper.vm.isOpen).toBe(false)
		})
	})

	describe('Option clearable', () => {
		it('affiche l\'icône de suppression quand clearable est true et une valeur est sélectionnée', async () => {
			const wrapper = mount(SyInputSelect, {
				props: {
					clearable: true,
					modelValue: { text: 'Option 1', value: '1' },
				},
				global: {
					plugins: [vuetify],
				},
			})

			const clearIcon = wrapper.find('.sy-input-select .v-icon[aria-label="Supprimer"]')
			expect(clearIcon.exists()).toBe(true)
		})

		it('n\'affiche pas l\'icône de suppression quand clearable est false', async () => {
			const wrapper = mount(SyInputSelect, {
				props: {
					clearable: false,
					modelValue: { text: 'Option 1', value: '1' },
				},
				global: {
					plugins: [vuetify],
				},
			})

			const clearIcon = wrapper.find('.sy-input-select .v-icon[aria-label="Supprimer"]')
			expect(clearIcon.exists()).toBe(false)
		})

		it('efface la valeur sélectionnée quand l\'icône de suppression est cliquée', async () => {
			const wrapper = mount(SyInputSelect, {
				props: {
					clearable: true,
					modelValue: { text: 'Option 1', value: '1' },
				},
				global: {
					plugins: [vuetify],
				},
			})

			const clearIcon = wrapper.find('.sy-input-select .v-icon[aria-label="Supprimer"]')
			await clearIcon.trigger('click')
			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
		})
	})

	describe('Affichage de l\'astérisque', () => {
		it('affiche l\'astérisque quand displayAsterisk et required sont true', () => {
			const wrapper = mount(SyInputSelect, {
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
			const wrapper = mount(SyInputSelect, {
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
			const wrapper = mount(SyInputSelect, {
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

	describe('Événements émis', () => {
		it('émet update:modelValue lors de la sélection d\'un élément', async () => {
			const wrapper = mount(SyInputSelect, {
				props: {
					items: [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }],
				},
				global: {
					plugins: [vuetify],
				},
			})

			await wrapper.vm.selectItem({ text: 'Option 1', value: '1' })
			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ text: 'Option 1', value: '1' }])
		})

		it('émet update:errorMessages après validation', async () => {
			const wrapper = mount(SyInputSelect, {
				props: {
					required: true,
					label: 'Test Label',
				},
				global: {
					plugins: [vuetify],
				},
			})

			await wrapper.vm.validateField(null)
			await wrapper.vm.selectItem(null)

			expect(wrapper.emitted('update:errorMessages')).toBeTruthy()
			expect(wrapper.emitted('update:errorMessages')?.[0][0]).toContainEqual(expect.stringContaining('Test Label est requis'))
		})
	})

	describe('Comportement du menu', () => {
		it('ouvre le menu quand on clique sur le bouton', async () => {
			const wrapper = mount(SyInputSelect, {
				global: {
					plugins: [vuetify],
				},
			})

			const button = wrapper.find('.sy-input-select')
			await button.trigger('click')

			expect(wrapper.find('.v-list').exists()).toBe(true)
		})

		it('applique des styles différents pour isHeaderToolbar', async () => {
			const wrapper = mount(SyInputSelect, {
				props: { isHeaderToolbar: true },
				global: {
					plugins: [vuetify],
				},
			})

			const button = wrapper.find('.sy-input-select')
			await button.trigger('click')

			expect(wrapper.find('.v-list').attributes('is-header-toolbar')).toBeTruthy()
		})
	})
})
