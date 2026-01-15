import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'

import { useSyComboboxMenuTarget } from '../useSyComboboxMenuTarget'
import { useSyComboboxVuetifyFocus } from '../useSyComboboxVuetifyFocus'
import { useSyComboboxAria } from '../useSyComboboxAria'

describe('useSyComboboxMenuTarget', () => {
	it('returns .v-field when present, otherwise root element', async () => {
		const root = document.createElement('div')
		const field = document.createElement('div')
		field.className = 'v-field'
		root.appendChild(field)

		const textInput = ref<{ $el?: HTMLElement } | null>({ $el: root })
		const { menuTarget } = useSyComboboxMenuTarget({ textInput })
		expect(menuTarget.value).toBe(field)

		field.remove()
		textInput.value = null
		textInput.value = { $el: root }
		await nextTick()
		expect(menuTarget.value).toBe(root)
	})
})

describe('useSyComboboxVuetifyFocus', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})
	afterEach(() => {
		vi.useRealTimers()
	})

	it('ensureNativeInputFocus calls focus multiple times', async () => {
		const input = document.createElement('input')
		const root = document.createElement('div')
		root.appendChild(input)

		const focusSpy = vi.spyOn(input, 'focus')
		vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
			cb(0)
			return 0
		})

		const textInput = ref<{ $el?: HTMLElement } | null>({ $el: root })
		const { ensureNativeInputFocus } = useSyComboboxVuetifyFocus({ textInput })

		ensureNativeInputFocus()
		await nextTick()
		vi.runAllTimers()
		expect(focusSpy).toHaveBeenCalled()
	})
})

describe('useSyComboboxAria', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})
	afterEach(() => {
		vi.useRealTimers()
	})

	it('applies combobox attributes on mount and reacts to isOpen', async () => {
		const Comp = defineComponent({
			setup() {
				const root = ref<HTMLElement | null>(null)
				const isOpen = ref(false)
				const uniqueMenuId = ref('menu-1')
				const activeDescendantId = ref('')
				const isRequired = ref<boolean | undefined>(false)
				const hasError = ref(false)
				const selectedItem = ref<unknown>(null)

				useSyComboboxAria({
					getRootEl: () => root.value,
					getInputEl: rootEl => rootEl.querySelector('input') as HTMLElement | null,
					isOpen,
					uniqueMenuId,
					activeDescendantId,
					isRequired,
					hasError,
					selectedItem,
					ariaAutocomplete: 'none',
				})

				return { root, isOpen }
			},
			template: `
			<div ref="root">
				<input data-testid="input" />
			</div>
		`,
		})

		const wrapper = mount(Comp)
		await nextTick()
		vi.runAllTimers()

		const input = wrapper.get('[data-testid="input"]').element as HTMLInputElement
		expect(input.getAttribute('role')).toBe('combobox')
		expect(input.getAttribute('aria-expanded')).toBe('false')

		;(wrapper.vm as unknown as { isOpen: boolean }).isOpen = true
		await nextTick()
		await nextTick()
		expect(input.getAttribute('aria-expanded')).toBe('true')
		expect(input.getAttribute('aria-controls')).toBe('menu-1')
	})
})
