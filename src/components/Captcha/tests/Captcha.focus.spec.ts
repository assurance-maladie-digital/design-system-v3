import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import Captcha from '../Captcha.vue'

const CaptchaBaseStub = defineComponent({
	name: 'CaptchaBase',
	emits: ['update:modelValue', 'create-captcha:init', 'create-captcha:success', 'create-captcha:error'],
	template: `
		<div>
			<button class="change-type" @click="$emit('update:modelValue', 'audio')" />
			<button class="refresh-captcha" @click="$emit('create-captcha:init')" />
			<slot
				name="image"
				:choose-image="() => {}"
				:choose-audio="() => {}"
				:url="''"
				:state="'idle'"
				:is-error="false"
				:error-message="null"
			/>
		</div>
	`,
})

const CaptchaFormStub = defineComponent({
	name: 'CaptchaForm',
	emits: ['update:modelValue'],
	template: '<div class="captcha-form-stub" />',
})

describe('Captcha behavior', () => {
	it('emits update:type when captcha type changes from CaptchaBase', async () => {
		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				type: 'image',
			},
			global: {
				stubs: {
					CaptchaInformation: true,
					CaptchaBase: CaptchaBaseStub,
					CaptchaImg: true,
					CaptchaAlert: true,
					CaptchaBtn: true,
					CaptchaHelpdesk: true,
					CaptchaForm: CaptchaFormStub,
					volumeUp: true,
					SyIcon: true,
					VBtn: true,
				},
			},
		})

		await wrapper.find('.change-type').trigger('click')

		expect(wrapper.emitted('update:type')).toBeTruthy()
		expect(wrapper.emitted('update:type')?.[0]).toEqual(['audio'])
	})

	it('clears captcha text when a new captcha is initialized', async () => {
		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
			},
			global: {
				stubs: {
					CaptchaInformation: true,
					CaptchaBase: CaptchaBaseStub,
					CaptchaImg: true,
					CaptchaAlert: true,
					CaptchaBtn: true,
					CaptchaHelpdesk: true,
					CaptchaForm: CaptchaFormStub,
					volumeUp: true,
					SyIcon: true,
					VBtn: true,
				},
			},
		})

		const form = wrapper.findComponent(CaptchaFormStub)
		await form.vm.$emit('update:modelValue', 'captcha-text')
		await wrapper.find('.refresh-captcha').trigger('click')

		const modelEvents = wrapper.emitted('update:modelValue') || []
		expect(modelEvents.length).toBeGreaterThanOrEqual(2)
		expect(modelEvents[0]).toEqual(['captcha-text'])
		expect(modelEvents[modelEvents.length - 1]).toEqual([''])
	})
})
