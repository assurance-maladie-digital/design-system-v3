import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { VList } from 'vuetify/components'
import { nextTick } from 'vue'
import SySelect from '../SySelect.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

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

	it('renders prepend and append slots content when provided', () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
			},
			slots: {
				prepend: '<span class="custom-prepend">prepend</span>',
				append: '<span class="custom-append">append</span>',
			},
			attachTo: document.body,
		})

		expect(wrapper.find('.custom-prepend').exists()).toBe(true)
		expect(wrapper.find('.custom-append').exists()).toBe(true)

		wrapper.unmount()
	})

	it('renders tooltip icons when prependTooltip/appendTooltip are provided', () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
				label: 'Test',
				prependTooltip: 'Information à gauche du champ',
				appendTooltip: 'Information à droite du champ',
				tooltipLocation: 'top',
			},
			attachTo: document.body,
		})

		// SyIcon renders a v-icon with aria-label
		expect(wrapper.findAll('[aria-label="Test - info"]').length).toBe(2)
		wrapper.unmount()
	})

	it('emits prepend-icon-click and does not open menu when clicking prepend icon', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
				label: 'Test',
				prependIcon: 'success',
				disableClickButton: false,
			},
			attachTo: document.body,
		})

		expect(wrapper.findComponent(VList).exists()).toBe(false)
		await wrapper.find('[aria-label="Test - bouton success"]').trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()['prepend-icon-click']).toBeTruthy()
		expect(wrapper.findComponent(VList).exists()).toBe(false)

		wrapper.unmount()
	})

	it('emits append-icon-click and does not open menu when clicking append icon', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
				label: 'Test',
				appendIcon: 'success',
				disableClickButton: false,
			},
			attachTo: document.body,
		})

		expect(wrapper.findComponent(VList).exists()).toBe(false)
		await wrapper.find('[aria-label="Test - bouton success"]').trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()['append-icon-click']).toBeTruthy()
		expect(wrapper.findComponent(VList).exists()).toBe(false)

		wrapper.unmount()
	})

	it('displays the selected item text', async () => {
		const items = [{ text: 'Option 1', value: '1' }, { text: 'Option 2', value: '2' }]
		const wrapper = mount(SySelect, {
			props: { items, modelValue: { text: 'Option 1', value: '1' } },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
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
		await wrapper.find('.v-field').trigger('click')
		await wrapper
			.findComponent(VList)
			.find('.v-list').trigger('keydown.esc')
		expect(wrapper.find('.v-list').exists()).toBe(false)

		wrapper.unmount()
	})

	it('renders error messages when provided', () => {
		const errorMessages = ['Error 1']
		const wrapper = mount(SySelect, {
			props: { errorMessages, hideDetails: false },
			attachTo: document.body,
		})
		const message = wrapper.find('.v-messages__message')
		expect(message.exists()).toBe(true)
		expect(message.text()).toContain('Error 1')

		wrapper.unmount()
	})

	describe('hideDetails', () => {
		it('masque les messages de validation quand hideDetails est true', async () => {
			const wrapper = mount(SySelect, {
				props: {
					errorMessages: ['Erreur de test'],
					hideDetails: true,
				},
				attachTo: document.body,
			})

			expect(wrapper.find('.v-messages__message').exists()).toBe(false)

			wrapper.unmount()
		})

		it('affiche les messages de validation quand hideDetails est false', async () => {
			const wrapper = mount(SySelect, {
				props: {
					errorMessages: ['Erreur de test'],
					hideDetails: false,
				},
				attachTo: document.body,
			})

			const message = wrapper.find('.v-messages__message')
			expect(message.exists()).toBe(true)
			expect(message.text()).toContain('Erreur de test')

			wrapper.unmount()
		})

		it('affiche la zone de messages par défaut (hideDetails vaut false par défaut)', () => {
			const wrapper = mount(SySelect, {
				attachTo: document.body,
			})

			expect(wrapper.find('.v-messages').exists()).toBe(true)

			wrapper.unmount()
		})

		it('n\'affiche pas le helpText en dessous du champ quand hideDetails est true et qu\'il y a des erreurs', () => {
			const wrapper = mount(SySelect, {
				props: {
					helpText: 'Texte d\'aide',
					errorMessages: ['Erreur de test'],
					hideDetails: true,
				},
				attachTo: document.body,
			})

			expect(wrapper.find('.help-text-below').exists()).toBe(false)

			wrapper.unmount()
		})

		it('affiche le helpText en dessous du champ quand hideDetails est false et qu\'il y a des erreurs', () => {
			const wrapper = mount(SySelect, {
				props: {
					helpText: 'Texte d\'aide',
					errorMessages: ['Erreur de test'],
					hideDetails: false,
				},
				attachTo: document.body,
			})

			expect(wrapper.find('.help-text-below').exists()).toBe(true)
			expect(wrapper.find('.help-text-below').text()).toContain('Texte d\'aide')

			wrapper.unmount()
		})
	})

	it('keeps the label active when a validation error is displayed', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
				label: 'Option',
				required: true,
			},
			attachTo: document.body,
		})

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- exposed method is not part of the inferred public instance type
		const isValid = await (wrapper.vm as any).validateOnSubmit()
		await nextTick()

		expect(isValid).toBe(false)
		expect(wrapper.find('.v-field').classes()).toContain('v-field--active')

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

		await wrapper.find('.v-field').trigger('click')
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

			await wrapper.find('.v-field').trigger('click')
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
		it('affiche une erreur pour un champ requis sans valeur', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: undefined,
				},
				attachTo: document.body,
			})

			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasError).toBe(true)

			wrapper.unmount()
		})

		it('n\'affiche pas d\'erreur pour un champ requis avec une valeur', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: { text: 'Option 1', value: '1' },
					returnObject: true,
				},
				attachTo: document.body,
			})

			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasError).toBe(false)

			wrapper.unmount()
		})

		it('n\'affiche pas d\'erreur à l\'ouverture du menu mais seulement à la fermeture', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: undefined,
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any

			// Au départ, pas d'erreur
			expect(instance.hasError).toBe(false)

			// Ouverture du menu - l'erreur ne doit pas s'afficher
			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()
			expect(instance.hasError).toBe(false)
			expect(instance.isOpen).toBe(true)

			// Fermeture du menu sans sélection - l'erreur doit s'afficher
			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()
			expect(instance.hasError).toBe(true)
			expect(instance.isOpen).toBe(false)

			wrapper.unmount()
		})

		describe('disableErrorHandling', () => {
			it('n\'affiche pas d\'erreur pour un champ requis sans valeur quand disableErrorHandling est true', async () => {
				const wrapper = mount(SySelect, {
					props: {
						required: true,
						label: 'Test Label',
						modelValue: undefined,
						disableErrorHandling: true,
					},
					attachTo: document.body,
				})

				await wrapper.find('.v-field').trigger('click')
				await wrapper.vm.$nextTick()
				await wrapper.find('.v-field').trigger('click')
				await wrapper.vm.$nextTick()

				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
				const instance = wrapper.vm as any
				expect(instance.hasError).toBe(false)

				wrapper.unmount()
			})

			it('Surcharge les errorMessages quand disableErrorHandling est true et que des messages sont passes', () => {
				const wrapper = mount(SySelect, {
					props: {
						errorMessages: ['Erreur forcée'],
						disableErrorHandling: true,
					},
					attachTo: document.body,
				})

				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
				const instance = wrapper.vm as any
				expect(instance.hasError).toBe(true)
				expect(wrapper.find('.v-messages__message').exists()).toBe(true)

				wrapper.unmount()
			})

			it('n\'évalue pas les customRules quand disableErrorHandling est true', async () => {
				const wrapper = mount(SySelect, {
					props: {
						modelValue: '1',
						disableErrorHandling: true,
						isValidateOnBlur: false,
						customRules: [{
							type: 'custom',
							options: {
								validate: () => false,
								message: 'Toujours invalide',
							},
						}],
					},
					attachTo: document.body,
				})

				await wrapper.vm.$nextTick()

				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
				const instance = wrapper.vm as any
				expect(instance.hasError).toBe(false)
				expect(wrapper.find('.v-messages__message').exists()).toBe(false)

				wrapper.unmount()
			})

			it('affiche les erreurs normalement quand disableErrorHandling est false', async () => {
				const wrapper = mount(SySelect, {
					props: {
						errorMessages: ['Erreur visible'],
						disableErrorHandling: false,
					},
					attachTo: document.body,
				})

				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
				const instance = wrapper.vm as any
				expect(instance.hasError).toBe(true)
				expect(wrapper.find('.v-messages__message').text()).toContain('Erreur visible')

				wrapper.unmount()
			})
		})

		it('valide immédiatement quand isValidateOnBlur est false', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					label: 'Test Label',
					modelValue: undefined,
					isValidateOnBlur: false,
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === '2',
							message: 'Test error message',
						},
					}],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasError).toBe(false)

			// Sélection de Option 1 via interaction utilisateur
			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.findComponent(VList).findAll('.v-list-item').at(0)!.trigger('click')
			await wrapper.setProps({ modelValue: '1' })

			await vi.waitUntil(() => instance.hasError === true)
			expect(wrapper.find('.v-messages').text()).toContain('Test error message')

			// Sélection de Option 2 via interaction utilisateur
			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.findComponent(VList).findAll('.v-list-item').at(1)!.trigger('click')
			await wrapper.setProps({ modelValue: '2' })

			await vi.waitUntil(() => instance.hasError === false)
			expect(wrapper.find('.v-messages').text()).not.toContain('Test error message')

			wrapper.unmount()
		})

		it('masque le message de succes mais conserve l\'etat de succes quand showSuccessMessages est false', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					label: 'Test Label',
					modelValue: undefined,
					isValidateOnBlur: false,
					showSuccessMessages: false,
					customSuccessRules: [{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === '2',
							successMessage: 'Test success message',
						},
					}],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasSuccess).toBe(false)

			await wrapper.setProps({ modelValue: '2' })

			await vi.waitUntil(() => instance.hasSuccess === true)
			expect(wrapper.find('.success-field').exists()).toBe(true)
			expect(wrapper.findAll('.v-messages__message')).toHaveLength(0)
			expect(wrapper.text()).not.toContain('Test success message')

			wrapper.unmount()
		})

		it('ne valide pas lors d\'un changement de valeur mais seulement à la fermeture du menu quand isValidateOnBlur est true', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					label: 'Test Label',
					modelValue: undefined,
					isValidateOnBlur: true,
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === '2',
							message: 'Test error message',
						},
					}],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasError).toBe(false)

			// Changement de valeur programmatique — l'erreur ne doit PAS apparaître
			await wrapper.setProps({ modelValue: '1' })
			await wrapper.vm.$nextTick()
			expect(instance.hasError).toBe(false)

			// Ouverture puis fermeture du menu (= blur) — l'erreur doit apparaître
			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()

			await vi.waitUntil(() => instance.hasError === true)
			expect(wrapper.find('.v-messages').text()).toContain('Test error message')

			wrapper.unmount()
		})

		it('déclenche la validation au blur natif sans ouvrir le menu', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: undefined,
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasError).toBe(false)

			// Simuler un blur natif sur l'input sans jamais ouvrir le menu
			const input = wrapper.find('input')
			await input.trigger('blur')
			await wrapper.vm.$nextTick()

			await vi.waitUntil(() => instance.hasError === true)
			expect(wrapper.find('.v-messages').text()).toContain('requis')

			wrapper.unmount()
		})

		it('affiche un avertissement avec customWarningRules', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					label: 'Test Label',
					modelValue: undefined,
					isValidateOnBlur: false,
					customWarningRules: [{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === '2',
							warningMessage: 'Option 1 est dépréciée.',
						},
					}],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasWarning).toBe(false)

			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()
			await wrapper.findComponent(VList).findAll('.v-list-item').at(0)!.trigger('click')
			await wrapper.setProps({ modelValue: '1' })

			await vi.waitUntil(() => instance.hasWarning === true)
			expect(wrapper.find('.v-messages').text()).toContain('Option 1 est dépréciée.')

			wrapper.unmount()
		})

		it('validateOnSubmit retourne true quand le champ est valide', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: '1',
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const isValid = await (wrapper.vm as any).validateOnSubmit()
			await nextTick()

			expect(isValid).toBe(true)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			expect((wrapper.vm as any).hasError).toBe(false)

			wrapper.unmount()
		})

		it('affiche le message de succès avec customSuccessRules quand showSuccessMessages est true', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					label: 'Test Label',
					modelValue: undefined,
					isValidateOnBlur: false,
					showSuccessMessages: true,
					customSuccessRules: [{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === '2',
							successMessage: 'Test success message',
						},
					}],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any
			expect(instance.hasSuccess).toBe(false)

			await wrapper.setProps({ modelValue: '2' })

			await vi.waitUntil(() => instance.hasSuccess === true)
			expect(wrapper.find('.success-field').exists()).toBe(true)
			expect(wrapper.find('.v-messages').text()).toContain('Test success message')

			wrapper.unmount()
		})

		it('clearValidation remet l\'état d\'erreur à zéro', async () => {
			const wrapper = mount(SySelect, {
				props: {
					required: true,
					label: 'Test Label',
					modelValue: undefined,
					items: [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
				},
				attachTo: document.body,
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			const instance = wrapper.vm as any

			await instance.validateOnSubmit()
			await nextTick()
			expect(instance.hasError).toBe(true)

			instance.clearValidation()
			await nextTick()
			expect(instance.hasError).toBe(false)
			expect(wrapper.find('.v-messages__message').exists()).toBe(false)

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

			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()

			expect(findList().exists()).toBe(true)

			wrapper.unmount()
		})

		it('ouvre et ferme le menu au clic2', async () => {
			const wrapper = mount(SySelect, {
				props: {
					items: [{ text: 'Option 1', value: '1' }],
				},
				attachTo: document.body,
			})

			expect(wrapper.findComponent(VList).exists()).toBe(false)

			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()

			expect(wrapper.findComponent(VList).exists()).toBe(true)

			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()

			expect(wrapper.vm.isOpen).toBe(false)

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

			await wrapper.find('.v-field').trigger('click')
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

		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper
			.findComponent(VList)
			.find('.v-list').exists()).toBe(true)

		await wrapper.find('.sy-select').trigger('mouseleave')
		await wrapper.find('.v-field').trigger('click')
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
		await wrapper.find('.v-field').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['1'])

		await wrapper.find('.v-field').trigger('click')
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

		await wrapper.find('.v-field').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([{ text: 'Option 1', value: '1' }])

		await wrapper.find('.v-field').trigger('click')
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
		await wrapper.find('.v-field').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['1'])

		await wrapper.find('.v-field').trigger('click')
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

		await wrapper.find('.v-field').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([{ theText: 'Option 1', theValue: '1' }])

		await wrapper.find('.v-field').trigger('click')
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

		await wrapper.find('.v-field').trigger('click')
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)
		await firstItem!.trigger('click')
		expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['Option 1'])

		await wrapper.find('.v-field').trigger('click')
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
			await wrapper.find('.v-field').trigger('click')
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
			await wrapper.find('.v-field').trigger('click')
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

		it('removes chip when Enter key is pressed on chip close button', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
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

			await wrapper.vm.$nextTick()
			const closeButton = wrapper.find('.v-chip__close')
			closeButton.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
			await wrapper.vm.$nextTick()

			expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([['2']])

			wrapper.unmount()
		})

		it('removes chip when Space key is pressed on chip close button', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
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

			await wrapper.vm.$nextTick()
			const closeButton = wrapper.find('.v-chip__close')
			closeButton.element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }))
			await wrapper.vm.$nextTick()

			expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([['2']])

			wrapper.unmount()
		})
	})

	describe('keyboard navigation', () => {
		it('navigates options with arrow keys', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
				{ text: 'Option 3', value: '3' },
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					modelValue: null,
					textKey: 'text',
					valueKey: 'value',
				},
				attachTo: document.body,
			})

			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()

			const list = wrapper.findComponent(VList).find('.v-list')!

			// expect the first item to be highlighted
			const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)

			await wrapper.vm.$nextTick()
			expect(firstItem?.classes()).toContain('active')
			expect(firstItem?.attributes('tabindex')).toBe('0')

			await list.trigger('keydown.down')
			await wrapper.vm.$nextTick()

			const secondItem = wrapper.findComponent(VList).findAll('.v-list-item').at(1)
			expect(firstItem?.classes()).not.toContain('keyboard-focused')
			expect(firstItem?.attributes('tabindex')).toBe('-1')
			expect(secondItem?.classes()).toContain('keyboard-focused')
			expect(secondItem?.attributes('tabindex')).toBe('0')

			wrapper.unmount()
		})

		it('selects an option with enter key', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
				{ text: 'Option 3', value: '3' },
			]
			const wrapper = mount(SySelect, {
				props: {
					items,
					modelValue: null,
					textKey: 'text',
					valueKey: 'value',
				},
				attachTo: document.body,
			})

			await wrapper.find('.v-field').trigger('click')
			await wrapper.vm.$nextTick()

			const list = wrapper.findComponent(VList).find('.v-list')!
			await list.trigger('keydown.down')
			await wrapper.vm.$nextTick()
			await list.trigger('keydown.enter')
			await wrapper.vm.$nextTick()

			expect(wrapper.emitted()['update:modelValue']).toEqual([['2']])

			wrapper.unmount()
		})
	})

	describe('locales', () => {
		it('utilise la locale `selectPlaceholder` comme nom accessible de repli', () => {
			const wrapper = mount(SySelect, {
				attachTo: document.body,
				props: {
					label: '',
					items: [{ text: 'A', value: 'a' }],
					locales: { selectPlaceholder: 'REPLI_X' },
				},
			})

			expect(wrapper.html()).toContain('REPLI_X')
			wrapper.unmount()
		})

		it('utilise la locale `fieldError` pour le message générique en erreur', () => {
			const wrapper = mount(SySelect, {
				attachTo: document.body,
				props: {
					label: 'Champ',
					items: [{ text: 'A', value: 'a' }],
					hasError: true,
					hideDetails: true,
					locales: { fieldError: 'ERREUR_X' },
				},
			})

			expect(wrapper.html()).toContain('ERREUR_X')
			wrapper.unmount()
		})
	})
})

