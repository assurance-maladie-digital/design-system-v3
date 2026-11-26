// @vitest-environment jsdom

import { describe, it, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { useId } from 'vue'

import TextFilter from '../TextFilter.vue'

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
		'disableErrorHandling', 'variant', 'bgColor'],
	emits: ['update:modelValue'],
	setup() {
		const inputId = `textfield-stub-${useId()}`
		return { inputId }
	},
}

const baseHeader = {
	title: 'Département',
	key: 'department',
}

afterEach(() => {
	document.body.innerHTML = ''
})

describe('TextFilter – accessibilité (axe)', () => {
	it('has no axe violations in default empty state', async () => {
		const wrapper = mount(TextFilter, {
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
		assertNoA11yViolations(results, 'TextFilter – empty', { ignoreRules: ['region'] })

		wrapper.unmount()
	})

	it('has no axe violations with a filled value', async () => {
		const wrapper = mount(TextFilter, {
			attachTo: document.body,
			global: { stubs: { SyTextField: accessibleSyTextFieldStub } },
			props: {
				header: baseHeader,
				filters: [{ key: 'department', value: 'RH', type: 'text' }],
				filterValue: 'RH',
				debounceTime: 0,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'TextFilter – with value', { ignoreRules: ['region'] })

		wrapper.unmount()
	})
})
