// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IconSlot from '../IconSlot.vue'

const props = { iconColor: 'primary', icons: { info: 'info-icon', save: 'save-icon' }, noIcon: false, disableClickButton: false, tooltipLocation: 'top' as const }
export const iconSlotRgaaCriteria = ['1.2', '7.1', '8.2', '10.7'] as const
describe('IconSlot – executable RGAA contracts', () => {
	it('7.1 and 8.2 – names and focuses an actionable icon', () => {
		const wrapper = mount(IconSlot, { props: { ...props, icon: 'save', label: 'Enregistrer' }, global: { stubs: { SyIcon: { template: '<span role="button" :tabindex="tabindex" :aria-label="label"></span>', props: ['label', 'tabindex'] } } } })
		const icon = wrapper.get('[role="button"]')
		expect(icon.attributes('tabindex')).toBe('0')
		expect(icon.attributes('aria-label')).toContain('Enregistrer')
	})

	it('1.2 – marks a non-actionable icon as presentation', () => {
		const wrapper = mount(IconSlot, { props: { ...props, icon: 'save', disableClickButton: true }, global: { stubs: { SyIcon: { template: '<span role="presentation"></span>' } } } })
		expect(wrapper.get('[role="presentation"]').exists()).toBe(true)
	})
})
