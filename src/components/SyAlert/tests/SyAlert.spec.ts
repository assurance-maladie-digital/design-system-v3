import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyAlert from '../SyAlert.vue'
import { VBtn } from 'vuetify/components'

describe('Alert', () => {
	it('render correctly', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				title: 'title',
				message: 'message',
				type: 'success',
			},
			slots: {
				default: 'slot content',
			},
		})

		expect(wrapper.classes()).toContain('sy-alert')
	})

	it.each(['comfortable', 'compact'] as const)('forwards the %s density', (density) => {
		const wrapper = mount(SyAlert, {
			props: { density },
			slots: { default: 'slot content' },
		})

		expect(wrapper.get('.v-alert').classes()).toContain(`v-alert--density-${density}`)
	})

	it('show and hide correctly when modelValue is updated', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				title: 'title',
				message: 'message',
				type: 'success',
			},
			slots: {
				default: 'slot content',
			},
		})

		expect(wrapper.text()).toContain('title')
		expect(wrapper.text()).toContain('slot content')

		await wrapper.setProps({
			modelValue: false,
		})

		await wrapper.setProps({
			modelValue: true,
		})

		expect(wrapper.text()).toContain('title')
		expect(wrapper.text()).toContain('slot content')
	})

	it('hide when the close btn is clicked', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				title: 'title',
				message: 'message',
				type: 'warning',
				variant: 'outlined',
				closable: true,
			},
			slots: {
				default: 'slot content',
			},
		})

		expect(wrapper.html()).not.toBeFalsy()

		const closeBtn = wrapper.findComponent(VBtn)

		await closeBtn.element.click()

		expect(wrapper.emitted('update:modelValue')![0]![0]).toBe(false)
	})

	it('prependIcon computed property', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				title: 'title',
				message: 'message',
				type: 'warning',
				variant: 'outlined',
				closable: true,
			},
			slots: {
				default: 'slot content',
			},
		})

		expect(wrapper.vm.prependIcon).toBe('M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16')
	})

	it('uses alert role by default', () => {
		const wrapper = mount(SyAlert, {
			slots: {
				default: 'slot content',
			},
		})

		expect(wrapper.attributes('role')).toBe('alert')
		expect(wrapper.attributes('aria-live')).toBeUndefined()
	})

	it('applies role and ariaLive props on the alert wrapper', () => {
		const wrapper = mount(SyAlert, {
			props: {
				role: 'status',
				ariaLive: 'polite',
			},
			slots: {
				default: 'slot content',
			},
		})

		expect(wrapper.attributes('role')).toBe('status')
		expect(wrapper.attributes('aria-live')).toBe('polite')
	})

	it('allows assertive live region props on the alert wrapper', () => {
		const wrapper = mount(SyAlert, {
			props: {
				role: 'alert',
				ariaLive: 'assertive',
			},
			slots: {
				default: 'slot content',
			},
		})

		expect(wrapper.attributes('role')).toBe('alert')
		expect(wrapper.attributes('aria-live')).toBe('assertive')
	})
})

// Le bouton fermer (closable) porte un ring scopé (primary, y compris en thème dark car
// le fond de l'alerte reste clair). jsdom ne calcule pas :focus-visible : on vérifie le
// prérequis — un <button> natif focusable.
describe('SyAlert - focus (close button)', () => {
	it('renders the close button as a native <button> when closable', () => {
		const wrapper = mount(SyAlert, { props: { closable: true }, slots: { default: 'Message' } })
		expect(wrapper.get('.alert-close-btn').element.tagName).toBe('BUTTON')
		wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(SyAlert, {
			props: { closable: true },
			slots: { default: 'Message' },
			attachTo: document.body,
		})
		const btn = wrapper.get('.alert-close-btn').element as HTMLButtonElement
		btn.focus()
		expect(document.activeElement).toBe(btn)
		wrapper.unmount()
	})
})
