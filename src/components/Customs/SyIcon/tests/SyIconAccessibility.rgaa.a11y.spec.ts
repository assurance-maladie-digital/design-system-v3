// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyIconAccessibility from '../SyIconAccessibility.vue'

export const syIconAccessibilityRgaaCriteria = ['1.2', '1.3', '8.2', '11.1'] as const

describe('SyIconAccessibility – executable RGAA contracts', () => {
	it('1.2, 1.3 and 8.2 – documents the decorative/informative icon distinction', () => {
		const passthrough = { template: '<div><slot /></div>' }
		const wrapper = mount(SyIconAccessibility, {
			global: {
				stubs: {
					VContainer: passthrough,
					VCard: passthrough,
					VCardTitle: passthrough,
					VCardText: passthrough,
					VAlert: passthrough,
					VList: passthrough,
					VListItem: passthrough,
					VListItemTitle: passthrough,
					VListItemSubtitle: passthrough,
					VDivider: passthrough,
					VRow: passthrough,
					VCol: passthrough,
					VChip: passthrough,
					VTextField: passthrough,
					SyIcon: passthrough,
					SySelect: passthrough,
					SyRadioGroup: passthrough,
				},
			},
		})
		expect(wrapper.text()).toContain('Icônes décoratives')
		expect(wrapper.text()).toContain('Icônes informatives')
		expect(wrapper.text()).toContain('aria-label')
	})
})
