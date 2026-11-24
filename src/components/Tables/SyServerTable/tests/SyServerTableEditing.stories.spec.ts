import { composeStories } from '@storybook/vue3-vite'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import * as bulkActions from '../BulkActions.stories'
import * as rowEditing from '../RowEditing.stories'

const stories = [
	...Object.entries(composeStories(bulkActions)).map(([name, story]) => [`BulkActions/${name}`, story] as const),
	...Object.entries(composeStories(rowEditing)).map(([name, story]) => [`RowEditing/${name}`, story] as const),
]

enableAutoUnmount(afterEach)

describe('Controls des stories d’édition de SyServerTable', () => {
	it.each(stories)('%s applique les en-têtes passés par les controls', async (_name, story) => {
		const wrapper = mount(story)

		await wrapper.setProps({ headers: [{ title: 'Identifiant patient', key: 'id' }] })
		await flushPromises()

		expect(wrapper.findAll('th').some(header => header.text() === 'Identifiant patient')).toBe(true)
	})

	it.each(stories)('%s désactive les controls des valeurs pilotées par la story', (_name, story) => {
		for (const arg of ['items', 'serverItemsLength', 'loading']) {
			expect(story.argTypes[arg]?.control).toMatchObject({ disable: true })
		}
	})
})
