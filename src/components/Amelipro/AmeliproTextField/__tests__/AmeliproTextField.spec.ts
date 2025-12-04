/* eslint-disable @typescript-eslint/no-explicit-any */
import { config, mount, shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproTextField from '../AmeliproTextField.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import { defineComponent, type PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import type { ValidateOnType } from '../../types'
import type { ValidationRule } from '@/utils/rules/types'

const VTextFieldStub = defineComponent({
	name: 'VTextField',
	props: {
		modelValue: {
			type: [String, Number],
			default: undefined,
		},
		placeholder: {
			type: String,
			default: undefined,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		clearable: {
			type: Boolean,
			default: false,
		},
		id: {
			type: String,
			default: undefined,
		},
		required: {
			type: [Boolean, String],
			default: false,
		},
		ariaInvalid: {
			type: [Boolean, String],
			default: false,
		},
		ariaDescribedby: {
			type: String,
			default: undefined,
		},
		hideDetails: {
			type: [Boolean, String],
			default: false,
		},
		style: {
			type: [String, Object],
			default: undefined,
		},
		type: {
			type: String,
			default: 'text',
		},
		max: {
			type: String,
			default: undefined,
		},
		min: {
			type: String,
			default: undefined,
		},
		counter: {
			type: [Boolean, Number, String],
			default: undefined,
		},
		validateOn: {
			type: String,
			default: undefined,
		},
		rules: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['update:modelValue', 'change', 'focus', 'blur'],
	template: `
		<div
			class="v-text-field-stub"
            :aria-required="required"
			:style="style"
		>
			<slot />
			<slot name="append" />
			<slot name="message" />
		</div>
	`,
})

config.global.stubs = config.global.stubs || {}
config.global.stubs.VTextField = VTextFieldStub

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproTextField> = {
	required: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: undefined,
	},
	clearable: {
		type: Boolean,
		default: false,
	},
	counter: {
		type: [Boolean, Number, String] as PropType<boolean | number>,
		default: undefined,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	disabledDateForSafari: {
		type: Boolean,
		default: false,
	},
	fullWidthErrorMsg: {
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
	hideErrorMessage: {
		type: [String, Boolean] as PropType<boolean | 'auto'>,
		default: false,
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
	maxDate: {
		type: String,
		default: undefined,
	},
	maxNumber: {
		type: String,
		default: undefined,
	},
	minDate: {
		type: String,
		default: undefined,
	},
	minNumber: {
		type: String,
		default: undefined,
	},
	modelValue: {
		type: [String, Number] as PropType<string | number>,
		default: undefined,
	},
	placeholder: {
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
	type: {
		type: String,
		default: 'text',
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

const requiredPropValues = (): ComponentProps<typeof AmeliproTextField> => ({
	label: 'Required label',
	uniqueId: 'required-unique-id',
})

const modifiedPropValues = (): ComponentProps<typeof AmeliproTextField> => ({
	required: true,
	classes: 'modified-classes',
	clearable: true,
	counter: 5,
	disabled: true,
	disabledDateForSafari: true,
	fullWidthErrorMsg: true,
	globalMaxWidth: '300px',
	globalMinWidth: '100px',
	globalWidth: '200px',
	hideErrorMessage: 'auto',
	horizontal: true,
	inputMaxWidth: '150px',
	inputMinWidth: '50px',
	label: 'Modified label',
	labelMaxWidth: '120px',
	labelMinWidth: '60px',
	maxDate: '2099-12-31',
	maxNumber: '100',
	minDate: '2000-01-01',
	minNumber: '1',
	modelValue: 'Modified model value',
	placeholder: 'Modified placeholder',
	readonly: true,
	rules: [() => true],
	type: 'number',
	uniqueId: 'modified-unique-id',
	validateOn: 'input',
})

const testHelper = new TestHelper(AmeliproTextField)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproTextField', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<any>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTextField, { props: requiredPropValues() })
		})

		it('prop uniqueId sets attribute id on root container', async () => {
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})

		it('prop label sets label text', async () => {
			expect(vueWrapper.find('.amelipro-text-field__label').text()).toContain(testHelper.default('label'))
			const { label } = modifiedPropValues()
			await vueWrapper.setProps({ label })
			expect(vueWrapper.find('.amelipro-text-field__label').text()).toContain(testHelper.modified('label'))
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<any>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTextField, { props: requiredPropValues() })
		})

		it('prop disabled sets prop disabled on VTextField', async () => {
			expect(vueWrapper.findComponent({ name: 'VTextField' }).props('disabled')).toBe(testHelper.default('disabled'))
			const { disabled } = modifiedPropValues()
			await vueWrapper.setProps({ disabled })
			expect(vueWrapper.findComponent({ name: 'VTextField' }).props('disabled')).toBe(testHelper.modified('disabled'))
		})

		it('prop clearable sets prop clearable on VTextField', async () => {
			expect(vueWrapper.findComponent({ name: 'VTextField' }).props('clearable')).toBe(testHelper.default('clearable'))
			const { clearable } = modifiedPropValues()
			await vueWrapper.setProps({ clearable })
			expect(vueWrapper.findComponent({ name: 'VTextField' }).props('clearable')).toBe(testHelper.modified('clearable'))
		})

		it('prop placeholder sets prop placeholder on VTextField', async () => {
			expect(vueWrapper.findComponent({ name: 'VTextField' }).props('placeholder')).toBe(testHelper.default('placeholder'))
			const { placeholder } = modifiedPropValues()
			await vueWrapper.setProps({ placeholder })
			expect(vueWrapper.findComponent({ name: 'VTextField' }).props('placeholder')).toBe(testHelper.modified('placeholder'))
		})

		it('prop disabledDateForSafari & type=date sets prop type on VTextField to text on Safari', () => {
			// Simule Safari
			const originalUserAgent = window.navigator.userAgent
			Object.defineProperty(window.navigator, 'userAgent', {
				value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
				configurable: true,
			})

			vueWrapper = shallowMount(AmeliproTextField, {
				props: {
					...requiredPropValues(),
					disabledDateForSafari: true,
					type: 'date',
				},
			})
			expect(vueWrapper.findComponent({ name: 'VTextField' }).props('type')).toBe('text')

			// Nettoyage : restaure l'userAgent
			Object.defineProperty(window.navigator, 'userAgent', {
				value: originalUserAgent,
				configurable: true,
			})
		})
	})

	describe('Slots', () => {
		it('displays slot content in labelInfo', () => {
			const vueWrapper = shallowMount(AmeliproTextField, {
				props: requiredPropValues(),
				slots: { labelInfo: '<div id="slot-content">Slot Content</div>' },
			})
			expect(vueWrapper.find('#slot-content').text()).toBe('Slot Content')
		})

		// Slot du composant VTextField, non accessible si on utilise shallowMount
		it('displays slot content in append', () => {
			const vueWrapper = mount(AmeliproTextField, {
				props: requiredPropValues(),
				slots: { append: '<div id="append-content">Append Content</div>' },
			})
			expect(vueWrapper.find('#append-content').text()).toBe('Append Content')
		})
	})

	describe('Events', () => {
		it('emits update:model-value on input change', async () => {
			const vueWrapper = mount(AmeliproTextField, { props: requiredPropValues() })
			await vueWrapper.findComponent({ name: 'VTextField' }).vm.$emit('update:modelValue', 'foo')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('update:model-value')).toBeTruthy()
		})
		it('emits change on change event', async () => {
			const vueWrapper = mount(AmeliproTextField, { props: requiredPropValues() })
			await vueWrapper.findComponent({ name: 'VTextField' }).vm.$emit('change')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('change')).toBeTruthy()
		})
	})
})
