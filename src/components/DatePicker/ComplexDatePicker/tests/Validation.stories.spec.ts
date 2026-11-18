import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../validation/Validation.stories'

const { WithError, WithWarning, WithSuccess } = composeStories(stories)

enableAutoUnmount(afterEach)

describe('DatePicker ComplexDatePicker validation stories', () => {
	it.each([
		{ name: 'WithError', story: WithError },
		{ name: 'WithWarning', story: WithWarning },
		{ name: 'WithSuccess', story: WithSuccess },
	])('$name initialise le champ depuis args.modelValue', async ({ story }) => {
		const wrapper = mount(story({ modelValue: '01/02/2026' }), { attachTo: document.body })
		await flushPromises()

		expect(wrapper.find('input').element.value).toBe('01/02/2026')
	})
})
