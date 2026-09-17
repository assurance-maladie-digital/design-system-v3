import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SelectBtnField from '../SelectBtnField.vue'

const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'SMS', value: 'sms' },
]

// Nettoyage garanti : exécuté même si une assertion échoue en cours de test,
// ce qui évite qu'un wrapper attaché au document ne fuite sur le test suivant.
let activeWrapper: VueWrapper | null = null

afterEach(() => {
	activeWrapper?.unmount()
	activeWrapper = null
	document.body.innerHTML = ''
})

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

	it('déplace le focus sur la première option après ArrowDown', async () => {
		// `attachTo` est indispensable : sans insertion dans le document,
		// `element.focus()` est sans effet et `document.activeElement` reste <body>.
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items },
			attachTo: document.body,
		})
		activeWrapper = wrapper

		const listbox = wrapper.find('[role="listbox"]')
		expect(listbox.exists()).toBe(true)

		// Le listbox doit être focusable pour recevoir l'événement clavier
		;(listbox.element as HTMLElement).focus()
		await listbox.trigger('keydown', { key: 'ArrowDown' })

		const options = wrapper.findAll('[role="option"]')
		expect(options).toHaveLength(items.length)

		// Le focus DOM doit réellement se déplacer sur la première option
		expect(document.activeElement).toBe(options[0]?.element)

		// Roving tabindex : une seule option tabulable à la fois (APG listbox)
		expect(wrapper.findAll('[role="option"][tabindex="0"]')).toHaveLength(1)
		expect(options[0]?.attributes('tabindex')).toBe('0')
		expect(options[1]?.attributes('tabindex')).toBe('-1')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – after ArrowDown', {
			ignoreRules: ['region'],
		})
	})

	it('boucle sur la dernière option avec ArrowUp depuis la première', async () => {
		const wrapper = mount(SelectBtnField, {
			props: { label: 'Moyen de contact', items },
			attachTo: document.body,
		})
		activeWrapper = wrapper

		const listbox = wrapper.find('[role="listbox"]')
        ;(listbox.element as HTMLElement).focus()
		await listbox.trigger('keydown', { key: 'ArrowDown' })
		await listbox.trigger('keydown', { key: 'ArrowUp' })

		const options = wrapper.findAll('[role="option"]')
		expect(document.activeElement).toBe(options[options.length - 1]?.element)
	})
})
