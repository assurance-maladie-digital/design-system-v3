import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../SyCheckBoxGroup.stories'
import * as validationStories from '../Validation/Validation.stories'

const { Required, MultipleRequired, Readonly, EventShowcase } = composeStories(stories)
const { CustomRules } = composeStories(validationStories)

enableAutoUnmount(afterEach)

describe('SyCheckBoxGroup stories', () => {
	it('Required affiche une erreur lors de la soumission sans sélection', async () => {
		const wrapper = mount(Required())

		await wrapper.get('form').trigger('submit')
		await flushPromises()

		expect(wrapper.find('.v-messages__message').text()).toContain('est requis')
	})

	it('MultipleRequired affiche puis efface l’erreur selon le nombre de cases cochées', async () => {
		const wrapper = mount(MultipleRequired())
		const checkboxes = wrapper.findAll('input[type="checkbox"]')

		await checkboxes[0]?.setValue(true)
		await wrapper.get('form').trigger('submit')
		await flushPromises()

		expect(wrapper.text()).toContain('Veuillez sélectionner au moins 2 options.')

		await checkboxes[1]?.setValue(true)
		await flushPromises()

		expect(wrapper.text()).not.toContain('Veuillez sélectionner au moins 2 options.')
	})

	it('Readonly conserve la sélection quand une autre option est activée', async () => {
		const wrapper = mount(Readonly())
		const checkboxes = wrapper.findAll('input[type="checkbox"]')

		expect(checkboxes).toHaveLength(3)
		await checkboxes[1]?.setValue(true)
		await flushPromises()

		expect(wrapper.text()).toContain('Sélection : a')
	})

	it.each([
		{ multiple: true, expectedEvent: 'update:modelValue: ["a"]' },
		{ multiple: false, expectedEvent: 'update:modelValue: "a"' },
	])('EventShowcase transmet la valeur sélectionnée avec multiple=$multiple', async ({ multiple, expectedEvent }) => {
		const wrapper = mount(EventShowcase({ multiple }))

		await wrapper.find('input[type="checkbox"]').setValue(true)

		expect(wrapper.text()).toContain(expectedEvent)
	})

	it('CustomRules affiche les messages correspondants et transmet les valeurs à l’action', async () => {
		const onUpdate = vi.fn()
		const wrapper = mount(CustomRules({ 'onUpdate:modelValue': onUpdate }))
		const checkboxes = wrapper.findAll('input[type="checkbox"]')

		await checkboxes[1]?.setValue(true)
		await flushPromises()

		expect(wrapper.text()).toContain('Vous devez sélectionner l\'option A')
		expect(onUpdate).toHaveBeenNthCalledWith(1, 'B')

		await checkboxes[0]?.setValue(true)
		await flushPromises()

		expect(wrapper.text()).toContain('Option A sélectionnée')
		expect(onUpdate).toHaveBeenNthCalledWith(2, 'A')
	})
})
