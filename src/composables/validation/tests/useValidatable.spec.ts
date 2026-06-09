/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { useFormValidation } from '../useFormValidation'
import { useValidatable } from '../useValidatable'

type FormValidationApi = ReturnType<typeof useFormValidation>

describe('useValidatable', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(async () => {
		await flushPromises()
	})
	it('registers component on mount and unregisters on unmount', async () => {
		const ChildComponent = defineComponent({
			name: 'ValidatableChild',
			setup() {
				const validateOnSubmit = vi.fn(() => true)
				const clearValidation = vi.fn()
				const reset = vi.fn()

				useValidatable(validateOnSubmit, clearValidation, reset)

				return {
					validateOnSubmit,
					clearValidation,
					reset,
				}
			},
			render() {
				return null
			},
		})

		const ParentWithForm = defineComponent({
			name: 'ParentWithFormForUseValidatable',
			setup() {
				const form = useFormValidation()
				return { form }
			},
			render() {
				return h(ChildComponent)
			},
		})

		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form

		expect(form.validatableComponents.value).toHaveLength(1)
		const registered = form.validatableComponents.value[0]

		const childWrapper = wrapper.findComponent(ChildComponent)
		const childVm = childWrapper.vm as unknown as {
			validateOnSubmit: ReturnType<typeof vi.fn>
			clearValidation: ReturnType<typeof vi.fn>
			reset: ReturnType<typeof vi.fn>
		}

		registered?.validateOnSubmit()
		expect(childVm.validateOnSubmit).toHaveBeenCalledTimes(1)

		registered?.clearValidation?.()
		expect(childVm.clearValidation).toHaveBeenCalledTimes(1)

		registered?.reset?.()
		expect(childVm.reset).toHaveBeenCalledTimes(1)

		wrapper.unmount()
		await flushPromises()
		expect(form.validatableComponents.value).toHaveLength(0)
	})

	it('does nothing harmful when no form provider is present', async () => {
		const OrphanComponent = defineComponent({
			name: 'OrphanValidatable',
			setup() {
				const validateOnSubmit = vi.fn(() => true)
				const clearValidation = vi.fn()
				const reset = vi.fn()

				useValidatable(validateOnSubmit, clearValidation, reset)

				return () => null
			},
		})

		const mountOrphan = async () => {
			const wrapper = mount(OrphanComponent)
			await flushPromises()
			wrapper.unmount()
			await flushPromises()
		}

		await expect(mountOrphan()).resolves.not.toThrow()
	})
})