describe('SySelect.vue - String items', () => {
	it('displays string items in the dropdown list', async () => {
		const wrapper = mount(SySelect, {
			props: { items: ['un', 'deux'] },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		expect(listItems).toHaveLength(2)
		expect(listItems[0]?.text()).toContain('un')
		expect(listItems[1]?.text()).toContain('deux')
		wrapper.unmount()
	})

	it('displays selected string item in the input field', async () => {
		const wrapper = mount(SySelect, {
			props: { items: ['un', 'deux'] },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)!
		await firstItem.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.find('input').element.value).toBe('un')
		expect(wrapper.emitted()['update:modelValue']).toEqual([['un']])
		wrapper.unmount()
	})

	it('displays selected string item with pre-selected modelValue', () => {
		const wrapper = mount(SySelect, {
			props: { items: ['un', 'deux'], modelValue: 'deux' },
			attachTo: document.body,
		})
		expect(wrapper.find('input').element.value).toBe('deux')
		wrapper.unmount()
	})

	it('displays multiple selected string items as inline labels', async () => {
		const wrapper = mount(SySelect, {
			props: { items: ['un', 'deux', 'trois'], multiple: true },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		await listItems[0]!.trigger('click')
		await listItems[1]!.trigger('click')
		await wrapper.vm.$nextTick()
		const labels = wrapper.findAll('.sy-select__label')
		expect(labels.length).toBeGreaterThanOrEqual(2)
		expect(labels[0]?.text()).toContain('un')
		expect(labels[1]?.text()).toContain('deux')
		wrapper.unmount()
	})

	it('displays chips for selected string items in chips mode', async () => {
		const wrapper = mount(SySelect, {
			props: { items: ['un', 'deux'], multiple: true, chips: true },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		await listItems[0]!.trigger('click')
		await wrapper.vm.$nextTick()
		const chips = wrapper.findAllComponents({ name: 'VChip' })
		expect(chips.length).toBeGreaterThan(0)
		expect(chips[0]?.text()).toContain('un')
		wrapper.unmount()
	})

	it('clears selection and input for string items', async () => {
		const wrapper = mount(SySelect, {
			props: { items: ['un', 'deux'], clearable: true, modelValue: 'un' },
			attachTo: document.body,
		})
		expect(wrapper.find('input').element.value).toBe('un')
		const clearBtn = wrapper.find('[aria-label="Effacer la sélection"]')
		expect(clearBtn.exists()).toBe(true)
		await clearBtn.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.find('input').element.value).toBe('')
		wrapper.unmount()
	})
})

describe('SySelect.vue - Number items', () => {
	it('displays number items in the dropdown list', async () => {
		const wrapper = mount(SySelect, {
			props: { items: [1, 2] },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		expect(listItems).toHaveLength(2)
		expect(listItems[0]?.text()).toContain('1')
		expect(listItems[1]?.text()).toContain('2')
		wrapper.unmount()
	})

	it('displays selected number item in the input field', async () => {
		const wrapper = mount(SySelect, {
			props: { items: [1, 2] },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const firstItem = wrapper.findComponent(VList).findAll('.v-list-item').at(0)!
		await firstItem.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.find('input').element.value).toBe('1')
		expect(wrapper.emitted()['update:modelValue']).toEqual([[1]])
		wrapper.unmount()
	})

	it('displays selected number item with pre-selected modelValue', () => {
		const wrapper = mount(SySelect, {
			props: { items: [1, 2], modelValue: 2 },
			attachTo: document.body,
		})
		expect(wrapper.find('input').element.value).toBe('2')
		wrapper.unmount()
	})

	it('displays multiple selected number items as inline labels', async () => {
		const wrapper = mount(SySelect, {
			props: { items: [1, 2, 3], multiple: true },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		await listItems[0]!.trigger('click')
		await listItems[1]!.trigger('click')
		await wrapper.vm.$nextTick()
		const labels = wrapper.findAll('.sy-select__label')
		expect(labels.length).toBeGreaterThanOrEqual(2)
		expect(labels[0]?.text()).toContain('1')
		expect(labels[1]?.text()).toContain('2')
		wrapper.unmount()
	})

	it('displays chips for selected number items in chips mode', async () => {
		const wrapper = mount(SySelect, {
			props: { items: [1, 2], multiple: true, chips: true },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		await listItems[0]!.trigger('click')
		await wrapper.vm.$nextTick()
		const chips = wrapper.findAllComponents({ name: 'VChip' })
		expect(chips.length).toBeGreaterThan(0)
		expect(chips[0]?.text()).toContain('1')
		wrapper.unmount()
	})

	it('clears selection and input for number items', async () => {
		const wrapper = mount(SySelect, {
			props: { items: [1, 2], clearable: true, modelValue: 1 },
			attachTo: document.body,
		})
		expect(wrapper.find('input').element.value).toBe('1')
		const clearBtn = wrapper.find('[aria-label="Effacer la sélection"]')
		expect(clearBtn.exists()).toBe(true)
		await clearBtn.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.find('input').element.value).toBe('')
		wrapper.unmount()
	})

	it('displays selected number item with falsy value 0', () => {
		const wrapper = mount(SySelect, {
			props: { items: [0, 1, 2], modelValue: 0 },
			attachTo: document.body,
		})
		expect(wrapper.find('input').element.value).toBe('0')
		wrapper.unmount()
	})

	it('shows item with value 0 as selected in the dropdown list', async () => {
		const wrapper = mount(SySelect, {
			props: { items: [0, 1, 2], modelValue: 0 },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		expect(listItems).toHaveLength(3)
		wrapper.unmount()
	})

	it('displays chip with text for falsy value 0 in chips mode', async () => {
		const wrapper = mount(SySelect, {
			props: { items: [0, 1, 2], multiple: true, chips: true },
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		expect(listItems).toHaveLength(3)
		await listItems[0]!.trigger('click')
		await wrapper.vm.$nextTick()
		const chips = wrapper.findAllComponents({ name: 'VChip' })
		expect(chips.length).toBeGreaterThan(0)
		expect(chips[0]?.text()).toContain('0')
		wrapper.unmount()
	})

	it('displays chip with text for object item with falsy text value 0 in chips mode', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [
					{ text: 0, value: 'zero' },
					{ text: 1, value: 'one' },
				],
				multiple: true,
				chips: true,
				returnObject: true,
				textKey: 'text',
				valueKey: 'value',
			},
			attachTo: document.body,
		})
		await wrapper.find('.v-field').trigger('click')
		await wrapper.vm.$nextTick()
		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		expect(listItems).toHaveLength(2)
		await listItems[0]!.trigger('click')
		await wrapper.vm.$nextTick()
		const chips = wrapper.findAllComponents({ name: 'VChip' })
		expect(chips.length).toBeGreaterThan(0)
		expect(chips[0]?.text()).toContain('0')
		wrapper.unmount()
	})

	it('displays selected object item with falsy text value 0 in input', () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [
					{ text: 0, value: 'zero' },
					{ text: 1, value: 'one' },
				],
				modelValue: 'zero',
				textKey: 'text',
				valueKey: 'value',
			},
			attachTo: document.body,
		})
		expect(wrapper.find('input').element.value).toBe('0')
		wrapper.unmount()
	})

	it('uses plainTextKey with falsy value 0 when allowHtml is true', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [
					{ text: '<b>0</b>', plainText: 0, value: 'zero' },
					{ text: '<b>1</b>', plainText: 1, value: 'one' },
				],
				modelValue: 'zero',
				textKey: 'text',
				valueKey: 'value',
				plainTextKey: 'plainText',
				allowHtml: true,
			},
			attachTo: document.body,
		})
		expect(wrapper.find('input').element.value).toBe('0')
		wrapper.unmount()
	})
})

describe('SySelect.vue — reset via SyForm', () => {
	// Le reset du formulaire (SyForm.reset()) déclenche deux choses :
	//  - VForm.reset() de Vuetify, qui reset le <VTextField> interne ;
	//  - resetAll() du registre custom, qui écrit `modelValue.value = undefined`
	//    via useCustomValidation.
	// Historiquement les deux produisaient un warning Vue « computed value is
	// readonly » / « Set operation on key "modelValue" failed: target is
	// readonly », parce que `selectedItemText` était lié en `v-model` (computed
	// sans setter) et que le `modelValue` de validation était un miroir readonly
	// de la prop. Le fix : `:model-value` one-way sur le VTextField interne, et
	// un `modelValue` inscriptible (computed get/set qui émet update:modelValue).

	const items = [{ text: 'Option 1', value: '1' }]

	it('le reset du formulaire émet update:modelValue(undefined) — le champ est inscriptible côté form', async () => {
		const wrapper = mount({
			components: { SyForm, SySelect },
			data: () => ({ value: '1' }),
			template: `
				<SyForm ref="form">
					<SySelect ref="select" v-model="value" :items="items" text-key="text" label="x" />
				</SyForm>
			`,
			setup() {
				return { items }
			},
		}, { attachTo: document.body })

		await flushPromises()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm.$refs.form as any).reset()
		await flushPromises()

		const select = wrapper.findComponent(SySelect)
		const emitted = select.emitted('update:modelValue') ?? []
		// Le reset doit pouvoir écrire la valeur du champ : on reçoit bien
		// update:modelValue(undefined) (et pas un warning readonly silencieux).
		expect(emitted.some((e: unknown[]) => e[0] === undefined)).toBe(true)

		wrapper.unmount()
	})

	it('ne produit aucun warning « readonly » au reset du formulaire', async () => {
		const warnings: string[] = []
		const spy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
			warnings.push(args.map(String).join(' '))
		})

		const wrapper = mount({
			components: { SyForm, SySelect },
			data: () => ({ value: '1' }),
			template: `
				<SyForm ref="form">
					<SySelect v-model="value" :items="items" text-key="text" label="x" />
				</SyForm>
			`,
			setup() {
				return { items }
			},
		}, { attachTo: document.body })

		await flushPromises()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm.$refs.form as any).reset()
		await flushPromises()

		spy.mockRestore()
		wrapper.unmount()

		const readonlyWarnings = warnings.filter(message => /readonly/i.test(message))
		expect(readonlyWarnings).toEqual([])
	})

	it('le reset natif du <form> (bouton type="reset") ne produit pas de warning « readonly »', async () => {
		const warnings: string[] = []
		const spy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
			warnings.push(args.map(String).join(' '))
		})

		const wrapper = mount({
			components: { SyForm, SySelect },
			data: () => ({ value: '1' }),
			template: `
				<SyForm>
					<form>
						<SySelect v-model="value" :items="items" text-key="text" label="x" />
					</form>
				</SyForm>
			`,
			setup() {
				return { items }
			},
		}, { attachTo: document.body })

		await flushPromises()
		// Simule un clic sur <button type="reset"> : le navigateur déclenche
		// l'événement `reset` du <form>.
		wrapper.find('form').element.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }))
		await flushPromises()

		spy.mockRestore()
		wrapper.unmount()

		const readonlyWarnings = warnings.filter(message => /readonly/i.test(message))
		expect(readonlyWarnings).toEqual([])
	})
})

