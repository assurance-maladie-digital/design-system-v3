// @vitest-environment jsdom

import { describe, it, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { useId } from 'vue'

import DateFilter from '../DateFilter.vue'

// Stub accessible : un <input> avec un <label> associé permet à axe
// de valider label / form-field sans dépendre de l'implémentation DatePicker.
const accessibleDatePickerStub = {
	template: `
		<div>
			<label :for="inputId">{{ label }}</label>
			<input :id="inputId" type="text" :aria-label="label" v-bind="$attrs" />
		</div>
	`,
	props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'hideMessages',
		'disableErrorHandling', 'variant', 'bgColor', 'placeholder', 'useCombinedMode',
		'showWeekNumber', 'textFieldClasses', 'isValidateOnBlur',
		'displayIcon', 'displayAppendIcon', 'noIcon', 'period', 'dateFormatReturn',
		'format', 'headingLevel', 'formats', 'customRules', 'customWarningRules',
		'customRulesSuccessMessage',
		'showSuccessMessages', 'readOnly', 'disabled', 'required', 'displayError',
		'displayPersistentErrorMessage', 'width', 'displayTodayButton',
		'displayWeekendDays', 'displayHolidayDays', 'useTextFieldActivator'],
	emits: ['update:modelValue', 'focus', 'blur'],
	setup() {
		const inputId = `datepicker-stub-${useId()}`
		return { inputId }
	},
}

const baseHeader = {
	title: 'Date de naissance',
	key: 'birthdate',
}

afterEach(() => {
	document.body.innerHTML = ''
})

describe('DateFilter – accessibilité (axe)', () => {
	it('has no axe violations in default empty state', async () => {
		const wrapper = mount(DateFilter, {
			attachTo: document.body,
			global: { stubs: { DatePicker: accessibleDatePickerStub } },
			props: {
				header: baseHeader,
				filters: [],
				filterValue: null,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DateFilter – empty', { ignoreRules: ['region'] })

		wrapper.unmount()
	})

	it('has no axe violations with a filled date', async () => {
		const wrapper = mount(DateFilter, {
			attachTo: document.body,
			global: { stubs: { DatePicker: accessibleDatePickerStub } },
			props: {
				header: baseHeader,
				filters: [{ key: 'birthdate', value: '15/01/2024', type: 'date' }],
				filterValue: '15/01/2024',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DateFilter – with value', { ignoreRules: ['region'] })

		wrapper.unmount()
	})
})
