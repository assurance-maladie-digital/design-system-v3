import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SelectBtnField from '../SelectBtnField.vue'

describe('SelectBtnField - Accessibility Tests', () => {
	it('should have appropriate ARIA roles and attributes', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Moyen de contact',
				items: [
					{ text: 'Email', value: 'email' },
					{ text: 'SMS', value: 'sms' },
				],
			},
		})

		const listbox = wrapper.find('[role="listbox"]')
		expect(listbox.exists()).toBe(true)
		expect(listbox.attributes('aria-label')).toBe('Moyen de contact')

		const options = wrapper.findAll('[role="option"]')
		expect(options).toHaveLength(2)
		expect(options[0]?.attributes('aria-selected')).toBe('false')
	})

	it('should update aria-selected on selection', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Moyen de contact',
				items: [
					{ text: 'Email', value: 'email' },
					{ text: 'SMS', value: 'sms' },
				],
			},
		})

		const options = wrapper.findAll('[role="option"]')
		await options[0]?.trigger('click')

		expect(options[0]?.attributes('aria-selected')).toBe('true')
		expect(options[1]?.attributes('aria-selected')).toBe('false')
	})

	it('should support keyboard navigation', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Moyen de contact',
				items: [
					{ text: 'Email', value: 'email' },
					{ text: 'SMS', value: 'sms' },
				],
			},
		})

		const listbox = wrapper.find('[role="listbox"]')
		await listbox.trigger('keydown', { key: 'ArrowDown' })

		const options = wrapper.findAll('[role="option"]')
		expect(options[0]?.attributes('tabindex')).toBe('0')
		expect(options[1]?.attributes('tabindex')).toBe('-1')
	})

	it('should have aria-disabled when disabled', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Moyen de contact',
				items: [
					{ text: 'Email', value: 'email' },
					{ text: 'SMS', value: 'sms' },
				],
				disabled: true,
			},
		})

		const listbox = wrapper.find('[role="listbox"]')
		expect(listbox.attributes('aria-disabled')).toBe('true')
	})

	it('should have aria-readonly when readonly', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Moyen de contact',
				items: [
					{ text: 'Email', value: 'email' },
					{ text: 'SMS', value: 'sms' },
				],
				readonly: true,
			},
		})

		const listbox = wrapper.find('[role="listbox"]')
		expect(listbox.attributes('aria-readonly')).toBe('true')
	})
})
