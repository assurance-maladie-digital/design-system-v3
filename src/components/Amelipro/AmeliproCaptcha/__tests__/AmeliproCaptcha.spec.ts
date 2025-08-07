import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCaptcha from '../AmeliproCaptcha.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproCaptcha', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCaptcha, {
			global: {
				plugins: [vuetify],
			},
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
