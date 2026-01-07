import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { VList } from 'vuetify/components'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import SyAutocomplete from '../SyAutocomplete.vue'

describe('SyAutocomplete.vue', () => {
	describe('Default', () => {
		it('sets aria-selected="true" only on the selected option', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]

			const wrapper = mount(SyAutocomplete, {
				props: {
					items,
					returnObject: true,
				},
				attachTo: document.body,
			})

			await wrapper.find('.sy-autocomplete').trigger('click')
			await wrapper.vm.$nextTick()

			const list = wrapper.findComponent(VList)
			const options = list.findAll('.v-list-item[role="option"]')
			expect(options.length).toBeGreaterThanOrEqual(2)

			await options[0].trigger('click')
			await wrapper.vm.$nextTick()

			// Re-open to read the listbox DOM again
			await wrapper.find('.sy-autocomplete').trigger('click')
			await wrapper.vm.$nextTick()

			const optionsAfter = wrapper.findComponent(VList).findAll('.v-list-item[role="option"]')
			expect(optionsAfter[0].attributes('aria-selected')).toBe('true')
			expect(optionsAfter[1].attributes('aria-selected')).toBe('false')

			wrapper.unmount()
		})
	})

	describe('Required', () => {
		it('displays required error message after blur when required and empty', async () => {
			const wrapper = mount(SyAutocomplete, {
				props: {
					required: true,
					hideMessages: false,
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('blur')
			await wrapper.vm.$nextTick()

			const message = wrapper.find('.v-messages__message')
			expect(message.exists()).toBe(true)
			expect(message.text()).toContain('Le champ est requis.')

			wrapper.unmount()
		})
	})

	describe('FormValidation', () => {
		it('displays required error message on form submit when value is empty', async () => {
			const Wrapper = defineComponent({
				components: { SyForm, SyAutocomplete },
				setup() {
					const value = ref(null)
					const search = ref('')
					return { value, search }
				},
				template: `
					<SyForm>
						<SyAutocomplete
							v-model="value"
							v-model:search="search"
							required
							:hide-messages="false"
							return-object
						/>
						<button type="submit">Submit</button>
					</SyForm>
				`,
			})

			const wrapper = mount(Wrapper, {
				attachTo: document.body,
			})

			await wrapper.find('form').trigger('submit')
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			expect(wrapper.text()).toContain('Le champ est requis.')

			wrapper.unmount()
		})
	})

	describe('WithApiCall', () => {
		it('shows and hides the loading row while fetchItems is pending', async () => {
			let resolveFetch!: (items: Array<{ text: string, value: string }>) => void
			const fetchItems = vi.fn().mockImplementation(
				() => new Promise((resolve) => {
					resolveFetch = resolve
				}),
			)

			const wrapper = mount(SyAutocomplete, {
				props: {
					fetchItems,
					debounceMs: 0,
					minChars: 1,
					returnObject: true,
				},
				attachTo: document.body,
			})

			await wrapper.find('.sy-autocomplete').trigger('click')
			await wrapper.vm.$nextTick()

			await wrapper.find('input').setValue('a')
			await wrapper.vm.$nextTick()

			// Loading indicator is rendered as a VListItem with the text "Chargement..."
			expect(wrapper.text()).toContain('Chargement...')

			resolveFetch([{ text: 'Alpha', value: 'a' }])
			await wrapper.vm.$nextTick()
			await wrapper.vm.$nextTick()

			expect(wrapper.text()).not.toContain('Chargement...')
			expect(wrapper.text()).toContain('Alpha')

			wrapper.unmount()
		})

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
})
