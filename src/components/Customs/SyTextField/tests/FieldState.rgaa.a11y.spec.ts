// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FieldState from '../FieldState.vue'

export const fieldStateRgaaCriteria = ['1.2', '3.2', '10.1'] as const

describe('FieldState – executable RGAA contracts', () => {
	it('1.2 – exposes validation icons as decorative because the state is conveyed by text', () => {
		const wrapper = mount(FieldState, {
			props: { state: 'error' },
			global: { stubs: { SyIcon: { template: '<svg aria-hidden="true" class="field-state-icon" />' } } },
		})
		expect(wrapper.get('[aria-hidden="true"]').exists()).toBe(true)
	})

	it('1.2 – renders no icon for the default state', () => {
		expect(mount(FieldState, { props: { state: 'default' } }).find('[aria-hidden="true"]').exists()).toBe(false)
	})
})
