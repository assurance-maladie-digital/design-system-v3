// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'
import { locales } from '../../locales'

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
		const helpText = 'Saisissez les dates du séjour au format JJ/MM/AAAA.'
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Période de séjour',
				format: 'DD/MM/YYYY',
				modelValue: null,
				useCombinedMode: true,
				displayRange: true,
				helpText,
			},
		})
		// SyTextField associe sa zone de messages (qui affiche le helpText) après le rendu
		await flushPromises()
		const input = wrapper.get('input')
		const descriptions = input.attributes('aria-describedby')?.split(/\s+/)
			.map(id => wrapper.get(`[id="${id}"]`).text())
		expect(descriptions).toEqual([locales.activationOpensCalendar, helpText])

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – combined mode with range', {
			ignoreRules: ['region'],
		})
	})

	it('keeps one visible format instruction associated with an invalid text range', async () => {
		const helpText = 'Saisissez les deux dates dans l’ordre, séparées par un tiret. Exemple : 2026-03-12 - 2026-04-18. La période ne doit pas dépasser 30 jours.'
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Période',
				format: 'YYYY-MM-DD',
				helpText,
				modelValue: null,
				noCalendar: true,
				displayRange: true,
				required: true,
			},
		})
		// SyTextField associe sa zone de messages (qui affiche le helpText) après le rendu
		await flushPromises()
		const input = wrapper.get('input')
		const getDescriptions = () => (input.attributes('aria-describedby') ?? '')
			.split(/\s+/)
			.filter(Boolean)
			.map(id => wrapper.get(`[id="${id}"]`))
		const initialDescriptions = getDescriptions()
		const [instruction] = initialDescriptions
		expect(initialDescriptions).toHaveLength(1)
		expect(instruction?.isVisible()).toBe(true)
		expect(instruction?.text()).toBe(helpText)

		await input.setValue('2026-04-18 - 2026-03-12')
		await input.trigger('blur')
		await flushPromises()

		expect(input.attributes('aria-invalid')).toBe('true')
		const descriptions = getDescriptions()
		expect(descriptions.filter(node => node.text() === helpText)).toHaveLength(1)
		expect(descriptions.some(node => node.element === instruction?.element)).toBe(true)
		expect(instruction?.isVisible()).toBe(true)
		expect(descriptions.map(node => node.text()).join(' ')).toContain(locales.endBeforeStartEqual)
		assertNoA11yViolations(await axe(wrapper.element), 'DatePicker – invalid text range', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
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

	it('has no obvious axe violations when the calendar dialog is open and exposes the expected ARIA contract', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de départ',
				format: 'DD/MM/YYYY',
				modelValue: null,
			},
			attachTo: document.body,
		})

		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		// Apply ARIA semantics before running axe so we test the patched markup
		wrapper.vm.updateAccessibility()
		await nextTick()

		const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]')
		expect(dialog).not.toBeNull()
		expect(dialog?.getAttribute('role')).toBe('dialog')
		expect(dialog?.getAttribute('aria-modal')).toBe('true')
		const titleId = dialog?.getAttribute('aria-labelledby')
		expect(titleId).toBeTruthy()
		expect(document.getElementById(titleId ?? '')?.textContent?.trim()).toBe(locales.calendarTitle)

		const activatorWrapper = wrapper.find('[aria-controls]')
		expect(activatorWrapper.exists()).toBe(true)

		const dayCells = Array.from(document.body.querySelectorAll<HTMLElement>('[role="gridcell"][data-v-date]'))
		expect(dayCells.length).toBeGreaterThan(0)
		expect(dayCells.every(cell => ['true', 'false'].includes(cell.getAttribute('aria-selected') ?? ''))).toBe(true)

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'DatePicker – opened calendar dialog', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations when the calendar opens on the year view (birth date mode)', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de naissance',
				format: 'DD/MM/YYYY',
				modelValue: null,
				isBirthDate: true,
			},
			attachTo: document.body,
		})

		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		// Apply ARIA semantics before running axe so we test the patched markup
		await wrapper.vm.updateAccessibility()
		await nextTick()

		const yearsContainer = document.body.querySelector<HTMLElement>('.v-date-picker-years')
		expect(yearsContainer).not.toBeNull()

		// Le conteneur scrollable n'est plus focusable, donc sans nom propre ;
		// role="rowgroup" car il est enfant direct du role="grid" posé sur .v-date-picker-years
		const yearsContent = yearsContainer?.querySelector<HTMLElement>('.v-date-picker-years__content')
		expect(yearsContent).not.toBeNull()
		expect(yearsContent?.getAttribute('role')).toBe('rowgroup')
		expect(yearsContent?.hasAttribute('aria-label')).toBe(false)

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'DatePicker – opened year view (birth date)', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	}, 60000)

	it('expose un seul arrêt de tabulation dans la vue années, y compris après un cycle focus/blur', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de naissance',
				format: 'DD/MM/YYYY',
				modelValue: null,
				isBirthDate: true,
			},
			attachTo: document.body,
		})

		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		await wrapper.vm.updateAccessibility()
		await nextTick()

		const yearsContainer = document.body.querySelector<HTMLElement>('.v-date-picker-years')
		expect(yearsContainer).not.toBeNull()
		const yearsContent = yearsContainer?.querySelector<HTMLElement>('.v-date-picker-years__content')
		expect(yearsContent?.getAttribute('tabindex')).toBe('-1')
		expect(yearsContainer?.querySelectorAll('[tabindex="0"]')).toHaveLength(1)

		const firstYear = yearsContainer?.querySelector<HTMLElement>('button')
		firstYear?.focus()
		await nextTick()
		firstYear?.blur()
		await nextTick()
		await nextTick()

		expect(yearsContent?.getAttribute('tabindex')).toBe('-1')
		expect(yearsContainer?.querySelectorAll('[tabindex="0"]')).toHaveLength(1)

		wrapper.unmount()
	}, 60000)
})
