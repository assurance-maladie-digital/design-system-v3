// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SelectBtnField from '../SelectBtnField.vue'

const items = [
	{
		text: 'Email',
		value: 'email',
	},
	{
		text: 'Courrier',
		value: 'courrier',
	},
	{
		text: 'SMS',
		value: 'sms',
	},
]

describe('SelectBtnField – accessibility (axe)', () => {
	it('has no obvious axe violations for labelled single-select listbox', async () => {
		const wrapper = mount({
			components: { SelectBtnField },
			template: `
				<div>
					<h2 id="contact-method">Choisissez votre moyen de contact</h2>
					<SelectBtnField
						:model-value="null"
						:items="items"
						aria-labelledby="contact-method"
					/>
				</div>
			`,
			setup() {
				return { items }
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – labelled single-select listbox', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for required labelled listbox', async () => {
		const wrapper = mount({
			components: { SelectBtnField },
			template: `
				<div>
					<h2 id="contact-method-required">Choisissez votre moyen de contact</h2>
					<SelectBtnField
						:model-value="null"
						:items="items"
						aria-labelledby="contact-method-required"
						required
					/>
				</div>
			`,
			setup() {
				return { items }
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – required labelled listbox', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for multi-select listbox', async () => {
		const wrapper = mount({
			components: { SelectBtnField },
			template: `
				<div>
					<h2 id="contact-method-multiple">Choisissez vos moyens de contact</h2>
					<SelectBtnField
						:model-value="['email', 'sms']"
						:items="items"
						aria-labelledby="contact-method-multiple"
						multiple
					/>
				</div>
			`,
			setup() {
				return { items }
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – multi-select listbox', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations when hint is displayed', async () => {
		const wrapper = mount({
			components: { SelectBtnField },
			template: `
				<div>
					<h2 id="contact-method-hint">Choisissez votre moyen de contact</h2>
					<SelectBtnField
						:model-value="null"
						:items="items"
						aria-labelledby="contact-method-hint"
						hint="Par défaut, le moyen de contact est l’email."
					/>
				</div>
			`,
			setup() {
				return { items }
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – hint displayed', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations in readonly state', async () => {
		const wrapper = mount({
			components: { SelectBtnField },
			template: `
				<div>
					<h2 id="contact-method-readonly">Choisissez votre moyen de contact</h2>
					<SelectBtnField
						:model-value="'email'"
						:items="items"
						aria-labelledby="contact-method-readonly"
						readonly
					/>
				</div>
			`,
			setup() {
				return { items }
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – readonly state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations when error state and error message are displayed', async () => {
		const wrapper = mount({
			components: { SelectBtnField },
			template: `
				<div>
					<h2 id="contact-method-error">Choisissez votre moyen de contact</h2>
					<SelectBtnField
						:model-value="null"
						:items="items"
						aria-labelledby="contact-method-error"
						:has-error="true"
						:error-messages="['Le champ est requis.']"
					/>
				</div>
			`,
			setup() {
				return { items }
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SelectBtnField – error state', {
			ignoreRules: ['region'],
		})
	})
})
