import { it, describe, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import SyForm from '../../Customs/SyForm/SyForm.vue'
import SyIcon from '../../Customs/SyIcon/SyIcon.vue'
import SyTextArea from '../SyTextArea.vue'

describe('SyTextArea', () => {
	it('renders correctly', () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
			},
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.text()).toContain('Description des symptomes')
	})

	it('applique l\'attribut id depuis uniqueId', () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'my-textarea-id',
				modelValue: '',
				label: 'Description',
			},
		})

		expect(wrapper.find('textarea').attributes('id')).toBe('my-textarea-id')
	})

	it('sets aria-required when required is true', () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				required: true,
				label: 'Description des symptomes',
			},
		})

		const textarea = wrapper.find('textarea')
		expect(textarea.attributes('aria-required')).toBe('true')
	})

	it('does not show required error message by default', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				required: true,
				label: 'Description des symptomes',
			},
		})

		expect(wrapper.text()).not.toContain('Ce champ est requis')
	})

	it('shows required error message when empty after interaction', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				required: true,
				label: 'Description des symptomes',
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.trigger('blur')
		expect(wrapper.text()).toContain('Ce champ est requis')
	})

	it('remove the white spaces at the beginning of the text as we try to add them', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				trim: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('    \n\ta')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
		expect(textarea.element.value).toBe('a')
	})

	it('does not remove the white spaces at the middle of the text', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				trim: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('a\n\t b\n\t ')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a\n\t b\n\t '])
		expect(textarea.element.value).toBe('a\n\t b\n\t ')
	})

	it('removes the white spaces at the end of the text at blur', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				trim: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('a\n\t b\n\t ')
		await textarea.trigger('blur')

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['a\n\t b'])
		expect(textarea.element.value).toBe('a\n\t b')
	})

	it('removes the tabs with the number of spaces defined in the prop', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				replaceTabs: 2,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('\tcontent\t\tcontent \t')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['  content    content   '])
		expect(textarea.element.value).toBe('  content    content   ')
	})

	it('show an error message when the text is too long', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				maxLines: 5,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('content\ncontent\ncontent\ncontent\ncontent\ncontent')
		await textarea.trigger('blur')

		expect(wrapper.text()).toContain('Ce champ ne peut pas dépasser 5 lignes')

		await textarea.trigger('focus')
		await textarea.setValue('content\ncontent\ncontent\ncontent\ncontent')
		await textarea.trigger('blur')

		expect(wrapper.text()).not.toContain('Ce champ ne peut pas dépasser 5 lignes')
	})

	it('adds a line break when a line is too long', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				autoWrap: 50,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('voici un text probablement trop long pour ce champ fdgssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss top')
		await textarea.trigger('blur')

		const expectedValue = 'voici un text probablement trop long pour ce champ\nfdgssssssssssssssssssssssssssssssssssssssssssssss-\nsssssssssssssssssssssssssssssssssssssssssssssssss-\nsssssss top'

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([expectedValue])
		expect(textarea.element.value).toBe(expectedValue)
	})

	it('adds a line break when a line is too long 2', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				autoWrap: 50,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('Bonjour,\nceci est une lettre\nIl contemple l’horizon avec une sérénité inébranlablement\ncalme, comme un sage qui a vu le monde et ses\ntroubles, mais qui sait que la paix intérieure est\nla seule véritable richesse.')
		await textarea.trigger('blur')

		const expectedValue = 'Bonjour,\nceci est une lettre\nIl contemple l’horizon avec une sérénité\ninébranlablement\ncalme, comme un sage qui a vu le monde et ses\ntroubles, mais qui sait que la paix intérieure est\nla seule véritable richesse.'

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([expectedValue])
		expect(textarea.element.value).toBe(expectedValue)
	})

	it('normalizes the text to NFC', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				normalize: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await textarea.setValue('\u006E\u0303')

		const result = wrapper.emitted('update:modelValue')?.[0]?.[0]
		expect(result).toBe('\u00F1')
	})

	it('updates the text when the modelValue prop changes', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				replaceTabs: 2,
				trim: true,
				label: 'Description des symptomes',
			},
		})
		const textarea = wrapper.find('textarea')
		await wrapper.setProps({ modelValue: 'new	value\n' })

		expect(textarea.element.value).toBe('new  value')
	})

	it('shows custom error from customRules in custom validation mode', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
				isValidateOnBlur: false,
				customRules: [
					{
						type: 'custom',
						options: {
							validate: (value: string) => value.includes('ok'),
							message: 'Le texte doit contenir ok',
						},
					},
				],
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('test')
		await textarea.trigger('blur')
		await flushPromises()

		const isValid = await (wrapper.vm as { validateOnSubmit: () => Promise<boolean> }).validateOnSubmit()
		expect(isValid).toBe(false)
	})

	it('shows vuetify rule error when useVuetifyValidation is true', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
				useVuetifyValidation: true,
				rules: [
					(value: string) => value.includes('ok') || 'Erreur Vuetify personnalisée',
				],
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('test')
		await textarea.trigger('blur')
		await flushPromises()

		expect(wrapper.text()).toContain('Erreur Vuetify personnalisée')
	})

	it('shows custom warning from customWarningRules in custom validation mode', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
				isValidateOnBlur: false,
				customRules: [
					{
						type: 'custom',
						options: {
							validate: () => true,
						},
					},
				],
				customWarningRules: [
					{
						type: 'custom',
						options: {
							warningMessage: 'Avertissement personnalisé',
							validate: () => false,
						},
					},
				],
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('valeur')
		await textarea.trigger('blur')
		await flushPromises()

		expect(wrapper.text()).toContain('Avertissement personnalisé')
	})

	it('shows custom success from customSuccessRules in custom validation mode', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
				isValidateOnBlur: false,
				customRules: [
					{
						type: 'custom',
						options: {
							validate: () => true,
						},
					},
				],
				customSuccessRules: [
					{
						type: 'custom',
						options: {
							successMessage: 'Succès personnalisé',
							validate: () => true,
						},
					},
				],
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('valeur')
		await textarea.trigger('blur')
		await flushPromises()

		expect(wrapper.text()).toContain('Succès personnalisé')
	})

	it('validates only on blur when isValidateOnBlur is true', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
				isValidateOnBlur: true,
				customRules: [
					{
						type: 'custom',
						options: {
							validate: (value: string) => value !== 'interdit',
							message: 'Erreur isValidateOnBlur',
						},
					},
				],
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('interdit')
		await flushPromises()

		expect(wrapper.text()).not.toContain('Erreur isValidateOnBlur')

		await textarea.trigger('blur')
		await flushPromises()

		expect(wrapper.text()).toContain('Erreur isValidateOnBlur')
	})

	it('keeps success visual state but hides success text when showSuccessMessages is false', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
				isValidateOnBlur: false,
				showSuccessMessages: false,
				customSuccessRules: [
					{
						type: 'custom',
						options: {
							successMessage: 'Succès masqué',
							validate: () => true,
						},
					},
				],
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('valeur')
		await textarea.trigger('blur')
		await flushPromises()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.vm as any).hasSuccess).toBe(true)
		expect(wrapper.find('.success-field').exists()).toBe(true)
		expect(wrapper.find('.sy-textarea__state-icon').exists()).toBe(true)
		expect(wrapper.findComponent(SyIcon).props('color')).toBe('onSuccessVariant')
		expect(wrapper.text()).not.toContain('Succès masqué')
	})

	it('applies warning visual state and warning icon when warning rules fail', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
				isValidateOnBlur: false,
				customWarningRules: [
					{
						type: 'custom',
						options: {
							warningMessage: 'Avertissement visuel',
							validate: () => false,
						},
					},
				],
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.setValue('valeur')
		await textarea.trigger('blur')
		await flushPromises()

		expect(wrapper.find('.warning-field').exists()).toBe(true)
		expect(wrapper.find('.sy-textarea__state-icon').exists()).toBe(true)
		expect(wrapper.findComponent(SyIcon).props('color')).toBe('onWarningVariant')
	})

	it('applies error visual state and error icon when validation fails', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				modelValue: '',
				label: 'Description des symptomes',
				required: true,
			},
		})

		const textarea = wrapper.find('textarea')
		await textarea.trigger('focus')
		await textarea.trigger('blur')
		await flushPromises()

		expect(wrapper.find('.error-field').exists()).toBe(true)
		expect(wrapper.find('.sy-textarea__state-icon').exists()).toBe(true)
		expect(wrapper.findComponent(SyIcon).props('color')).toBe('error')
	})

	describe('Affichage de l\'astérisque', () => {
		it('affiche l\'astérisque quand displayAsterisk et required sont true', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Test Label',
					displayAsterisk: true,
					required: true,
				},
			})

			expect(wrapper.html()).toContain('Test Label *')
		})

		it('n\'affiche pas l\'astérisque quand displayAsterisk est false', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Test Label',
					displayAsterisk: false,
					required: true,
				},
			})

			expect(wrapper.html()).not.toContain('Test Label *')
			expect(wrapper.html()).toContain('Test Label')
		})

		it('n\'affiche pas l\'astérisque quand required est false', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Test Label',
					displayAsterisk: true,
					required: false,
				},
			})

			expect(wrapper.html()).not.toContain('Test Label *')
		})
	})

	describe('helpText', () => {
		it('affiche le helpText quand aucun message de validation n\'est présent', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					helpText: 'Texte d\'aide',
				},
			})

			expect(wrapper.text()).toContain('Texte d\'aide')
		})

		it('masque le helpText quand des erreurs sont présentes', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					helpText: 'Texte d\'aide',
					required: true,
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.trigger('blur')

			expect(wrapper.text()).not.toContain('Texte d\'aide')
			expect(wrapper.text()).toContain('Ce champ est requis')
		})
	})

	describe('hideDetails', () => {
		it('masque la zone des messages quand hideDetails est true et qu\'il n\'y a pas de messages', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					hideDetails: true,
				},
			})

			expect(wrapper.find('.v-messages').exists()).toBe(false)
		})

		it('affiche la zone des messages quand hideDetails est true mais qu\'il y a des erreurs', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					hideDetails: true,
					required: true,
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.trigger('blur')

			expect(wrapper.find('.v-messages').exists()).toBe(true)
			expect(wrapper.text()).toContain('Ce champ est requis')
		})

		it('affiche la zone des messages par défaut (hideDetails vaut false)', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
				},
			})

			expect(wrapper.find('.v-messages').exists()).toBe(true)
		})
	})

	describe('clearable', () => {
		it('affiche le bouton de suppression quand clearable est true et qu\'une valeur est saisie', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: 'contenu',
					label: 'Description',
					clearable: true,
				},
				attachTo: document.body,
			})

			expect(wrapper.find('.sy-textarea__clear-button').exists()).toBe(true)

			wrapper.unmount()
		})

		it('n\'affiche pas le bouton de suppression quand clearable est false', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: 'contenu',
					label: 'Description',
					clearable: false,
				},
				attachTo: document.body,
			})

			expect(wrapper.find('.sy-textarea__clear-button').exists()).toBe(false)

			wrapper.unmount()
		})

		it('vide le champ au clic sur le bouton de suppression', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: 'contenu',
					label: 'Description',
					clearable: true,
				},
				attachTo: document.body,
			})

			const clearButton = wrapper.find('.sy-textarea__clear-button')
			await clearButton.trigger('click')
			await flushPromises()

			expect(wrapper.emitted('update:modelValue')).toBeTruthy()
			const emittedValues = wrapper.emitted('update:modelValue') as string[][]
			expect(emittedValues[emittedValues.length - 1]).toEqual([''])

			wrapper.unmount()
		})
	})

	describe('disableErrorHandling', () => {
		it('n\'affiche pas d\'erreur pour un champ requis sans valeur quand disableErrorHandling est true', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					required: true,
					disableErrorHandling: true,
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.trigger('blur')

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect((wrapper.vm as any).hasError).toBe(false)
			expect(wrapper.text()).not.toContain('Ce champ est requis')
		})

		it('affiche les erreurs normalement quand disableErrorHandling est false', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					required: true,
					disableErrorHandling: false,
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.trigger('blur')

			expect(wrapper.text()).toContain('Ce champ est requis')
		})
	})

	describe('validateOnSubmit / clearValidation', () => {
		it('validateOnSubmit retourne true quand le champ est valide', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: 'valeur',
					label: 'Description',
					required: true,
				},
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const isValid = await (wrapper.vm as any).validateOnSubmit()
			await flushPromises()

			expect(isValid).toBe(true)
		})

		it('validateOnSubmit retourne false quand le champ est invalide', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					isValidateOnBlur: false,
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: string) => value.length <= 5,
							message: 'Valeur trop longue.',
						},
					}],
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.setValue('valeur trop longue')
			await textarea.trigger('blur')
			await flushPromises()

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const isValid = await (wrapper.vm as any).validateOnSubmit()
			await flushPromises()

			expect(isValid).toBe(false)
			expect(wrapper.text()).toContain('Valeur trop longue.')
		})

		it('validateOnSubmit retourne false quand un champ requis est vide', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					required: true,
				},
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const isValid = await (wrapper.vm as any).validateOnSubmit()
			await flushPromises()

			expect(isValid).toBe(false)
			expect(wrapper.text()).toContain('Ce champ est requis')
		})

		it('clearValidation remet l\'état d\'erreur à zéro', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					counter: 255,
					modelValue: '',
					label: 'Description',
					isValidateOnBlur: false,
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: string) => value.length <= 5,
							message: 'Valeur trop longue.',
						},
					}],
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.setValue('valeur trop longue')
			await textarea.trigger('blur')
			await flushPromises()

			expect(wrapper.text()).toContain('Valeur trop longue.')

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const instance = wrapper.vm as any
			instance.clearValidation()
			await flushPromises()
			expect(wrapper.find('.v-messages__message').exists()).toBe(false)
		})
	})

	describe('counter', () => {
		it('n\'affiche pas le compteur par défaut', () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: 'hello',
					label: 'Description',
				},
			})

			expect(wrapper.find('.v-counter').exists()).toBe(false)
		})

		it('affiche uniquement le nombre de caractères quand counter est true', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Description',
					counter: true,
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.setValue('hello')

			expect(wrapper.find('.v-counter').text()).toBe('5')
		})

		it('affiche le format X / N quand counter est un nombre', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Description',
					counter: 255,
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.setValue('hello')

			expect(wrapper.find('.v-counter').text()).toBe('5 / 255')
		})
	})

	describe('SyForm integration', () => {
		it('valide un champ requis vide lors de la soumission sans interaction préalable', async () => {
			const onSubmit = vi.fn()
			const wrapper = mount({
				components: { SyForm, SyTextArea },
				setup() {
					const value = ref('')
					return { onSubmit, value }
				},
				template: `
					<SyForm @submit="onSubmit">
						<SyTextArea
							v-model="value"
							label="Description"
							required
						/>
						<button type="submit">Soumettre</button>
					</SyForm>
				`,
			})

			await wrapper.find('form').trigger('submit')
			await flushPromises()

			expect(onSubmit).toHaveBeenCalledWith({ isValid: false })
			expect(wrapper.text()).toContain('Ce champ est requis')
		})
	})
})
