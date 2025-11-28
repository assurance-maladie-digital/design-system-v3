import { AmeliproIcon, AmeliproMessage } from '@/components'
import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproIllustratedRadioGroup from '../AmeliproIllustratedRadioGroup.vue'
import type { AmeliproIllustratedRadioGroupItem } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproIllustratedRadioGroup> = {
	ariaRequired: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	error: {
		type: Boolean,
		default: false,
	},
	groupLabel: {
		type: String,
		required: true,
	},
	iconSize: {
		type: String,
		default: '40px',
	},
	modelValue: {
		type: Array as PropType<AmeliproIllustratedRadioGroupItem[]>,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

const ameliproIllustratedRadioGroupItemDatas = (): AmeliproIllustratedRadioGroupItem[] => [
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-yellow',
		isChecked: false,
		label: 'the item label 1',
		value: 'the-item-value-1',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-green',
		isChecked: false,
		label: 'the item label 2',
		value: 'the-item-value-2',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-red',
		isChecked: false,
		label: 'the item label 3',
		value: 'the-item-value-3',
	},
]

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproIllustratedRadioGroup> => ({
	groupLabel: 'Required group label',
	modelValue: [],
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproIllustratedRadioGroup> => ({
	ariaRequired: true,
	disabled: true,
	error: true,
	groupLabel: 'Modified group label',
	iconSize: 'modified-icon-size',
	modelValue: ameliproIllustratedRadioGroupItemDatas(),
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproIllustratedRadioGroup)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproIllustratedRadioGroup', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIllustratedRadioGroup>>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBe('required-unique-id-container')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe('modified-unique-id-container')
			})
		})

		describe('label wrapper', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__label-wrapper').attributes('id')).toBe('required-unique-id-label-group')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__label-wrapper').attributes('id')).toBe('modified-unique-id-label-group')
			})
		})

		describe('label', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__label').attributes('id')).toBe('required-unique-id')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__label').attributes('id')).toBe('modified-unique-id')
			})

			it('prop ariaRequired & groupLabel sets label content', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__label').text()).toBe('Required group label')

				const { ariaRequired, groupLabel } = modifiedPropValues()
				await vueWrapper.setProps({ groupLabel })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__label').text()).toBe('Modified group label')

				await vueWrapper.setProps({ ariaRequired })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__label').text()).toBe('Modified group label   *   Champ obligatoire')
			})
		})

		describe('group', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute aria-labelledby', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__group').attributes('aria-labelledby')).toBe('required-unique-id')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__group').attributes('aria-labelledby')).toBe('modified-unique-id')
			})

			it('prop ariaRequired sets attribute aria-required', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__group').attributes('aria-required')).toBe('false')

				const { ariaRequired } = modifiedPropValues()
				await vueWrapper.setProps({ ariaRequired })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__group').attributes('aria-required')).toBe('true')
			})
		})

		describe('list', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__list').attributes('id')).toBe('required-unique-id-list')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__list').attributes('id')).toBe('modified-unique-id-list')
			})
		})

		describe('item', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, { props: requiredPropValues() })
			})

			it('prop modelValue sets items', async () => {
				expect(vueWrapper.findAll('.amelipro-illustrated-radio-group__item').length).toBe(0)

				const { modelValue } = modifiedPropValues()
				await vueWrapper.setProps({ modelValue })
				expect(vueWrapper.findAll('.amelipro-illustrated-radio-group__item').length).toBe(3)
			})

			it('prop uniqueId sets attribute id', async () => {
				const { modelValue, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ modelValue })

				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item').attributes('id')).toBe('required-unique-id-item-0')

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item').attributes('id')).toBe('modified-unique-id-item-0')
			})
		})

		describe('item label', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, {
					props: {
						...requiredPropValues(),
						modelValue: modifiedPropValues().modelValue,
					},
				})
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item label').attributes('id')).toBe('required-unique-id-label-0')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item label').attributes('id')).toBe('modified-unique-id-label-0')
			})
		})

		describe('item input', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, {
					props: {
						...requiredPropValues(),
						modelValue: modifiedPropValues().modelValue,
					},
				})
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('id')).toBe('required-unique-id-input-0')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('id')).toBe('modified-unique-id-input-0')
			})

			it('prop modelValue[n].isChecked sets attribute aria-checked', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('aria-checked')).toBe('false')

				const { modelValue } = modifiedPropValues()
				modelValue[0].isChecked = true
				await vueWrapper.setProps({ modelValue })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('aria-checked')).toBe('true')
			})

			it('props ariaRequired, error & uniqueId set attribute aria-describedby', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('aria-describedby')).toBeUndefined()

				const { ariaRequired, error, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ ariaRequired, error })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('aria-describedby')).toBe('required-unique-id-error')

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('aria-describedby')).toBe('modified-unique-id-error')

				await vueWrapper.setProps({ error: false })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('aria-describedby')).toBeUndefined()
			})

			it('prop modelValue[n].isChecked sets attribute checked', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('checked')).toBeUndefined()

				const { modelValue } = modifiedPropValues()
				modelValue[0].isChecked = true
				await vueWrapper.setProps({ modelValue })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('checked')).toBe('')
			})

			it('props disabled & modelValue[n].disabled sets attribute disabled', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('disabled')).toBeUndefined()

				const { disabled, modelValue } = modifiedPropValues()
				await vueWrapper.setProps({ disabled })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('disabled')).toBe('')

				await vueWrapper.setProps({ disabled: false })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('disabled')).toBeUndefined()

				modelValue[0].disabled = true
				await vueWrapper.setProps({ modelValue })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('disabled')).toBe('')
			})

			it('prop uniqueId sets attribute name', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('name')).toBe('required-unique-id-name')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('name')).toBe('modified-unique-id-name')
			})

			it('prop ariaRequired sets attribute required', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('required')).toBeUndefined()

				const { ariaRequired } = modifiedPropValues()
				await vueWrapper.setProps({ ariaRequired })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('required')).toBe('')
			})

			it('props modelValue[n].value sets attribute value', async () => {
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('value')).toBe('the-item-value-1')

				const { modelValue } = modifiedPropValues()
				modelValue[0].value = 'New value'
				await vueWrapper.setProps({ modelValue })
				expect(vueWrapper.find('.amelipro-illustrated-radio-group__item input').attributes('value')).toBe('New value')
			})
		})

		describe('item icon radio wrapper', () => {
			const finder = () => vueWrapper.find('.amelipro-illustrated-radio-group__item .icon-radio__wrapper')
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, {
					props: {
						...requiredPropValues(),
						modelValue: modifiedPropValues().modelValue,
					},
				})
			})

			it('prop modelValue[n].isChecked sets attribute checked', async () => {
				expect(finder().classes('bg-ap-blue-darken-1')).toBe(false)
				expect(finder().classes('bg-ap-blue-lighten-3')).toBe(true)

				const { modelValue } = modifiedPropValues()
				modelValue[0].isChecked = true
				await vueWrapper.setProps({ modelValue })
				expect(finder().classes('bg-ap-blue-darken-1')).toBe(true)
				expect(finder().classes('bg-ap-blue-lighten-3')).toBe(false)
			})
		})

		describe('item label text', () => {
			const finder = () => vueWrapper.find('.amelipro-illustrated-radio-group__item .amelipro-illustrated-radio-group__item-label-text')
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, {
					props: {
						...requiredPropValues(),
						modelValue: modifiedPropValues().modelValue,
					},
				})
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(finder().attributes('id')).toBe('required-unique-id-label-text-0')

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(finder().attributes('id')).toBe('modified-unique-id-label-text-0')
			})

			it('prop modelValue[n].isChecked sets attribute checked', async () => {
				expect(finder().classes('text-ap-white')).toBe(false)
				expect(finder().classes('text-ap-blue-darken-1')).toBe(true)

				const { modelValue } = modifiedPropValues()
				modelValue[0].isChecked = true
				await vueWrapper.setProps({ modelValue })
				expect(finder().classes('text-ap-white')).toBe(true)
				expect(finder().classes('text-ap-blue-darken-1')).toBe(false)
			})

			it('prop modelValue[n].label sets label content', async () => {
				expect(finder().text()).toBe('the item label 1')

				const { modelValue } = modifiedPropValues()
				modelValue[0].label = 'New item label'
				await vueWrapper.setProps({ modelValue })
				expect(finder().text()).toBe('New item label')
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIllustratedRadioGroup>>

		describe('AmeliproIcon', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, {
					props: {
						...requiredPropValues(),
						modelValue: modifiedPropValues().modelValue,
					},
				})
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-icon-0`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproIcon).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-icon-0`)
			})

			it('prop modelValue[n].icon sets prop icon', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('icon')).toBe('vaccination')

				const { modelValue } = modifiedPropValues()
				modelValue[0].icon = 'new-icon'
				await vueWrapper.setProps({ modelValue })
				expect(vueWrapper.findComponent(AmeliproIcon).props('icon')).toBe('new-icon')
			})

			it('prop modelValue[n].isChecked sets prop iconColor', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('ap-yellow')

				const { modelValue } = modifiedPropValues()
				modelValue[0].isChecked = true
				await vueWrapper.setProps({ modelValue })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('ap-white')
			})

			it('prop iconSize sets prop size', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('size')).toBe(testHelper.default('iconSize'))

				const { iconSize } = modifiedPropValues()
				await vueWrapper.setProps({ iconSize })
				expect(vueWrapper.findComponent(AmeliproIcon).props('size')).toBe(testHelper.modified('iconSize'))
			})
		})

		describe('AmeliproMessage', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIllustratedRadioGroup, { props: requiredPropValues() })
			})

			it('props ariaRequired, error & modelValue set AmeliproMessage visibility', async () => {
				expect(vueWrapper.findComponent(AmeliproMessage).exists()).toBe(false)

				const { ariaRequired, error, modelValue } = modifiedPropValues()
				await vueWrapper.setProps({ ariaRequired, error })
				expect(vueWrapper.findComponent(AmeliproMessage).exists()).toBe(true)

				await vueWrapper.setProps({ modelValue, error: false })
				expect(vueWrapper.findComponent(AmeliproMessage).exists()).toBe(false)
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				const { ariaRequired, error, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ ariaRequired, error })

				expect(vueWrapper.findComponent(AmeliproMessage).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-error`)

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproMessage).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-error`)
			})
		})
	})

	// describe.skip('Slots', () => {
	//	describe.todo('#labelInfo')
	// })

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIllustratedRadioGroup>>
		const inputWrappers = () => vueWrapper.findAll('input')

		beforeEach(() => {
			vueWrapper = mount(AmeliproIllustratedRadioGroup, { props: modifiedPropValues() })
		})

		it('should test the input vueWrapper', () => {
			expect(inputWrappers().length).toBe(3)
		})

		// TODO: réparer ces tests. trigger('input') ne semble plus fonctionner
		it.skip('should react to input event', async () => {
			expect(vueWrapper.emitted('change:selected')).toBeUndefined()
			expect(inputWrappers().at(0)?.exists()).toBe(true)

			await inputWrappers().at(0)?.trigger('input')
			expect(vueWrapper.emitted('change:selected')).toStrictEqual([[
				'the-item-value-1',
			]])

			await inputWrappers().at(1)?.trigger('input')
			expect(vueWrapper.emitted('change:selected')).toStrictEqual([[
				'the-item-value-1',
			], [
				'the-item-value-2',
			]])
		})
	})
})
