import { composeStories } from '@storybook/vue3-vite'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import * as bulkActions from '../BulkActions.stories'
import * as rowEditing from '../RowEditing.stories'

const stories = [...Object.entries(composeStories(bulkActions)), ...Object.entries(composeStories(rowEditing))]

enableAutoUnmount(afterEach)

describe('Controls des stories d’édition de SyTable', () => {
	it.each(stories)('%s applique les en-têtes passés par les controls', async (_name, story) => {
		const wrapper = mount(story)

		await wrapper.setProps({ headers: [{ title: 'Identifiant patient', key: 'id' }] })

		expect(wrapper.findAll('th').some(header => header.text() === 'Identifiant patient')).toBe(true)
	})

	it('désactive le control des options dans la démo de défilement', () => {
		const { Default } = composeStories(bulkActions)

		expect(Default.argTypes.options?.control).toMatchObject({ disable: true })
	})
})
