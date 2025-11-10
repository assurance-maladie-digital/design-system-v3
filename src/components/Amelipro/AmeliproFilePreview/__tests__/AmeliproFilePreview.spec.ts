import type { ExpectedPropOptions } from '@tests/types'
import { RouterLinkStub, VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AmeliproFilePreview from '../AmeliproFilePreview.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import TestHelper from '@tests/helpers/TestHelper'
import { AmeliproAccordion, AmeliproCard } from '@/components'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproFilePreview> = {
	cardTitle: {
		type: String,
		required: true,
	},
	downloadBtnText: {
		type: String,
		default: 'Télécharger',
	},
	fileName: {
		type: String,
		required: true,
	},
	fileSrc: {
		type: String,
		required: true,
	},
	foldable: {
		type: Boolean,
		default: false,
	},
	iframeTitle: {
		type: String,
		default: 'Aperçu du fichier PDF',
	},
	isOpen: {
		type: Boolean,
		default: false,
	},
	linkTitle: {
		type: String,
		default: 'Télécharger le fichier au Format PDF',
	},
	previewHeight: {
		type: Number,
		default: 550,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproFilePreview> => ({
	cardTitle: 'Required card title',
	fileName: 'Required file name',
	fileSrc: 'required-file-src',
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproFilePreview> => ({
	cardTitle: 'The card title',
	downloadBtnText: 'The download btn text',
	fileName: 'The file name',
	fileSrc: 'the-file-src',
	foldable: true,
	iframeTitle: 'The iframe title',
	isOpen: true,
	linkTitle: 'The link title',
	previewHeight: 400,
	uniqueId: 'test-id',
})

const displayWrapper = mount(DisplayTestComponent)
const testHelper = new TestHelper(AmeliproFilePreview)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproFilePreview', () => {
	displayWrapper.vm.setMdAndUp(true)

	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('setting props should update props and attributes of inner components', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproFilePreview>>
		beforeEach(() => {
			wrapper = shallowMount(AmeliproFilePreview, {
				props: requiredPropValues(),
				global: {
					stubs: {
						AmeliproCard,
						RouterLink: RouterLinkStub,
					},
				},
			})
		})

		describe('AmeliproCard', () => {
			it('prop cardTitle sets prop cardTitle', async () => {
				expect(wrapper.findComponent(AmeliproCard).props('cardTitle')).toBe(requiredPropValues().cardTitle)

				const { cardTitle } = modifiedPropValues()
				await wrapper.setProps({ cardTitle })
				expect(wrapper.findComponent(AmeliproCard).props('cardTitle')).toBe(modifiedPropValues().cardTitle)
			})
		})

		describe('AmeliproAccordion', () => {
			it('prop cardTitle sets prop accordionTitle', async () => {
				await wrapper.setProps({ foldable: true })
				expect(wrapper.findComponent(AmeliproAccordion).props('accordionTitle')).toBe(requiredPropValues().cardTitle)

				const { cardTitle } = modifiedPropValues()
				await wrapper.setProps({ cardTitle })
				expect(wrapper.findComponent(AmeliproAccordion).props('accordionTitle')).toBe(modifiedPropValues().cardTitle)
			})
		})
	})

	describe('setting props should update attributes of inner tags', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproFilePreview>>

		beforeEach(() => {
			wrapper = mount(AmeliproFilePreview, {
				props: requiredPropValues(),
				stubs: {
					AmeliproCard,
					RouterLink: RouterLinkStub,
				},
			})
		})

		describe('header link', () => {
			it('prop fileName sets attribute download', async () => {
				expect(wrapper.find('.amelipro-file-preview__header__link').attributes('download')).toBe('Required file name')

				await wrapper.setProps({ fileName: 'The new file name' })
				expect(wrapper.find('.amelipro-file-preview__header__link').attributes('download')).toBe('The new file name')
			})

			it('prop fileSrc sets attribute href', async () => {
				expect(wrapper.find('.amelipro-file-preview__header__link').attributes('href')).toBe('required-file-src')

				await wrapper.setProps({ fileSrc: 'new-file-src' })
				expect(wrapper.find('.amelipro-file-preview__header__link').attributes('href')).toBe('new-file-src')
			})

			it('prop linkTitle sets attribute title', async () => {
				expect(wrapper.find('.amelipro-file-preview__header__link').attributes('title')).toBe('Télécharger le fichier au Format PDF')

				const { linkTitle } = modifiedPropValues()
				await wrapper.setProps({ linkTitle })
				expect(wrapper.find('.amelipro-file-preview__header__link').attributes('title')).toBe('The link title')
			})
		})

		describe('iframe', () => {
			it('prop fileSrc sets attribute src', async () => {
				expect(wrapper.find('.amelipro-file-preview__iframe').attributes('src')).toBe('required-file-src')

				await wrapper.setProps({ fileSrc: 'new-file-src' })
				expect(wrapper.find('.amelipro-file-preview__iframe').attributes('src')).toBe('new-file-src')
			})

			it('prop iframeTitle sets attribute title', async () => {
				expect(wrapper.find('.amelipro-file-preview__iframe').attributes('title')).toBe('Aperçu du fichier PDF')

				const { iframeTitle } = modifiedPropValues()
				await wrapper.setProps({ iframeTitle })
				expect(wrapper.find('.amelipro-file-preview__iframe').attributes('title')).toBe('The iframe title')
			})
		})

		describe('download link', () => {
			beforeEach(() => {
				displayWrapper.vm.setMdAndUp(false)
			})
			afterEach(() => {
				displayWrapper.vm.setMdAndUp(true)
			})

			it('prop fileName sets attribute download', async () => {
				expect(wrapper.find('.download-file-link').attributes('download')).toBe('Required file name')

				await wrapper.setProps({ fileName: 'The new file name' })
				expect(wrapper.find('.download-file-link').attributes('download')).toBe('The new file name')
			})

			it('prop fileSrc sets attribute href', async () => {
				expect(wrapper.find('.download-file-link').attributes('href')).toBe('required-file-src')

				await wrapper.setProps({ fileSrc: 'new-file-src' })
				expect(wrapper.find('.download-file-link').attributes('href')).toBe('new-file-src')
			})

			it('prop linkTitle sets attribute title', async () => {
				expect(wrapper.find('.download-file-link').attributes('title')).toBe('Télécharger le fichier au Format PDF')

				const { linkTitle } = modifiedPropValues()
				await wrapper.setProps({ linkTitle })
				expect(wrapper.find('.download-file-link').attributes('title')).toBe('The link title')
			})
		})
	})

	describe('visibility of some elements depends on screen size', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproFilePreview>>

		beforeEach(() => {
			wrapper = mount(AmeliproFilePreview, {
				props: modifiedPropValues(),
				stubs: {
					AmeliproCard,
					RouterLink: RouterLinkStub,
				},
			})
		})

		it('header right visibility', async () => {
			displayWrapper.vm.setMdAndUp(true)
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.amelipro-file-preview__header-right').exists()).toBe(true)

			displayWrapper.vm.setMdAndUp(false)
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.amelipro-file-preview__header-right').exists()).toBe(false)
		})

		it('iframe visibility', async () => {
			displayWrapper.vm.setMdAndUp(true)
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.amelipro-file-preview__iframe').exists()).toBe(true)

			displayWrapper.vm.setMdAndUp(false)
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.amelipro-file-preview__iframe').exists()).toBe(false)
		})

		it('download file link visibility', async () => {
			displayWrapper.vm.setMdAndUp(true)
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.download-file-link').exists()).toBe(false)

			displayWrapper.vm.setMdAndUp(false)
			await wrapper.vm.$nextTick()
			expect(wrapper.find('.download-file-link').exists()).toBe(true)
		})
	})
})
