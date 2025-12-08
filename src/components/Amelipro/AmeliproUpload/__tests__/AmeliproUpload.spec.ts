import { shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, it, expect } from 'vitest'
import AmeliproUpload from '../AmeliproUpload.vue'
import TestHelper from '@tests/helpers/TestHelper'
import type { ErrorMessages } from '@/utils/rules/types'
import { defineComponent, h, type PropType } from 'vue'
import type { ValidationRule } from 'vuetify'
import type { ErrorBucket } from '../types'

const expectedPropOptions = {
	ariaRequired: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	errorMessages: {
		type: Object as PropType<ErrorMessages>,
		default: undefined,
	},
	errorTitle: {
		type: String,
		default: undefined,
	},
	externalErrors: {
		type: Array as PropType<ErrorBucket[] | string[]>,
		default: () => [],
	},
	fileTypeAccepted: {
		type: Array as PropType<string[]>,
		required: true,
	},
	inputLabel: {
		type: String,
		default: 'Cliquer sur ce bouton pour joindre vos documents ou les glisser-déposer directement dans ce cadre',
	},
	maxFileNumber: {
		type: Number,
		default: 1,
	},
	rules: {
		type: Array as PropType<ValidationRule[]>,
		default: () => [],
	},
	uniqueId: {
		type: String,
		required: true,
	},
	value: {
		type: Array as PropType<File[]>,
		default: () => [],
	},
	warningRules: {
		type: Array as PropType<ValidationRule[]>,
		default: () => [],
	},
	warningTitle: {
		type: String,
		default: undefined,
	},
}

const requiredPropValues = () => ({
	fileTypeAccepted: ['required-type'],
	uniqueId: 'required-unique-id',
})

const modifiedPropValues = () => ({
	ariaRequired: true,
	disabled: true,
	errorMessages: { error: 'Modified error message' },
	errorTitle: 'Modified error title',
	externalErrors: ['Modified external error'],
	fileTypeAccepted: ['modified-type-1', 'modified-type-2'],
	inputLabel: 'Modified input label',
	maxFileNumber: 3,
	rules: [() => true],
	uniqueId: 'modified-unique-id',
	value: [new File(['foo'], 'modified-file.txt')],
	warningRules: [() => true],
	warningTitle: 'Modified warning title',
})

const VFileInputMock = defineComponent({
	name: 'VFileInput',
	props: {
		id: { type: String, required: true },
	},
	setup(props, { slots }) {
		return () =>
			h('v-file-input-stub', { id: props.id }, [
				slots.prepend ? slots.prepend() : null,
			])
	},
})

const testHelper = new TestHelper(AmeliproUpload)
testHelper
	.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproUpload', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproUpload>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproUpload, {
				props: requiredPropValues(),
				global: {
					stubs: {
						VFileInput: VFileInputMock,
					},
				},
			})
		})

		describe('Main', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})

			it('prop externalErrors sets class invalid and valid', async () => {
				expect(wrapper.classes()).not.toContain('invalid')
				expect(wrapper.classes()).toContain('valid')

				const { externalErrors } = modifiedPropValues()
				await wrapper.setProps({ externalErrors })
				expect(wrapper.classes()).toContain('invalid')
			})
		})

		// amelipro-upload__label
		describe('AmeliproUpload Label', () => {
			const tag = () => wrapper.find('.amelipro-upload__label')

			it('prop uniqueId sets label text', async () => {
				expect(tag().attributes('id')).toBe(`${testHelper.default('uniqueId')}-label`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(tag().attributes('id')).toBe(`${testHelper.modified('uniqueId')}-label`)
			})
		})

		// amelipro-upload__text
		describe('AmeliproUpload Text', () => {
			const tag = () => wrapper.find('.amelipro-upload__text')

			it('prop inputLabel sets label text', async () => {
				expect(tag().text()).toContain(testHelper.default('inputLabel'))

				const { inputLabel } = modifiedPropValues()
				await wrapper.setProps({ inputLabel })
				expect(tag().text()).toContain(testHelper.modified('inputLabel'))
			})

			// ariaRequired change text
			it('prop ariaRequired adds required text to label', async () => {
				expect(tag().text()).not.toContain('Champ obligatoire')

				const { ariaRequired } = modifiedPropValues()
				await wrapper.setProps({ ariaRequired })
				expect(tag().text()).toContain('Champ obligatoire')
			})
		})

		// label > img
		describe('Label Image', () => {
			const img = () => wrapper.find('.amelipro-upload__label img')

			// unique id
			it('prop uniqueId sets attribute id', async () => {
				expect(img().attributes('id')).toBe(`${testHelper.default('uniqueId')}-upload-img`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(img().attributes('id')).toBe(`${testHelper.modified('uniqueId')}-upload-img`)
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		describe('VFileInput', () => {
			let wrapper: VueWrapper<InstanceType<typeof AmeliproUpload>>
			const fileInput = () => wrapper.findComponent({ name: 'VFileInput' })

			beforeEach(() => {
				wrapper = shallowMount(AmeliproUpload, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(fileInput().attributes('id')).toBe(`${testHelper.default('uniqueId')}`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(fileInput().attributes('id')).toBe(`${testHelper.modified('uniqueId')}`)
			})

			it('prop externalErrors sets attribute describedby', async () => {
				expect(fileInput().attributes('aria-describedby')).toBeUndefined()

				const { externalErrors } = modifiedPropValues()
				await wrapper.setProps({ externalErrors })
				expect(fileInput().attributes('aria-describedby')).toBe('required-unique-id-error')
			})

			it('prop externalErrors sets attribue aria-invalid', async () => {
				expect(fileInput().attributes('aria-invalid')).toBe('false')

				const { externalErrors } = modifiedPropValues()
				await wrapper.setProps({ externalErrors })
				expect(fileInput().attributes('aria-invalid')).toBe('true')
			})

			it('prop ariaRequired sets attribue aria-required', async () => {
				expect(fileInput().attributes('aria-required')).toBe('false')

				const { ariaRequired } = modifiedPropValues()
				await wrapper.setProps({ ariaRequired })
				expect(fileInput().attributes('aria-required')).toBe('true')
			})
		})

		describe('AmeliproIcon', () => {
			let wrapper: VueWrapper<InstanceType<typeof AmeliproUpload>>
			const icon = () => wrapper.findComponent({ name: 'AmeliproIcon' })

			beforeEach(() => {
				wrapper = shallowMount(AmeliproUpload, {
					props: requiredPropValues(),
					global: {
						stubs: {
							VFileInput: VFileInputMock,
						},
					},
				})
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(icon().props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-upload-icon`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(icon().props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-upload-icon`)
			})
		})
	})

	describe('Slots', () => {
		it('displays slot content', () => {
			const wrapper = shallowMount(AmeliproUpload, {
				props: requiredPropValues(),
				slots: {
					'append-icon': '<div id="slot-content">Slot Content</div>',
				},
				global: {
					stubs: {
						VFileInput: VFileInputMock,
					},
				},
			})
			expect(wrapper.find('#slot-content').text()).toBe('Slot Content')
		})
	})

	// TODO: Events
})
