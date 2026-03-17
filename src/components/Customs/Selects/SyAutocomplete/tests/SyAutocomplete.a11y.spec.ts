// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyAutocomplete from '../SyAutocomplete.vue'

const items = [
	{ text: 'Option 1', value: '1' },
	{ text: 'Option 2', value: '2' },
	{ text: 'Option 3', value: '3' },
]

describe('SyAutocomplete – accessibility (axe)', () => {
	it('has no obvious axe violations for basic autocomplete', async () => {
		const wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: null,
				items,
				label: 'Choisir une option',
				textKey: 'text',
				valueKey: 'value',
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyAutocomplete – basic field', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for multiple selection', async () => {
		const wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [],
				items,
				label: 'Choisir plusieurs options',
				textKey: 'text',
				valueKey: 'value',
				multiple: true,
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyAutocomplete – multiple selection', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for chips display', async () => {
		const wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [items[0]!.value],
				items,
				label: 'Options sélectionnées',
				textKey: 'text',
				valueKey: 'value',
				multiple: true,
				chips: true,
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyAutocomplete – chips display', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for selectionText with no selection', async () => {
		const wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [],
				items,
				label: 'Colonnes affichées',
				textKey: 'text',
				valueKey: 'value',
				multiple: true,
				selectionText: (selected: unknown[]) => `${selected.length} colonnes sélectionnées`,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyAutocomplete – selectionText empty', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for selectionText with selection', async () => {
		const wrapper = mount(SyAutocomplete, {
			props: {
				modelValue: [items[0]!.value, items[1]!.value],
				items,
				label: 'Colonnes affichées',
				textKey: 'text',
				valueKey: 'value',
				multiple: true,
				selectionText: (selected: unknown[]) => `${selected.length} colonnes sélectionnées`,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyAutocomplete – selectionText with selection', {
			ignoreRules: ['region'],
		})
	})
})
