// @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DatePicker from '../DatePicker.vue'

// Scénario d'accessibilité : sélecteur de date en mode calendrier,
// avec label, format jour/mois/année et navigation clavier.

describe('DatePicker (CalendarMode) – accessibility (axe)', () => {
	it('has no obvious axe violations in default calendar mode', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de naissance',
				format: 'DD/MM/YYYY',
				modelValue: null,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – default calendar mode', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with required date field', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de rendez-vous',
				format: 'DD/MM/YYYY',
				modelValue: null,
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – required date field', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with error messages', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de début',
				format: 'DD/MM/YYYY',
				modelValue: '32/13/2023', // Date invalide
				errorMessages: ['La date est invalide'],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – with error messages', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations in no-calendar mode', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
				modelValue: null,
				noCalendar: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – no-calendar mode', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations in combined mode', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Période de séjour',
				format: 'DD/MM/YYYY',
				modelValue: null,
				useCombinedMode: true,
				displayRange: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – combined mode with range', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with disabled state', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de consultation',
				format: 'DD/MM/YYYY',
				modelValue: '15/03/2023',
				disabled: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – disabled state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with readonly state', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de création',
				format: 'DD/MM/YYYY',
				modelValue: '01/01/2023',
				readonly: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – readonly state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with hint text', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date d\'échéance',
				format: 'DD/MM/YYYY',
				modelValue: null,
				hint: 'Sélectionnez une date dans les 30 prochains jours',
				persistentHint: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – with hint text', {
			ignoreRules: ['region'],
		})
	})
})

describe('DatePicker (CalendarMode) – ARIA attributes', () => {
	let wrapper: ReturnType<typeof mount> | null = null

	afterEach(() => {
		wrapper?.unmount()
		wrapper = null
	})

	const mountDP = (props: Record<string, unknown> = {}) =>
		mount(DatePicker, { props: { label: 'Date de naissance', format: 'DD/MM/YYYY', ...props } })

	it('has aria-haspopup="dialog" on the activator wrapper', () => {
		wrapper = mountDP()
		const activator = wrapper.find('[aria-haspopup="dialog"]')
		expect(activator.exists()).toBe(true)
	})

	it('has aria-controls pointing to the date picker content id on the activator wrapper when visible', async () => {
		wrapper = mountDP()
		const vm = wrapper.vm as InstanceType<typeof DatePicker>
		vm.isDatePickerVisible = true
		await nextTick()
		const activator = wrapper.find('[aria-haspopup="dialog"]')
		expect(activator.attributes('aria-controls')).toBeTruthy()
	})

	it('has no aria-controls on the activator wrapper when closed', () => {
		wrapper = mountDP()
		const activator = wrapper.find('[aria-haspopup="dialog"]')
		expect(activator.attributes('aria-controls')).toBeUndefined()
	})

	it('panelLiveText is empty initially', () => {
		wrapper = mountDP()
		const vm = wrapper.vm as InstanceType<typeof DatePicker>
		expect(vm.panelLiveText).toBe('')
	})

	it('panelLiveText is a reactive ref exposed by the component', async () => {
		wrapper = mountDP()
		const vm = wrapper.vm as InstanceType<typeof DatePicker>
		vm.panelLiveText = 'Sélection du mois, utilisez les touches fléchées pour naviguer'
		await nextTick()
		expect(vm.panelLiveText).toContain('Sélection du mois')
	})

	it('panelLiveText can be cleared', async () => {
		wrapper = mountDP()
		const vm = wrapper.vm as InstanceType<typeof DatePicker>
		vm.panelLiveText = 'Sélection du mois, utilisez les touches fléchées pour naviguer'
		await nextTick()
		vm.panelLiveText = ''
		await nextTick()
		expect(vm.panelLiveText).toBe('')
	})
})
