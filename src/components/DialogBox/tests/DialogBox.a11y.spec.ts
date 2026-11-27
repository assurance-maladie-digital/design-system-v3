// @vitest-environment jsdom

import { describe, it, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DialogBox from '../DialogBox.vue'

let attachTarget: HTMLElement

beforeEach(() => {
	attachTarget = document.createElement('div')
	attachTarget.setAttribute('id', 'dialog-box-a11y-target')
	document.body.appendChild(attachTarget)
})

afterEach(() => {
	attachTarget.remove()
})

describe('DialogBox – accessibility (axe)', () => {
	it('has no obvious axe violations with title, content and actions', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				headingLevel: 2,
				modelValue: true,
				title: 'Confirmation',
				confirmBtnText: 'Valider',
				cancelBtnText: 'Annuler',
			},
			slots: {
				default: '<p role="document">Merci de confirmer votre action.</p>',
			},
			attachTo: attachTarget,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DialogBox – default open state', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations without actions (hideActions)', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				headingLevel: 2,
				modelValue: true,
				title: 'Information',
				hideActions: true,
			},
			slots: {
				default: '<p>Contenu de la fenêtre.</p>',
			},
			attachTo: attachTarget,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DialogBox – hideActions', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations with a custom actions slot', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				headingLevel: 3,
				modelValue: true,
				title: 'Actions personnalisées',
			},
			slots: {
				default: '<p>Contenu de la fenêtre.</p>',
				actions: '<button type="button">Action projet</button>',
			},
			attachTo: attachTarget,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DialogBox – custom actions slot', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations in persistent mode', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				headingLevel: 2,
				modelValue: true,
				title: 'Action irréversible',
				persistent: true,
				confirmBtnText: 'Supprimer',
				cancelBtnText: 'Annuler',
			},
			slots: {
				default: '<p>Cette action ne peut pas être annulée.</p>',
			},
			attachTo: attachTarget,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DialogBox – persistent', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
