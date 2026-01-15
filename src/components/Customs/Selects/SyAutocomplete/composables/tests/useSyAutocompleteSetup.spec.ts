import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'

import { useSyAutocompleteSetup, type SyAutocompleteSetupEmit } from '../useSyAutocompleteSetup'

vi.mock('@/composables/validation/useValidatable', () => {
	return {
		useValidatable: () => {},
	}
})

describe('useSyAutocompleteSetup', () => {
	it('exposes the expected contract', () => {
		const props = reactive({
			modelValue: null,
			menuId: 'sy-autocomplete-menu',
			search: '',
			fetchItems: undefined,
			minChars: 1,
			debounceMs: 0,
			cache: false,
			items: [],
			label: 'Label',
			errorMessages: [],
			required: false,
			disabled: false,
			outlined: true,
			textKey: 'text',
			plainTextKey: '',
			valueKey: 'value',
			displayAsterisk: false,
			returnObject: true,
			disableErrorHandling: false,
			density: 'default',
			bgColor: 'white',
			readonly: false,
			clearable: true,
			hideMessages: false,
			width: 'undefined',
			multiple: false,
			chips: false,
			helpText: '',
			allowHtml: false,
			autocomplete: 'on',
			noDataText: 'Aucun résultat',
		})

		const emit = (() => {}) as Parameters<typeof useSyAutocompleteSetup>[1]
		const api = useSyAutocompleteSetup(props as unknown as Parameters<typeof useSyAutocompleteSetup>[0], emit)

		expect(api).toHaveProperty('isOpen')
		expect(api).toHaveProperty('inputId')
		expect(api).toHaveProperty('uniqueMenuId')
		expect(api).toHaveProperty('formattedItems')
		expect(api).toHaveProperty('textFieldModel')
		expect(api).toHaveProperty('toggleMenu')
		expect(api).toHaveProperty('closeList')
		expect(api).toHaveProperty('onListKeydown')
		expect(api).toHaveProperty('initializeActivatorProps')
	})

	it('syncs items updates into formattedItems', async () => {
		const props = reactive({
			modelValue: null,
			menuId: 'sy-autocomplete-menu',
			search: '',
			fetchItems: undefined,
			minChars: 1,
			debounceMs: 0,
			cache: false,
			items: [] as Array<{ text: string, value: string }>,
			label: 'Label',
			errorMessages: [],
			required: false,
			disabled: false,
			outlined: true,
			textKey: 'text',
			plainTextKey: '',
			valueKey: 'value',
			displayAsterisk: false,
			returnObject: true,
			disableErrorHandling: false,
			density: 'default',
			bgColor: 'white',
			readonly: false,
			clearable: true,
			hideMessages: false,
			width: 'undefined',
			multiple: false,
			chips: false,
			helpText: '',
			allowHtml: false,
			autocomplete: 'on',
			noDataText: 'Aucun résultat',
		})

		let api!: ReturnType<typeof useSyAutocompleteSetup>
		const emit: SyAutocompleteSetupEmit = (() => {}) as unknown as SyAutocompleteSetupEmit
		const TestComponent = defineComponent({
			setup() {
				api = useSyAutocompleteSetup(props as unknown as Parameters<typeof useSyAutocompleteSetup>[0], emit)
				return () => null
			},
		})

		mount(TestComponent)
		expect(api.formattedItems.value.length).toBe(0)

		props.items = [
			{ text: 'France', value: 'FR' },
			{ text: 'Finlande', value: 'FI' },
		]
		await nextTick()
		await nextTick()
		expect(api.formattedItems.value.length).toBe(2)
	})
})
