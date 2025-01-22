import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vAnimateClick } from '../vAnimateClick'

describe('vAnimateClick', () => {
	const TestComponent = defineComponent({
		directives: {
			animateClick: vAnimateClick,
		},
		template: `<div v-animate-click></div>`,
	})

	it('should add the animate-click class on mousedown', async () => {
		const wrapper = mount(TestComponent)

		const el = wrapper.find('div')

		await el.trigger('mousedown')
		expect(el.classes()).toContain('animate-click')
	})

	it('should remove the animate-click class on mouseup', async () => {
		const wrapper = mount(TestComponent)

		const el = wrapper.find('div')

		await el.trigger('mousedown')
		await el.trigger('mouseup')
		expect(el.classes()).not.toContain('animate-click')
	})
})
