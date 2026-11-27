// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { mdiAccount } from '@mdi/js'
import DataListItem from '../DataListItem.vue'

export const dataListItemRgaaCriteria = ['1.2', '7.1', '7.3', '8.2', '9.3', '10.7', '10.11'] as const

const mountInDescriptionList = (props: Record<string, unknown>) => mount({
	render: () => h('dl', [h(DataListItem, props)]),
})

describe('DataListItem – executable RGAA contracts', () => {
	it('8.2 and 9.3 – uses a description-list term/value pair', () => {
		const wrapper = mountInDescriptionList({ label: 'Nom', value: 'Dupont' })
		expect(wrapper.get('dt').text()).toContain('Nom')
		expect(wrapper.get('dd').text()).toContain('Dupont')
	})

	it('1.2 – keeps an optional decorative icon hidden from assistive technologies', () => {
		const wrapper = mountInDescriptionList({ label: 'Nom', value: 'Dupont', icon: mdiAccount })
		expect(wrapper.get('.sy-data-list-item-label .v-icon').attributes('aria-hidden')).toBe('true')
	})

	it('7.1, 7.3 and 10.7 – renders the optional action as a native focusable button', () => {
		const wrapper = mountInDescriptionList({ label: 'Nom', value: 'Dupont', action: 'Modifier le nom' })
		const button = wrapper.get('.sy-data-list-item-action-btn')
		expect(button.element.tagName).toBe('BUTTON')
		expect(button.text()).toBe('Modifier le nom')
		expect(button.attributes('tabindex')).not.toBe('-1')
	})
})
