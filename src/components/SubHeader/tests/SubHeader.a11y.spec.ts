// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SubHeader from '../SubHeader.vue'
import * as stories from '../SubHeader.stories'

const { Default, DataList, DataListFixedHeight, ActionBtn, HtmlValue, SlotSubTitle, SlotAdditionalInformations } = composeStories(stories)

describe('SubHeader – accessibility (axe)', () => {
	it.each([
		{ name: 'Default', story: Default },
		{ name: 'DataList', story: DataList },
		{ name: 'DataListFixedHeight', story: DataListFixedHeight },
		{ name: 'ActionBtn', story: ActionBtn },
		{ name: 'HtmlValue', story: HtmlValue },
		{ name: 'SlotSubTitle', story: SlotSubTitle },
		{ name: 'SlotAdditionalInformations', story: SlotAdditionalInformations },
	])('has no axe violations in the $name story', async ({ name, story }) => {
		const target = document.createElement('main')
		document.body.appendChild(target)
		const wrapper = mount(story(), { attachTo: target })
		try {
			assertNoA11yViolations(await axe(target), `SubHeader – ${name}`)
			expect(wrapper.find('p[aria-label]').exists()).toBe(false)
		}
		finally {
			wrapper.unmount()
			target.remove()
		}
	})

	it('provides the full subtitle for screen readers without repeating the number', () => {
		const wrapper = mount(SubHeader, {
			props: { subTitleText: '123', subTitleAccessibleName: 'Numéro de sécurité sociale : 123' },
		})
		try {
			const subtitle = wrapper.get('p')
			expect(subtitle.get('.d-sr-only').text()).toBe('Numéro de sécurité sociale : 123')
			expect(subtitle.get('[aria-hidden="true"]').text()).toBe('123')
		}
		finally {
			wrapper.unmount()
		}
	})

	it('has no axe violations in the default state', async () => {
		const wrapper = mount(SubHeader, {
			slots: {
				default: '<h1>Mon titre principal</h1>',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SubHeader – default state')
	})
})
