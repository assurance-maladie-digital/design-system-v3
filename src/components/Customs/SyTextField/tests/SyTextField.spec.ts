import { mount } from '@vue/test-utils'
import SyTextField from '../SyTextField.vue'
import { expect, describe, it } from 'vitest'
import { VIcon } from 'vuetify/components'
import { vuetify } from '@tests/unit/setup'

describe('SyTextField', () => {
	const factory = (props = {}, slots = {}) => {
		return mount(SyTextField, {
			props,
			slots,
			global: {
				plugins: [vuetify],
			},
		})
	}

	it('renders correctly with default props', () => {
		const wrapper = factory()
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(VIcon).exists()).toBe(false) // No icons by default
	})

	it('applies the correct variant style', () => {
		const wrapper = factory({ variantStyle: 'filled' })
		const textField = wrapper.findComponent({ name: 'VTextField' })
		expect(textField.props('variant')).toBe('filled')
	})

	it('renders default slots correctly', () => {
		const wrapper = factory({}, {
			prepend: '<div data-testid="prepend-slot">Prepend Slot Content</div>',
			append: '<div data-testid="append-slot">Append Slot Content</div>',
		})

		const prependSlot = wrapper.find('.v-field--prepended')
		const appendSlot = wrapper.find('.v-field--appended')

		expect(prependSlot.exists()).toBe(true)
		expect(appendSlot.exists()).toBe(true)
	})

	it('renders inner slots correctly', () => {
		const wrapper = factory({}, {
			'prepend-inner': '<div data-testid="prepend-inner-slot">Prepend Inner Slot Content</div>',
			'append-inner': '<div data-testid="append-inner-slot">Append Inner Slot Content</div>',
		})

		const prependInnerSlot = wrapper.find('[data-testid="prepend-inner-slot"]')
		const appendInnerSlot = wrapper.find('[data-testid="append-inner-slot"]')

		expect(prependInnerSlot.exists()).toBe(true)
		expect(prependInnerSlot.text()).toBe('Prepend Inner Slot Content')
		expect(appendInnerSlot.exists()).toBe(true)
		expect(appendInnerSlot.text()).toBe('Append Inner Slot Content')
	})

	it('matches snapshot', () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'custom label',
				modelValue: '',
				errorMessages: ['Test error message'],
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('returns error color for appendInnerIcon when value is error', () => {
		const wrapper = factory({ appendInnerIcon: 'error' })
		expect(wrapper.vm.appendInnerIconColor).toBe('error')
	})

	it('returns success color for appendInnerIcon when value is success', () => {
		const wrapper = factory({ appendInnerIcon: 'success' })
		expect(wrapper.vm.appendInnerIconColor).toBe('success')
	})

	it('returns default color for appendInnerIcon when value is info', () => {
		const wrapper = factory({ appendInnerIcon: 'info' })
		expect(wrapper.vm.appendInnerIconColor).toBe('black')
	})

	it('returns default color for appendInnerIcon when value is undefined', () => {
		const wrapper = factory({ appendInnerIcon: undefined })
		expect(wrapper.vm.appendInnerIconColor).toBe('black')
	})
})
