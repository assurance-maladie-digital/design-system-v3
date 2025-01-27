import { defineComponent, ref, type Ref } from 'vue'
import useThumbKeyboard from '../useThumbKeyboard'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

describe('useThumbKeyboard', () => {
	let setValue = vi.fn()

	const TestComponent = defineComponent({
		props: {
			step: {
				type: Number,
				default: 1,
			},
		},
		setup(props) {
			const thumb = ref<HTMLElement | null>(null)
			useThumbKeyboard(
				thumb as Ref<HTMLElement>,
				ref(50),
				0,
				100,
				props.step,
				setValue,
			)

			return { thumb }
		},
		template: `<div ref="thumb" class="thumb"></div>`,
	})

	afterEach(() => {
		setValue = vi.fn()
	})

	it('should handle ArrowLeft key', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 5,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'ArrowLeft',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(45)
	})

	it('should handle ArrowDown key', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 5,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'ArrowDown',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(45)
	})

	it('should handle ArrowRight key', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 5,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'ArrowRight',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(55)
	})

	it('should handle ArrowUp key', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 5,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'ArrowUp',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(55)
	})

	it('should set a value that is a multiple of the step', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 6,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'ArrowRight',
		})

		expect(setValue).toHaveBeenCalledWith(54)
	})

	it('should handle Home key', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 9,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'Home',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(0)
	})

	it('should handle End key', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 9,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'End',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(100)
	})

	it('should handle PageDown key', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 2,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'PageDown',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(30)
	})

	it('should handle PageUp key', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 2,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'PageUp',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(70)
	})

	it('should handle PageDown key with overflow', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 9,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'PageDown',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(0)
	})

	it('should handle PageUp key with overflow', async () => {
		const wrapper = mount(TestComponent, {
			global: {
				plugins: [vuetify],
			},
			props: {
				step: 9,
			},
		})

		await wrapper.find('div.thumb').trigger('keydown', {
			key: 'PageUp',
		})

		expect(setValue).toHaveBeenCalledTimes(1)
		expect(setValue).toHaveBeenCalledWith(100)
	})
})
