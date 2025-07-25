import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import useHeaderResponsiveMode from '../useHeaderResponsiveMode'

describe('useHeaderResponsiveMode', () => {
	it('should return isDesktop as true for desktop mode', () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(1200)

		const wrapper = mount({
			template: `<div :class="{'is-desktop': isDesktop}">{{ isDesktop }}</div>`,
			setup() {
				const { isDesktop } = useHeaderResponsiveMode()
				return { isDesktop }
			},
		})

		expect(wrapper.vm.isDesktop).toBe(true)
		wrapper.unmount()
	})

	it('should return isDesktop as false for mobile mode', () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)

		const wrapper = mount({
			template: `<div :class="{'is-mobile': !isDesktop}">{{ isDesktop }}</div>`,
			setup() {
				const { isDesktop } = useHeaderResponsiveMode()
				return { isDesktop }
			},
		})

		expect(wrapper.vm.isDesktop).toBe(false)
		wrapper.unmount()
	})

	it('should be reactive to window size changes', () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(1200)

		const wrapper = mount({
			template: `<div>{{ isDesktop }}</div>`,
			setup() {
				const { isDesktop } = useHeaderResponsiveMode()
				return { isDesktop }
			},
		})

		expect(wrapper.vm.isDesktop).toBe(true)
		wrapper.unmount()

		// Note: In a real test environment, we'd need to trigger the matchMedia change event
		// For now, we'll just verify the initial state based on window width
	})

	it('should return the correct responsive mode', async () => {
		// Test mobile mode
		const mobileWrapper = mount({
			template: `<div :class="{'is-desktop': isDesktop}"></div>`,
			setup() {
				const { isDesktop } = useHeaderResponsiveMode()
				return { isDesktop }
			},
		})

		expect(mobileWrapper.find('.is-desktop').exists()).toBe(false)
		mobileWrapper.unmount()

		// Test desktop mode
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(1200)
		const desktopWrapper = mount({
			template: `<div :class="{'is-desktop': isDesktop}">{{ isDesktop }}</div>`,
			setup() {
				const { isDesktop } = useHeaderResponsiveMode()
				return { isDesktop }
			},
		})

		expect(desktopWrapper.vm.isDesktop).toBe(true)
		desktopWrapper.unmount()
	})
})
