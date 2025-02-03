import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import { useRating } from '../Rating'

/** Create the test component */
function createTestComponent() {
	return defineComponent({
		props: {
			label: {
				type: String,
				default: null,
			},
			readonly: {
				type: Boolean,
				default: false,
			},
			modelValue: {
				type: Number,
				default: -1,
			},
		},
		emits: ['update:modelValue'],
		setup(props, { emit }) {
			const { internalValue, hasAnswered, emitInputEvent } = useRating(props, emit)

			return {
				internalValue,
				hasAnswered,
				emitInputEvent,
			}
		},
		template: '<div />', // Placeholder template for the test
	})
}

describe('useRating', () => {
	const label = 'Pouvez-vous nous en dire plus ?'

	it('verifies props', () => {
		const testComponent = createTestComponent()

		const wrapper = mount(testComponent, {
			props: {
				label,
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.props('label')).toBe(label)
		expect(wrapper.props('readonly')).toBe(false) // Ensure default prop value
		expect(wrapper.props('modelValue')).toBe(-1) // Ensure default model value
	})

	it('emits input event', async () => {
		const testComponent = createTestComponent()

		const wrapper = mount(testComponent, {
			props: {
				label,
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Call the composable's emitInputEvent method
		wrapper.vm.emitInputEvent(3)

		await wrapper.vm.$nextTick() // Wait for any asynchronous updates

		// Check that the emit occurred
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
	})

	it('checks hasAnswered computed property', async () => {
		const testComponent = createTestComponent()

		const wrapper = mount(testComponent, {
			props: {
				label,
				modelValue: 3, // Set modelValue to a non-default value
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Ensure hasAnswered reflects the proper state
		expect(wrapper.vm.hasAnswered).toBe(true)

		// Modify the modelValue
		wrapper.vm.emitInputEvent(-1)
		await wrapper.vm.$nextTick()

		// Ensure hasAnswered updates accordingly
		expect(wrapper.vm.hasAnswered).toBe(false)
	})
})
