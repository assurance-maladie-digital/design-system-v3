import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../Validation/Validation.stories'

const { WithError, MultipleSelectionValidation } = composeStories(stories)

enableAutoUnmount(afterEach)

async function checkedAfterClickingBAndC(wrapper: ReturnType<typeof mount>): Promise<boolean[]> {
	const inputs = wrapper.findAll('input[type="checkbox"]')
	await inputs[1]!.trigger('click')
	await inputs[2]!.trigger('click')
	await flushPromises()
	return wrapper.findAll<HTMLInputElement>('input[type="checkbox"]').map(input => input.element.checked)
}

describe('SyCheckBoxGroup validation stories', () => {
	it.each([
		['WithError', WithError],
		['MultipleSelectionValidation', MultipleSelectionValidation],
	])('%s laisse le control multiple effectif', async (_name, Story) => {
		const multiple = mount(Story(), { attachTo: document.body })
		const multipleChecked = await checkedAfterClickingBAndC(multiple)
		expect(multipleChecked.slice(1, 3)).toEqual([true, true])

		const single = mount(Story({ multiple: false }), { attachTo: document.body })
		const singleChecked = await checkedAfterClickingBAndC(single)
		expect(singleChecked.filter(Boolean)).toHaveLength(1)
	})
})
