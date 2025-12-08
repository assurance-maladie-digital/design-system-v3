/* eslint-disable vue/one-component-per-file */
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, it, expect } from 'vitest'
import AmeliproCaptcha from '../AmeliproCaptcha.vue'
import TestHelper from '@tests/helpers/TestHelper'
import { defineComponent, h, type PropType } from 'vue'
import type { ICaptcha } from '../types'
import AmeliproCard from '../../AmeliproCard/AmeliproCard.vue'

const expectedPropOptions = {
	captchaInputLabelAudio: {
		type: String,
		default: 'Code entendu :',
	},
	captchaInputLabelImg: {
		type: String,
		default: 'Caractères de l’image :',
	},
	captchaTitle: {
		type: String,
		default: 'Code de sécurité',
	},
	defaultAudio: {
		type: Boolean,
		default: false,
	},
	imgAlt: {
		type: String,
		default: 'liste de caractères',
	},
	imgMaxWidth: {
		type: String,
		default: '100%',
	},
	imgWidth: {
		type: String,
		default: '320px',
	},
	modelValue: {
		type: Object as PropType<ICaptcha>,
		required: true,
	},
	switchCaptchaTypeLabelAudio: {
		type: String,
		default: 'Utiliser un captcha image',
	},
	switchCaptchaTypeLabelImg: {
		type: String,
		default: 'Utiliser un captcha audio',
	},
	uniqueId: {
		type: String,
		required: true,
	},
	updateCaptchaLabelAudio: {
		type: String,
		default: 'Changer d’audio',
	},
	updateCaptchaLabelImg: {
		type: String,
		default: 'Changer d’image',
	},
}

const requiredPropValues = () => ({
	modelValue: {
		audioSrc: 'required-audio-src',
		imgSrc: 'required-img-src',
		inputValue: 'required-input-value',
	},
	uniqueId: 'required-unique-id',
})

const modifiedPropValues = () => ({
	modelValue: {
		audioSrc: 'modified-audio-src',
		imgSrc: 'modified-img-src',
		inputValue: 'modified-input-value',
	},
	uniqueId: 'modified-unique-id',
	captchaInputLabelAudio: 'Modified captcha input label audio',
	captchaInputLabelImg: 'Modified captcha input label img',
	captchaTitle: 'Modified captcha title',
	defaultAudio: true,
	imgAlt: 'modified-img-alt',
	imgMaxWidth: '123px',
	imgWidth: '12px',
	switchCaptchaTypeLabelAudio: 'Modified switch captcha type label audio',
	switchCaptchaTypeLabelImg: 'Modified switch captcha type label img',
	updateCaptchaLabelAudio: 'Modified update captcha label audio',
	updateCaptchaLabelImg: 'Modified update captcha label img',
})

const AmeliproCardMock = defineComponent({
	name: 'AmeliproCard',
	props: {
		uniqueId: { type: String, required: true },
	},
	setup(props, { slots }) {
		return () =>
			h('amelipro-card-stub', { uniqueId: props.uniqueId }, [
				slots.default ? slots.default() : null,
			])
	},
})

const AmeliproTextFieldMock = defineComponent({
	name: 'AmeliproTextField',
	props: {
		uniqueId: { type: String, required: true },
		label: { type: String, required: true },
	},
	setup(props, { slots }) {
		return () =>
			h('amelipro-text-field-stub', { uniqueId: props.uniqueId, label: props.label }, [
				slots.default ? slots.default() : null,
			])
	},
})

const AmeliproBtnMock = defineComponent({
	name: 'AmeliproBtn',
	props: {
		uniqueId: { type: String, required: true },
	},
	setup(props, { slots }) {
		return () =>
			h('amelipro-btn-stub', { uniqueId: props.uniqueId }, [
				slots.default ? slots.default() : null,
			])
	},
})

