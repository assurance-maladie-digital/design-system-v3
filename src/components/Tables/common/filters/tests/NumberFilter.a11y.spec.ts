// @vitest-environment jsdom

import { describe, it, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { useId } from 'vue'

import NumberFilter from '../NumberFilter.vue'

// Stub accessible : un <input> avec un <label> associé permet à axe
// de valider label / form-field sans dépendre de l'implémentation SyTextField.
const accessibleSyTextFieldStub = {
	template: `
		<div>
			<label :for="inputId">{{ label }}</label>
			<input :id="inputId" type="text" :aria-label="label" v-bind="$attrs" />
		</div>
	`,
	props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'hideMessages',
		'disableErrorHandling', 'variant', 'bgColor', 'type'],
	emits: ['update:modelValue'],
	setup() {
		const inputId = `number-stub-${useId()}`
		return { inputId }
	},
}

const baseHeader = {
	title: 'Âge',
	key: 'age',
}

afterEach(() => {
	document.body.innerHTML = ''
})

describe('NumberFilter – accessibilité (axe)', () => {
	it('has no axe violations in default empty state', async () => {
		const wrapper = mount(NumberFilter, {
			attachTo: document.body,
			global: { stubs: { SyTextField: accessibleSyTextFieldStub } },
			props: {
				header: baseHeader,
				filters: [],
				filterValue: '',
				debounceTime: 0,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NumberFilter – empty', { ignoreRules: ['region'] })

		wrapper.unmount()
	})

	it('has no axe violations with a filled value', async () => {
		const wrapper = mount(NumberFilter, {
			attachTo: document.body,
			global: { stubs: { SyTextField: accessibleSyTextFieldStub } },
			props: {
				header: baseHeader,
				filters: [{ key: 'age', value: '42', type: 'number' }],
				filterValue: '42',
				debounceTime: 0,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NumberFilter – with value', { ignoreRules: ['region'] })

		wrapper.unmount()
	})
})
