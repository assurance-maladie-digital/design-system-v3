/* eslint-disable vue/one-component-per-file */
import { defineComponent, onMounted, ref, toRef, type Ref } from 'vue'
import useTrack from '../useTrack'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

describe('useTrack', () => {
	it('should return the track object', async () => {
		const setMin = vi.fn()
		const setMax = vi.fn()
		const TestElement = defineComponent({
			setup() {
				const track = ref<HTMLElement | null>(null)
				onMounted(() => {
					const mockRect = vi.spyOn((track.value as HTMLElement), 'getBoundingClientRect')
					mockRect.mockReturnValue({
						left: 0,
						width: 200,
					} as DOMRect)
				})

				useTrack(
					track as Ref<HTMLElement>,
					{
						rangeMin: 0,
						rangeMax: 100,
						selectedMin: 0,
						selectedMax: 100,
						step: 1,
					},
					setMin,
					setMax,
				)

				return { track }
			},
			template: `<div>
				<div ref="track" class="track"></div>
			</div>`,
		})

		const wrapper = mount(TestElement, {
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('div.track').trigger('click', {
			clientX: 30,
		})

		expect(setMin).toHaveBeenCalledTimes(1)
		expect(setMin).toHaveBeenCalledWith(15)
		expect(setMax).toHaveBeenCalledTimes(0)

		await wrapper.find('div.track').trigger('click', {
			clientX: 170,
		})

		expect(setMax).toHaveBeenCalledTimes(1)
		expect(setMax).toHaveBeenCalledWith(85)
		expect(setMin).toHaveBeenCalledTimes(1)

		await wrapper.find('div.track').trigger('click', {
			clientX: 200,
		})

		expect(setMax).toHaveBeenCalledTimes(2)
		expect(setMax).toHaveBeenCalledWith(100)
		expect(setMin).toHaveBeenCalledTimes(1)
	})

	it('call the function with the closest step', async () => {
		const setMin = vi.fn()
		const setMax = vi.fn()
		const TestElement = defineComponent({
			setup() {
				const track = ref<HTMLElement | null>(null)
				onMounted(() => {
					const mockRect = vi.spyOn((track.value as HTMLElement), 'getBoundingClientRect')
					mockRect.mockReturnValue({
						left: 0,
						width: 200,
					} as DOMRect)
				})

				useTrack(
					track as Ref<HTMLElement>,
					{
						rangeMin: 0,
						rangeMax: 100,
						selectedMin: 0,
						selectedMax: 100,
						step: 5,
					},
					setMin,
					setMax,
				)

				return { track }
			},
			template: `<div>
				<div ref="track" class="track"></div>
			</div>`,
		})

		const wrapper = mount(TestElement, {
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('div.track').trigger('click', {
			clientX: 33,
		})

		expect(setMin).toHaveBeenCalledTimes(1)
		expect(setMin).toHaveBeenCalledWith(15)

		await wrapper.find('div.track').trigger('click', {
			clientX: 188,
		})

		expect(setMax).toHaveBeenCalledTimes(1)
		expect(setMax).toHaveBeenCalledWith(95)
	})

	it('return the good value when the track contains negative values', async () => {
		const setMin = vi.fn()
		const setMax = vi.fn()
		const TestElement = defineComponent({
			setup() {
				const track = ref<HTMLElement | null>(null)
				onMounted(() => {
					const mockRect = vi.spyOn((track.value as HTMLElement), 'getBoundingClientRect')
					mockRect.mockReturnValue({
						left: 0,
						width: 200,
					} as DOMRect)
				})

				useTrack(
					track as Ref<HTMLElement>,
					{
						rangeMin: -50,
						rangeMax: 50,
						selectedMin: -50,
						selectedMax: 10,
						step: 5,
					},
					setMin,
					setMax,
				)

				return { track }
			},
			template: `<div>
				<div ref="track" class="track"></div>
			</div>`,
		})

		const wrapper = mount(TestElement, {
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('div.track').trigger('click', {
			clientX: 121,
		})

		expect(setMax).toHaveBeenCalledTimes(1)
		expect(setMax).toHaveBeenCalledWith(10)

		await wrapper.find('div.track').trigger('click', {
			clientX: 17,
		})

		expect(setMin).toHaveBeenCalledTimes(1)
		expect(setMin).toHaveBeenCalledWith(-40)
	})

	it('do not call any function if the disabled prop is true', async () => {
		const setMin = vi.fn()
		const setMax = vi.fn()
		const TestElement = defineComponent({
			props: {
				disable: {
					type: Boolean,
					default: false,
				},
			},
			setup(props) {
				const track = ref<HTMLElement | null>(null)
				const disable = toRef(props, 'disable')
				onMounted(() => {
					const mockRect = vi.spyOn((track.value as HTMLElement), 'getBoundingClientRect')
					mockRect.mockReturnValue({
						left: 0,
						width: 200,
					} as DOMRect)
				})

				useTrack(
					track as Ref<HTMLElement>,
					{
						rangeMin: 0,
						rangeMax: 100,
						selectedMin: 0,
						selectedMax: 100,
						step: 5,
					},
					setMin,
					setMax,
					disable,
				)

				return { track }
			},
			template: `<div>
				<div ref="track" class="track"></div>
			</div>`,
		})

		const wrapper = mount(TestElement, {
			global: {
				plugins: [vuetify],
			},
			props: {
				disable: true,
			},
		})

		await wrapper.find('div.track').trigger('click', {
			clientX: 33,
		})

		expect(setMin).toHaveBeenCalledTimes(0)
		expect(setMax).toHaveBeenCalledTimes(0)

		await wrapper.setProps({ disable: false })

		await wrapper.find('div.track').trigger('click', {
			clientX: 33,
		})

		expect(setMin).toHaveBeenCalledTimes(1)

		await wrapper.setProps({ disable: true })

		await wrapper.find('div.track').trigger('click', {
			clientX: 33,
		})

		expect(setMin).toHaveBeenCalledTimes(1)
		expect(setMax).toHaveBeenCalledTimes(0)
	})

	it('when min and max are equal, call the function for right thumb', async () => {
		const setMin = vi.fn()
		const setMax = vi.fn()
		const TestElement = defineComponent({
			setup() {
				const track = ref<HTMLElement | null>(null)
				onMounted(() => {
					const mockRect = vi.spyOn((track.value as HTMLElement), 'getBoundingClientRect')
					mockRect.mockReturnValue({
						left: 0,
						width: 200,
					} as DOMRect)
				})

				useTrack(
					track as Ref<HTMLElement>,
					{
						rangeMin: 0,
						rangeMax: 100,
						selectedMin: 50,
						selectedMax: 50,
						step: 5,
					},
					setMin,
					setMax,
				)

				return { track }
			},
			template: `<div>
				<div ref="track" class="track"></div>
			</div>`,
		})

		const wrapper = mount(TestElement, {
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('div.track').trigger('click', {
			clientX: 90,
		})

		expect(setMin).toHaveBeenCalledTimes(1)
		expect(setMax).toHaveBeenCalledTimes(0)

		await wrapper.find('div.track').trigger('click', {
			clientX: 160,
		})

		expect(setMin).toHaveBeenCalledTimes(1)
		expect(setMax).toHaveBeenCalledTimes(1)
	})
})
