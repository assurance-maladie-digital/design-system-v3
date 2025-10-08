/* eslint-disable @typescript-eslint/no-explicit-any */
import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproUpload from '../AmeliproUpload.vue'
import type { ComponentProps } from 'vue-component-type-helpers'

const requiredPropValues = (): ComponentProps<typeof AmeliproUpload> => ({
	fileTypeAccepted: ['text/plain'],
	uniqueId: 'required-unique-id',
})

const defaultPropValues = (): ComponentProps<typeof AmeliproUpload> => ({
	...requiredPropValues(),
	ariaRequired: false,
	disabled: false,
	errorMessages: undefined,
	errorTitle: undefined,
	externalErrors: [],
	inputLabel: 'Cliquer sur ce bouton pour joindre vos documents ou les glisser-déposer directement dans ce cadre',
	maxFileNumber: 1,
	rules: [],
	value: [],
	warningRules: [],
	warningTitle: undefined,
})

const modifiedPropValues = (): ComponentProps<typeof AmeliproUpload> => ({
	ariaRequired: true,
	disabled: true,
	errorMessages: { error: 'Modified error message' },
	fileTypeAccepted: ['modified-type-1', 'modified-type-2'],
	inputLabel: 'Modified input label',
	maxFileNumber: 3,
	value: [new File(['foo'], 'modified-file.txt')],
	rules: [() => true],
	uniqueId: 'modified-unique-id',
})

describe('AmeliproUpload', () => {
	describe('Setting props should update attributes of inner tags', () => {
		let wrapper: VueWrapper<any>
		beforeEach(() => {
			wrapper = shallowMount(AmeliproUpload, { props: requiredPropValues() })
		})

		it('prop uniqueId sets attribute id on root container', async () => {
			expect(wrapper.attributes('id')).toBe(`${defaultPropValues().uniqueId}-container`)
			const { uniqueId } = modifiedPropValues()
			await wrapper.setProps({ uniqueId })
			expect(wrapper.attributes('id')).toBe(`${modifiedPropValues().uniqueId}-container`)
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let wrapper: VueWrapper<any>
		beforeEach(() => {
			wrapper = shallowMount(AmeliproUpload, { props: requiredPropValues() })
		})

		it('prop disabled sets prop disabled on VFileInput', async () => {
			expect(wrapper.findComponent({ name: 'VFileInput' }).props('disabled')).toBe(defaultPropValues().disabled)
			const { disabled } = modifiedPropValues()
			await wrapper.setProps({ disabled })
			expect(wrapper.findComponent({ name: 'VFileInput' }).props('disabled')).toBe(modifiedPropValues().disabled)
		})

		it('prop ariaRequired sets attribute aria-required on VFileInput', async () => {
			expect(wrapper.findComponent({ name: 'VFileInput' }).attributes('aria-required')).toBe(String(defaultPropValues().ariaRequired))
			const { ariaRequired } = modifiedPropValues()
			await wrapper.setProps({ ariaRequired })
			expect(wrapper.findComponent({ name: 'VFileInput' }).attributes('aria-required')).toBe(String(modifiedPropValues().ariaRequired))
		})
	})
})
