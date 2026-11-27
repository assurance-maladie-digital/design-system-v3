// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VolumeUp from '../VolumeUp.vue'

export const volumeUpRgaaCriteria = ['1.2'] as const
describe('VolumeUp – executable RGAA contracts', () => {
	it('1.2 – remains a neutral SVG asset without an accessible name', () => {
		expect(mount(VolumeUp).get('svg').attributes('aria-label')).toBeUndefined()
	})
})
