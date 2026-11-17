import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import CopyBtn from '../CopyBtn.vue'
import { config } from '../config'
import * as stories from '../CopyBtn.stories'
import meta from '../CopyBtn.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

function getPropDefault(name: string): unknown {
	const definition: unknown = Object.entries(CopyBtn.props ?? {}).find(([key]) => key === name)?.[1]

	return typeof definition === 'object' && definition !== null && 'default' in definition ? definition.default : undefined
}

const modifiedArgs = {
	ariaLabel: 'Libellé modifié',
	ariaOwns: 'copy-btn-modifie',
	textToCopy: 'TEXTE123',
	tooltipDuration: 1234,
}

enableAutoUnmount(afterEach)

describe('CopyBtn stories', () => {
	const writeText = vi.fn()

	beforeEach(() => {
		vi.spyOn(window, 'navigator', 'get').mockReturnValue({
			clipboard: { writeText },
		} as unknown as Navigator)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		writeText.mockReset()
	})

	it.each(allStories)('$name nomme le bouton avec son ariaLabel', ({ story }) => {
		const wrapper = mount(story())

		expect(wrapper.find('button').attributes('aria-label')).toBe(story.args.ariaLabel)
		expect(wrapper.find('.sy-copy-btn').attributes('label')).toBeUndefined()
	})

	it.each(allStories)('$name répercute les args modifiés sur le rendu', async ({ story }) => {
		const wrapper = mount(story, { props: modifiedArgs })
		const button = wrapper.find('button')

		expect(button.attributes('aria-label')).toBe(modifiedArgs.ariaLabel)
		expect(button.attributes('data-test-id')).toBe(modifiedArgs.ariaOwns)
		expect(wrapper.findComponent(CopyBtn).props('tooltipDuration')).toBe(modifiedArgs.tooltipDuration)

		await button.trigger('click')

		expect(writeText).toHaveBeenCalledWith(modifiedArgs.textToCopy)
	})

	it.each(allStories)('$name passe ses separatorsToRemove au composant', ({ story }) => {
		const wrapper = mount(story, { props: { separatorsToRemove: '#' } })

		expect(wrapper.findComponent(CopyBtn).props('separatorsToRemove')).toBe('#')
	})

	it.each(Object.entries(meta.argTypes))('l\'argType $0 renseigne sa valeur par défaut dans la table des Controls', (name, argType) => {
		expect(argType).not.toHaveProperty('default')

		if (name === 'vuetifyOptions') {
			expect(argType).toHaveProperty('table.defaultValue', { summary: 'object', detail: JSON.stringify(config, null, 2) })
			return
		}

		const defaultValue = getPropDefault(name)
		expect(argType).toHaveProperty('table.defaultValue.summary', typeof defaultValue === 'string' ? `'${defaultValue}'` : String(defaultValue))
	})
})
