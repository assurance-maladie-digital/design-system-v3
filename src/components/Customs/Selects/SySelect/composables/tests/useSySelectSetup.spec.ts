import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'

import { useSySelectSetup } from '../useSySelectSetup'

describe('useSySelectSetup', () => {
	it('exposes the expected contract', () => {
		const props = reactive({
			modelValue: null,
			items: [],
			label: 'Label',
			errorMessages: [],
			required: false,
			disabled: false,
			menuId: 'sy-select-menu',
			outlined: true,
			textKey: 'text',
			plainTextKey: '',
			valueKey: 'value',
			displayAsterisk: false,
			returnObject: false,
			disableErrorHandling: false,
			density: 'default',
			bgColor: 'white',
			readonly: false,
			clearable: false,
			hideMessages: false,
			width: 'undefined',
			multiple: false,
			chips: false,
			helpText: '',
			allowHtml: false,
			autocomplete: 'on',
		})

		const emit = () => {}
		const api = useSySelectSetup(props as unknown as Parameters<typeof useSySelectSetup>[0], emit)

		expect(api).toHaveProperty('isOpen')
		expect(api).toHaveProperty('inputId')
		expect(api).toHaveProperty('uniqueMenuId')
		expect(api).toHaveProperty('formattedItems')
		expect(api).toHaveProperty('toggleMenu')
		expect(api).toHaveProperty('closeList')
		expect(api).toHaveProperty('onFieldKeydown')
		expect(api).toHaveProperty('onListKeydown')
		expect(api).toHaveProperty('selectedItemText')
		expect(api).toHaveProperty('initializeActivatorProps')
	})

	it('reacts to modelValue changes (selection text updates)', async () => {
		const props = reactive({
			modelValue: null as unknown,
			items: [
				{ text: 'A', value: 'a' },
				{ text: 'B', value: 'b' },
			],
			label: 'Label',
			errorMessages: [],
			required: false,
			disabled: false,
			menuId: 'sy-select-menu',
			outlined: true,
			textKey: 'text',
			plainTextKey: '',
			valueKey: 'value',
			displayAsterisk: false,
			returnObject: false,
			disableErrorHandling: false,
			density: 'default',
			bgColor: 'white',
			readonly: false,
			clearable: false,
			hideMessages: false,
			width: 'undefined',
			multiple: false,
			chips: false,
			helpText: '',
			allowHtml: false,
			autocomplete: 'on',
		})

		let api!: ReturnType<typeof useSySelectSetup>
		const TestComponent = defineComponent({
			setup() {
				api = useSySelectSetup(props as unknown as Parameters<typeof useSySelectSetup>[0], () => {})
				return () => null
			},
		})

		mount(TestComponent)
		expect(api.selectedItemText.value).toBe('')

		props.modelValue = 'b'
		await nextTick()
		await nextTick()
		expect(api.selectedItemText.value).toBe('B')
	})
})
