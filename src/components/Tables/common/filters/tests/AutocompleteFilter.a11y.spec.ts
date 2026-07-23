// @vitest-environment jsdom

import { describe, it, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { useId } from 'vue'

import AutocompleteFilter from '../AutocompleteFilter.vue'

// Stub accessible : un <input> avec un <label> associé représente
// le champ de saisie de l'autocomplete de façon évaluable par axe.
const accessibleSyAutocompleteStub = {
	template: `
		<div>
			<label :for="inputId">{{ label }}</label>
			<input
				:id="inputId"
				type="text"
				role="combobox"
				:aria-label="label"
				:aria-expanded="false"
				aria-autocomplete="list"
				v-bind="$attrs"
			/>
		</div>
	`,
	props: ['modelValue', 'label', 'items', 'clearable', 'density', 'hideDetails',
		'disableErrorHandling', 'variantStyle', 'bgColor', 'multiple', 'chips', 'filter'],
	emits: ['update:modelValue', 'click:clear'],
	setup() {
		const inputId = `autocomplete-stub-${useId()}`
		return { inputId }
	},
}

const baseHeader = {
	title: 'Statut',
	key: 'status',
	filterOptions: [
		{ text: 'Actif', value: 'Actif' },
		{ text: 'En congé', value: 'En congé' },
		{ text: 'Inactif', value: 'Inactif' },
	],
}

afterEach(() => {
	document.body.innerHTML = ''
})

describe('AutocompleteFilter – accessibilité (axe)', () => {
	it('has no axe violations in default (single) state', async () => {
		const wrapper = mount(AutocompleteFilter, {
			attachTo: document.body,
			global: { stubs: { SyAutocomplete: accessibleSyAutocompleteStub } },
			props: {
				header: baseHeader,
				filters: [],
				filterValue: undefined,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'AutocompleteFilter – single, empty', { ignoreRules: ['region'] })
	})

	it('has no axe violations when a value is selected', async () => {
		const wrapper = mount(AutocompleteFilter, {
			attachTo: document.body,
			global: { stubs: { SyAutocomplete: accessibleSyAutocompleteStub } },
			props: {
				header: baseHeader,
				filters: [{ key: 'status', value: 'Actif', type: 'autocomplete' }],
				filterValue: 'Actif',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'AutocompleteFilter – single, with value', { ignoreRules: ['region'] })
	})

	it('has no axe violations in multiple selection state', async () => {
		const wrapper = mount(AutocompleteFilter, {
			attachTo: document.body,
			global: { stubs: { SyAutocomplete: accessibleSyAutocompleteStub } },
			props: {
				header: { ...baseHeader, multiple: true, chips: true },
				filters: [],
				filterValue: [],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'AutocompleteFilter – multiple, empty', { ignoreRules: ['region'] })
	})

	it('has no axe violations when header has no title (falls back to aria-label "Filtre")', async () => {
		const wrapper = mount(AutocompleteFilter, {
			attachTo: document.body,
			global: { stubs: { SyAutocomplete: accessibleSyAutocompleteStub } },
			props: {
				header: { key: 'status', filterOptions: baseHeader.filterOptions },
				filters: [],
				filterValue: undefined,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'AutocompleteFilter – no title', { ignoreRules: ['region'] })
	})
})
