import { composeStories } from '@storybook/vue3-vite'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import * as stories from '../FilterSideBar.stories'

const composedStories = composeStories(stories)
const openButtonSelector = '.sy-filters-side-bar__open-btn'

enableAutoUnmount(afterEach)

describe('Controls des stories FilterSideBar', () => {
	it.each(Object.entries(composedStories))('%s désactive le control du modèle géré par le formulaire', (_name, story) => {
		expect(story.argTypes.modelValue?.control).toMatchObject({ disable: true })
	})

	it.each(Object.entries(composedStories))('%s met à jour le libellé du bouton via le control locales', async (_name, story) => {
		const wrapper = mount(story)
		expect(wrapper.get(openButtonSelector).text()).toContain('Filtres')

		await wrapper.setProps({ locales: { filterBtnLabel: 'Affiner les résultats' } })

		for (const button of wrapper.findAll(openButtonSelector)) {
			expect(button.text()).toContain('Affiner les résultats')
		}
	})
})
