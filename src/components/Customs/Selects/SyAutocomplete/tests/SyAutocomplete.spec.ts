import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { VList } from 'vuetify/components'
import SyAutocomplete from '../SyAutocomplete.vue'

describe('SyAutocomplete.vue', () => {
	it('debounces fetchItems calls from v-model:search', async () => {
		vi.useFakeTimers()
		const fetchItems = vi.fn().mockResolvedValue([
			{ text: 'Alpha', value: 'a' },
		])

		const wrapper = mount(SyAutocomplete, {
			props: {
				fetchItems,
				debounceMs: 250,
				minChars: 2,
				returnObject: true,
			},
			attachTo: document.body,
		})

		// Open dropdown (activator)
		await wrapper.find('.sy-autocomplete').trigger('click')
		await wrapper.vm.$nextTick()

		const input = wrapper.find('input')
		await input.setValue('al')

		expect(fetchItems).not.toHaveBeenCalled()

		vi.advanceTimersByTime(250)
		await vi.runOnlyPendingTimersAsync()
		expect(fetchItems).toHaveBeenCalledWith('al')

		wrapper.unmount()
		vi.useRealTimers()
	})

	it('keeps only last request result (last request wins)', async () => {
		vi.useFakeTimers()

		let resolveA!: (v: unknown) => void
		let resolveB!: (v: unknown) => void
		const fetchItems = vi.fn()
			.mockImplementationOnce(() => new Promise((r) => { resolveA = r }))
			.mockImplementationOnce(() => new Promise((r) => { resolveB = r }))

		const wrapper = mount(SyAutocomplete, {
			props: {
				fetchItems,
				debounceMs: 0,
				minChars: 2,
				returnObject: true,
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-autocomplete').trigger('click')
		await wrapper.vm.$nextTick()

		const input = wrapper.find('input')
		await input.setValue('ab')
		await input.setValue('abc')

		// Resolve second request first
		resolveB([{ text: 'ABC', value: 'abc' }])
		await wrapper.vm.$nextTick()

		resolveA([{ text: 'AB', value: 'ab' }])
		await wrapper.vm.$nextTick()

		const listItems = wrapper.findComponent(VList).findAll('.v-list-item')
		expect(listItems.some(li => li.text().includes('ABC'))).toBe(true)
		expect(listItems.some(li => li.text().trim() === 'AB')).toBe(false)

		wrapper.unmount()
		vi.useRealTimers()
	})
})
