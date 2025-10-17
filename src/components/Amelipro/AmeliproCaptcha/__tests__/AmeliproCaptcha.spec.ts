import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCaptcha from '../AmeliproCaptcha.vue'
describe('AmeliproCaptcha', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCaptcha, {
			props: {
				modelValue: {
					audioSrc: 'myAudioFile',
					imgSrc: 'myImgFile',
					inputValue: 'input value',
				},
				uniqueId: 'my-captcha-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
