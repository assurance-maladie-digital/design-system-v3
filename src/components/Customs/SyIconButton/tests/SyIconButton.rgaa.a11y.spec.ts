// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyIconButton from '../SyIconButton.vue'

export const syIconButtonRgaaCriteria = ['7.1', '8.9', '10.7', '11.9'] as const

describe('SyIconButton – executable RGAA contracts', () => {
	it('7.1, 8.9 and 11.9 – exposes a labelled native button with a decorative icon', () => {
		const wrapper = mount(SyIconButton, {
			props: { icon: 'mdi-close', label: 'Fermer' },
			global: {
				stubs: {
					'v-btn': { template: '<button :aria-label="ariaLabel" :disabled="disabled"><slot /></button>', props: ['ariaLabel', 'disabled'] },
					'SyIcon': { template: '<span aria-hidden="true" />' },
				},
			},
		})
		expect(wrapper.get('button').attributes('aria-label')).toBe('Fermer')
		expect(wrapper.get('button span[aria-hidden="true"]').exists()).toBe(true)
	})
})
