import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

import SyTextField from '../SyTextField.vue'
import type { IconType, SyTextFieldProps } from '../types'
import { SyForm } from '@/components'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SyFormInstance extends Record<string, any> {
	validate: () => Promise<boolean>
}

describe('SyTextField', () => {
	let wrapper: ReturnType<typeof mount<typeof SyTextField>>

	beforeEach(() => {
		wrapper = mount(SyTextField, {
			props: {
				modelValue: undefined,
				required: true,
				showSuccessMessages: true,
				outlined: true,
				label: 'Test Field',
			},
		})
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(false) // No icons by default
	})

	it('applies the correct variant style', () => {
		wrapper = mount(SyTextField, {
			props: { variantStyle: 'filled', label: 'Test Field' },
		})
		const textField = wrapper.findComponent({ name: 'VTextField' })
		expect(textField.props('variant')).toBe('filled')
	})

	it('renders default slots correctly', () => {
		wrapper = mount(SyTextField, {
			props: { label: 'Test Field' },
			slots: {
				prepend: '<div data-testid="prepend-slot">Prepend Slot Content</div>',
				append: '<div data-testid="append-slot">Append Slot Content</div>',
			},
		})

		const prependSlot = wrapper.find('.v-field--prepended')
		const appendSlot = wrapper.find('.v-field--appended')

		expect(prependSlot.exists()).toBe(true)
		expect(appendSlot.exists()).toBe(true)
	})

	it('renders inner slots correctly', () => {
		wrapper = mount(SyTextField, {
			props: { label: 'Test Field' },
			slots: {
				'prepend-inner': '<div data-testid="prepend-inner-slot">Prepend Inner Slot Content</div>',
				'append-inner': '<div data-testid="append-inner-slot">Append Inner Slot Content</div>',
			},
		})

		const prependInnerSlot = wrapper.find('[data-testid="prepend-inner-slot"]')
		const appendInnerSlot = wrapper.find('[data-testid="append-inner-slot"]')

		expect(prependInnerSlot.exists()).toBe(true)
		expect(prependInnerSlot.text()).toBe('Prepend Inner Slot Content')
		expect(appendInnerSlot.exists()).toBe(true)
		expect(appendInnerSlot.text()).toBe('Append Inner Slot Content')
	})

	it('should update icon when validation state changes', async () => {
		wrapper = mount(SyTextField, {
			props: { appendInnerIcon: 'success' as IconType, label: 'Test Field' },
		})
		expect((wrapper.vm.$props as SyTextFieldProps).appendInnerIcon).toBe('success')
	})

	it('should update icon when validation state changes with warning', async () => {
		wrapper = mount(SyTextField, {
			props: { appendInnerIcon: 'warning' as IconType, label: 'Test Field' },
		})
		expect((wrapper.vm.$props as SyTextFieldProps).appendInnerIcon).toBe('warning')
	})

	it('should update icon when validation state changes with error', async () => {
		wrapper = mount(SyTextField, {
			props: { appendInnerIcon: 'error' as IconType, label: 'Test Field' },
		})
		expect((wrapper.vm.$props as SyTextFieldProps).appendInnerIcon).toBe('error')
	})

	it('should update icon when validation state changes with success', async () => {
		wrapper = mount(SyTextField, {
			props: { appendInnerIcon: 'success' as IconType, label: 'Test Field' },
		})
		expect((wrapper.vm.$props as SyTextFieldProps).appendInnerIcon).toBe('success')
	})

	it('emits prepend-icon-click event when prepend icon is clicked', async () => {
		const wrapper = mount(SyTextField, {
			props: { prependIcon: 'calendar' as IconType, label: 'Test Field', disableClickButton: false },
		})

		await wrapper.vm.$nextTick()
		const prependButton = wrapper.find('.sy-text-field__icon-button')
		expect(prependButton.exists()).toBe(true)
		await prependButton.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('prepend-icon-click')).toBeTruthy()
	})

	it('emits append-icon-click event when append icon is clicked', async () => {
		const wrapper = mount(SyTextField, {
			props: { appendIcon: 'calendar' as IconType, label: 'Test Field', disableClickButton: false },
		})

		await wrapper.vm.$nextTick()
		const appendButton = wrapper.find('.sy-text-field__icon-button')
		expect(appendButton.exists()).toBe(true)
		await appendButton.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('append-icon-click')).toBeTruthy()
	})

	it('disables prepend icon button when the field is readonly', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				prependIcon: 'calendar' as IconType,
				label: 'Test Field',
				disableClickButton: false,
				readonly: true,
			},
		})

		const prependButton = wrapper.find('.sy-text-field__icon-button')
		expect(prependButton.attributes('disabled')).toBeDefined()
		expect(prependButton.attributes('aria-disabled')).toBe('true')
		await prependButton.trigger('click')
		expect(wrapper.emitted('prepend-icon-click')).toBeFalsy()
	})

	it('prevents mousedown on icon buttons from blurring the input first', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				prependIcon: 'calendar' as IconType,
				label: 'Test Field',
				disableClickButton: false,
			},
		})

		const prependButton = wrapper.find('.sy-text-field__icon-button')
		const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
		prependButton.element.dispatchEvent(mouseDownEvent)

		expect(mouseDownEvent.defaultPrevented).toBe(true)
	})

	it('does not propagate click from clear button to parent container', async () => {
		const onClickParent = vi.fn()

		const wrapper = mount({
			components: { SyTextField },
			template: `
				<div data-testid="parent" @click="onClickParent">
					<SyTextField
						is-clearable
						label="Test Field"
						model-value="foo"
					/>
				</div>
			`,
			setup() {
				return { onClickParent }
			},
		})

		await wrapper.vm.$nextTick()

		const clearButton = wrapper.find('button[aria-label="Vider Test Field"]')
		expect(clearButton.exists()).toBe(true)

		await clearButton.trigger('click')
		await wrapper.vm.$nextTick()

		expect(onClickParent).not.toHaveBeenCalled()
	})

	it('does not show required error immediately after clear in non-blur validation mode', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Nom',
				modelValue: 'Jean Dupont',
				required: true,
				isClearable: true,
				isValidateOnBlur: false,
			},
			attachTo: document.body,
		})

		const clearButton = wrapper.find('.sy-text-field__clear')
		expect(clearButton.exists()).toBe(true)

		await clearButton.trigger('click')
		await flushPromises()

		expect(wrapper.text()).not.toContain('Le champ Nom est requis.')

		wrapper.unmount()
	})

	it('shows validation error message', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				required: true,
				label: 'Test Field',
			},
		})
		await wrapper.find('input').trigger('focus')
		await wrapper.vm.$nextTick()
		await wrapper.find('input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.v-messages').text()).toContain('Le champ Test Field est requis')
	})

	it('exposes validation messages as read-only state', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				errorMessages: ['Erreur exposee'],
				warningMessages: ['Avertissement expose'],
				successMessages: ['Succes expose'],
			},
		})

		await flushPromises()

		expect(wrapper.vm.errors).toEqual(['Erreur exposee'])
		expect(wrapper.vm.warnings).toEqual(['Avertissement expose'])
		expect(wrapper.vm.successes).toEqual(['Succes expose'])
	})

	it('exposes states calculated by custom validation rules', async () => {
		const errorWrapper = mount(SyTextField, {
			props: {
				modelValue: 'invalid',
				label: 'Test Field',
				showSuccessMessages: true,
				customRules: [{
					type: 'custom',
					options: { validate: () => false, message: 'Erreur custom' },
				}],
			},
		})
		const warningWrapper = mount(SyTextField, {
			props: {
				modelValue: 'warning',
				customWarningRules: [{
					type: 'custom',
					options: { validate: () => false, warningMessage: 'Avertissement custom' },
				}],
			},
		})
		const successWrapper = mount(SyTextField, {
			props: {
				modelValue: 'success',
				showSuccessMessages: true,
				customSuccessRules: [{
					type: 'custom',
					options: { validate: () => true, successMessage: 'Succes custom' },
				}],
			},
		})

		await errorWrapper.vm.validateOnSubmit()
		await warningWrapper.vm.validateOnSubmit()
		await successWrapper.vm.validateOnSubmit()

		expect(errorWrapper.vm.errors).toContain('Erreur custom')
		expect(warningWrapper.vm.warnings).toContain('Avertissement custom')
		expect(successWrapper.vm.successes).toContain('Succes custom')
	})

	it('exposes Vuetify validation errors alongside injected warning and success messages', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				modelValue: '',
				label: 'Test Field',
				useVuetifyValidation: true,
				rules: [() => 'Erreur Vuetify'],
				warningMessages: ['Avertissement expose'],
				successMessages: ['Succes expose'],
			},
		})

		await wrapper.vm.validateOnSubmit()

		expect(wrapper.vm.errors).toContain('Erreur Vuetify')
		expect(wrapper.vm.warnings).toEqual(['Avertissement expose'])
		expect(wrapper.vm.successes).toEqual(['Succes expose'])
	})

	it('keeps only injected states exposed when error handling is disabled', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				modelValue: 'invalid',
				disableErrorHandling: true,
				errorMessages: ['Erreur exposee'],
				warningMessages: ['Avertissement expose'],
				successMessages: ['Succes expose'],
				customRules: [{
					type: 'custom',
					options: { validate: () => false, message: 'Erreur calculee' },
				}],
			},
		})

		await wrapper.vm.validateOnSubmit()

		expect(wrapper.vm.errors).toEqual(['Erreur exposee'])
		expect(wrapper.vm.warnings).toEqual(['Avertissement expose'])
		expect(wrapper.vm.successes).toEqual(['Succes expose'])
	})

	it('updates exposed states on input when validation on blur is disabled', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				modelValue: '',
				isValidateOnBlur: false,
				customRules: [{
					type: 'custom',
					options: { validate: (value: string) => value.length > 2, message: 'Erreur a la saisie' },
				}],
			},
		})

		await wrapper.setProps({ modelValue: 'ab' } as Parameters<typeof wrapper.setProps>[0])
		await vi.waitUntil(() => wrapper.vm.errors.includes('Erreur a la saisie'))

		expect(wrapper.vm.warnings).toEqual([])
		expect(wrapper.vm.successes).toEqual([])
	})

	it('validates field with custom rules', async () => {
		const customRule = {
			type: 'custom',
			options: {
				validate: (value: string) => value.length > 2,
				message: 'Test error message',
			},
		}

		wrapper = mount(SyTextField, {
			props: { customRules: [customRule], label: 'Test Field' },
		})

		await wrapper.setProps({ modelValue: 'ab' } as Parameters<typeof wrapper.setProps>[0])
		await wrapper.find('input').trigger('focus')
		await wrapper.vm.$nextTick()
		await wrapper.find('input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		await wrapper.vm.$nextTick()

		const messages = wrapper.find('.v-messages')
		expect(messages.text()).toContain('Test error message')
	})

	it('validates field with custom warning rules', async () => {
		const warningRule = {
			type: 'custom',
			options: {
				validate: (value: string) => value.length <= 3,
				message: 'Test warning message',
				isWarning: true,
			},
		}

		const wrapper = mount(SyTextField, {
			props: {
				modelValue: 'test',
				customWarningRules: [warningRule],
				showSuccessMessages: true,
				label: 'Test Field',
			},
		})

		await wrapper.find('input').trigger('focus')
		await wrapper.vm.$nextTick()
		await wrapper.find('input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		await wrapper.vm.$nextTick()

		const messages = wrapper.find('.v-messages')
		expect(messages.exists()).toBe(true)
		expect(messages.text()).toContain('Attention : Test Field peut contenir une erreur')
	})

	describe('loading', () => {
		it('shows progress bar when loading is true', async () => {
			wrapper = mount(SyTextField, {
				props: { loading: true, label: 'Nom' },
			})
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-progress-linear').exists()).toBe(true)
		})

		it('does not show progress bar when loading is false', async () => {
			wrapper = mount(SyTextField, {
				props: { loading: false, label: 'Nom' },
			})
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.v-progress-linear').exists()).toBe(false)
		})

		it('sets aria-label with field label when loading', async () => {
			wrapper = mount(SyTextField, {
				props: { loading: true, label: 'Nom' },
			})
			await wrapper.vm.$nextTick()
			const bar = wrapper.find('.v-progress-linear')
			expect(bar.attributes('aria-label')).toBe('Chargement de Nom')
		})

		it('sets generic aria-label when no label and loading', async () => {
			wrapper = mount(SyTextField, {
				props: { loading: true, label: '' },
			})
			await wrapper.vm.$nextTick()
			const bar = wrapper.find('.v-progress-linear')
			expect(bar.attributes('aria-label')).toBe('Chargement en cours')
		})
	})

	it('maintains input value without validation rules', async () => {
		wrapper = mount(SyTextField, {
			props: { label: 'Test Field' },
		})
		const input = wrapper.find('input')

		await input.setValue('test value')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test value'])
	})

	it('filters alphabetic characters when type is number', async () => {
		wrapper = mount(SyTextField, {
			props: {
				label: 'Test Field',
				type: 'number',
			},
		})

		const input = wrapper.find('input')
		const inputElement = input.element as HTMLInputElement
		inputElement.value = '12ab.3e-4'

		await input.trigger('input')

		expect(inputElement.value).toBe('12.3e-4')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['12.3e-4'])
	})

	it('prevents invalid beforeinput data when type is number', async () => {
		wrapper = mount(SyTextField, {
			props: {
				label: 'Test Field',
				type: 'number',
			},
		})

		const input = wrapper.find('input')
		const inputElement = input.element as HTMLInputElement
		const event = new InputEvent('beforeinput', {
			data: 'a',
			cancelable: true,
			bubbles: true,
		})

		input.element.dispatchEvent(event)
		await wrapper.vm.$nextTick()

		expect(event.defaultPrevented).toBe(true)
		// Le caractère interdit n'est pas inséré : le champ reste vide
		expect(inputElement.value).toBe('')
	})

	it('allows multi-character beforeinput data when type is number (spinner increment / paste)', async () => {
		wrapper = mount(SyTextField, {
			props: {
				label: 'Test Field',
				type: 'number',
			},
		})

		const input = wrapper.find('input')
		const inputElement = input.element as HTMLInputElement
		// Ex. incrément du spinner 9 -> 10, ou collage d'un nombre : data = "10"
		const event = new InputEvent('beforeinput', {
			data: '10',
			cancelable: true,
			bubbles: true,
		})

		input.element.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(false)

		// La saisie n'étant pas bloquée, le navigateur l'applique : le champ la conserve telle quelle
		inputElement.value = '10'
		await input.trigger('input')
		await wrapper.vm.$nextTick()

		expect(inputElement.value).toBe('10')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['10'])
	})

	it('collapses multiple decimal separators when type is number', async () => {
		wrapper = mount(SyTextField, {
			props: { label: 'Test Field', type: 'number' },
		})

		const input = wrapper.find('input')
		const inputElement = input.element as HTMLInputElement
		inputElement.value = '32323.....2332...32.32.323'

		await input.trigger('input')

		// Un seul séparateur décimal conservé (préfixe de nombre valide)
		expect(inputElement.value).toBe('32323.')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['32323.'])
	})

	it('renders as a text input (with inputmode decimal) when type is number', () => {
		wrapper = mount(SyTextField, {
			props: { label: 'Test Field', type: 'number' },
		})
		const input = wrapper.find('input')
		expect(input.attributes('type')).toBe('text')
		expect(input.attributes('inputmode')).toBe('decimal')
	})

	describe('number increment buttons', () => {
		it('increments via the up button', async () => {
			wrapper = mount(SyTextField, {
				props: { label: 'Test Field', type: 'number', modelValue: '5' },
			})
			await wrapper.find('button[aria-label="Augmenter Test Field"]').trigger('click')
			expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['6'])
		})

		it('decrements via the down button', async () => {
			wrapper = mount(SyTextField, {
				props: { label: 'Test Field', type: 'number', modelValue: '5' },
			})
			await wrapper.find('button[aria-label="Diminuer Test Field"]').trigger('click')
			expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['4'])
		})

		it('increments with the ArrowUp key', async () => {
			wrapper = mount(SyTextField, {
				props: { label: 'Test Field', type: 'number', modelValue: '5' },
			})
			await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
			expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['6'])
		})

		it('respects step and clamps to max', async () => {
			wrapper = mount(SyTextField, {
				props: { label: 'Test Field', type: 'number', modelValue: '0.2' },
				attrs: { step: 0.1, max: 0.25 },
			})
			await wrapper.find('button[aria-label="Augmenter Test Field"]').trigger('click')
			// 0.2 + 0.1 = 0.3 -> plafonné à 0.25
			expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['0.25'])
		})

		it('hides the increment buttons when areSpinButtonsHidden is true', () => {
			wrapper = mount(SyTextField, {
				props: { label: 'Test Field', type: 'number', areSpinButtonsHidden: true },
			})
			expect(wrapper.find('button[aria-label="Augmenter Test Field"]').exists()).toBe(false)
		})
	})

	it('filters alphabetic characters when type is tel', async () => {
		wrapper = mount(SyTextField, {
			props: {
				label: 'Telephone',
				type: 'tel',
			},
		})

		const input = wrapper.find('input')
		const inputElement = input.element as HTMLInputElement
		inputElement.value = '+33 ab(0)1-23.45'

		await input.trigger('input')

		expect(inputElement.value).toBe('+33 (0)1-23.45')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['+33 (0)1-23.45'])
	})

	it('prevents invalid beforeinput data when type is tel', async () => {
		wrapper = mount(SyTextField, {
			props: {
				label: 'Telephone',
				type: 'tel',
			},
		})

		const input = wrapper.find('input')
		const event = new InputEvent('beforeinput', {
			data: 'a',
			cancelable: true,
			bubbles: true,
		})

		input.element.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(true)
	})

	it('allows multi-character beforeinput data when type is tel (paste)', () => {
		wrapper = mount(SyTextField, {
			props: {
				label: 'Telephone',
				type: 'tel',
			},
		})

		const input = wrapper.find('input')
		const event = new InputEvent('beforeinput', {
			data: '+33 6 12',
			cancelable: true,
			bubbles: true,
		})

		input.element.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(false)
	})

	it('validates field immediately when isValidateOnBlur is false', async () => {
		const customRule = {
			type: 'custom',
			options: {
				validate: (value: string) => value.length > 2,
				message: 'Test error message',
			},
		}

		wrapper = mount(SyTextField, {
			props: {
				modelValue: '',
				label: 'Test Field',
				customRules: [customRule],
				isValidateOnBlur: false,
			},
		})

		await wrapper.setProps({ modelValue: 'ab' } as Parameters<typeof wrapper.setProps>[0])
		await wrapper.vm.$nextTick()

		// settle all pending promises to ensure validation has completed
		await vi.waitUntil(() => {
			const messages = wrapper.find('.v-messages')
			return messages.text().includes('Test error message')
		})

		const messages = wrapper.find('.v-messages')
		expect(messages.text()).toContain('Test error message')

		// Vérifie que l'erreur disparaît quand la valeur devient valide
		await wrapper.setProps({ modelValue: 'abc' } as Parameters<typeof wrapper.setProps>[0])
		await wrapper.vm.$nextTick()

		// the async validation should have updated the error messages, so we wait for the next tick before checking the messages again
		await wrapper.vm.$nextTick()

		await vi.waitUntil(() => {
			const messages = wrapper.find('.v-messages')
			return !messages.text().includes('Test error message')
		})

		expect(messages.text()).not.toContain('Test error message')
	})

	it('s\'enregistre auprès d\'un SyForm parent et déclenche la validation à la soumission', async () => {
		const wrapper = mount({
			components: { SyForm, SyTextField },
			template: `
        <SyForm ref="form">
          <SyTextField v-model="value" label="Nom" required />
        </SyForm>
      `,
			setup() {
				return { value: ref('') }
			},
		})

		const form = wrapper.getComponent(SyForm)
		const isValid = await (form.vm as unknown as SyFormInstance).validate()
		await flushPromises()

		expect(isValid).toBe(false) // champ requis vide
		expect(wrapper.find('.v-messages__message').exists()).toBe(true)
	})

	it('does not show error messages when hideDetails is true even with validation errors', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				modelValue: null,
				label: 'Test hideDetails + erreur',
				hideDetails: true,
				hasError: true,
				errorMessages: ['Erreur de validation'],
			},
		})

		await wrapper.vm.$nextTick()
		expect(wrapper.find('.v-input__details').exists()).toBe(false)
		expect(wrapper.find('.v-messages').exists()).toBe(false)
	})
})

// Le focus du champ = bordure primary du field Vuetify (color="primary"). Le bouton
// d'effacement est un VBtn → ring de focus via l'override global (_btns.scss). jsdom ne
// calcule pas :focus-visible : on vérifie le prérequis — un <button> natif focusable.
describe('SyTextField - focus (clear button)', () => {
	it('renders the clear button as a native <button> so the global focus ring applies', () => {
		const wrapper = mount(SyTextField, { props: { label: 'Nom', isClearable: true, modelValue: 'Texte' } })
		expect(wrapper.get('.sy-text-field__clear').element.tagName).toBe('BUTTON')
		wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(SyTextField, {
			props: { label: 'Nom', isClearable: true, modelValue: 'Texte' },
			attachTo: document.body,
		})
		const btn = wrapper.get('.sy-text-field__clear').element as HTMLButtonElement
		btn.focus()
		expect(document.activeElement).toBe(btn)
		wrapper.unmount()
	})
})
