import { VueWrapper, config, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AmeliproSelect from '../AmeliproSelect.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import { defineComponent, type PropType } from 'vue'
import type { SelectItem } from '../types'
import TestHelper from '@tests/helpers/TestHelper'
import type { ValidateOnType } from '../../types'
import type { ValidationRule } from '@/utils/rules/types'
import { isRequired } from '@/utils/rules/isRequired'

vi.mock('@/utils/rules/isRequired', () => ({ isRequired: 'mocked-is-required' }))

const VSelectStub = defineComponent({
	name: 'VSelect',
	props: {
		modelValue: {
			type: [String, Number, Object],
			default: undefined,
		},
		items: {
			type: Array,
			default: () => [],
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
		prefix: {
			type: [String, Number],
			default: undefined,
		},
		id: {
			type: String,
			default: undefined,
		},
		ariaRequired: {
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
		rules: {
			type: Array,
			default: () => [],
		},
		validateOn: {
			type: String,
			default: undefined,
		},
	},
	emits: ['update:modelValue', 'focus', 'blur'],
	template: `
		<div
			class="v-select-stub"
			:aria-required="ariaRequired"
			:style="style"
		>
			<slot />
			<slot name="append" />
		</div>
	`,
})

config.global.stubs = config.global.stubs || {}
config.global.stubs.VSelect = VSelectStub

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproSelect> = {
	ariaRequired: {
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
	disabled: {
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
		type: Boolean,
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
	items: {
		type: Array as PropType<string[] | SelectItem[]>,
		required: true,
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
		type: [Object, Number, String] as PropType<SelectItem | number | string>,
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
	uniqueId: {
		type: String,
		required: true,
	},
	validateOn: {
		default: 'input',
		type: String as PropType<ValidateOnType>,
		validator(value: string): boolean {
			return ['lazy', 'blur', 'input', 'submit', 'blur lazy', 'input lazy', 'submit lazy', 'lazy blur', 'lazy input', 'lazy submit'].includes(value.toLowerCase())
		},
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproSelect> => ({
	items: [],
	label: 'Required label',
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproSelect> => ({
	ariaRequired: true,
	classes: 'modified-classes',
	clearable: true,
	disabled: true,
	fullWidthErrorMsg: true,
	globalMaxWidth: 'modified-global-max-width',
	globalMinWidth: 'modified-global-min-width',
	globalWidth: 'modified-global-width',
	hideErrorMessage: true,
	horizontal: true,
	inputMaxWidth: 'modified-input-max-width',
	inputMinWidth: 'modified-input-min-width',
	items: [
		{
			disabled: true,
			title: 'Modified item title 1',
			value: 'modified-item-value-1',
		},
		{
			title: 'Modified item title 2',
			value: 'modified-item-value-2',
		},
		{
			title: 'Modified item title 3',
			value: 'modified-item-value-3',
		},
	] as SelectItem[],
	label: 'Modified label',
	labelMaxWidth: 'modified-label-max-width',
	labelMinWidth: 'modified-label-min-width',
	modelValue: 'modified-value',
	placeholder: 'Modified placeholder',
	readonly: true,
	rules: [() => 'modified-rule'],
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproSelect)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproSelect', () => {
	let vueWrapper: VueWrapper<InstanceType<typeof AmeliproSelect>>
	const selectWrapper = () => vueWrapper.findComponent(VSelectStub)

	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Slots', () => {
		describe('label info', () => {
			it('renders correctly', () => {
				vueWrapper = shallowMount(AmeliproSelect, {
					props: modifiedPropValues(),
					slots: { labelInfo: '<div class="custom-label-info">Custom label info</div>' },
					global: {
						stubs: { VSelect: VSelectStub },
					},
				})
				expect(vueWrapper.find('.custom-label-info').text()).toEqual('Custom label info')
			})
		})

		describe('append', () => {
			it('renders correctly', () => {
				vueWrapper = mount(AmeliproSelect, {
					props: modifiedPropValues(),
					slots: { append: '<div class="append">Append outer</div>' },
					global: {
						stubs: { VSelect: VSelectStub },
					},
				})
				expect(vueWrapper.find('.append').text()).toEqual('Append outer')
			})
		})
	})

	describe('Setting props should update attributes of inner tags', () => {
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproSelect, { props: requiredPropValues() })
		})

		describe('main div', () => {
			it('prop ariaRequired sets display of span', async () => {
				expect(vueWrapper.findAll('.amelipro-select__label span').length).toBe(0)

				const { ariaRequired } = modifiedPropValues()
				await vueWrapper.setProps({ ariaRequired })
				expect(vueWrapper.findAll('.amelipro-select__label span').length).toBe(3)
			})

			it('prop horizontal sets attribute class', async () => {
				expect(vueWrapper.find('.amelipro-select__wrapper').attributes('class')).toBe('w-100 amelipro-select__wrapper d-flex flex-column')

				const { horizontal } = modifiedPropValues()
				await vueWrapper.setProps({ horizontal })
				expect(vueWrapper.find('.amelipro-select__wrapper').attributes('class')).toBe('w-100 amelipro-select__wrapper d-flex flex-column flex-md-row')
			})

			it('props globalMaxWidth, globalMinWidth & globalWidth set attribute style', async () => {
				if (vueWrapper.attributes('style')) {
					expect(vueWrapper.attributes('style')).not.toContain('max-width:')
					expect(vueWrapper.attributes('style')).not.toContain('min-width:')
				}

				const { globalMaxWidth, globalMinWidth, globalWidth } = modifiedPropValues()
				await vueWrapper.setProps({ globalMaxWidth, globalMinWidth, globalWidth })
				expect(vueWrapper.attributes('style')).toContain('margin-bottom: 12px; max-width: modified-global-max-width; min-width: modified-global-min-width;')
			})
		})

		describe('label wrapper', () => {
			it('prop horizontal sets attribute class', async () => {
				expect(vueWrapper.find('.amelipro-select__wrapper > div').classes()).not.toContain('mt-md-2')
				expect(vueWrapper.find('.amelipro-select__wrapper > div').classes()).not.toContain('mr-md-2')

				const { horizontal } = modifiedPropValues()
				await vueWrapper.setProps({ horizontal })
				expect(vueWrapper.find('.amelipro-select__wrapper > div').classes()).toContain('mt-md-2')
				expect(vueWrapper.find('.amelipro-select__wrapper > div').classes()).toContain('mr-md-2')
			})
		})

		describe('label', () => {
			it('prop uniqueId sets attributes id & for', async () => {
				expect(vueWrapper.find('.amelipro-select__label').attributes('id')).toBe('required-unique-id-label')
				expect(vueWrapper.find('.amelipro-select__label').attributes('for')).toBe('required-unique-id')

				await vueWrapper.setProps({ uniqueId: 'new-id' })
				expect(vueWrapper.find('.amelipro-select__label').attributes('id')).toBe('new-id-label')
				expect(vueWrapper.find('.amelipro-select__label').attributes('for')).toBe('new-id')
			})
			it('props labelMinWidth & labelMaxWidth set attribute style', async () => {
				expect(vueWrapper.find('.amelipro-select__label').attributes('style')).toBeUndefined()

				const { labelMinWidth, labelMaxWidth } = modifiedPropValues()
				await vueWrapper.setProps({ labelMinWidth, labelMaxWidth })
				expect(vueWrapper.find('.amelipro-select__label').attributes('style')).toBe('max-width: modified-label-max-width; min-width: modified-label-min-width;')
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		describe('VSelect', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproSelect, {
					props: requiredPropValues(),
					global: {
						stubs: { VSelect: VSelectStub },
					},
				})
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				expect(vueWrapper.findComponent(VSelectStub).props('id')).toBe(testHelper.default('uniqueId'))
				await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
				expect(vueWrapper.findComponent(VSelectStub).props('id')).toBe(testHelper.modified('uniqueId'))
			})

			it('prop clearable sets prop clearable', async () => {
				expect(vueWrapper.findComponent(VSelectStub).props('clearable')).toBe(testHelper.default('clearable'))
				await vueWrapper.setProps({ clearable: testHelper.modified('clearable') })
				expect(vueWrapper.findComponent(VSelectStub).props('clearable')).toBe(testHelper.modified('clearable'))
			})

			it('prop disabled sets prop disabled', async () => {
				expect(vueWrapper.findComponent(VSelectStub).props('disabled')).toBe(testHelper.default('disabled'))
				await vueWrapper.setProps({ disabled: testHelper.modified('disabled') })
				expect(vueWrapper.findComponent(VSelectStub).props('disabled')).toBe(testHelper.modified('disabled'))
			})

			it('prop hideErrorMessage sets prop hideDetails', async () => {
				expect(vueWrapper.findComponent(VSelectStub).props('hideDetails')).toBe(testHelper.default('hideErrorMessage'))
				await vueWrapper.setProps({ hideErrorMessage: testHelper.modified('hideErrorMessage') })
				expect(vueWrapper.findComponent(VSelectStub).props('hideDetails')).toBe(testHelper.modified('hideErrorMessage'))
			})

			it('prop items sets prop items', async () => {
				expect(vueWrapper.findComponent(VSelectStub).props('items')).toEqual(testHelper.default('items'))
				await vueWrapper.setProps({ items: testHelper.modified('items') })
				expect(vueWrapper.findComponent(VSelectStub).props('items')).toEqual(testHelper.modified('items'))
			})

			it('prop placeholder sets prop placeholder', async () => {
				expect(vueWrapper.findComponent(VSelectStub).props('placeholder')).toBe(testHelper.default('placeholder'))
				await vueWrapper.setProps({ placeholder: testHelper.modified('placeholder') })
				expect(vueWrapper.findComponent(VSelectStub).props('placeholder')).toBe(testHelper.modified('placeholder'))
			})

			it('prop readonly sets prop readonly', async () => {
				expect(vueWrapper.findComponent(VSelectStub).props('readonly')).toBe(testHelper.default('readonly'))
				await vueWrapper.setProps({ readonly: testHelper.modified('readonly') })
				expect(vueWrapper.findComponent(VSelectStub).props('readonly')).toBe(testHelper.modified('readonly'))
			})

			it('prop ariaRequired sets attribute aria-required', async () => {
				expect(vueWrapper.findComponent(VSelectStub).attributes('aria-required')).toBe('false')
				await vueWrapper.setProps({ ariaRequired: testHelper.modified('ariaRequired') })
				expect(vueWrapper.findComponent(VSelectStub).attributes('aria-required')).toBe('true')
			})

			it('props inputMinWidth & inputMaxWidth set attribute style', async () => {
				expect(vueWrapper.findComponent(VSelectStub).attributes('style')).toBeUndefined()
				await vueWrapper.setProps({
					inputMinWidth: testHelper.modified('inputMinWidth'),
					inputMaxWidth: testHelper.modified('inputMaxWidth'),
				})
				expect(vueWrapper.findComponent(VSelectStub).attributes('style')).toBe(`max-width: ${testHelper.modified('inputMaxWidth')}; min-width: ${testHelper.modified('inputMinWidth')};`)
			})

			it('props ariaRequired & rules set prop rules', async () => {
				expect(vueWrapper.findComponent(VSelectStub).props('rules')).toEqual([])
				await vueWrapper.setProps({ ariaRequired: testHelper.modified('ariaRequired') })
				expect(vueWrapper.findComponent(VSelectStub).props('rules')).toEqual(['mocked-is-required'])
			})
		})
	})

	describe('should react to child component events', () => {
		beforeEach(() => {
			vueWrapper = mount(AmeliproSelect, { props: modifiedPropValues() })
		})

		describe('VSelect', () => {
			it.skip('should react to blur/focus event', async () => {
				// focused est inutilisé
				expect(vueWrapper.attributes('???')).toBe('???')
				await selectWrapper().vm.$emit('focus')
				expect(vueWrapper.attributes('???')).toBe('???')
				await selectWrapper().vm.$emit('blur')
				expect(vueWrapper.attributes('???')).toBe('???')
			})
		})
	})

	describe.skip('Getters', () => {
		it('displays error message when input is invalid', async () => {
			const uniqueId = 'test-id'
			vueWrapper = mount(AmeliproSelect, {
				props: {
					items: [{ title: 'option 1', value: 'Option1' }],
					label: 'Mon Label',
					rules: [isRequired],
					uniqueId,
				},
			})
			await vueWrapper.vm.$nextTick()
			const errorId = `${vueWrapper.props().uniqueId}-error`
			expect(errorId).toBe(`${uniqueId}-error`)
		})
		it('computes bgColor correctly based on props', () => {
			vueWrapper = mount(AmeliproSelect, {
				props: {
					ariaRequired: true,
					bgWhite: true,
					disabled: true,
					items: [{ title: 'option 1', value: 'Option1' }],
					label: 'My Label',
					readonly: false,
					uniqueId: 'exampleId',
				},
			})
			expect((vueWrapper.vm as unknown as { bgColor: string }).bgColor).toStrictEqual('#EEEEEE')
		})

		it('renders slot content correctly', () => {
			vueWrapper = mount(AmeliproSelect, {
				propsData: {
					items: [{ title: 'option 1', value: 'Option1' }],
					label: 'Mon Label',
					uniqueId: 'modified-unique-id',
				},
				slots: { labelInfo: '<div class="custom-label-info">Custom Label Info</div>' },
			})
			const labelInfoNameSelector = vueWrapper.find('.custom-label-info')
			expect(labelInfoNameSelector.text()).toEqual('Custom Label Info')
		})
	})
})
