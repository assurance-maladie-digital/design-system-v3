// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolbarContainer from '../ToolbarContainer.vue'

export const toolbarContainerRgaaCriteria = ['1.2', '3.3', '7.1', '7.3', '10.7'] as const

describe('ToolbarContainer – executable RGAA contracts', () => {
	it('7.1 and 7.3 – exposes a toolbar with keyboard-managed controls', async () => {
		const wrapper = mount(ToolbarContainer, { slots: { default: '<button>Premier</button><button>Second</button>' } })
		const toolbar = wrapper.get('[role="toolbar"]')
		expect(toolbar.attributes('tabindex')).toBe('0')
		await wrapper.vm.$nextTick()
		expect(wrapper.findAll('button')).toHaveLength(2)
	})
})
