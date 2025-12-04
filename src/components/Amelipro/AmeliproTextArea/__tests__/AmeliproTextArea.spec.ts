import { mount, shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproTextArea from '../AmeliproTextArea.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import type { ValidateOnType } from '../../types'
import type { ValidationRule } from '@/utils/rules/types'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproTextArea> = {
	required: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: undefined,
	},
	counter: {
		type: Number,
		default: 255,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	globalMaxWidth: {
		type: String,
		default: undefined,
	},
	globalMinWidth: {
		type: String,
		default: undefined,
	},
	globalWidth: {
		type: String,
		default: undefined,
	},
	horizontal: {
		type: Boolean,
		default: false,
	},
	inputMaxWidth: {
		type: String,
		default: undefined,
	},
	inputMinWidth: {
		type: String,
		default: undefined,
	},
	label: {
		type: String,
		required: true,
	},
	labelMaxWidth: {
		type: String,
		default: undefined,
	},
	labelMinWidth: {
		type: String,
		default: undefined,
	},
	modelValue: {
		type: String,
		default: undefined,
	},
	readonly: {
		type: Boolean,
		default: false,
	},
	rules: {
		type: Array as PropType<ValidationRule[]>,
		default: () => [],
	},
	uniqueId: {
		type: String,
		required: true,
	},
	validateOn: {
		default: undefined,
		type: String as PropType<ValidateOnType>,
		validator(value: string): boolean {
			return ['lazy', 'blur', 'input', 'submit', 'blur lazy', 'input lazy', 'submit lazy', 'lazy blur', 'lazy input', 'lazy submit'].includes(value.toLowerCase())
		},
	},
}

const requiredPropValues = (): ComponentProps<typeof AmeliproTextArea> => ({
	label: 'Required label',
	uniqueId: 'required-unique-id',
})

const modifiedPropValues = (): ComponentProps<typeof AmeliproTextArea> => ({
	required: true,
	classes: 'modified-classes',
	counter: 100,
	disabled: true,
	globalMaxWidth: '300px',
	globalMinWidth: '100px',
	globalWidth: '200px',
	horizontal: true,
	inputMaxWidth: '150px',
	inputMinWidth: '50px',
	label: 'Modified label',
	labelMaxWidth: '120px',
	labelMinWidth: '60px',
	modelValue: 'Modified model value',
	readonly: true,
	rules: [() => true],
	uniqueId: 'modified-unique-id',
	validateOn: 'input',
})

const VTextareaStub = {
	name: 'VTextarea',
	inheritAttrs: false,
	props: ['disabled', 'readonly', 'modelValue'],
	template: `
		<textarea
			v-if="!$slots.append"
			v-bind="$attrs"
			:disabled="disabled"
			:readonly="readonly"
			:modelvalue="modelValue"
		/>
		<div v-else>
			<textarea
				v-bind="$attrs"
				:disabled="disabled"
				:readonly="readonly"
				:modelvalue="modelValue"
			/>
			<slot name="append" />
		</div>
	`,
}

const testHelper = new TestHelper(AmeliproTextArea)
testHelper
	.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)
	.setMountOptions({
		global: {
			stubs: {
				VTextarea: VTextareaStub,
			},
		},
	})

describe('AmeliproTextArea', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTextArea>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTextArea, {
				props: requiredPropValues(),
				global: {
					stubs: {
						VTextarea: VTextareaStub,
					},
				},
			})
		})

		it('prop uniqueId sets attribute id on root container', async () => {
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})

		it('prop label sets label text', async () => {
			expect(vueWrapper.find('.amelipro-textarea__label').text()).toContain(testHelper.default('label'))
			const { label } = modifiedPropValues()
			await vueWrapper.setProps({ label })
			expect(vueWrapper.find('.amelipro-textarea__label').text()).toContain(testHelper.modified('label'))
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTextArea>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTextArea, {
				props: requiredPropValues(),
				global: {
					stubs: {
						VTextarea: VTextareaStub,
					},
				},
			})
		})

		it('prop disabled sets prop disabled on VTextarea', async () => {
			expect(vueWrapper.findComponent({ name: 'VTextarea' }).props('disabled')).toBe(testHelper.default('disabled'))
			const { disabled } = modifiedPropValues()
			await vueWrapper.setProps({ disabled })
			expect(vueWrapper.findComponent({ name: 'VTextarea' }).props('disabled')).toBe(testHelper.modified('disabled'))
		})

		it('prop readonly sets prop readonly on VTextarea', async () => {
			expect(vueWrapper.findComponent({ name: 'VTextarea' }).props('readonly')).toBe(testHelper.default('readonly'))
			const { readonly } = modifiedPropValues()
			await vueWrapper.setProps({ readonly })
			expect(vueWrapper.findComponent({ name: 'VTextarea' }).props('readonly')).toBe(testHelper.modified('readonly'))
		})
	})

	describe('Slots', () => {
		it('displays slot content in labelInfo', () => {
			const vueWrapper = shallowMount(AmeliproTextArea, {
				props: requiredPropValues(),
				slots: { labelInfo: '<div id="slot-content">Slot Content</div>' },
				global: {
					stubs: {
						VTextarea: VTextareaStub,
					},
				},
			})
			expect(vueWrapper.find('#slot-content').text()).toBe('Slot Content')
		})
		it('displays slot content in append', () => {
			const vueWrapper = mount(AmeliproTextArea, {
				props: requiredPropValues(),
				slots: { append: '<div id="append-content">Append Content</div>' },
				global: {
					stubs: {
						VTextarea: VTextareaStub,
					},
				},
			})
			expect(vueWrapper.find('#append-content').text()).toBe('Append Content')
		})
	})

	describe('Events', () => {
		it('emits update:model-value on input change', async () => {
			const vueWrapper = mount(AmeliproTextArea, {
				props: requiredPropValues(),
				global: {
					stubs: {
						VTextarea: VTextareaStub,
					},
				},
			})
			await vueWrapper.findComponent({ name: 'VTextarea' }).vm.$emit('update:modelValue', 'foo')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('update:model-value')).toBeTruthy()
		})
		it('emits change on change event', async () => {
			const vueWrapper = mount(AmeliproTextArea, {
				props: requiredPropValues(),
				global: {
					stubs: {
						VTextarea: VTextareaStub,
					},
				},
			})
			await vueWrapper.findComponent({ name: 'VTextarea' }).vm.$emit('change')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('change')).toBeTruthy()
		})
	})
})