describe('SySelect.vue — utilisation sans model-value / v-model', () => {
	// Le composant doit rester utilisable quand le parent ne pilote pas la valeur
	// (pas de `v-model`, pas de prop `model-value`). Le `modelValue` de validation
	// étant un computed get/set qui ne fait qu'émettre `update:modelValue`, aucun
	// warning « readonly » ne doit survenir, et la sélection reste fonctionnelle.

	it('fonctionne sans model-value : la sélection émet update:modelValue', async () => {
		const wrapper = mount(SySelect, {
			props: {
				items: [{ text: 'Option 1', value: '1' }],
				textKey: 'text',
				label: 'x',
			},
			attachTo: document.body,
		})

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accès à l'instance
		const instance = wrapper.vm as any
		instance.selectItem({ text: 'Option 1', value: '1' })
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])

		wrapper.unmount()
	})

	it('le reset via SyForm ne produit pas de warning « readonly » sans v-model', async () => {
		const warnings: string[] = []
		const spy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
			warnings.push(args.map(String).join(' '))
		})

		const wrapper = mount({
			components: { SyForm, SySelect },
			setup() {
				return { items: [{ text: 'Option 1', value: '1' }] }
			},
			template: `
				<SyForm ref="form">
					<SySelect :items="items" text-key="text" label="x" />
				</SyForm>
			`,
		}, { attachTo: document.body })

		await flushPromises()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accès au ref du formulaire
		;(wrapper.vm.$refs.form as any).reset()
		await flushPromises()

		spy.mockRestore()
		wrapper.unmount()

		const readonlyWarnings = warnings.filter(message => /readonly/i.test(message))
		expect(readonlyWarnings).toEqual([])
	})
})
