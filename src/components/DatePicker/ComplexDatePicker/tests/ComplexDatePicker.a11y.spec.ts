// @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import ComplexDatePicker from '../ComplexDatePicker.vue'

// Scénario d'accessibilité : sélecteur de date combiné (champ + calendrier),
// en mode simple, avec label et format jour/mois/année.

describe('ComplexDatePicker – accessibility (axe)', () => {
	it('has no obvious axe violations in default calendar mode', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		const ignoredRules = ['region'] // Ignoring 'region' rule as per test configuration

		const results = await axe(wrapper.element as HTMLElement)
		// Debug aid: log violations details when present
		if (results.violations.filter(
			v => !ignoredRules.includes(v.id), // Ignoring specified rules as per test configuration
		).length > 0) {
			console.log(JSON.stringify(results.violations, null, 2))
		}
		assertNoA11yViolations(results, 'ComplexDatePicker – default calendar mode', {
			ignoreRules: ignoredRules,
		})
	})
})

describe('ComplexDatePicker – ARIA attributes', () => {
	let wrapper: ReturnType<typeof mount> | null = null

	afterEach(() => {
		wrapper?.unmount()
		wrapper = null
	})

	const mountCP = (props: Record<string, unknown> = {}) =>
		mount(ComplexDatePicker, { props: { label: 'Date', format: 'DD/MM/YYYY', ...props } })

	it('has role="combobox" on the activator', () => {
		wrapper = mountCP()
		const combobox = wrapper.find('[role="combobox"]')
		expect(combobox.exists()).toBe(true)
	})

	it('has aria-expanded="false" on the combobox initially', () => {
		wrapper = mountCP()
		const combobox = wrapper.find('[role="combobox"]')
		expect(combobox.attributes('aria-expanded')).toBe('false')
	})

	it('has aria-haspopup="dialog" on the combobox', () => {
		wrapper = mountCP()
		const combobox = wrapper.find('[role="combobox"]')
		expect(combobox.attributes('aria-haspopup')).toBe('dialog')
	})

	it('has aria-expanded="true" and aria-controls when calendar is open', async () => {
		wrapper = mountCP()
		const vm = wrapper.vm as InstanceType<typeof ComplexDatePicker>
		vm.isDatePickerVisible = true
		await nextTick()
		const combobox = wrapper.find('[role="combobox"]')
		expect(combobox.attributes('aria-expanded')).toBe('true')
		expect(combobox.attributes('aria-controls')).toBeTruthy()
	})

	it('panelLiveText is empty initially', () => {
		wrapper = mountCP()
		const vm = wrapper.vm as InstanceType<typeof ComplexDatePicker>
		expect(vm.panelLiveText).toBe('')
	})

	it('panelLiveText is a reactive ref exposed by the component', async () => {
		wrapper = mountCP()
		const vm = wrapper.vm as InstanceType<typeof ComplexDatePicker>
		vm.panelLiveText = 'Sélection du mois, utilisez les touches fléchées pour naviguer'
		await nextTick()
		expect(vm.panelLiveText).toContain('Sélection du mois')
	})

	it('panelLiveText can be cleared', async () => {
		wrapper = mountCP()
		const vm = wrapper.vm as InstanceType<typeof ComplexDatePicker>
		vm.panelLiveText = 'Sélection du mois, utilisez les touches fléchées pour naviguer'
		await nextTick()
		vm.panelLiveText = ''
		await nextTick()
		expect(vm.panelLiveText).toBe('')
	})
})
