import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproAutoCompleteField from '../AmeliproAutoCompleteField.vue'
import type { AutoCompleteItem } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import { defineComponent, h, type PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import type { ValidateOnType } from '../../types'
import type { ValidationRule } from '@/utils/rules/types'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproAutoCompleteField> = {
	required: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: undefined,
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
	items: {
		type: Array as PropType<AutoCompleteItem[]>,
		default: () => [],
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
		type: [String, Object] as PropType<string | object>,
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
		default: undefined,
		type: String as PropType<ValidateOnType>,
		validator(value: string): boolean {
			return ['lazy', 'blur', 'input', 'submit', 'blur lazy', 'input lazy', 'submit lazy', 'lazy blur', 'lazy input', 'lazy submit'].includes(value.toLowerCase())
		},
	},
}

const items = (): AutoCompleteItem[] => ([
	{
		disabled: true,
		title: 'Item title 1',
		value: 'item-value-1',
	},
	{
		title: 'Item title 2',
		value: 'item-value-2',
	},
	{
		title: 'Item title 3',
		value: 'item-value-3',
	},
	{
		title: 'Item title 4',
		value: 'item-value-4',
	},
])

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproAutoCompleteField> => ({
	label: 'Required label',
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproAutoCompleteField> => ({
	required: true,
	classes: 'modified-classes',
	disabled: true,
	globalMaxWidth: 'modified-global-max-width',
	globalMinWidth: 'modified-global-min-width',
	// Non pris en compte pour "width" si valeur non valide. Avec var() ça passe...
	globalWidth: 'var(--modified-global-width)',
	hideErrorMessage: true,
	horizontal: true,
	inputMaxWidth: 'modified-input-max-width',
	inputMinWidth: 'modified-input-min-width',
	items: items(),
	label: 'Modified label',
	labelMaxWidth: 'modified-label-max-width',
	labelMinWidth: 'modified-label-min-width',
	modelValue: 'modified-model-value',
	placeholder: 'Modified placeholder',
	readonly: true,
	rules: [() => 'modified-rules'],
	uniqueId: 'modified-unique-id',
	validateOn: 'lazy',
})

// Mock VAutocomplete pour éviter la logique d'attache DOM de Vuetify
const VAutocompleteMock = defineComponent({
	name: 'VAutocomplete',
	setup() {
		return () => h('v-autocomplete-stub')
	},
})

const testHelper = new TestHelper(AmeliproAutoCompleteField)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)
	.setMountOptions({ global: { stubs: { VAutocomplete: VAutocompleteMock } } })

describe('AmeliproAutoCompleteField', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproAutoCompleteField>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproAutoCompleteField, {
				props: requiredPropValues(), global: {
					stubs: { VAutocomplete: VAutocompleteMock },
				},
			})
		})

		describe('root', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBe('required-unique-id-container')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe('modified-unique-id-container')
			})

			it('props horizontal & classes set attribute class', async () => {
				expect(vueWrapper.attributes('class')).toBe('d-flex flex-column amelipro-autocomplete')

				const { classes, horizontal } = modifiedPropValues()
				await vueWrapper.setProps({ horizontal })
				expect(vueWrapper.attributes('class')).toBe('d-flex flex-column amelipro-autocomplete flex-md-row')

				await vueWrapper.setProps({ classes })
				expect(vueWrapper.attributes('class')).toBe('d-flex flex-column amelipro-autocomplete flex-md-row modified-classes')
			})

			it('props globalMaxWidth, globalMinWidth & globalWidth set attribute style', async () => {
				expect(vueWrapper.attributes('class')).toBe('d-flex flex-column amelipro-autocomplete')

				const { globalMaxWidth, globalMinWidth, globalWidth } = modifiedPropValues()
				await vueWrapper.setProps({ globalMaxWidth })
				expect(vueWrapper.attributes('style')).toBe('max-width: modified-global-max-width;')

				await vueWrapper.setProps({ globalMinWidth })
				expect(vueWrapper.attributes('style')).toBe('max-width: modified-global-max-width; min-width: modified-global-min-width;')

				await vueWrapper.setProps({ globalWidth })
				expect(vueWrapper.attributes('style')).toBe('max-width: modified-global-max-width; min-width: modified-global-min-width; width: var(--modified-global-width);')
			})
		})

		describe('label wrapper', () => {
			it('prop horizontal sets attribute class', async () => {
				expect(vueWrapper.find('.amelipro-autocomplete__label-wrapper').classes('mt-md-2')).toBe(false)
				expect(vueWrapper.find('.amelipro-autocomplete__label-wrapper').classes('mr-md-2')).toBe(false)

				const { horizontal } = modifiedPropValues()
				await vueWrapper.setProps({ horizontal })
				expect(vueWrapper.find('.amelipro-autocomplete__label-wrapper').classes('mt-md-2')).toBe(true)
				expect(vueWrapper.find('.amelipro-autocomplete__label-wrapper').classes('mr-md-2')).toBe(true)
			})
		})

		describe('label', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-autocomplete__label').attributes('id')).toBe('required-unique-id-label')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-autocomplete__label').attributes('id')).toBe('modified-unique-id-label')
			})

			it('prop horizontal sets attribute class', async () => {
				expect(vueWrapper.find('.amelipro-autocomplete__label').classes('mr-md-2')).toBe(false)

				const { horizontal } = modifiedPropValues()
				await vueWrapper.setProps({ horizontal })
				expect(vueWrapper.find('.amelipro-autocomplete__label').classes('mr-md-2')).toBe(true)
			})

			it('prop uniqueId sets attribute for', async () => {
				expect(vueWrapper.find('.amelipro-autocomplete__label').attributes('for')).toBe('required-unique-id')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-autocomplete__label').attributes('for')).toBe('modified-unique-id')
			})

			it('props labelMaxWidth & labelMinWidth set attribute style', async () => {
				expect(vueWrapper.find('.amelipro-autocomplete__label').attributes('style')).toBeUndefined()

				const { labelMaxWidth, labelMinWidth } = modifiedPropValues()
				await vueWrapper.setProps({ labelMaxWidth })
				expect(vueWrapper.find('.amelipro-autocomplete__label').attributes('style')).toBe('max-width: modified-label-max-width;')

				await vueWrapper.setProps({ labelMinWidth })
				expect(vueWrapper.find('.amelipro-autocomplete__label').attributes('style')).toBe('max-width: modified-label-max-width; min-width: modified-label-min-width;')
			})

			it('props label & required set label content', async () => {
				expect(vueWrapper.find('.amelipro-autocomplete__label').text()).toBe('Required label')

				const { label, required } = modifiedPropValues()
				await vueWrapper.setProps({ label })
				expect(vueWrapper.find('.amelipro-autocomplete__label').text()).toBe('Modified label')

				await vueWrapper.setProps({ required })
				expect(vueWrapper.find('.amelipro-autocomplete__label').text()).toBe('Modified label   *   Champ obligatoire')
			})
		})
	})

	describe.todo('Setting props should update props or attributes of inner components')

	describe.todo('Events')

	describe.todo('Slots')
})
