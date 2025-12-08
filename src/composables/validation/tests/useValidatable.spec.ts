import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useFormValidation } from '../useFormValidation'
import { useValidatable } from '../useValidatable'

type FormValidationApi = ReturnType<typeof useFormValidation>

describe('useValidatable', () => {
	it('registers component on mount and unregisters on unmount', () => {
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

		registered.validateOnSubmit()
		expect(childVm.validateOnSubmit).toHaveBeenCalledTimes(1)

		registered.clearValidation?.()
		expect(childVm.clearValidation).toHaveBeenCalledTimes(1)

		registered.reset?.()
		expect(childVm.reset).toHaveBeenCalledTimes(1)

		wrapper.unmount()
		expect(form.validatableComponents.value).toHaveLength(0)
	})

	it('does nothing harmful when no form provider is present', () => {
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

		const mountOrphan = () => {
			const wrapper = mount(OrphanComponent)
			wrapper.unmount()
		}

		expect(mountOrphan).not.toThrow()
	})
})
