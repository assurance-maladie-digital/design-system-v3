import { DOMWrapper, mount, shallowMount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproCheckboxGroup from '../AmeliproCheckboxGroup.vue'
import type { AmeliproCheckboxGroupItem } from '../types'
import { AmeliproMessage } from '@/components'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import { attachToApp } from '@tests/helpers/utils'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproCheckboxGroup> = {
	required: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	fullHorizontal: {
		type: Boolean,
		default: false,
	},
	groupLabel: {
		type: String,
		required: true,
	},
	hiddenLabel: {
		type: Boolean,
		default: false,
	},
	horizontal: {
		type: Boolean,
		default: false,
	},
	horizontalLabel: {
		type: Boolean,
		default: false,
	},
	modelValue: {
		type: Array as PropType<AmeliproCheckboxGroupItem[]>,
		required: true,
	},
	multipleRequired: {
		type: Boolean,
		default: false,
	},
	multipleRequiredErrorMessage: {
		type: String,
		default: 'Vous devez cocher au moins deux options',
	},
	pills: {
		type: Boolean,
		default: false,
	},
	requiredErrorMessage: {
		type: String,
		default: 'Sélection obligatoire',
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproCheckboxGroup> => ({
	groupLabel: 'required-group-label',
	modelValue: [{
		isChecked: true,
		label: 'Required item label',
		value: 'required-item-value',
	}],
	multipleRequired: false,
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproCheckboxGroup> => ({
	required: true,
	disabled: true,
	fullHorizontal: true,
	groupLabel: 'Modified group label',
	horizontal: true,
	horizontalLabel: true,
	modelValue: [
		{
			description: 'Modified item description 1',
			disabled: false,
			isChecked: false,
			label: 'Modified item label 1',
			value: 'modified-item-value-1',
		},
		{
			description: 'Modified item description 2',
			disabled: false,
			isChecked: true,
			label: 'Modified item label 2',
			value: 'modified-item-value-2',
		},
		{
			description: 'Modified item description 3',
			disabled: false,
			isChecked: true,
			label: 'Modified item label 3',
			value: 'modified-item-value-3',
		},
	],
	multipleRequired: true,
	multipleRequiredErrorMessage: 'Modified multiple required error message',
	pills: true,
	requiredErrorMessage: 'Modified required error message',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproCheckboxGroup)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproCheckboxGroup', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		describe('Checkbox group', () => {
			let vueWrapper: VueWrapper<InstanceType<typeof AmeliproCheckboxGroup>>

			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproCheckboxGroup, { props: requiredPropValues() })
			})

			it('should have the default classes', () => {
				expect(vueWrapper.find('.amelipro-checkbox-group').attributes('class'))
					.toBe('amelipro-checkbox-group d-flex flex-column classic')
			})

			it('prop fullHorizontal sets attribute class', async () => {
				await vueWrapper.setProps({ fullHorizontal: true })
				expect(vueWrapper.find('.amelipro-checkbox-group').attributes('class'))
					.toBe('amelipro-checkbox-group d-flex flex-column flex-md-row align-md-start classic')
			})

			it('prop horizontalLabel sets attribute class', async () => {
				await vueWrapper.setProps({ horizontalLabel: true })
				expect(vueWrapper.find('.amelipro-checkbox-group').attributes('class'))
					.toBe('amelipro-checkbox-group d-flex flex-column flex-md-row align-md-start classic')
			})

			it('prop pills sets attribute class', async () => {
				await vueWrapper.setProps({ pills: true })
				expect(vueWrapper.find('.amelipro-checkbox-group').attributes('class'))
					.toBe('amelipro-checkbox-group d-flex flex-column pills')
			})
		})

		describe('Checkbox group wrapper', () => {
			let vueWrapper: VueWrapper<InstanceType<typeof AmeliproCheckboxGroup>>

			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproCheckboxGroup, { props: requiredPropValues() })
			})

			it('should have the default class', () => {
				expect(vueWrapper.find('.amelipro-checkbox-group__wrapper').attributes('class'))
					.toBe('amelipro-checkbox-group__wrapper')
			})

			it('should update class when pills is true', async () => {
				await vueWrapper.setProps({ pills: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__wrapper').attributes('class'))
					.toBe('amelipro-checkbox-group__wrapper mt-2')
			})

			it('should update class when fullHorizontal is true', async () => {
				await vueWrapper.setProps({ fullHorizontal: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__wrapper').attributes('class'))
					.toBe('amelipro-checkbox-group__wrapper mt-1 mt-md-0')
			})

			it('should update class when fullHorizontal and pills are true', async () => {
				await vueWrapper.setProps({ fullHorizontal: true, pills: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__wrapper').attributes('class'))
					.toBe('amelipro-checkbox-group__wrapper mt-2')
			})

			it('should update class when horizontal is true', async () => {
				await vueWrapper.setProps({ horizontal: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__wrapper').attributes('class'))
					.toBe('amelipro-checkbox-group__wrapper')
			})

			it('should update class when horizontal and pills are true', async () => {
				await vueWrapper.setProps({ horizontal: true, pills: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__wrapper').attributes('class'))
					.toBe('amelipro-checkbox-group__wrapper mt-2')
			})
		})

		describe('Checkbox group list', () => {
			let vueWrapper: VueWrapper<InstanceType<typeof AmeliproCheckboxGroup>>

			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproCheckboxGroup, { props: requiredPropValues() })
			})

			it('should have the default class', () => {
				expect(vueWrapper.find('.amelipro-checkbox-group__list').attributes('class'))
					.toBe('d-flex flex-wrap list-style-none amelipro-checkbox-group__list flex-column')
			})

			it('should update class when pills is true', async () => {
				await vueWrapper.setProps({ pills: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__list').attributes('class'))
					.toBe('d-flex flex-wrap list-style-none amelipro-checkbox-group__list')
			})

			it('should update class when fullHorizontal is true', async () => {
				await vueWrapper.setProps({ fullHorizontal: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__list').attributes('class'))
					.toBe('d-flex flex-wrap list-style-none amelipro-checkbox-group__list flex-column flex-md-row align-md-center')
			})

			it('should update class when fullHorizontal and pills are true', async () => {
				await vueWrapper.setProps({ fullHorizontal: true, pills: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__list').attributes('class'))
					.toBe('d-flex flex-wrap list-style-none amelipro-checkbox-group__list flex-md-row align-md-center')
			})

			it('should update class when horizontal is true', async () => {
				await vueWrapper.setProps({ horizontal: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__list').attributes('class'))
					.toBe('d-flex flex-wrap list-style-none amelipro-checkbox-group__list flex-column flex-md-row align-md-center')
			})

			it('should update class when horizontal and pills are true', async () => {
				await vueWrapper.setProps({ horizontal: true, pills: true })
				expect(vueWrapper.find('.amelipro-checkbox-group__list').attributes('class'))
					.toBe('d-flex flex-wrap list-style-none amelipro-checkbox-group__list flex-md-row align-md-center')
			})
		})
	})

	describe('classes', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproCheckboxGroup>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproCheckboxGroup, {
				props: {
					...requiredPropValues(),
					modelValue: modifiedPropValues().modelValue,
				},
			})
		})

		it('should update checkbox label classes', async () => {
			const labelWrappers = vueWrapper.findAll('.amelipro-checkbox-group__item-input .checkbox-label')
			expect(labelWrappers.at(0)?.attributes('class')).toContain('text-ap-grey-darken-1')

			await vueWrapper.setProps({ disabled: true })
			expect(labelWrappers.at(0)?.attributes('class')).toContain('text-ap-grey')

			await vueWrapper.setProps({ disabled: false, required: true })
			await vueWrapper.findAll('.amelipro-checkbox-group__item-input').at(1)?.trigger('click')
			await vueWrapper.findAll('.amelipro-checkbox-group__item-input').at(2)?.trigger('click')
			expect(labelWrappers.at(1)?.attributes('class')).toContain('checkbox-label text-ap-red amelipro-checkbox-group__item-label-span-error')
		})

		it('should update checkbox label classes with pills version', async () => {
			await vueWrapper.setProps({ pills: true })
			const labelWrappers = vueWrapper.findAll('.amelipro-checkbox-group__item-input .checkbox-label')
			expect(labelWrappers.at(0)?.attributes('class')).toContain('text-ap-blue-darken-1')

			await vueWrapper.setProps({ disabled: true })
			expect(labelWrappers.at(0)?.attributes('class')).toContain('text-ap-grey-darken-1')

			await vueWrapper.setProps({ disabled: false, required: true })
			await vueWrapper.findAll('.amelipro-checkbox-group__item-input').at(1)?.trigger('click')
			await vueWrapper.findAll('.amelipro-checkbox-group__item-input').at(2)?.trigger('click')
			expect(labelWrappers.at(0)?.attributes('class')).toContain('checkbox-label text-ap-red amelipro-checkbox-group__item-label-span-error')
		})
	})

	describe.todo('Setting props should update props or attributes of inner components')

	// TODO: n'a pas le comportement attendu, probablement à cause de slotSubItem (ne réagit pas aux changements de props ?)
	describe.skip('Slots', () => {
		const vueWrapper = mount(AmeliproCheckboxGroup, {
			attachTo: attachToApp(),
			props: requiredPropValues(),
			slots: {
				'subItem-0': '<p>subItem 0</p>',
				'subItem-1': '<p>subItem 1</p>',
			},
			// stubs: { AmeliproMessage },
		})
		const inputWrappers = () => vueWrapper.findAll('.amelipro-checkbox-group__item__label input')

		it('should test slots and aria-controls', async () => {
			const subItemsWrapper = (index: number) => vueWrapper.find(`#test-id-subitem-${index}`)

			// Default state
			expect(subItemsWrapper(0).exists()).toBe(false)
			expect(inputWrappers().at(0)?.attributes('aria-controls')).toBe('uniqueId-subitem-0')

			// test case for item with slot but fullHorizontal or Horizontal is true
			await vueWrapper.setProps({ fullHorizontal: true })
			// => slotSubItem = false => no sub-items, no aria-controls
			expect(subItemsWrapper(0).exists()).toBe(false)
			// expect(inputWrappers().at(0)?.attributes('aria-controls')).toBeUndefined(); // => Ne retourne pas la valeur attendue

			// test case for checked item with slot
			await vueWrapper.setProps({ fullHorizontal: false })
			expect(subItemsWrapper(0).exists()).toBe(true)
			expect(inputWrappers().at(0)?.attributes('aria-controls')).toBe('test-id-subitem-0')
			// test case for item which is not checked
			expect(subItemsWrapper(1).exists()).toBe(false)
			expect(inputWrappers().at(1)?.attributes('aria-controls')).toBe('test-id-subitem-1')
			// test case for item without slot
			expect(subItemsWrapper(2).exists()).toBe(false)
			expect(inputWrappers().at(2)?.attributes('aria-controls')).toBeUndefined()
		})
	})

	// TODO: n'a pas le comportement attendu, probablement à cause de slotSubItem (ne réagit pas aux changements de props ?)
	describe.skip('attributes', () => {
		const vueWrapper = shallowMount(AmeliproCheckboxGroup, {
			props: modifiedPropValues(),
			slots: {
				'subItem-0': '<p>subItem 0</p>',
				'subItem-1': '<p>subItem 1</p>',
			},
		})
		const inputWrappers = () => vueWrapper.findAll('.amelipro-checkbox-group__item__label input')

		it('should test aria-expanded value', () => {
			// test case for item slot opened
			expect(inputWrappers().at(0)?.attributes('aria-expanded')).toBe('true')
			// test case for item slot closed
			expect(inputWrappers().at(1)?.attributes('aria-expanded')).toBe('false')
			// test case for item without slot
			expect(inputWrappers().at(2)?.attributes('aria-expanded')).toBe(undefined)
		})
	})

	// skip this because there is an error "Cannot read property 'addApp' of null" we don't know where is this property 'addApp'
	// we tested with console.log and it seems to work well but the error is still here
	describe.skip('errors', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproCheckboxGroup>>
		let inputWrappers: DOMWrapper<HTMLInputElement>[]

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproCheckboxGroup, {
				props: modifiedPropValues(),
				slots: {
					'subItem-0': '<p>subItem 0</p>',
					'subItem-1': '<p>subItem 1</p>',
				},
			})

			inputWrappers = vueWrapper.findAll('.amelipro-checkbox-group__item__label input')
		})

		it('should display error message (single)', async () => {
			let componentWrapper = vueWrapper.findComponent(AmeliproMessage)
			expect(componentWrapper.exists()).toBe(false)

			await vueWrapper.setProps({ required: true })

			inputWrappers.at(1)?.trigger('input')
			inputWrappers.at(2)?.trigger('input')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('change:selected')).toStrictEqual([
				[[{
					description: 'the item description 3',
					disabled: false,
					isChecked: true,
					label: 'the item label 3',
					value: 'the-item-value-3',
				}]],
				[[]],
			])
			componentWrapper = vueWrapper.findComponent(AmeliproMessage)

			expect(inputWrappers.at(0)?.attributes('aria-describedby')).toBe('the-group-id-error the item description 1')
			expect(inputWrappers.at(1)?.attributes('aria-describedby')).toBe('the-group-id-error the item description 2')
			expect(inputWrappers.at(2)?.attributes('aria-describedby')).toBe('the-group-id-error the item description 3')
			expect(componentWrapper.exists()).toBe(true)
			expect(componentWrapper.find('.mb-0').text()).toBe('Sélection obligatoire')
		})

		it('should display error message (multiple)', async () => {
			let componentWrapper = vueWrapper.findComponent(AmeliproMessage)
			expect(componentWrapper.exists()).toBe(false)

			await vueWrapper.setProps({ multipleRequired: true })

			inputWrappers.at(1)?.trigger('input')
			await vueWrapper.vm.$nextTick()

			expect(vueWrapper.emitted('change:selected')).toStrictEqual([[{
				description: 'the item description 3',
				disabled: false,
				isChecked: true,
				label: 'the item label 3',
				value: 'the-item-value-3',
			}]])
			componentWrapper = vueWrapper.findComponent(AmeliproMessage)

			expect(inputWrappers.at(0)?.attributes('aria-describedby')).toBe('the-group-id-error the item description 1')
			expect(inputWrappers.at(1)?.attributes('aria-describedby')).toBe('the-group-id-error the item description 2')
			expect(inputWrappers.at(2)?.attributes('aria-describedby')).toBe('the-group-id-error the item description 3')
			expect(componentWrapper.exists()).toBe(true)
			expect(componentWrapper.find('.mb-0').text()).toBe('Vous devez cocher au moins deux options')
		})
	})
})
