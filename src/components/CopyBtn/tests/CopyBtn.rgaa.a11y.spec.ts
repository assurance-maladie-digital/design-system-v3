// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CopyBtn from '../CopyBtn.vue'

export const copyBtnRgaaCriteria = ['3.3', '7.1', '7.5', '8.2', '13.8'] as const

describe('CopyBtn – executable RGAA contracts', () => {
	it('7.1 and 7.5 – exposes a named native button', () => {
		const wrapper = mount(CopyBtn, { props: { ariaLabel: 'Copier le numéro', hideTooltip: true } })
		const button = wrapper.get('button')
		expect(button.attributes('aria-label')).toBe('Copier le numéro')
		expect(button.attributes('type')).toBe('button')
	})

	it('1.2 – exposes the copy icon as decorative', () => {
		const wrapper = mount(CopyBtn, { props: { hideTooltip: true } })
		expect(wrapper.get('button [aria-hidden="true"]').exists()).toBe(true)
	})

	it('8.2 – generates a unique owner id for multiple instances', () => {
		const host = mount({ components: { CopyBtn }, template: '<div><CopyBtn hide-tooltip /><CopyBtn hide-tooltip /></div>' })
		const ids = host.findAll('.sy-copy-btn').map(element => element.attributes('id'))
		expect(new Set(ids).size).toBe(2)
	})
})
