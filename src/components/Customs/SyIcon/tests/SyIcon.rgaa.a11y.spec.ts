// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyIcon from '../SyIcon.vue'

export const syIconRgaaCriteria = ['1.2', '1.3', '10.1'] as const

const iconStub = {
	template: '<span class="v-icon" :role="role" :aria-label="ariaLabel" :aria-hidden="ariaHidden"><slot /></span>',
	props: ['role', 'ariaLabel', 'ariaHidden'],
}

const global = { stubs: { 'v-icon': iconStub }, directives: { 'rgaa-svg-fix': () => {} } }

describe('SyIcon – executable RGAA contracts', () => {
	it('1.2 – hides decorative icons from assistive technologies', () => {
		const wrapper = mount(SyIcon, { props: { icon: 'mdi-home', decorative: true }, global })
		expect(wrapper.get('.v-icon').attributes('aria-hidden')).toBe('true')
	})

	it('1.3 – exposes an informative icon with an explicit label', () => {
		const wrapper = mount(SyIcon, { props: { icon: 'mdi-alert', decorative: false, role: 'img', label: 'Alerte' }, global })
		expect(wrapper.get('.v-icon').attributes('role')).toBe('img')
		expect(wrapper.get('.v-icon').attributes('aria-label')).toBe('Alerte')
	})
})
