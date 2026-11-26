import { composeStories } from '@storybook/vue3-vite'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import * as stories from '../FilterSideBar.stories'

const { Default, FilterCombination } = composeStories(stories)
const auditedStories = [
	['Default', Default],
	['FilterCombination', FilterCombination],
] as const

enableAutoUnmount(afterEach)

describe('Controls des stories FilterSideBar', () => {
	it.each(auditedStories)('%s désactive le control du modèle géré par le formulaire', (_name, story) => {
		expect(story.argTypes.modelValue?.control).toMatchObject({ disable: true })
	})

	it.each(auditedStories)('%s met à jour le libellé du bouton via le control locales', async (_name, story) => {
		const wrapper = mount(story)
		expect(wrapper.get('button').text()).toContain('Filtres')

		await wrapper.setProps({ locales: { filterBtnLabel: 'Affiner les résultats' } })

		expect(wrapper.get('button').text()).toContain('Affiner les résultats')
	})
})
