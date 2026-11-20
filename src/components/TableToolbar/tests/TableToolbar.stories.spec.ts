import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../TableToolbar.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

enableAutoUnmount(afterEach)

describe('TableToolbar stories', () => {
	it.each(allStories)('$name transmet les libellés des Controls', ({ story }) => {
		const wrapper = mount(story({
			searchLabel: 'Recherche personnalisée',
			addButtonLabel: 'Ajout personnalisé',
			showAddButton: true,
		}))

		expect(wrapper.get('[data-test-id="search-input"]').text()).toContain('Recherche personnalisée')
		expect(wrapper.get('[data-test-id="add-btn"]').text()).toContain('Ajout personnalisé')
	})

	it.each(allStories)('$name permet de masquer le bouton via les Controls', ({ story }) => {
		const wrapper = mount(story({ showAddButton: false }))

		expect(wrapper.find('[data-test-id="add-btn"]').exists()).toBe(false)
	})

	it.each(allStories)('$name transmet les deux valeurs du Control loading', ({ story }) => {
		for (const loading of [true, false]) {
			const wrapper = mount(story({ loading }))

			expect(wrapper.get('[data-test-id="search-input"] input').attributes('disabled') !== undefined).toBe(loading)
			wrapper.unmount()
		}
	})

	it('désactive les Controls des valeurs gérées par les exemples', () => {
		expect(stories.default.argTypes.nbTotal.control).toBe(false)
		expect(stories.default.argTypes.nbFiltered.control).toBe(false)
		expect(stories.default.argTypes.search.control).toBe(false)
		for (const { story } of allStories) {
			expect(story.args).not.toHaveProperty('nbTotal')
			expect(story.args).not.toHaveProperty('nbFiltered')
		}
	})
})
