import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'import RangeSlider from '../RangeSlider.vue'

describe('RangeField component', () => {
	it('should render the component', () => {
		const wrapper = mount(RangeSlider, {
			props: {
				min: 0,
				max: 100,
				modelValue: [25, 75],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()

		const minThumb = wrapper.find('.thumb-min')
		expect(minThumb.attributes('style')).toBe('left: 25%;')
		expect(minThumb.attributes('aria-valuenow')).toBe('25')
		expect(minThumb.text()).toBe('25')

		const maxThumb = wrapper.find('.thumb-max')
		expect(maxThumb.attributes('style')).toBe('left: 75%;')
		expect(maxThumb.attributes('aria-valuenow')).toBe('75')
		expect(maxThumb.text()).toBe('75')
	})

	it('should update the model value on thumb drag', async () => {
		const wrapper = mount(RangeSlider, {
			props: {
				min: 0,
				max: 100,
				modelValue: [25, 75],
			},
		})

		const minThumb = wrapper.find('.thumb-min')
		await minThumb.trigger('keydown', { key: 'ArrowRight' })

		expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[26, 75]])
	})

	it('should update the range when the modelValue is updated', async () => {
		const wrapper = mount(RangeSlider, {
			props: {
				min: 0,
				max: 100,
				modelValue: [25, 75],
			},
		})

		await wrapper.setProps({ modelValue: [30, 70] })

		const minThumb = wrapper.find('.thumb-min')
		expect(minThumb.attributes('style')).toBe('left: 30%;')
		expect(minThumb.attributes('aria-valuenow')).toBe('30')
		expect(minThumb.text()).toBe('30')

		const maxThumb = wrapper.find('.thumb-max')
		expect(maxThumb.attributes('style')).toBe('left: 70%;')
		expect(maxThumb.attributes('aria-valuenow')).toBe('70')
		expect(maxThumb.text()).toBe('70')
	})

	it('emit an event when the track is clicked', async () => {
		const wrapper = mount(RangeSlider, {
			props: {
				min: 0,
				max: 100,
				modelValue: [25, 75],
			},
		})

		const track = wrapper.find('.track')

		vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue({
			left: 0,
			width: 100,
		} as DOMRect)

		await wrapper.find('.track').trigger('click', { clientX: 33 })

		expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[33, 75]])
	})
})
