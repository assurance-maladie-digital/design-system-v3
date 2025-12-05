import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useFormValidation, useValidatableComponent } from '../useFormValidation'
import type { ValidatableComponent } from '../useFormValidation'

type FormValidationApi = ReturnType<typeof useFormValidation>

let lastChildApi: ReturnType<typeof useValidatableComponent> | null = null

const ChildComponent = {
	name: 'ValidatableChild',
	setup() {
		const api = useValidatableComponent()
		lastChildApi = api
		return () => null
	},
}

const ParentWithForm = defineComponent({
	name: 'ParentWithFormValidation',
	setup() {
		const form = useFormValidation()
		return { form }
	},
	render() {
		return h(ChildComponent)
	},
})

describe('useFormValidation', () => {
	it('registers components and avoids duplicates', () => {
		lastChildApi = null

		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form
		expect(lastChildApi).not.toBeNull()
		const childApi = lastChildApi!

		const component: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
		}

		expect(form.validatableComponents.value).toHaveLength(0)

		childApi.register(component)
		expect(form.validatableComponents.value).toHaveLength(1)
		expect(form.validatableComponents.value[0]).toStrictEqual(component)

		// Duplicate registration should be ignored
		childApi.register(component)
		expect(form.validatableComponents.value).toHaveLength(1)
	})

	it('unregisters components by reference and by validateOnSubmit fallback', () => {
		lastChildApi = null

		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form
		expect(lastChildApi).not.toBeNull()
		const childApi = lastChildApi!

		const sharedValidate = vi.fn(() => true)
		const component1: ValidatableComponent = { validateOnSubmit: sharedValidate }
		const component2: ValidatableComponent = { validateOnSubmit: sharedValidate }

		// Direct reference removal
		childApi.register(component1)
		expect(form.validatableComponents.value).toHaveLength(1)

		childApi.unregister(component1)
		expect(form.validatableComponents.value).toHaveLength(0)

		// Fallback: removal by matching validateOnSubmit reference
		childApi.register(component1)
		expect(form.validatableComponents.value).toHaveLength(1)

		childApi.unregister(component2)
		expect(form.validatableComponents.value).toHaveLength(0)
	})

	it('clearAll calls clearValidation on registered components and ignores missing or throwing ones', () => {
		lastChildApi = null

		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form
		expect(lastChildApi).not.toBeNull()
		const childApi = lastChildApi!

		const clearSpy = vi.fn()
		const throwingClear = vi.fn(() => {
			throw new Error('boom')
		})

		const componentWithClear: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
			clearValidation: clearSpy,
		}
		const componentWithoutClear: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
		}
		const componentThrowing: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
			clearValidation: throwingClear,
		}

		childApi.register(componentWithClear)
		childApi.register(componentWithoutClear)
		childApi.register(componentThrowing)

		form.clearAll()

		expect(clearSpy).toHaveBeenCalledTimes(1)
		expect(throwingClear).toHaveBeenCalledTimes(1)
	})

	it('clearAll returns early when there are no registered components', () => {
		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form

		expect(form.validatableComponents.value).toHaveLength(0)

		// Should not throw even when nothing is registered
		form.clearAll()
	})

	it('resetAll calls reset on registered components and ignores missing or throwing ones', () => {
		lastChildApi = null

		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form
		expect(lastChildApi).not.toBeNull()
		const childApi = lastChildApi!

		const resetSpy = vi.fn()
		const throwingReset = vi.fn(() => {
			throw new Error('boom')
		})

		const componentWithReset: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
			reset: resetSpy,
		}
		const componentWithoutReset: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
		}
		const componentThrowingReset: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
			reset: throwingReset,
		}

		childApi.register(componentWithReset)
		childApi.register(componentWithoutReset)
		childApi.register(componentThrowingReset)

		form.resetAll()

		expect(resetSpy).toHaveBeenCalledTimes(1)
		expect(throwingReset).toHaveBeenCalledTimes(1)
	})

	it('resetAll returns early when there are no registered components', () => {
		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form

		expect(form.validatableComponents.value).toHaveLength(0)

		// Should not throw even when nothing is registered
		form.resetAll()
	})

	it('validateAll returns true when there are no registered components', async () => {
		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form

		await expect(form.validateAll()).resolves.toBe(true)
	})

	it('validateAll returns false when at least one component is invalid (sync/async mix)', async () => {
		lastChildApi = null

		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form
		expect(lastChildApi).not.toBeNull()
		const childApi = lastChildApi!

		const syncTrue: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
		}
		const asyncTrue: ValidatableComponent = {
			validateOnSubmit: vi.fn(async () => true),
		}
		const asyncFalse: ValidatableComponent = {
			validateOnSubmit: vi.fn(async () => false),
		}

		childApi.register(syncTrue)
		childApi.register(asyncTrue)
		childApi.register(asyncFalse)

		await expect(form.validateAll()).resolves.toBe(false)
	})

	it('validateAll returns true when all components are valid', async () => {
		lastChildApi = null

		const wrapper = mount(ParentWithForm)
		const form = (wrapper.vm as { form: FormValidationApi }).form
		expect(lastChildApi).not.toBeNull()
		const childApi = lastChildApi!

		const syncTrue: ValidatableComponent = {
			validateOnSubmit: vi.fn(() => true),
		}
		const asyncTrue: ValidatableComponent = {
			validateOnSubmit: vi.fn(async () => true),
		}

		childApi.register(syncTrue)
		childApi.register(asyncTrue)

		await expect(form.validateAll()).resolves.toBe(true)
	})
})

describe('useValidatableComponent without provider', () => {
	it('returns no-op functions when no form provider is present', () => {
		let orphanApi: ReturnType<typeof useValidatableComponent> | null = null

		const OrphanComponent = {
			name: 'OrphanComponent',
			setup() {
				const api = useValidatableComponent()
				orphanApi = api
				return () => null
			},
		}

		mount(OrphanComponent)

		expect(orphanApi).toBeTruthy()

		const dummyComponent: ValidatableComponent = { validateOnSubmit: () => true }

		// These calls should be safe no-ops
		orphanApi!.register(dummyComponent)
		orphanApi!.unregister(dummyComponent)
		orphanApi!.clearAll()
		orphanApi!.resetAll()
	})
})
