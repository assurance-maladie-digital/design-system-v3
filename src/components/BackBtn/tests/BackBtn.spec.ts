import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import BackBtn from '../BackBtn.vue'
import { VIcon, VBtn } from 'vuetify/components'

describe('BackBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(BackBtn, {
			component: {
				VIcon,
				VBtn,
			},
		})

		expect(wrapper.exists()).toBe(true)
	})

	it('hides back icon when hideBackIcon is true', () => {
		const wrapper = mount(BackBtn, {
			component: {
				VIcon,
				VBtn,
			},
			props: { hideBackIcon: true },
		})
		expect(wrapper.find('VIcon').exists()).toBe(false)
	})

	it('applies the correct button classes based on props', () => {
		const wrapper = mount(BackBtn, {
			props: {
				dark: false,
				hideBackIcon: false,
			},
		})

		const classes = wrapper.get('.sy-back-btn').classes()

		expect(classes).toContain('sy-back-btn')
		expect(classes).toContain('text-none')
		expect(classes).not.toContain('sy-back-btn--dark')
	})

	it('applies correct button classes when dark is true and hideBackIcon is false', () => {
		const wrapper = mount(BackBtn, {
			component: {
				VIcon,
				VBtn,
			},
			props: { dark: true, hideBackIcon: false },
		})
		expect(wrapper.find('.sy-back-btn').classes()).not.toContain('pr-1')
	})
	it('returns false when dark prop is not provided', () => {
		const wrapper = mount(BackBtn, {
			component: {
				VIcon,
				VBtn,
			},
		})
		expect(wrapper.vm.dark).toBe(false)
	})

	it('returns true when dark prop is true', () => {
		const wrapper = mount(BackBtn, {
			component: {
				VIcon,
				VBtn,
			},
			props: { dark: true },
		})
		expect(wrapper.vm.dark).toBe(true)
	})

	it('returns false when dark prop is false', () => {
		const wrapper = mount(BackBtn, {
			component: {
				VIcon,
				VBtn,
			},
			props: { dark: false },
		})
		expect(wrapper.vm.dark).toBe(false)
	})

	// Le ring de focus est géré globalement (_btns.scss) : ces tests vérifient les
	// prérequis structurels de ce ring (jsdom ne calcule pas le style :focus-visible).
	describe('focus', () => {
		it('renders a native <button> so the global focus ring applies', () => {
			const wrapper = mount(BackBtn, {
				component: { VIcon, VBtn },
			})

			expect(wrapper.get('.sy-back-btn').element.tagName).toBe('BUTTON')
		})

		it('carries the sy-back-btn--dark class in dark mode (onPrimary focus ring)', () => {
			const wrapper = mount(BackBtn, {
				component: { VIcon, VBtn },
				props: { dark: true },
			})

			expect(wrapper.get('.sy-back-btn').classes()).toContain('sy-back-btn--dark')
		})

		it('is focusable', () => {
			const wrapper = mount(BackBtn, {
				component: { VIcon, VBtn },
				attachTo: document.body,
			})

			const button = wrapper.get('.sy-back-btn').element as HTMLButtonElement
			button.focus()

			expect(document.activeElement).toBe(button)

			wrapper.unmount()
		})
	})
})
