import { describe, expect, it, vi, afterEach } from 'vitest'
import useMouseSlide from '../useMouseSlide'

import { defineComponent, onMounted, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'

describe('useMouseSlide', () => {
	let callbackFn = vi.fn()
	const TestComponent = defineComponent({
		setup() {
			const track = ref<HTMLElement | null>(null)
			const thumb = ref<HTMLElement | null>(null)

			onMounted(() => {
				const mockRect = vi.spyOn((track.value as HTMLElement), 'getBoundingClientRect')
				mockRect.mockReturnValue({
					left: 0,
					width: 200,
				} as DOMRect)
			})

			const {
				inProgress,
			} = useMouseSlide(
				thumb as Ref<HTMLElement>,
				track as Ref<HTMLElement>,
				ref(50),
				0,
				100,
				1,
				0,
				100,
				callbackFn,
			)
			return { track, thumb, inProgress }
		},
		template: `
		<div ref="track">
			<div ref="thumb" class="thumb"></div>
		</div>`,
	})

	afterEach(() => {
		callbackFn = vi.fn()
	})

	it('calls the callback function when the mouse is down', async () => {
		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		const thumb = wrapper.find('div.thumb')

		await thumb.trigger('mousedown')
		await thumb.trigger('mousemove', {
			clientX: 100,
		})
		await thumb.trigger('mousemove', {
			clientX: 150,
		})
		await thumb.trigger('mouseup')

		expect(callbackFn).toHaveBeenCalledWith(75) // 50 + 25

		wrapper.unmount()
	})

	it('handle touch events', async () => {
		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		const thumb = wrapper.find('div.thumb')

		await thumb.trigger('touchstart')
		await thumb.trigger('touchmove', {
			touches: [{ clientX: 100 }],
		})
		await thumb.trigger('touchmove', {
			touches: [{ clientX: 150 }],
		})
		await thumb.trigger('touchend')

		expect(callbackFn).toHaveBeenCalledWith(75) // 50 + 25

		wrapper.unmount()
	})

	it('handle going backward', async () => {
		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		const thumb = wrapper.find('div.thumb')

		await thumb.trigger('mousedown')
		await thumb.trigger('mousemove', {
			clientX: 100,
		})
		await thumb.trigger('mousemove', {
			clientX: 50,
		})
		await thumb.trigger('mouseup')

		expect(callbackFn).toHaveBeenCalledWith(25) // 50 - 25

		wrapper.unmount()
	})

	it('do not call the callback function when the mouse have not moved', async () => {
		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		const thumb = wrapper.find('div.thumb')

		await thumb.trigger('mousedown')
		await thumb.trigger('mousemove', {
			clientX: 100,
		})
		await thumb.trigger('mousemove', {
			clientX: 100,
		})
		await thumb.trigger('mouseup')

		expect(callbackFn).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('set the inProgress to false after 100ms', async () => {
		vi.useFakeTimers()
		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		const thumb = wrapper.find('div.thumb')

		await thumb.trigger('mousedown')
		await thumb.trigger('mousemove', {
			clientX: 100,
		})
		await thumb.trigger('mousemove', {
			clientX: 150,
		})
		await thumb.trigger('mouseup')

		expect(wrapper.vm.inProgress).toBe(true)

		await thumb.trigger('mousemove', {
			clientX: 100,
		})

		expect(wrapper.vm.inProgress).toBe(true)

		vi.advanceTimersByTime(100)

		expect(wrapper.vm.inProgress).toBe(false)

		wrapper.unmount()
	})

	it('do not overstep the minSelectableValue', async () => {
		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		const thumb = wrapper.find('div.thumb')

		await thumb.trigger('mousedown')
		await thumb.trigger('mousemove', {
			clientX: 0,
		})
		await thumb.trigger('mousemove', {
			clientX: -300,
		})
		await thumb.trigger('mouseup')

		expect(callbackFn).toHaveBeenCalledWith(0)

		wrapper.unmount()
	})

	it('do not overstep the maxSelectableValue', async () => {
		const wrapper = mount(TestComponent, {
			attachTo: document.body,
		})

		const thumb = wrapper.find('div.thumb')

		await thumb.trigger('mousedown')
		await thumb.trigger('mousemove', {
			clientX: 200,
		})
		await thumb.trigger('mousemove', {
			clientX: 500,
		})
		await thumb.trigger('mouseup')

		expect(callbackFn).toHaveBeenCalledWith(100)

		wrapper.unmount()
	})
})
