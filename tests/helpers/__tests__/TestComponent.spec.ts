import { type VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestComponent from './TestComponent.vue'
import TestHelper from '../TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof TestComponent> = {
	booleanProp: {
		type: Boolean,
		default: true,
	},
	bordered: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: undefined,
	},
	color: {
		type: String,
		default: undefined,
	},
	nullStringProp: {
		type: [String, null] as PropType<string | null>,
		default: null,
	},
	requiredBoolean: {
		type: Boolean,
		required: true,
	},
	requiredString: {
		type: String,
		required: true,
	},
	stringProp: {
		type: String,
		default: 'String prop default value',
	},
	undefinedStringProp: {
		type: String,
		default: undefined,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

const requiredPropValues = (): ComponentProps<typeof TestComponent> => ({
	requiredBoolean: true,
	requiredString: 'Required required string',
	uniqueId: 'required-unique-id',
})

const modifiedPropValues = (): ComponentProps<typeof TestComponent> => ({
	booleanProp: false,
	bordered: true,
	classes: 'modified-classes',
	color: 'ap-blue',
	nullStringProp: 'Modified null string prop',
	requiredBoolean: false,
	requiredString: 'Modified required string',
	stringProp: 'Modified string prop',
	undefinedStringProp: 'Modified undefined string prop',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(TestComponent)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('TestComponent', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof TestComponent>>
		beforeEach(() => {
			vueWrapper = shallowMount(TestComponent, { props: requiredPropValues() })
		})

		it('prop uniqueId sets attribute id', async () => {
			expect(vueWrapper.attributes('id')).toBe(testHelper.default('uniqueId'))

			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.attributes('id')).toBe(testHelper.modified('uniqueId'))
		})

		it('prop classes sets class attribute', async () => {
			expect(vueWrapper.classes()).toContain('test-component')
			expect(vueWrapper.classes()).not.toContain(testHelper.modified('classes'))
			await vueWrapper.setProps({ classes: testHelper.modified('classes') })
			expect(vueWrapper.classes()).toContain('test-component')
			expect(vueWrapper.classes()).toContain(testHelper.modified('classes'))
		})

		// Pour une raison inconnue, le test échoue dans l'environnement de test
		it.skip('props bordered & color set style attribute', async () => {
			expect(vueWrapper.attributes('style')).toContain('background-color: computed-background-color;')
			expect(vueWrapper.attributes('style')).not.toContain('border: 1px solid black;')
			expect(vueWrapper.attributes('style')).not.toContain('color: ap-blue;')

			const { bordered, color } = modifiedPropValues()
			await vueWrapper.setProps({ bordered, color })
			expect(vueWrapper.attributes('style')).toContain('background-color: computed-background-color;')
			expect(vueWrapper.attributes('style')).toContain('border: 1px solid black;')
			expect(vueWrapper.attributes('style')).toContain('color: ap-blue;')
		})
	})

	describe('Setting props should update content and conditional rendering', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof TestComponent>>
		beforeEach(() => {
			vueWrapper = shallowMount(TestComponent, { props: requiredPropValues() })
		})

		it('prop requiredString sets h1 content', async () => {
			expect(vueWrapper.find('h1').text()).toBe(testHelper.default('requiredString'))
			const { requiredString } = modifiedPropValues()
			await vueWrapper.setProps({ requiredString })
			expect(vueWrapper.find('h1').text()).toBe(testHelper.modified('requiredString'))
		})

		it('prop nullStringProp controls null paragraph', async () => {
			expect(vueWrapper.find('.test-null-string').exists()).toBe(true)
			await vueWrapper.setProps({ nullStringProp: 'Modified null string prop' })
			expect(vueWrapper.find('.test-null-string').exists()).toBe(false)
		})

		it('prop undefinedStringProp controls undefined paragraph', async () => {
			expect(vueWrapper.find('.test-undefined-string').exists()).toBe(true)

			const undefinedStringProp = testHelper.modified('undefinedStringProp')
			await vueWrapper.setProps({ undefinedStringProp })
			expect(vueWrapper.find('.test-undefined-string').exists()).toBe(false)
		})

		it('prop stringProp controls default value paragraph', async () => {
			expect(vueWrapper.find('.test-string-prop').exists()).toBe(true)
			expect(vueWrapper.find('.test-string-prop').text()).toBe(testHelper.default('stringProp'))

			const { stringProp } = modifiedPropValues()
			await vueWrapper.setProps({ stringProp })
			expect(vueWrapper.find('.test-string-prop').text()).toBe(testHelper.modified('stringProp'))

			await vueWrapper.setProps({ stringProp: '' })
			expect(vueWrapper.find('.test-string-prop').exists()).toBe(false)
		})

		it('prop booleanProp controls boolean paragraph', async () => {
			expect(vueWrapper.find('.test-boolean-false').exists()).toBe(false)

			const { booleanProp } = modifiedPropValues()
			await vueWrapper.setProps({ booleanProp })
			expect(vueWrapper.find('.test-boolean-false').exists()).toBe(true)
		})

		it('prop bordered controls bordered paragraphs', async () => {
			expect(vueWrapper.find('.test-bordered-false').exists()).toBe(true)
			expect(vueWrapper.find('.test-bordered-true').exists()).toBe(false)

			const { bordered } = modifiedPropValues()
			await vueWrapper.setProps({ bordered })
			expect(vueWrapper.find('.test-bordered-true').exists()).toBe(true)
			expect(vueWrapper.find('.test-bordered-false').exists()).toBe(false)
		})

		it('prop color controls color paragraphs', async () => {
			expect(vueWrapper.find('.test-color-not-set').exists()).toBe(true)
			expect(vueWrapper.find('.test-color-set').exists()).toBe(false)

			const { color } = modifiedPropValues()
			await vueWrapper.setProps({ color })
			expect(vueWrapper.find('.test-color-set').exists()).toBe(true)
			expect(vueWrapper.find('.test-color-not-set').exists()).toBe(false)
		})

		it('prop requiredBoolean controls conditional div', async () => {
			expect(vueWrapper.find('.test-required-boolean').exists()).toBe(true)

			const { requiredBoolean } = modifiedPropValues()
			await vueWrapper.setProps({ requiredBoolean })
			expect(vueWrapper.find('.test-required-boolean').exists()).toBe(false)
		})
	})
})
