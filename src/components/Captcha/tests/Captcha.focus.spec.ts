import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import Captcha from '../Captcha.vue'

const CaptchaBaseStub = {
	name: 'CaptchaBase',
	emits: ['update:modelValue', 'create-captcha:init', 'create-captcha:success', 'create-captcha:error'],
	template: `
		<div>
			<button class="change-type" @click="$emit('update:modelValue', 'audio')" />
			<button class="refresh-captcha" @click="$emit('create-captcha:init')" />
			<button class="captcha-success" @click="$emit('create-captcha:success', 'captcha-id-1')" />
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
}

const CaptchaFormStub = {
	name: 'CaptchaForm',
	emits: ['update:modelValue'],
	template: '<div class="captcha-form-stub" />',
}

const CaptchaFormWithFocusStub = defineComponent({
	name: 'CaptchaForm',
	props: {
		errorMessages: { type: Array, default: () => [] },
	},
	emits: ['update:modelValue', 'focus', 'blur'],
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

		// Complete the initial captcha load so subsequent refreshes work
		await wrapper.find('.captcha-success').trigger('click')

		const form = wrapper.findComponent(CaptchaFormStub)
		await form.vm.$emit('update:modelValue', 'captcha-text')
		await wrapper.find('.refresh-captcha').trigger('click')

		const modelEvents = wrapper.emitted('update:modelValue') || []
		expect(modelEvents.length).toBeGreaterThanOrEqual(2)
		expect(modelEvents[0]).toEqual(['captcha-text'])
		expect(modelEvents[modelEvents.length - 1]).toEqual([''])
	})

	it('does not clear validation errors when the first captcha loads after a blur', async () => {
		const commonStubs = {
			CaptchaInformation: true,
			CaptchaBase: CaptchaBaseStub,
			CaptchaImg: true,
			CaptchaAlert: true,
			CaptchaBtn: true,
			CaptchaHelpdesk: true,
			CaptchaForm: CaptchaFormWithFocusStub,
			volumeUp: true,
			SyIcon: true,
			VBtn: true,
		}

		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				customRules: [
					{
						type: 'custom' as const,
						options: {
							validate: (v: unknown) => v ? true : 'Le captcha est requis',
						},
					},
				],
			},
			global: { stubs: commonStubs },
		})

		// Simulate: user focuses and blurs without entering a value (triggers validation)
		const form = wrapper.findComponent(CaptchaFormWithFocusStub)
		await form.vm.$emit('focus')
		await form.vm.$emit('blur')

		// Wait for async validation to complete
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		// Errors should now be set
		const errorsBeforeSuccess = form.props('errorMessages') as string[]
		expect(errorsBeforeSuccess).toContain('Le captcha est requis')

		// Simulate: first captcha load completes (race condition – used to clear validation)
		await wrapper.find('.captcha-success').trigger('click')
		await wrapper.vm.$nextTick()

		// Errors must still be present – first create-captcha:success must NOT clear validation
		const errorsAfterFirstSuccess = form.props('errorMessages') as string[]
		expect(errorsAfterFirstSuccess).toContain('Le captcha est requis')
	})

	it('clears validation errors when the captcha is refreshed after a blur', async () => {
		const commonStubs = {
			CaptchaInformation: true,
			CaptchaBase: CaptchaBaseStub,
			CaptchaImg: true,
			CaptchaAlert: true,
			CaptchaBtn: true,
			CaptchaHelpdesk: true,
			CaptchaForm: CaptchaFormWithFocusStub,
			volumeUp: true,
			SyIcon: true,
			VBtn: true,
		}

		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				customRules: [
					{
						type: 'custom' as const,
						options: {
							validate: (v: unknown) => v ? true : 'Le captcha est requis',
						},
					},
				],
			},
			global: { stubs: commonStubs },
		})

		// Complete the initial load first
		await wrapper.find('.captcha-success').trigger('click')
		await wrapper.vm.$nextTick()

		// User blurs without a value → error shown
		const form = wrapper.findComponent(CaptchaFormWithFocusStub)
		await form.vm.$emit('focus')
		await form.vm.$emit('blur')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(form.props('errorMessages') as string[]).toContain('Le captcha est requis')

		// User asks for a new captcha (init + success)
		await wrapper.find('.refresh-captcha').trigger('click')
		await wrapper.find('.captcha-success').trigger('click')
		await wrapper.vm.$nextTick()

		// Errors should be cleared now (this is the intended behaviour for a refresh)
		expect(form.props('errorMessages') as string[]).toEqual([])
	})
})
