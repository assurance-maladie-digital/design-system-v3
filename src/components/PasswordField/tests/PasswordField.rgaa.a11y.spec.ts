// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordField from '../PasswordField.vue'

export const passwordFieldRgaaCriteria = ['7.1', '8.2', '10.7', '11.1', '11.10'] as const

describe('PasswordField – executable RGAA contracts', () => {
	it('7.1, 8.2 and 11.1 – exposes a labelled password input', () => {
		const wrapper = mount(PasswordField, { props: { label: 'Mot de passe' } })
		expect(wrapper.find('input').attributes('aria-label')).toBe('Mot de passe')
		expect(wrapper.find('input').attributes('type')).toBe('password')
	})

	it('7.1 and 11.10 – exposes a named visibility toggle', () => {
		const wrapper = mount(PasswordField, { props: { label: 'Mot de passe' } })
		expect(wrapper.get('.password-toggle-button').attributes('aria-label')).toBeTruthy()
		expect(wrapper.get('.password-toggle-button').attributes('aria-controls')).toBeTruthy()
	})
})
