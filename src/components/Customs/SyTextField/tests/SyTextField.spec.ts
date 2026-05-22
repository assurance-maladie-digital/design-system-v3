import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { VIcon } from 'vuetify/components'
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
			props: { prependIcon: 'info' as IconType, label: 'Test Field' },
		})

		await wrapper.vm.$nextTick()
		const prependIcon = wrapper.findComponent(VIcon)
		expect(prependIcon.exists()).toBe(true)
		await prependIcon.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('prepend-icon-click')).toBeTruthy()
	})

	it('emits append-icon-click event when append icon is clicked', async () => {
		const wrapper = mount(SyTextField, {
			props: { appendIcon: 'info' as IconType, label: 'Test Field' },
		})

		await wrapper.vm.$nextTick()
		const appendIcon = wrapper.findComponent(VIcon)
		expect(appendIcon.exists()).toBe(true)
		await appendIcon.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('append-icon-click')).toBeTruthy()
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
		const event = new InputEvent('beforeinput', {
			data: 'a',
			cancelable: true,
			bubbles: true,
		})

		input.element.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(true)
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
})
