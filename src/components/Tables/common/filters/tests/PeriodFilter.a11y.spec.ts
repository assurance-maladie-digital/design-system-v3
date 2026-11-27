// @vitest-environment jsdom

import { describe, it, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { useId } from 'vue'

import PeriodFilter from '../PeriodFilter.vue'

// Stub accessible : deux champs labellisés permettent à axe de valider
// label / form-field sans dépendre de l'implémentation PeriodField.
const accessiblePeriodFieldStub = {
	template: `
		<fieldset>
			<legend>{{ label }}</legend>
			<label :for="fromId">Date de début</label>
			<input :id="fromId" type="text" />
			<label :for="toId">Date de fin</label>
			<input :id="toId" type="text" />
		</fieldset>
	`,
	props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'hideMessages',
		'disableErrorHandling', 'variant', 'bgColor', 'format'],
	emits: ['update:modelValue'],
	setup() {
		const fromId = `period-from-${useId()}`
		const toId = `period-to-${useId()}`
		return { fromId, toId }
	},
}

const baseHeader = {
	title: 'Période',
	key: 'period',
}

afterEach(() => {
	document.body.innerHTML = ''
})

describe('PeriodFilter – accessibilité (axe)', () => {
	it('has no axe violations in default empty state', async () => {
		const wrapper = mount(PeriodFilter, {
			attachTo: document.body,
			global: { stubs: { PeriodField: accessiblePeriodFieldStub } },
			props: {
				header: baseHeader,
				filters: [],
				filterValue: undefined,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PeriodFilter – empty', { ignoreRules: ['region'] })

		wrapper.unmount()
	})

	it('has no axe violations with a filled period', async () => {
		const wrapper = mount(PeriodFilter, {
			attachTo: document.body,
			global: { stubs: { PeriodField: accessiblePeriodFieldStub } },
			props: {
				header: baseHeader,
				filters: [{ key: 'period', value: { from: '01/01/2024', to: '31/01/2024' }, type: 'period' }],
				filterValue: { from: '01/01/2024', to: '31/01/2024' },
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PeriodFilter – with value', { ignoreRules: ['region'] })

		wrapper.unmount()
	})
})
