import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import CopyBtn from '../CopyBtn.vue'

describe('CopyBtn', () => {
	const copy = vi.fn()

	beforeEach(() => {
		const navigator = {
			clipboard: {
				writeText: copy,
			},
		} as unknown as Navigator

		vi.spyOn(window, 'navigator', 'get').mockReturnValue(navigator)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('renders correctly', () => {
		const wrapper = shallowMount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'test',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('copies the text to the clipboard', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'test',
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(copy).toHaveBeenCalledWith('test')

		await wrapper.setProps({
			textToCopy: () => 'function test',
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(copy).toHaveBeenCalledWith('function test')
	})

	it('shows a tooltip when the text is copied', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'test',
				tooltipDuration: 100,
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(wrapper.vm.tooltip).toBeTruthy()

		vi.advanceTimersByTime(101) // tooltipDuration + 1ms pour être sûr

		expect(wrapper.vm.tooltip).toBeFalsy()
	})

	it('does not show a tooltip when the text is copied but hide-tooltip is true', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'test',
				hideTooltip: true,
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(wrapper.vm.tooltip).toBeFalsy()
	})

	it('removes spaces in the text', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'text with spaces',
				separatorsToRemove: ' ',
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(copy).toHaveBeenCalledWith('textwithspaces')
	})

	it('removes all types of whitespace', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'text with\tspaces\nand\rtabs',
				separatorsToRemove: ' ',
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(copy).toHaveBeenCalledWith('textwithspacesandtabs')
	})

	it('removes specified separator when separatorsToRemove is a string', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'FR76-3000-4000-0300',
				separatorsToRemove: '-',
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(copy).toHaveBeenCalledWith('FR76300040000300')
	})

	it('removes multiple separators when separatorsToRemove is an array', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: '+33 (0)6.12.34.56',
				separatorsToRemove: ['+', '(', ')', '.'],
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(copy).toHaveBeenCalledWith('3306123456')
	})

	it('handles special regex characters in separators correctly', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'text.with*special[chars]',
				separatorsToRemove: ['.', '*', '[', ']'],
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(copy).toHaveBeenCalledWith('textwithspecialchars')
	})

	it('removes separators', async () => {
		const wrapper = mount(CopyBtn, {
			propsData: {
				label: 'test',
				textToCopy: 'FR76-3000-4000',
				separatorsToRemove: '-',
			},
		})

		await wrapper.find('[data-test-id="copy-btn"]').trigger('click')

		expect(copy).toHaveBeenCalledWith('FR7630004000')
	})
})
