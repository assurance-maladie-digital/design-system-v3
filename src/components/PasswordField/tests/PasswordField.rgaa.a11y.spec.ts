// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordField from '../PasswordField.vue'

export const passwordFieldRgaaCriteria = ['1.2', '7.1', '11.10', '11.11', '11.13'] as const

describe('PasswordField – executable RGAA contracts', () => {
	it('11.10 and 11.13 – keeps the password input named and typed', () => {
		const wrapper = mount(PasswordField, { props: { label: 'Mot de passe', required: true } })
		const input = wrapper.get('input')
		expect(input.attributes('type')).toBe('password')
		expect(wrapper.text()).toContain('Mot de passe')
	})
})
