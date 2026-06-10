// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyTextArea from '../SyTextArea.vue'

describe('SyTextArea – accessibility (axe)', () => {
	it('has no obvious axe violations with default props', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
			},
			modelValue: '',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - default props', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with value', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
			},
			modelValue: 'Ceci est une description',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - with value', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with required field', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
				required: true,
			},
			modelValue: '',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - required field', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with error messages', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
				required: true,
			},
			modelValue: '',
		})

		// Trigger validation
		await wrapper.find('textarea').trigger('blur')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - with errors', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with max lines constraint', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
				maxLines: 3,
			},
			modelValue: 'Ligne 1\nLigne 2\nLigne 3\nLigne 4',
		})

		// Trigger validation
		await wrapper.find('textarea').trigger('blur')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - with max lines violation', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with custom rules', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
				rules: [(value: string) => value.length >= 10 || 'Minimum 10 caractères'],
			},
			modelValue: 'Court',
		})

		// Trigger validation
		await wrapper.find('textarea').trigger('blur')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - with custom rules', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with different variant', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
				variant: 'filled',
			},
			modelValue: 'Texte de test',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - filled variant', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with custom color', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
				color: 'secondary',
			},
			modelValue: 'Texte de test',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - custom color', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with background color', async () => {
		const wrapper = mount(SyTextArea, {
			props: {
				uniqueId: 'textarea-1',
				counter: 255,
				label: 'Description',
				bgColor: 'grey-lighten-2',
			},
			modelValue: 'Texte de test',
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextArea - background color', {
			ignoreRules: ['region'],
		})
	})
})
