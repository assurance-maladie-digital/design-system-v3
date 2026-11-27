// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaBtn from '../CaptchaBtn.vue'
describe('CaptchaBtn – RGAA contract', () => {
	it('is a native button', () => expect(mount(CaptchaBtn).get('button').attributes('type')).toBe('button'))
})
