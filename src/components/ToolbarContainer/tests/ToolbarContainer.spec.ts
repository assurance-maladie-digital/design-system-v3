import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Toolbar from '../ToolbarContainer.vue'
import { VBtn } from 'vuetify/components'
import { vuetify } from '@tests/unit/setup'
import { defineComponent } from 'vue'

describe('ToolbarContainer.vue', () => {
	it('renders default slot content', () => {
		const wrapper = mount(Toolbar, {
			global: {
				plugins: [vuetify],
			},
			slots: {
				default: '<div class="toolbar-content">Toolbar Content</div>',
			},
		})

		expect(wrapper.find('.toolbar-content').exists()).toBe(true)
	})

	it('applies custom classes', () => {
		const wrapper = mount(Toolbar, {
			global: {
				plugins: [vuetify],
			},
			props: {
				class: 'custom-toolbar',
			},
		})

		expect(wrapper.classes()).toContain('custom-toolbar')
	})

	it('set the focus to the first button', async () => {
		const wrapper = mount(Toolbar, {
			attachTo: document.body,
			global: {
				plugins: [vuetify],
			},
			slots: {
				default: `
				<div>
					<VBtn>Action 1</VBtn>
					<VBtn>Action 2</VBtn>
				</div>
				`,
			},
		})

		const toolbar = wrapper.find('.sy-toolbar')
		const firstButton = wrapper.find('button.v-btn')

		await toolbar.trigger('focus')
		expect(document.activeElement).toBe(firstButton.element)
	})

	it('focuses the button when the navigation key are pressed', async () => {
		const wrapper = mount(Toolbar, {
			attachTo: document.body,
			global: {
				plugins: [vuetify],
			},
			slots: {
				default: `
					<div>
						<VBtn>Action 1</VBtn>
						<VBtn>Action 2</VBtn>
					</div>
				`,
			},
		})

		const toolbar = wrapper.find('.sy-toolbar')
		const firstButton = wrapper.find('button.v-btn')
		const secondButton = wrapper.findAll('button.v-btn')[1]

		await toolbar.trigger('focus')
		await firstButton.trigger('keydown', { key: 'ArrowRight' })
		expect(document.activeElement).toBe(secondButton.element)
		await secondButton.trigger('keydown', { key: 'ArrowLeft' })
		expect(document.activeElement).toBe(firstButton.element)
		await firstButton.trigger('keydown', { key: 'ArrowDown' })
		expect(document.activeElement).toBe(secondButton.element)
		await secondButton.trigger('keydown', { key: 'ArrowUp' })
		expect(document.activeElement).toBe(firstButton.element)
	})

	it('focuses the first and last buttons when Home and End keys are pressed', async () => {
		const wrapper = mount(Toolbar, {
			attachTo: document.body,
			global: {
				plugins: [vuetify],
			},
			slots: {
				default: `
					<div>
						<VBtn>Action 1</VBtn>
						<VBtn>Action 2</VBtn>
						<VBtn>Action 3</VBtn>
						<VBtn>Action 4</VBtn>
					</div>
				`,
			},
		})

		const toolbar = wrapper.find('.sy-toolbar')
		const firstButton = wrapper.find('button.v-btn')
		const lastButton = wrapper.findAll('button.v-btn')[3]

		await toolbar.trigger('focus')
		await firstButton.trigger('keydown', { key: 'End' })
		expect(document.activeElement).toBe(lastButton.element)
		await lastButton.trigger('keydown', { key: 'Home' })
		expect(document.activeElement).toBe(firstButton.element)
	})

	it('keeps in memory the last focused button', async () => {
		const TestComponent = defineComponent({
			components: {
				Toolbar,
				VBtn,
			},
			template: `
				<div>
					<Toolbar>
						<VBtn>Action 1</VBtn>
						<VBtn>Action 2</VBtn>
						<VBtn>Action 3</VBtn>
					</Toolbar>
					<VBtn>Action 4</VBtn>
				</div>
			`,
		})
		const wrapper = mount(TestComponent, {
			attachTo: document.body,
			global: {
				plugins: [vuetify],
			},
		})

		const toolbar = wrapper.find('.sy-toolbar')
		const firstButton = wrapper.find('button.v-btn')
		const secondButton = wrapper.findAll('button.v-btn')[1]
		const lastButton = wrapper.findAll<HTMLElement>('button.v-btn')[3]

		await toolbar.trigger('focus')
		expect(document.activeElement).toBe(firstButton.element)
		await firstButton.trigger('keydown', { key: 'ArrowRight' })
		expect(document.activeElement).toBe(secondButton.element)
		await lastButton.element.focus()
		expect(document.activeElement).toBe(lastButton.element)
		await toolbar.trigger('focus')
		expect(document.activeElement).toBe(secondButton.element)
	})
})
