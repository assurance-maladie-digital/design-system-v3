import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VIcon } from 'vuetify/components'

import SyTextField from '../SyTextField.vue'
import type { IconType } from '../types'

const vuetify = createVuetify({
	components,
	directives,
})

describe('SyTextField.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof SyTextField>>

	beforeEach(() => {
		wrapper = mount(SyTextField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: undefined,
				required: true,
				showSuccessMessages: true,
				outlined: true,
			},
		})
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(false) // No icons by default
	})

	it('applies the correct variant style', () => {
		wrapper = mount(SyTextField, {
			global: { plugins: [vuetify] },
			props: { variantStyle: 'filled' },
		})
		const textField = wrapper.findComponent({ name: 'VTextField' })
		expect(textField.props('variant')).toBe('filled')
	})

	it('renders default slots correctly', () => {
		wrapper = mount(SyTextField, {
			global: { plugins: [vuetify] },
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
			global: { plugins: [vuetify] },
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
			global: { plugins: [vuetify] },
			props: { appendInnerIcon: 'success' as IconType },
		})
		expect(wrapper.props('appendInnerIcon')).toBe('success')
	})

	it('should update icon when validation state changes with warning', async () => {
		wrapper = mount(SyTextField, {
			global: { plugins: [vuetify] },
			props: { appendInnerIcon: 'warning' as IconType },
		})
		expect(wrapper.props('appendInnerIcon')).toBe('warning')
	})

	it('should update icon when validation state changes with error', async () => {
		wrapper = mount(SyTextField, {
			global: { plugins: [vuetify] },
			props: { appendInnerIcon: 'error' as IconType },
		})
		expect(wrapper.props('appendInnerIcon')).toBe('error')
	})

	it('should update icon when validation state changes with success', async () => {
		wrapper = mount(SyTextField, {
			global: { plugins: [vuetify] },
			props: { appendInnerIcon: 'success' as IconType },
		})
		expect(wrapper.props('appendInnerIcon')).toBe('success')
	})

	it('emits prepend-icon-click event when prepend icon is clicked', async () => {
		const wrapper = mount(SyTextField, {
			global: { plugins: [vuetify] },
			props: { prependIcon: 'info' as IconType },
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
			global: { plugins: [vuetify] },
			props: { appendIcon: 'info' as IconType },
		})

		await wrapper.vm.$nextTick()
		const appendIcon = wrapper.findComponent(VIcon)
		expect(appendIcon.exists()).toBe(true)
		await appendIcon.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('append-icon-click')).toBeTruthy()
	})

	it('shows validation error message', async () => {
		const wrapper = mount(SyTextField, {
			global: { plugins: [vuetify] },
			props: {
				required: true,
				label: 'Test Field',
			},
		})
		await wrapper.find('input').trigger('blur')
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
			global: { plugins: [vuetify] },
			props: { customRules: [customRule] },
		})

		await wrapper.setProps({ modelValue: 'ab' })
		await wrapper.find('input').trigger('blur')
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
			global: { plugins: [vuetify] },
			props: {
				modelValue: 'test',
				customWarningRules: [warningRule],
				showSuccessMessages: true,
				label: 'Test Field',
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.find('input').trigger('blur')
		await wrapper.vm.$nextTick()

		const messages = wrapper.find('.v-messages')
		expect(messages.exists()).toBe(true)
		expect(messages.text()).toContain('Attention : Test Field peut contenir une erreur')
	})

	it('maintains input value without validation rules', async () => {
		wrapper = mount(SyTextField, {
			global: { plugins: [vuetify] },
		})
		const input = wrapper.find('input')

		await input.setValue('test value')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test value'])
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
			global: { plugins: [vuetify] },
			props: {
				customRules: [customRule],
				isValidateOnBlur: false,
			},
		})

		await wrapper.setProps({ modelValue: 'ab' })
		await wrapper.vm.$nextTick()

		const messages = wrapper.find('.v-messages')
		expect(messages.text()).toContain('Test error message')

		// Vérifie que l'erreur disparaît quand la valeur devient valide
		await wrapper.setProps({ modelValue: 'abc' })
		await wrapper.vm.$nextTick()

		expect(messages.text()).not.toContain('Test error message')
	})
})
