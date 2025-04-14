/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import { VCard } from 'vuetify/components'
import { defineComponent } from 'vue'
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
			})

			expect(wrapper.html()).toMatchSnapshot()
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
			})

			expect(wrapper.html()).toBe('')
		})

		it('becomes visible when the model value is updated', async () => {
			const wrapper = mount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
			})

			const card = wrapper.getComponent(VCard)
			expect(card.isVisible()).toBe(true)

			await wrapper.setProps({ modelValue: false })
			expect(card.isVisible()).toBe(false)

			await wrapper.setProps({ modelValue: true })
			expect(card.isVisible()).toBe(true)
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
			})

			const modal = wrapper.getComponent(VCard)
			const title = modal.find<HTMLElement>('h2').text()

			await modal.vm.$nextTick()

			expect(title).toBe('Test title')
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
			})

			const modal = wrapper.getComponent(VCard)

			expect(modal.isVisible()).toBe(true)

			const closeBtn = modal.find('button')
			await closeBtn.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		})

		it('emits a cancel event when cancel button is clicked', async () => {
			const wrapper = mount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
			})

			const modal = wrapper.getComponent(VCard)

			const cancelBtn = modal.find('.sy-dialog-box-actions-ctn button')
			await cancelBtn.trigger('click')

			expect(wrapper.emitted('cancel')).toBeTruthy()
		})

		it('emits a confirm event when confirm button is clicked', async () => {
			const wrapper = mount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
			})

			const modal = wrapper.getComponent(VCard)

			const confirmBtn = modal.find('[data-test-id="confirm-btn"]')
			await confirmBtn.trigger('click')

			expect(wrapper.emitted('confirm')).toBeTruthy()
		})
	})

	describe('Test methods', () => {
		it('getSelectableElements if this.$refs.dialogContent.$el is undefined', async () => {
			const wrapper = shallowMount(DialogBox, {
				props: defaultProps,
				global: {
					plugins: [vuetify],
				},
			})
			// @ts-expect-error - Testing private method
			const result = await wrapper.vm.getSelectableElements()
			expect(result).toEqual([])
		})
	})
})
