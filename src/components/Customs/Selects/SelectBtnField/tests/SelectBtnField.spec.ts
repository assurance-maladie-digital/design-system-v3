import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

import SelectBtnField from '../SelectBtnField.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

describe('SelectBtnField', () => {
	it('renders correctly', () => {
		const wrapper = mount(SelectBtnField)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with props', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				helpText: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: '',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('render correctly in multiple mode', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				helpText: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: '',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
				multiple: true,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('emits an update event when the value change in single mode', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				helpText: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
				],
			},
		})

		await wrapper.find('[role="option"]').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('update:modelValue')

		await wrapper.find('[role="option"]').trigger('click')

		expect(wrapper.emitted('update:modelValue')).toEqual([['test'], [null]])
	})

	it(`emits an array of values when the value changes in multiple mode`, async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				helpText: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
				multiple: true,
			},
		})

		await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(3)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[['test2']],
			[['test2', 'test3']],
			[['test3']],
		])
	})

	it('handles multiple mode safely when modelValue is null', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				helpText: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
				multiple: true,
				modelValue: null,
			},
		})

		await wrapper.find('[role="option"]').trigger('click')

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[['test']],
		])
	})

	it(`display correctly with an error`, () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				helpText: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
				errorMessages: ['Test'],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it(`clear the others values when defined to unique`, async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				items: [
					{
						text: 'Test 1',
						value: 'test1',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
					{
						text: 'Other',
						value: 'other',
						unique: true,
					},
				],
				multiple: true,
			},
		})

		await wrapper.find('li:nth-child(1)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(3)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[['test1']],
			[['test1', 'test2']],
			[['other']],
			[['test2']],
		])
	})

	it(`display correctly in dark mode with an error`, () => {
		const DarkMode = {
			template: `
				<v-app>
					<v-theme-provider theme="dark">
						<div>
							<SelectBtnField v-bind="props" />
						</div>
					</v-theme-provider>
				</v-app>
			`,
			components: {
				SelectBtnField,
			},
			data() {
				return {
					props: {
						label: 'Test',
						helpText: 'Test',
						items: [
							{
								text: 'Test 1',
								value: 'test1',
							},
							{
								text: 'Test 2',
								value: 'test2',
							},
						],
						errorMessages: ['Test'],
						multiple: true,
						inline: true,
					},
				}
			},
		}

		const wrapper = mount(DarkMode)

		wrapper.find('li:nth-child(1)[role="option"]').trigger('click')
		wrapper.find('li:nth-child(2)[role="option"]').trigger('click')

		expect(wrapper.html()).toMatchSnapshot()
	})

	it(`display correctly with in dark mode with a help text`, () => {
		const DarkMode = {
			template: `
				<v-app>
					<v-theme-provider theme="dark">
						<div>
							<SelectBtnField v-bind="props" />
						</div>
					</v-theme-provider>
				</v-app>
			`,
			components: {
				SelectBtnField,
			},
			data() {
				return {
					props: {
						label: 'Test',
						helpText: 'Test',
						items: [
							{
								text: 'Test 1',
								value: 'test1',
							},
							{
								text: 'Test 2',
								value: 'test2',
							},
						],
						multiple: true,
						inline: true,
					},
				}
			},
		}

		const wrapper = mount(DarkMode)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('do not allow to select an item when the readonly prop is defined', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				helpText: 'Test',
				items: [
					{
						text: 'Test 1',
						value: 'test1',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
				],
				readonly: true,
			},
		})

		await wrapper.find('[role="option"]').trigger('click')
		expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
	})

	it('filters out items with null or undefined value', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'Valide', value: 'valide' },
					{ text: 'Null', value: null as unknown as string },
					{ text: 'Undefined', value: undefined as unknown as string },
				],
			},
		})

		const options = wrapper.findAll('[role="option"]')
		expect(options).toHaveLength(1)
		expect(options[0]!.text()).toContain('Valide')
	})

	it('syncs internalValue when modelValue prop changes externally', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
				],
				modelValue: 'a',
			},
		})

		let selectedItem = wrapper.find('[aria-selected="true"]')
		expect(selectedItem.text()).toContain('A')

		await wrapper.setProps({ modelValue: 'b' })

		selectedItem = wrapper.find('[aria-selected="true"]')
		expect(selectedItem.text()).toContain('B')
	})

	it('syncs internalValue array when modelValue changes in multiple mode', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
				],
				multiple: true,
				modelValue: ['a'],
			},
		})

		expect(wrapper.find('li:nth-child(1)').attributes('aria-checked')).toBe('true')
		expect(wrapper.find('li:nth-child(2)').attributes('aria-checked')).toBe('false')

		await wrapper.setProps({ modelValue: ['a', 'b'] })

		expect(wrapper.find('li:nth-child(2)').attributes('aria-checked')).toBe('true')
	})

	it('sets correct ARIA attributes on the listbox', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Choix',
				multiple: true,
				inline: true,
				errorMessages: ['Erreur'],
			},
		})

		const listbox = wrapper.find('[role="listbox"]')
		expect(listbox.attributes('aria-label')).toBe('Choix')
		expect(listbox.attributes('aria-multiselectable')).toBe('true')
		expect(listbox.attributes('aria-orientation')).toBe('horizontal')
		expect(listbox.attributes('aria-invalid')).toBe('true')
	})

	it('sets aria-readonly on the listbox when readonly', () => {
		const wrapper = mount(SelectBtnField, {
			props: { readonly: true },
		})

		expect(wrapper.find('[role="listbox"]').attributes('aria-readonly')).toBe('true')
	})

	it('navigates to next item with ArrowRight key', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
					{ text: 'C', value: 'c' },
				],
			},
		})

		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowRight' })
		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowRight' })

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted!.length).toBeGreaterThanOrEqual(1)
	})

	it('wraps around to first item when navigating past last with ArrowDown', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
				],
				modelValue: 'b',
			},
		})

		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted![emitted!.length - 1]![0]).toBe('a')
	})

	it('wraps around to last item when navigating before first with ArrowUp', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
				],
				modelValue: 'a',
			},
		})

		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowUp' })

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted![emitted!.length - 1]![0]).toBe('b')
	})

	it('selects item with Space key', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [{ text: 'Test', value: 'test' }],
			},
		})

		await wrapper.find('[role="option"]').trigger('keydown', { key: ' ' })

		expect(wrapper.emitted('update:modelValue')).toEqual([['test']])
	})

	it('selecting unique item when others are selected replaces all', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				multiple: true,
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
					{ text: 'Unique', value: 'unique', unique: true },
				],
				modelValue: ['a', 'b'],
			},
		})

		await wrapper.find('li:nth-child(3)[role="option"]').trigger('click')

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted![emitted!.length - 1]![0]).toEqual(['unique'])
	})

	it('re-selecting a unique item in multiple mode deselects it', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				multiple: true,
				items: [
					{ text: 'Unique', value: 'unique', unique: true },
				],
				modelValue: ['unique'],
			},
		})

		await wrapper.find('[role="option"]').trigger('click')

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted![emitted!.length - 1]![0]).toEqual([])
	})

	it('displays helpText when no validation message', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				helpText: 'Aide contextuelle',
				items: [{ text: 'A', value: 'a' }],
			},
		})

		expect(wrapper.text()).toContain('Aide contextuelle')
	})

	it('displays errorMessages instead of helpText when both are provided', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				helpText: 'Aide contextuelle',
				errorMessages: ['Champ invalide'],
				items: [{ text: 'A', value: 'a' }],
			},
		})

		expect(wrapper.text()).toContain('Champ invalide')
		expect(wrapper.text()).not.toContain('Aide contextuelle')
	})

	describe('validation', () => {
		it('exposes validateOnSubmit and returns false for an empty required field', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					required: true,
					items: [{ text: 'Email', value: 'email' }],
				},
			})

			const vm = wrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean>, errors: string[] }
			const result = await vm.validateOnSubmit()

			expect(result).toBe(false)
			expect(vm.errors).toContain('Le champ Moyen de contact est requis.')

			wrapper.unmount()
		})

		it('validateOnSubmit returns true when a required field is filled', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					required: true,
					modelValue: 'email',
					items: [{ text: 'Email', value: 'email' }],
				},
			})

			const vm = wrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean> }
			expect(await vm.validateOnSubmit()).toBe(true)

			wrapper.unmount()
		})

		it('displays an error from a customRule', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					modelValue: 'sms',
					items: [
						{ text: 'Email', value: 'email' },
						{ text: 'SMS', value: 'sms' },
					],
					customRules: [{
						type: 'custom',
						options: {
							validate: (v: unknown) => v !== 'sms',
							message: 'Le SMS n’est pas disponible.',
						},
					}],
				},
			})
			const vm = wrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean>, hasError: boolean, errors: string[] }
			await vm.validateOnSubmit()
			await flushPromises()

			expect(vm.hasError).toBe(true)
			expect(vm.errors).toContain('Le SMS n’est pas disponible.')
			expect(wrapper.find('[role="listbox"]').attributes('aria-invalid')).toBe('true')

			wrapper.unmount()
		})

		it('displays a warning and a success message from custom rules', async () => {
			const warningWrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					modelValue: 'courrier',
					items: [{ text: 'Courrier', value: 'courrier' }],
					customWarningRules: [{
						type: 'custom',
						options: {
							validate: (v: unknown) => v !== 'courrier',
							warningMessage: 'Délais allongés.',
						},
					}],
				},
			})
			const warningVm = warningWrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean>, hasWarning: boolean, warnings: string[] }
			await warningVm.validateOnSubmit()
			await flushPromises()
			expect(warningVm.hasWarning).toBe(true)
			expect(warningVm.warnings).toContain('Délais allongés.')
			warningWrapper.unmount()

			const successWrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					modelValue: 'email',
					showSuccessMessages: true,
					items: [{ text: 'Email', value: 'email' }],
					customSuccessRules: [{
						type: 'custom',
						options: {
							validate: (v: unknown) => v === 'email',
							successMessage: 'Choix optimal.',
						},
					}],
				},
			})
			const successVm = successWrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean>, hasSuccess: boolean, successes: string[] }
			await successVm.validateOnSubmit()
			await flushPromises()
			expect(successVm.hasSuccess).toBe(true)
			expect(successVm.successes).toContain('Choix optimal.')
			successWrapper.unmount()
		})

		it('sets aria-required when required', () => {
			const wrapper = mount(SelectBtnField, {
				props: { label: 'Choix', required: true },
			})
			expect(wrapper.find('[role="listbox"]').attributes('aria-required')).toBe('true')
			wrapper.unmount()
		})

		it('does not display errors when disableErrorHandling is true', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					required: true,
					disableErrorHandling: true,
					items: [{ text: 'Email', value: 'email' }],
				},
			})

			const vm = wrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean>, errors: string[] }
			await vm.validateOnSubmit()
			await flushPromises()

			expect(vm.errors).toHaveLength(0)
			expect(wrapper.find('[role="listbox"]').attributes('aria-invalid')).toBe('false')

			wrapper.unmount()
		})

		it('registers with a parent SyForm and is validated on submit', async () => {
			const wrapper = mount({
				components: { SyForm, SelectBtnField },
				template: `
					<SyForm ref="form">
						<SelectBtnField v-model="value" label="Moyen de contact" required :items="items" />
					</SyForm>
				`,
				setup() {
					return {
						value: ref<string | null>(null),
						items: [{ text: 'Email', value: 'email' }],
					}
				},
			})

			const form = wrapper.getComponent(SyForm)
			const isValid = await (form.vm as unknown as { validate: () => Promise<boolean> }).validate()
			await flushPromises()

			expect(isValid).toBe(false)
			expect(wrapper.text()).toContain('Le champ Moyen de contact est requis.')

			wrapper.unmount()
		})

		it('validates on selection change when isValidateOnBlur is false', async () => {
			const wrapper = mount({
				components: { SelectBtnField },
				template: `
					<SelectBtnField
						ref="field"
						v-model="value"
						label="Moyen de contact"
						:items="items"
						:custom-rules="customRules"
					/>
				`,
				setup() {
					return {
						value: ref<string | null>(null),
						items: [
							{ text: 'Email', value: 'email' },
							{ text: 'SMS', value: 'sms' },
						],
						customRules: [{
							type: 'custom',
							options: {
								validate: (v: unknown) => v !== 'sms',
								message: 'Le SMS n’est pas disponible.',
							},
						}],
					}
				},
			})
			const vm = wrapper.findComponent(SelectBtnField).vm as unknown as { hasError: boolean, errors: string[] }

			// Sélection d'une valeur invalide -> validation immédiate
			await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')
			await flushPromises()
			expect(vm.hasError).toBe(true)
			expect(vm.errors).toContain('Le SMS n’est pas disponible.')

			// Re-clic pour désélectionner -> l'erreur disparaît
			await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')
			await flushPromises()
			expect(vm.hasError).toBe(false)

			wrapper.unmount()
		})

		it('supports Vuetify native validation (useVuetifyValidation)', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					useVuetifyValidation: true,
					rules: [(v: unknown) => !!v || 'Le moyen de contact est requis.'],
					items: [{ text: 'Email', value: 'email' }],
				},
			})

			const vm = wrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean>, errors: string[] }
			expect(await vm.validateOnSubmit()).toBe(false)
			await flushPromises()
			expect(vm.errors).toContain('Le moyen de contact est requis.')

			wrapper.unmount()
		})

		it('clears the validation state via clearValidation', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					required: true,
					items: [{ text: 'Email', value: 'email' }],
				},
			})
			const vm = wrapper.vm as unknown as {
				validateOnSubmit: () => Promise<boolean>
				clearValidation: () => void
				errors: string[]
			}

			await vm.validateOnSubmit()
			await flushPromises()
			expect(vm.errors.length).toBeGreaterThan(0)

			vm.clearValidation()
			await flushPromises()
			expect(vm.errors).toHaveLength(0)

			wrapper.unmount()
		})

		it('renders external error, warning and success messages', async () => {
			const errorWrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					errorMessages: ['Erreur externe'],
					items: [{ text: 'Email', value: 'email' }],
				},
			})
			expect(errorWrapper.text()).toContain('Erreur externe')
			expect(errorWrapper.find('.select-btn-field__message--error').exists()).toBe(true)
			errorWrapper.unmount()

			const warningWrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					warningMessages: ['Avertissement externe'],
					items: [{ text: 'Email', value: 'email' }],
				},
			})
			expect(warningWrapper.text()).toContain('Avertissement externe')
			expect(warningWrapper.find('.select-btn-field__message--warning').exists()).toBe(true)
			warningWrapper.unmount()

			const successWrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					successMessages: ['Succès externe'],
					showSuccessMessages: true,
					items: [{ text: 'Email', value: 'email' }],
				},
			})
			expect(successWrapper.text()).toContain('Succès externe')
			expect(successWrapper.find('.select-btn-field__message--success').exists()).toBe(true)
			successWrapper.unmount()
		})

		it('applies the matching state class on the listbox container', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					errorMessages: ['Erreur'],
					items: [{ text: 'Email', value: 'email' }],
				},
			})
			expect(wrapper.find('.select-btn-field__options--error').exists()).toBe(true)
			wrapper.unmount()
		})

		it('does not render the messages area when hideDetails is true', () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					hideDetails: true,
					errorMessages: ['Erreur masquée'],
					items: [{ text: 'Email', value: 'email' }],
				},
			})

			expect(wrapper.find('.select-btn-field__messages').exists()).toBe(false)
			expect(wrapper.text()).not.toContain('Erreur masquée')

			wrapper.unmount()
		})

		it('does not display success message text when showSuccessMessages is false', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					modelValue: 'email',
					items: [{ text: 'Email', value: 'email' }],
					customSuccessRules: [{
						type: 'custom',
						options: {
							validate: (v: unknown) => v === 'email',
							successMessage: 'Choix optimal.',
						},
					}],
				},
			})
			const vm = wrapper.vm as unknown as { validateOnSubmit: () => Promise<boolean>, hasSuccess: boolean }
			await vm.validateOnSubmit()
			await flushPromises()

			// L'état de succès est actif mais le message texte reste masqué
			expect(vm.hasSuccess).toBe(true)
			expect(wrapper.text()).not.toContain('Choix optimal.')

			wrapper.unmount()
		})

		it('does not allow selection when disabled', async () => {
			const wrapper = mount(SelectBtnField, {
				props: {
					label: 'Moyen de contact',
					disabled: true,
					items: [{ text: 'Email', value: 'email' }],
				},
			})

			await wrapper.find('[role="option"]').trigger('click')
			expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
			expect(wrapper.find('[role="listbox"]').attributes('aria-disabled')).toBe('true')

			wrapper.unmount()
		})
	})
})
