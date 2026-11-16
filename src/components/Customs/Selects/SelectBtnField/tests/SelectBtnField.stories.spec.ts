import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import SelectBtnField from '../SelectBtnField.vue'
import * as validationStories from '../Validation/Validation.stories'

const { DisableErrorHandling } = composeStories(validationStories)

enableAutoUnmount(afterEach)

describe('SelectBtnField stories', () => {
	it('DisableErrorHandling affiche l\'erreur required sur le champ standard seulement', async () => {
		const wrapper = mount(DisableErrorHandling(), { attachTo: document.body })
		await flushPromises()

		const [standardField, noHandlingField] = wrapper.findAllComponents(SelectBtnField)

		expect(standardField!.text()).toContain('Le champ Validation standard est requis.')
		expect(noHandlingField!.text()).not.toContain('est requis.')
	})
})
