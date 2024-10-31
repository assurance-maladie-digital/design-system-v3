import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import useHeaderResponsiveMode from '../useHeaderResponsiveMode'

describe('useHeaderResponsiveMode', () => {
	it('should return the correct responsive mode', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)
		const wrapper = mount({
			template: `<div :class="{'is-desktop': isDesktop}"></div>`,
			setup() {
				const { isDesktop } = useHeaderResponsiveMode()
				return { isDesktop }
			},
		})

		expect(wrapper.find('.is-desktop').exists()).toBe(false)

		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(1200)
		await wrapper.vm.$nextTick()
		expect(wrapper.find('.is-desktop').exists()).toBe(true)

		wrapper.unmount()
	})
})
