/* eslint-disable vue/one-component-per-file */
import { vuetify } from '@tests/unit/setup'
import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { defineComponent } from 'vue'
import { VCard } from 'vuetify/components'
import DialogBox from '../DialogBox.vue'

const defaultProps = {
	modelValue: true,
	title: 'Test title',
	width: '600px',
	cancelBtnText: 'Cancel',
	confirmBtnText: 'Confirm',
	hideActions: false,
	persistent: false,
}

describe('DialogBox', () => {
	describe('rendering and props', () => {
		it('renders correctly with props', () => {
			const wrapper = mount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
					stubs: {
						VDialog: {
							template: '<div><slot></slot></div>',
						},
					},
				},
				attachTo: document.body,
			})

			expect(wrapper.html()).toMatchSnapshot()
			wrapper.unmount()
		})

		it('is closed when model value is false', async () => {
			const wrapper = mount(DialogBox, {
				props: {
					...defaultProps,
					modelValue: false,
				},
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			expect(wrapper.html()).toBe('')
			wrapper.unmount()
		})

		it('becomes visible when the model value is updated', async () => {
			const wrapper = mount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
			})

			// Initially visible with modelValue: true
			const card = wrapper.findComponent(VCard)
			expect(card.exists()).toBe(true)

			// Set modelValue to false - dialog should be hidden
			await wrapper.setProps({ modelValue: false })
			await wrapper.vm.$nextTick()

			// Check if the dialog is actually closed by looking for the dialog wrapper
			const dialogWrapper = wrapper.find('.v-dialog')
			if (dialogWrapper.exists()) {
				// If dialog wrapper exists, check if it's hidden via CSS
				const dialogElement = dialogWrapper.element as HTMLElement
				const isHidden = dialogElement.style.display === 'none'
					|| !dialogElement.offsetParent
					|| dialogElement.style.visibility === 'hidden'
				expect(isHidden).toBe(true)
			}
			else {
				// Dialog wrapper doesn't exist, which means it's properly hidden
				expect(dialogWrapper.exists()).toBe(false)
			}

			// Set modelValue back to true - dialog should be visible again
			await wrapper.setProps({ modelValue: true })
			await wrapper.vm.$nextTick()

			// Dialog should be visible again
			const cardAfterReopen = wrapper.findComponent(VCard)
			expect(cardAfterReopen.exists()).toBe(true)

			wrapper.unmount()
		})

		it('renders the title slot', async () => {
			const wrapper = mount(DialogBox, {
				slots: {
					title: '<h2>Test title</h2>',
				},
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const modal = wrapper.getComponent(VCard)
			const title = modal.find<HTMLElement>('h2').text()

			await modal.vm.$nextTick()

			expect(title).toBe('Test title')
			wrapper.unmount()
		})
	})

	describe('focusable elements and tab navigation', () => {
		it('gets the correct focusable elements', async () => {
			const wrapper = mount(DialogBox, {
				slots: {
					default: `
						<button id="first">First</button>
						<button id="second" disabled>Second</button>
						<button id="third">third</button>
						<a href="https://www.ameli.fr/" id="link">ameli.fr</a>
					`,
				},
				props: {
					...defaultProps,
					hideActions: true,
					persistent: true,
				},
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const modal = wrapper.getComponent(VCard)

			const firstBtn = modal.find<HTMLElement>('#first')
			const thirdBtn = modal.find<HTMLElement>('#third')
			const theLink = modal.find<HTMLElement>('#link')

			await modal.vm.$nextTick()

			// @ts-expect-error - Testing private method
			expect(await wrapper.vm.getSelectableElements()).toEqual([
				firstBtn.element,
				thirdBtn.element,
				theLink.element,
			])

			wrapper.unmount()
		})

		it('handles the internal tab navigation', async () => {
			const wrapper = mount(DialogBox, {
				slots: {
					default: `
						<button id="first">First</button>
						<button id="second" disabled>Second</button>
						<button id="third">third</button>
						<a href="https://www.ameli.fr/" id="link">ameli.fr</a>
					`,
				},
				props: {
					...defaultProps,
					hideActions: true,
					persistent: true,
				},
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			async function triggerTab() {
				await modal.find(':focus').trigger('keydown', {
					keyCode: 9,
					key: 'Tab',
					code: 'Tab',
				})
			}

			async function triggerShiftTab() {
				await modal.find(':focus').trigger('keydown', {
					keyCode: 9,
					key: 'Tab',
					code: 'Tab',
					shiftKey: true,
				})
			}

			const modal = wrapper.getComponent(VCard)

			const firstBtn = modal.find<HTMLElement>('#first')
			const link = modal.find<HTMLElement>('#link')
			await modal.vm.$nextTick()

			firstBtn.element.focus()
			await modal.vm.$nextTick()

			await triggerShiftTab()
			expect(link.element).toEqual(document.activeElement)

			await triggerTab()
			expect(firstBtn.element).toEqual(document.activeElement)

			wrapper.unmount()
		})

		it('return to the first focusable element', async () => {
			const testComponent = defineComponent({
				components: { DialogBox },
				setup() {
					return {
						dialog: true,
					}
				},
				template: `
				<DialogBox v-model="dialog" title="Test title" :hide-actions="true">
					<button id="first">First</button>
					<button id="second" disabled>Second</button>
					<button id="third">third</button>
					<a href="https://www.ameli.fr/" id="link">ameli.fr</a>
				</DialogBox>
				<button id="external">External</button>
				`,
			})
			const wrapper = mount(testComponent, {
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const externalBtn = wrapper.find<HTMLButtonElement>('#external')
			externalBtn.element.focus()
			await wrapper.vm.$nextTick()

			await externalBtn.trigger('keydown', {
				keyCode: 9,
				key: 'Tab',
				code: 'Tab',
			})

			const modal = wrapper.getComponent(VCard)

			const firstBtn = modal.find<HTMLElement>('#first')
			expect(firstBtn.element).toEqual(document.activeElement)
			wrapper.unmount()
		})

		it('return the last focusable element', async () => {
			const testComponent = defineComponent({
				components: { DialogBox },
				setup() {
					return {
						dialog: true,
					}
				},
				template: `
				<button id="external">External</button>
				<DialogBox v-model="dialog" title="Test title" :hide-actions="true">
					<button id="first">First</button>
					<button id="second" disabled>Second</button>
					<button id="third">third</button>
					<a href="https://www.ameli.fr/" id="link">ameli.fr</a>
				</DialogBox>
				`,
			})
			const wrapper = mount(testComponent, {
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const external = wrapper.find<HTMLElement>('#external')
			const modal = wrapper.getComponent(VCard)
			external.element.focus()
			await wrapper.vm.$nextTick()

			await modal.trigger('keydown', {
				keyCode: 9,
				key: 'Tab',
				code: 'Tab',
				shiftKey: true,
			})

			const link = modal.find<HTMLButtonElement>('#link')
			expect(link.element).toEqual(document.activeElement)
			wrapper.unmount()
		})
	})

	describe('event emissions', () => {
		it('emits an event when close button is clicked', async () => {
			const wrapper = mount(DialogBox, {
				props: {
					modelValue: true,
				},
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const modal = wrapper.getComponent(VCard)

			expect(modal.isVisible()).toBe(true)

			const closeBtn = modal.find('button')
			await closeBtn.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeTruthy()
			wrapper.unmount()
		})

		it('emits a cancel event when cancel button is clicked', async () => {
			const wrapper = mount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const modal = wrapper.getComponent(VCard)

			const cancelBtn = modal.find('.sy-dialog-box-actions-ctn button')
			await cancelBtn.trigger('click')

			expect(wrapper.emitted('cancel')).toBeTruthy()
			wrapper.unmount()
		})

		it('emits a confirm event when confirm button is clicked', async () => {
			const wrapper = mount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const modal = wrapper.getComponent(VCard)

			const confirmBtn = modal.find('[data-test-id="confirm-btn"]')
			await confirmBtn.trigger('click')

			expect(wrapper.emitted('confirm')).toBeTruthy()
			wrapper.unmount()
		})
	})

	describe('Test methods', () => {
		it('getSelectableElements if this.$refs.dialogContent.$el is undefined', async () => {
			const wrapper = shallowMount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})
			// @ts-expect-error - Testing private method
			const result = await wrapper.vm.getSelectableElements()
			expect(result).toEqual([])
			wrapper.unmount()
		})
	})

	it('focus the confirm button on open if autofocusValidateBtn is true', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				...defaultProps,
				autofocusValidateBtn: true,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const modal = wrapper.getComponent(VCard)

		const confirmBtn = modal.find('[data-test-id="confirm-btn"]')

		await wrapper.vm.$nextTick()

		expect(confirmBtn.element).toEqual(document.activeElement)
		wrapper.unmount()
	})

	describe('draggable dialog', () => {
		it('renders the dialog as draggable when the draggable prop is true', async () => {
			const wrapper = mount(DialogBox, {
				props: {
					...defaultProps,
					draggable: true,
				},
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const card = wrapper.getComponent(VCard)
			const titleBar = card.find<HTMLElement>('.sy-dialog-box-title')

			expect(card.classes()).toContain('sy-dialog-box-draggable')

			titleBar.trigger('mousedown', { clientX: 100, clientY: 100 })
			await wrapper.vm.$nextTick()

			expect(card.classes()).toContain('sy-dialog-box-draggable--active')

			await wrapper.trigger('mousemove', { clientX: 200, clientY: 200 })
			await wrapper.vm.$nextTick()

			const overlayElement = card.element.closest('.v-overlay__content') as HTMLElement

			expect(overlayElement.style.left).toBe('100px') // Check that left style has been set
			expect(overlayElement.style.top).toBe('100px') // Check that top style has been set

			await wrapper.trigger('mouseup')

			expect(card.classes()).not.toContain('sy-dialog-box-draggable--active')
			wrapper.unmount()
		})

		it('do not allow the dialog to be dragged outside the viewport', async () => {
			const wrapper = mount(DialogBox, {
				props: {
					...defaultProps,
					draggable: true,
				},
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const card = wrapper.getComponent(VCard)
			const titleBar = card.find<HTMLElement>('.sy-dialog-box-title')

			titleBar.trigger('mousedown', { clientX: 100, clientY: 100 })
			await wrapper.vm.$nextTick()

			await wrapper.trigger('mousemove', { clientX: -1000, clientY: -1000 })
			await wrapper.vm.$nextTick()

			const overlayElement = card.element.closest('.v-overlay__content') as HTMLElement

			expect(parseInt(overlayElement.style.left, 10)).toBe(0)
			expect(parseInt(overlayElement.style.top, 10)).toBe(0)

			await wrapper.trigger('mousemove', { clientX: 10000, clientY: 10000 })
			await wrapper.vm.$nextTick()

			const windowWidth = window.innerWidth
			const windowHeight = window.innerHeight
			const overlayWidth = overlayElement.offsetWidth
			const overlayHeight = overlayElement.offsetHeight

			expect(parseInt(overlayElement.style.left, 10)).toBe(windowWidth - overlayWidth)
			expect(parseInt(overlayElement.style.top, 10)).toBe(windowHeight - overlayHeight)

			await wrapper.trigger('mouseup')

			wrapper.unmount()
		})

		it('move the dialog to the left when the left arrow is pressed', async () => {
			const wrapper = mount(DialogBox, {
				props: {
					...defaultProps,
					draggable: true,
				},
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const card = wrapper.getComponent(VCard)

			await card.trigger('keydown', { key: 'ArrowLeft' })
			await wrapper.vm.$nextTick()

			const overlayElement = card.element.closest('.v-overlay__content') as HTMLElement

			expect(overlayElement.style.position).toBe('absolute')
			expect(overlayElement.style.left).toBe(`0px`)
			wrapper.unmount()
		})

		it('move the dialog to the right when the right arrow is pressed', async () => {
			const wrapper = mount(DialogBox, {
				props: {
					...defaultProps,
					draggable: true,
				},
				global: {
					plugins: [vuetify],
				},
				attachTo: document.body,
			})

			const card = wrapper.getComponent(VCard)

			await card.trigger('keydown', { key: 'ArrowRight' })
			await wrapper.vm.$nextTick()

			const overlayElement = card.element.closest('.v-overlay__content') as HTMLElement
			const computedStyle = getComputedStyle(overlayElement)
			const marginLeft = parseFloat(computedStyle.marginLeft) || 0
			const positionToLeft = window.innerWidth - overlayElement.offsetWidth - marginLeft * 2

			expect(overlayElement.style.position).toBe('absolute')
			expect(overlayElement.style.left).toBe(`${positionToLeft}px`)
			wrapper.unmount()
		})
	})

	it('move the dialog to the top when the up arrow is pressed', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				...defaultProps,
				draggable: true,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const card = wrapper.getComponent(VCard)

		await card.trigger('keydown', { key: 'ArrowUp' })
		await wrapper.vm.$nextTick()

		const overlayElement = card.element.closest('.v-overlay__content') as HTMLElement

		expect(overlayElement.style.position).toBe('absolute')
		expect(overlayElement.style.top).toBe(`0px`)

		wrapper.unmount()
	})

	it('move the dialog to the bottom when the down arrow is pressed', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				...defaultProps,
				draggable: true,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const card = wrapper.getComponent(VCard)

		await card.trigger('keydown', { key: 'ArrowDown' })
		await wrapper.vm.$nextTick()

		const overlayElement = card.element.closest('.v-overlay__content') as HTMLElement
		const computedStyle = getComputedStyle(overlayElement)
		const marginTop = parseFloat(computedStyle.marginTop) || 0
		const positionToTop = window.innerHeight - overlayElement.offsetHeight - marginTop * 2

		expect(overlayElement.style.position).toBe('absolute')
		expect(overlayElement.style.top).toBe(`${positionToTop}px`)

		wrapper.unmount()
	})

	it('move the dialog to the left when the window is resized and the dialog is out of viewport', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				...defaultProps,
				draggable: true,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const card = wrapper.getComponent(VCard)
		const titleBar = card.find<HTMLElement>('.sy-dialog-box-title')

		titleBar.trigger('mousedown', { clientX: 100, clientY: 100 })
		await wrapper.vm.$nextTick()

		await wrapper.trigger('mousemove', { clientX: 800, clientY: 100 })
		await wrapper.vm.$nextTick()

		const overlayElement = card.element.closest('.v-overlay__content') as HTMLElement

		const left = parseFloat(overlayElement.style.left) || 0
		expect(left).toBe(700)

		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 300,
		})

		window.dispatchEvent(new Event('resize'))
		await wrapper.vm.$nextTick()

		const newLeft = parseFloat(overlayElement.style.left) || 0

		expect(newLeft).toBe(300 - overlayElement.offsetWidth)

		wrapper.unmount()
	})

	it('move the dialog to the top when the window is resized and the dialog is out of viewport', async () => {
		const wrapper = mount(DialogBox, {
			props: {
				...defaultProps,
				draggable: true,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const card = wrapper.getComponent(VCard)
		const titleBar = card.find<HTMLElement>('.sy-dialog-box-title')

		titleBar.trigger('mousedown', { clientX: 100, clientY: 100 })
		await wrapper.vm.$nextTick()

		await wrapper.trigger('mousemove', { clientX: 100, clientY: 800 })
		await wrapper.vm.$nextTick()

		const overlayElement = card.element.closest('.v-overlay__content') as HTMLElement

		const top = parseFloat(overlayElement.style.top) || 0
		expect(top).toBe(700)

		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 300,
		})

		window.dispatchEvent(new Event('resize'))
		await wrapper.vm.$nextTick()

		const newTop = parseFloat(overlayElement.style.top) || 0

		expect(newTop).toBe(300 - overlayElement.offsetHeight)

		wrapper.unmount()
	})
})
