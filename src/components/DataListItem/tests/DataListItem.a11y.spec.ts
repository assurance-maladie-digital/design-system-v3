// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { mdiAccount } from '@mdi/js'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DataListItem from '../DataListItem.vue'

describe('DataListItem – accessibility (axe)', () => {
	it.each([
		{ name: 'default', props: { label: 'Nom', value: 'Dupont' } },
		{ name: 'action', props: { label: 'Nom', value: 'Dupont', action: 'Modifier le nom' } },
		{ name: 'row', props: { label: 'Nom', value: 'Dupont', row: true } },
		{ name: 'chip', props: { label: 'Statut', value: 'Actif', chip: true } },
		{ name: 'decorative icon', props: { label: 'Nom', value: 'Dupont', icon: mdiAccount } },
		{ name: 'placeholder', props: { label: 'Nom', placeholder: 'Non renseigné' } },
	])('has no obvious axe violations with $name', async ({ name, props }) => {
		const main = document.createElement('main')
		document.body.appendChild(main)

		const wrapper = mount({
			render: () => h('dl', [h(DataListItem, props)]),
		}, { attachTo: main })

		try {
			const results = await axe(main)
			assertNoA11yViolations(results, `DataListItem – ${name}`)
		}
		finally {
			wrapper.unmount()
			main.remove()
		}
	})
})

describe('DataListItem – semantic structure', () => {
	it('uses dt for the label and dd for the value', () => {
		const main = document.createElement('main')
		document.body.appendChild(main)

		const wrapper = mount({
			render: () => h('dl', [
				h(DataListItem, {
					label: 'Nom',
					value: 'Dupont',
				}),
			]),
		}, {
			attachTo: main,
		})

		try {
			const label = wrapper.find('dt')
			const value = wrapper.find('dd')

			expect(label.exists()).toBe(true)
			expect(label.text()).toContain('Nom')

			expect(value.exists()).toBe(true)
			expect(value.text()).toContain('Dupont')
		}
		finally {
			wrapper.unmount()
			main.remove()
		}
	})

	it('renders the placeholder as the value when no value is provided', () => {
		const main = document.createElement('main')
		document.body.appendChild(main)

		const wrapper = mount({
			render: () => h('dl', [
				h(DataListItem, {
					label: 'Nom',
					placeholder: 'Non renseigné',
				}),
			]),
		}, {
			attachTo: main,
		})

		try {
			const value = wrapper.find('dd')

			expect(value.exists()).toBe(true)
			expect(value.text()).toBe('Non renseigné')
		}
		finally {
			wrapper.unmount()
			main.remove()
		}
	})
})

describe('DataListItem – decorative icon', () => {
	it('does not expose the decorative icon to assistive technologies', () => {
		const main = document.createElement('main')
		document.body.appendChild(main)

		const wrapper = mount({
			render: () => h('dl', [
				h(DataListItem, {
					label: 'Nom',
					value: 'Dupont',
					icon: mdiAccount,
				}),
			]),
		}, {
			attachTo: main,
		})

		try {
			const icon = wrapper.find(
				'.sy-data-list-item-label .v-icon',
			)

			expect(icon.exists()).toBe(true)
			expect(icon.attributes('aria-hidden')).toBe('true')
		}
		finally {
			wrapper.unmount()
			main.remove()
		}
	})
})

describe('DataListItem – action', () => {
	it('renders the action as a real button', () => {
		const main = document.createElement('main')
		document.body.appendChild(main)

		const wrapper = mount({
			render: () => h('dl', [
				h(DataListItem, {
					label: 'Nom',
					value: 'Dupont',
					action: 'Modifier le nom',
				}),
			]),
		}, {
			attachTo: main,
		})

		try {
			const button = wrapper.find(
				'.sy-data-list-item-action-btn',
			)

			expect(button.exists()).toBe(true)
			expect(button.element.tagName).toBe('BUTTON')
			expect(button.text()).toBe('Modifier le nom')
		}
		finally {
			wrapper.unmount()
			main.remove()
		}
	})

	it('does not render an action button when no action is provided', () => {
		const main = document.createElement('main')
		document.body.appendChild(main)

		const wrapper = mount({
			render: () => h('dl', [
				h(DataListItem, {
					label: 'Nom',
					value: 'Dupont',
				}),
			]),
		}, {
			attachTo: main,
		})

		try {
			expect(
				wrapper.find('.sy-data-list-item-action-btn').exists(),
			).toBe(false)
		}
		finally {
			wrapper.unmount()
			main.remove()
		}
	})
})

describe('DataListItem – custom value slot', () => {
	it('keeps custom value content accessible', async () => {
		const main = document.createElement('main')
		document.body.appendChild(main)

		const wrapper = mount({
			render: () => h('dl', [
				h(
					DataListItem,
					{
						label: 'Nom',
						value: 'Dupont',
					},
					{
						value: () => h(
							'span',
							{ class: 'custom-value' },
							'Paul Dupont',
						),
					},
				),
			]),
		}, {
			attachTo: main,
		})

		try {
			const customValue = wrapper.find('.custom-value')

			expect(customValue.exists()).toBe(true)
			expect(customValue.text()).toBe('Paul Dupont')

			const results = await axe(main)

			assertNoA11yViolations(
				results,
				'DataListItem – custom value slot',
			)
		}
		finally {
			wrapper.unmount()
			main.remove()
		}
	})
})
