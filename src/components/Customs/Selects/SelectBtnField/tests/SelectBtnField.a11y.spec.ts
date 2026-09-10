import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SelectBtnField from '../SelectBtnField.vue'

const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'SMS', value: 'sms' },
]

describe('SelectBtnField – accessibility (axe)', () => {
	it('has no axe violations – default', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – default', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – inline', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items, inline: true },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – inline', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – multiple with selection', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items, multiple: true, modelValue: ['email'] },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – multiple with selection', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – selected (single)', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items, modelValue: 'sms' },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – selected', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – error state', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items, errorMessages: ['Choix obligatoire'] },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – error', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – disabled', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items, disabled: true },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – disabled', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – readonly', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items, readonly: true },
		})
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – readonly', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no axe violations – ariaLabelledby', async () => {
		const container = document.createElement('div')
		document.body.appendChild(container)

		const labelElement = document.createElement('div')
		labelElement.id = 'custom-label-id'
		labelElement.textContent = 'Libellé personnalisé'
		container.appendChild(labelElement)

		const wrapper = mount(SelectBtnField, {
			props: { ariaLabelledby: 'custom-label-id', items },
			attachTo: container,
		})

		const results = await axe(container as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – ariaLabelledby', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
		document.body.removeChild(container)
	})

	it('has no axe violations after keyboard navigation', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items },
		})
		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – after ArrowDown', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})
})
