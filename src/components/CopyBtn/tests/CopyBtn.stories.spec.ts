import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../CopyBtn.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

enableAutoUnmount(afterEach)

describe('CopyBtn stories', () => {
	it.each(allStories)('$name nomme le bouton avec son ariaLabel', ({ story }) => {
		const wrapper = mount(story())

		expect(wrapper.find('button').attributes('aria-label')).toBe(story.args.ariaLabel)
		expect(wrapper.find('.sy-copy-btn').attributes('label')).toBeUndefined()
	})
})
