// @vitest-environment jsdom

import { describe, it, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { useId } from 'vue'

import SelectFilter from '../SelectFilter.vue'

// Stub accessible : un <select> avec un <label> associé permet à axe
// de valider label / form-field sans dépendre de l'implémentation SySelect.
const accessibleSySelectStub = {
	template: `
		<div>
			<label :for="inputId">{{ label }}</label>
			<select :id="inputId" :aria-label="label" v-bind="$attrs">
				<option v-for="item in items" :key="item.value" :value="item.value">{{ item.text }}</option>
			</select>
		</div>
	`,
	props: ['modelValue', 'label', 'items', 'clearable', 'density', 'hideDetails', 'hideMessages',
		'disableErrorHandling', 'variant', 'bgColor', 'multiple', 'chips'],
	emits: ['update:modelValue', 'click:clear'],
	setup() {
		const inputId = `select-stub-${useId()}`
		return { inputId }
	},
}

const baseHeader = {
	title: 'Département',
	key: 'department',
	filterOptions: [
		{ text: 'RH', value: 'RH' },
		{ text: 'IT', value: 'IT' },
		{ text: 'Finance', value: 'Finance' },
	],
}

afterEach(() => {
	document.body.innerHTML = ''
})

describe('SelectFilter – accessibilité (axe)', () => {
	it('has no axe violations in default (single) state', async () => {
		const wrapper = mount(SelectFilter, {
			attachTo: document.body,
			global: { stubs: { SySelect: accessibleSySelectStub } },
			props: {
				header: baseHeader,
				filters: [],
				filterValue: undefined,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectFilter – single, empty', { ignoreRules: ['region'] })
	})

	it('has no axe violations when a value is selected', async () => {
		const wrapper = mount(SelectFilter, {
			attachTo: document.body,
			global: { stubs: { SySelect: accessibleSySelectStub } },
			props: {
				header: baseHeader,
				filters: [{ key: 'department', value: 'RH', type: 'select' }],
				filterValue: 'RH',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectFilter – single, with value', { ignoreRules: ['region'] })
	})

	it('has no axe violations in multiple selection state', async () => {
		const wrapper = mount(SelectFilter, {
			attachTo: document.body,
			global: { stubs: { SySelect: accessibleSySelectStub } },
			props: {
				header: { ...baseHeader, multiple: true, chips: true },
				filters: [],
				filterValue: [],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectFilter – multiple, empty', { ignoreRules: ['region'] })
	})

	it('has no axe violations when header has no title (falls back to aria-label "Filtre")', async () => {
		const wrapper = mount(SelectFilter, {
			attachTo: document.body,
			global: { stubs: { SySelect: accessibleSySelectStub } },
			props: {
				header: { key: 'status', filterOptions: baseHeader.filterOptions },
				filters: [],
				filterValue: undefined,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectFilter – no title', { ignoreRules: ['region'] })
	})
})