const testHelper = new TestHelper(AmeliproCaptcha)
testHelper
	.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproCaptcha', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproCaptcha>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproCaptcha, {
				props: requiredPropValues(), global: {
					stubs: { AmeliproCard: AmeliproCardMock },
				},
			})
		})

		describe('title', () => {
			it('has correct id and text content', async () => {
				expect(wrapper.find('.amelipro-captcha__title').attributes('id')).toBe(`${testHelper.default('uniqueId')}-title`)
				expect(wrapper.find('.amelipro-captcha__title').text()).toBe(`${testHelper.default('captchaTitle')}`)

				const { uniqueId, captchaTitle } = modifiedPropValues()
				await wrapper.setProps({ uniqueId, captchaTitle })
				expect(wrapper.find('.amelipro-captcha__title').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-title`)
				expect(wrapper.find('.amelipro-captcha__title').text()).toBe(`${testHelper.modified('captchaTitle')}`)
			})
		})

		describe('captcha wrapper', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.captcha__wrapper').attributes('id')).toBe(`${testHelper.default('uniqueId')}-captcha`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.captcha__wrapper').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-captcha`)
			})
		})

		describe('img', () => {
			it('prop imgAlt sets attribute alt', async () => {
				const img = wrapper.find('.captcha-img')
				expect(img.attributes('alt')).toBe(testHelper.default('imgAlt'))

				const { imgAlt } = modifiedPropValues()
				await wrapper.setProps({ imgAlt })
				expect(img.attributes('alt')).toBe(testHelper.modified('imgAlt'))
			})

			it('props width & maxWidth set style attributes width & max-width', async () => {
				const img = wrapper.find('.captcha-img')
				expect(img.attributes('style')).toContain(`max-width: ${testHelper.default('imgMaxWidth')};`)
				expect(img.attributes('style')).toContain(`width: ${testHelper.default('imgWidth')};`)

				const { imgMaxWidth, imgWidth } = modifiedPropValues()
				await wrapper.setProps({ imgMaxWidth, imgWidth })
				expect(img.attributes('style')).toContain(`max-width: ${testHelper.modified('imgMaxWidth')};`)
				expect(img.attributes('style')).toContain(`width: ${testHelper.modified('imgWidth')};`)
			})
		})

		// Captch text
		describe('Captcha text', () => {
			// uniqueId
			it('prop uniqueId sets attribute id', async () => {
				const captchaText = wrapper.find('.captcha-text')
				expect(captchaText.attributes('id')).toBe(`${testHelper.default('uniqueId')}-captcha-text`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(captchaText.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-captcha-text`)
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		describe('AmeliproCard', () => {
			let wrapper: VueWrapper<InstanceType<typeof AmeliproCaptcha>>

			beforeEach(() => {
				wrapper = shallowMount(AmeliproCaptcha, { props: requiredPropValues() })
			})
			it('prop uniqueId sets prop uniqueId', async () => {
				expect(wrapper.findComponent(AmeliproCard).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.findComponent(AmeliproCard).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}`)
			})
		})

		// AmeliproTextField (default / img)
		describe('AmeliproTextField (img)', () => {
			let wrapper: VueWrapper<InstanceType<typeof AmeliproCaptcha>>

			beforeEach(() => {
				wrapper = shallowMount(AmeliproCaptcha, {
					props: requiredPropValues(), global: {
						stubs: { AmeliproCard: AmeliproCardMock },
					},
				})
			})

			// uniqueId
			it('prop uniqueId sets prop uniqueId', async () => {
				expect(wrapper.findComponent({ name: 'AmeliproTextField' }).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-input`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.findComponent({ name: 'AmeliproTextField' }).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-input`)
			})

			// label
			it('prop captchaInputLabelImg sets prop label', async () => {
				expect(wrapper.findComponent({ name: 'AmeliproTextField' }).props('label')).toBe(testHelper.default('captchaInputLabelImg'))

				const { captchaInputLabelImg } = modifiedPropValues()
				await wrapper.setProps({ captchaInputLabelImg })
				expect(wrapper.findComponent({ name: 'AmeliproTextField' }).props('label')).toBe(testHelper.modified('captchaInputLabelImg'))
			})
		})

		// AmeliproTextField (audio)
		describe('AmeliproTextField (audio)', () => {
			let wrapper: VueWrapper<InstanceType<typeof AmeliproCaptcha>>

			beforeEach(() => {
				wrapper = shallowMount(AmeliproCaptcha, {
					props: { ...requiredPropValues(), defaultAudio: true },
					global: {
						stubs: { AmeliproCard: AmeliproCardMock },
					},
				})
			})

			// uniqueId
			it('prop uniqueId sets prop uniqueId', async () => {
				expect(wrapper.findComponent({ name: 'AmeliproTextField' }).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-input`)
				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.findComponent({ name: 'AmeliproTextField' }).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-input`)
			})

			// label
			it('prop captchaInputLabelAudio sets prop label', async () => {
				expect(wrapper.findComponent({ name: 'AmeliproTextField' }).props('label')).toBe(testHelper.default('captchaInputLabelAudio'))
				const { captchaInputLabelAudio } = modifiedPropValues()
				await wrapper.setProps({ captchaInputLabelAudio })
				expect(wrapper.findComponent({ name: 'AmeliproTextField' }).props('label')).toBe(testHelper.modified('captchaInputLabelAudio'))
			})
		})

		// AmeliproBtns (default / img)
		describe('AmeliproBtns', () => {
			let wrapper: VueWrapper<InstanceType<typeof AmeliproCaptcha>>

			const updateBtn = () => wrapper.findAllComponents({ name: 'AmeliproBtn' }).filter(btn => btn.classes('captcha-update-btn') === true)[0]
			const switchBtn = () => wrapper.findAllComponents({ name: 'AmeliproBtn' }).filter(btn => btn.classes('captcha-switch-btn') === true)[0]

			beforeEach(() => {
				wrapper = shallowMount(AmeliproCaptcha, {
					props: requiredPropValues(),
					global: {
						stubs: {
							AmeliproCard: AmeliproCardMock,
							AmeliproTextField: AmeliproTextFieldMock,
							AmeliproBtn: AmeliproBtnMock,
						},
					},
				})
			})

			// uniqueId
			it('prop uniqueId sets prop uniqueId', async () => {
				expect(updateBtn().props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-update-btn`)
				expect(switchBtn().props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-switch-type-btn`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(updateBtn().props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-update-btn`)
				expect(switchBtn().props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-switch-type-btn`)
			})

			// text updateCaptchaLabelImg & switchCaptchaTypeLabelImg
			it('props updateCaptchaLabelImg & switchCaptchaTypeLabelImg set btn text', async () => {
				expect(updateBtn().text()).toBe(testHelper.default('updateCaptchaLabelImg'))
				expect(switchBtn().text()).toBe(testHelper.default('switchCaptchaTypeLabelImg'))

				const { updateCaptchaLabelImg, switchCaptchaTypeLabelImg } = modifiedPropValues()
				await wrapper.setProps({ updateCaptchaLabelImg, switchCaptchaTypeLabelImg })
				expect(updateBtn().text()).toBe(testHelper.modified('updateCaptchaLabelImg'))
				expect(switchBtn().text()).toBe(testHelper.modified('switchCaptchaTypeLabelImg'))
			})
		})

		// AmeliproBtns (audio)
		describe('AmeliproBtns (audio)', () => {
			let wrapper: VueWrapper<InstanceType<typeof AmeliproCaptcha>>

			const updateBtn = () => wrapper.findAllComponents({ name: 'AmeliproBtn' }).filter(btn => btn.classes('captcha-update-btn') === true)[0]
			const switchBtn = () => wrapper.findAllComponents({ name: 'AmeliproBtn' }).filter(btn => btn.classes('captcha-switch-btn') === true)[0]

			beforeEach(() => {
				wrapper = shallowMount(AmeliproCaptcha, {
					props: { ...requiredPropValues(), defaultAudio: true },
					global: {
						stubs: {
							AmeliproCard: AmeliproCardMock,
							AmeliproTextField: AmeliproTextFieldMock,
							AmeliproBtn: AmeliproBtnMock,
						},
					},
				})
			})

			// uniqueId => identiques à img captcha btns

			// text updateCaptchaLabelAudio & switchCaptchaTypeLabelAudio
			it('props updateCaptchaLabelAudio & switchCaptchaTypeLabelAudio set btn text', async () => {
				expect(updateBtn().text()).toBe(testHelper.default('updateCaptchaLabelAudio'))
				expect(switchBtn().text()).toBe(testHelper.default('switchCaptchaTypeLabelAudio'))

				const { updateCaptchaLabelAudio, switchCaptchaTypeLabelAudio } = modifiedPropValues()
				await wrapper.setProps({ updateCaptchaLabelAudio, switchCaptchaTypeLabelAudio })
				expect(updateBtn().text()).toBe(testHelper.modified('updateCaptchaLabelAudio'))
				expect(switchBtn().text()).toBe(testHelper.modified('switchCaptchaTypeLabelAudio'))
			})
		})
	})
})
