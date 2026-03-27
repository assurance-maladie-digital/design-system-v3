// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import LunarCalendar from '../LunarCalendar.vue'

describe('LunarCalendar – accessibility (axe)', () => {
	it('has no obvious axe violations with default props', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
			},
			modelValue: '',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - default props')
	})

	it('has no obvious axe violations with value', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
			},
			modelValue: '15/08/2023',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - with value')
	})

	it('has no obvious axe violations with required field', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
				required: true,
			},
			modelValue: '',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - required field')
	})

	it('has no obvious axe violations with error messages', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
				required: true,
			},
			modelValue: 'invalid',
		})

		// Trigger validation
		await wrapper.find('input').trigger('blur')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - with errors')
	})

	it('has no obvious axe violations with success messages', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
				successMessages: 'Date valide',
			},
			modelValue: '15/08/2023',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - with success messages')
	})

	it('has no obvious axe violations with clearable field', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
				isClearable: true,
			},
			modelValue: '15/08/2023',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - clearable field')
	})

	it('has no obvious axe violations with prepend icon', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
				displayPrependIcon: true,
				displayAppendIcon: false,
			},
			modelValue: '',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - with prepend icon')
	})

	it('has no obvious axe violations with append icon', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
				displayPrependIcon: false,
				displayAppendIcon: true,
			},
			modelValue: '',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - with append icon')
	})

	it('has no obvious axe violations with year constraints', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
				minYear: 1900,
				maxYear: 2023,
			},
			modelValue: '15/08/2023',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - with year constraints')
	})

	it('has no obvious axe violations with placeholder', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				label: 'Date de naissance lunaire',
				placeholder: 'JJ/MM/AAAA',
			},
			modelValue: '',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LunarCalendar - with placeholder')
	})
})
